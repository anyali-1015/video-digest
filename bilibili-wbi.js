/**
 * BILIBILI WBI SIGNING
 *
 * Several Bilibili API endpoints (including the one that lists a video's
 * subtitles) require requests to carry a signed `w_rid` + `wts` pair. This
 * is Bilibili's own anti-scraping scheme, documented by the reverse-engineering
 * community at https://github.com/SocialSisterYi/bilibili-API-collect —
 * there is no official API documentation from Bilibili itself.
 *
 * Because this is unofficial and Bilibili can change it at any time, treat
 * failures here as expected occasionally — the caller falls back to a clear
 * "no subtitles" message rather than crashing.
 *
 * Everything below runs in the background service worker (no DOM, no
 * Node crypto), so it includes a small self-contained MD5 implementation —
 * Web Crypto's SubtleCrypto does not support MD5.
 */
var YTD_BILIBILI_WBI = (() => {
  // Fixed permutation table Bilibili uses to mix img_key + sub_key into the
  // final 32-character salt. This table is public and has been stable since
  // the scheme was introduced in 2023.
  const MIXIN_KEY_ENC_TAB = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
    33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
    61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
    36, 20, 34, 44, 52,
  ];

  function getMixinKey(imgKey, subKey) {
    const raw = imgKey + subKey;
    let key = "";
    for (const index of MIXIN_KEY_ENC_TAB) {
      key += raw[index] || "";
    }
    return key.slice(0, 32);
  }

  // --- Minimal MD5 (public-domain style implementation) ---
  function md5(input) {
    function rotl(x, c) {
      return (x << c) | (x >>> (32 - c));
    }
    function toBytesUtf8(str) {
      return new TextEncoder().encode(str);
    }

    const s = [
      7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20,
      5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23,
      4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15,
      21, 6, 10, 15, 21,
    ];
    const K = new Int32Array(64);
    for (let i = 0; i < 64; i++) {
      K[i] = (Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32)) | 0;
    }

    const bytes = toBytesUtf8(input);
    const originalLenBits = bytes.length * 8;
    const withOne = new Uint8Array(
      (((bytes.length + 8) >> 6) + 1) * 64,
    );
    withOne.set(bytes);
    withOne[bytes.length] = 0x80;
    const view = new DataView(withOne.buffer);
    // Length in bits, little-endian 64-bit (we only use the low 32 bits — fine
    // for the short strings used in WBI signing).
    view.setUint32(withOne.length - 8, originalLenBits >>> 0, true);
    view.setUint32(withOne.length - 4, 0, true);

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    for (let chunkStart = 0; chunkStart < withOne.length; chunkStart += 64) {
      const M = new Int32Array(16);
      for (let j = 0; j < 16; j++) {
        M[j] = view.getInt32(chunkStart + j * 4, true);
      }
      let A = a0,
        B = b0,
        C = c0,
        D = d0;
      for (let i = 0; i < 64; i++) {
        let F, g;
        if (i < 16) {
          F = (B & C) | (~B & D);
          g = i;
        } else if (i < 32) {
          F = (D & B) | (~D & C);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          F = B ^ C ^ D;
          g = (3 * i + 5) % 16;
        } else {
          F = C ^ (B | ~D);
          g = (7 * i) % 16;
        }
        F = (F + A + K[i] + M[g]) | 0;
        A = D;
        D = C;
        C = B;
        B = (B + rotl(F, s[i])) | 0;
      }
      a0 = (a0 + A) | 0;
      b0 = (b0 + B) | 0;
      c0 = (c0 + C) | 0;
      d0 = (d0 + D) | 0;
    }

    function toHexLE(n) {
      const bytes = [
        n & 0xff,
        (n >>> 8) & 0xff,
        (n >>> 16) & 0xff,
        (n >>> 24) & 0xff,
      ];
      return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    return toHexLE(a0) + toHexLE(b0) + toHexLE(c0) + toHexLE(d0);
  }

  /**
   * Fetches the current img_key / sub_key pair from Bilibili's nav endpoint.
   * These rotate periodically; we don't cache across service-worker restarts
   * to keep this simple, since it's one lightweight request per digest.
   */
  async function fetchWbiKeys() {
    const response = await fetch("https://api.bilibili.com/x/web-interface/nav", {
      headers: { Referer: "https://www.bilibili.com/" },
    });
    if (!response.ok) {
      throw new Error(`Bilibili nav request failed: ${response.status}`);
    }
    const data = await response.json();
    const imgUrl = data?.data?.wbi_img?.img_url || "";
    const subUrl = data?.data?.wbi_img?.sub_url || "";
    const imgKey = imgUrl.split("/").pop()?.split(".")[0] || "";
    const subKey = subUrl.split("/").pop()?.split(".")[0] || "";
    if (!imgKey || !subKey) {
      throw new Error("Could not read Bilibili WBI keys.");
    }
    return { imgKey, subKey };
  }

  /**
   * Signs a params object, returning a new object with `wts` and `w_rid`
   * added, ready to serialize into a query string.
   */
  function signParams(params, imgKey, subKey) {
    const mixinKey = getMixinKey(imgKey, subKey);
    const wts = Math.floor(Date.now() / 1000);
    const merged = { ...params, wts };
    const sortedKeys = Object.keys(merged).sort();
    const query = sortedKeys
      .map((key) => {
        // Bilibili strips these characters from values before signing.
        const value = String(merged[key]).replace(/[!'()*]/g, "");
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");
    const w_rid = md5(query + mixinKey);
    return { ...merged, w_rid };
  }

  return { fetchWbiKeys, signParams, getMixinKey, md5 };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = YTD_BILIBILI_WBI;
}
