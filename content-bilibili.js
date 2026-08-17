/**
 * CONTENT SCRIPT — BILIBILI
 *
 * Bilibili's counterpart to content.js. It runs on bilibili.com/video/*
 * pages and implements the SAME message protocol the background script and
 * side panel already use for YouTube (getVideoInfo, getCurrentTime, seekTo,
 * showNoteSavedFeedback) so the rest of the extension doesn't need to know
 * which platform it's talking to.
 *
 * Bilibili's DOM and navigation model differ from YouTube's, so button
 * injection here is simpler and more defensive: a floating pill over the
 * player rather than trying to match Bilibili's own (less stable) action bar.
 */

const DEBUG = false;
const debugLog = (...args) => {
  if (DEBUG) console.log(...args);
};

let bilibiliDigestButton = null;
let bilibiliNoteButton = null;
let bilibiliNoteButtonTimer = null;
let lastKnownUrl = location.href;
let bilibiliKeyboardListenerAdded = false;

function init() {
  if (!bilibiliKeyboardListenerAdded) {
    document.addEventListener("keydown", handleNoteKeyboardShortcut);
    bilibiliKeyboardListenerAdded = true;
  }
  scheduleInjectButtons();
  setupNavigationWatcher();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ============================================================
// MESSAGE HANDLING — same protocol as content.js
// ============================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog("[Bilibili Digest Content] Received:", message.action);

  if (message.action === "getVideoInfo") {
    sendResponse(extractVideoInfo());
    return false;
  }

  if (message.action === "highlightMoments") {
    sendResponse({ success: true });
    return false;
  }

  if (message.action === "getCurrentTime") {
    const video = document.querySelector("video");
    sendResponse({
      currentTime: video ? Math.floor(video.currentTime) : 0,
      paused: video ? video.paused : true,
    });
    return false;
  }

  if (message.action === "seekTo") {
    seekToTimestamp(message.seconds);
    sendResponse({ success: true });
    return false;
  }

  if (message.action === "showNoteSavedFeedback") {
    showNoteSavedToast(message.note);
    sendResponse({ success: true });
    return false;
  }

  sendResponse({ success: false, error: "Unknown action" });
  return false;
});

// ============================================================
// VIDEO INFO
// ============================================================

function extractBvid() {
  const match = location.pathname.match(/\/video\/(BV[0-9A-Za-z]+)/);
  return match ? match[1] : "";
}

function extractVideoInfo() {
  const titleElement = document.querySelector(
    "h1.video-title, h1[title].video-title, .video-info-title h1",
  );
  const uploaderElement = document.querySelector(
    ".up-info__name, .staff-name, a.up-name",
  );
  const videoElement = document.querySelector("video");
  const descriptionElement = document.querySelector(
    ".basic-desc-info, .desc-info-text, #v_desc",
  );

  return {
    title: titleElement?.textContent?.trim() || document.title.replace(/_哔哩哔哩.*$/, "").trim(),
    channelName: uploaderElement?.textContent?.trim() || "",
    duration: videoElement?.duration || 0,
    description: descriptionElement?.textContent?.trim() || "",
    bvid: extractBvid(),
  };
}

function seekToTimestamp(seconds) {
  const video = document.querySelector("video");
  if (!video) {
    console.error("[Bilibili Digest Content] No video element found for seek");
    return;
  }
  video.currentTime = seconds;
  if (video.paused) {
    video.play().catch(() => {});
  }
}

// ============================================================
// BUTTON INJECTION (floating over the player — Bilibili's own
// action bar layout is less stable to target reliably)
// ============================================================

function findPlayerContainer() {
  return document.querySelector(
    "#bilibili-player, .bpx-player-container, #playerWrap",
  );
}

function scheduleInjectButtons(delay = 400) {
  setTimeout(() => {
    if (!location.pathname.startsWith("/video/")) return;
    injectDigestButton();
    injectNoteButton();
  }, delay);
}

function injectDigestButton() {
  if (bilibiliDigestButton && bilibiliDigestButton.isConnected) return;
  const container = findPlayerContainer();
  if (!container) return;

  if (window.getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }

  const button = document.createElement("button");
  button.id = "ytd-digest-button-bilibili";
  button.type = "button";
  button.textContent = "▶ Digest";
  button.style.cssText = `
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 9999;
    padding: 0 16px;
    height: 34px;
    border: none;
    border-radius: 17px;
    background: #c8674f;
    color: white;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(200, 103, 79, 0.35);
  `;
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await chrome.runtime.sendMessage({ action: "openSidePanel" });
    } catch (err) {
      console.error("[Bilibili Digest] Failed to open side panel:", err);
    }
  });

  container.appendChild(button);
  bilibiliDigestButton = button;
}

function injectNoteButton() {
  const container = findPlayerContainer();
  if (!container) return;
  if (bilibiliNoteButton && bilibiliNoteButton.isConnected) return;

  if (window.getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }

  const button = document.createElement("button");
  button.id = "ytd-note-button-bilibili";
  button.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right: 6px; vertical-align: -2px;">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>Note
  `;
  button.style.cssText = `
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 9999;
    padding: 8px 14px;
    background: #c8674f;
    color: white;
    border: none;
    border-radius: 999px;
    font-family: system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  `;
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await saveCurrentNote(button);
  });

  container.appendChild(button);
  bilibiliNoteButton = button;
}

function handleNoteKeyboardShortcut(e) {
  if (!location.pathname.startsWith("/video/")) return;
  if (e.key !== "n" && e.key !== "N") return;
  const active = document.activeElement;
  if (
    active &&
    (active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.isContentEditable)
  ) {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  saveCurrentNote(bilibiliNoteButton);
}

async function saveCurrentNote(button) {
  const video = document.querySelector("video");
  if (!video) return;

  const currentTime = Math.max(0, Math.floor(video.currentTime) - 3);
  const videoInfo = extractVideoInfo();
  const originalContent = button ? button.innerHTML : "";

  if (button) {
    button.textContent = "SAVING...";
    button.style.pointerEvents = "none";
  }

  try {
    const result = await chrome.runtime.sendMessage({
      action: "saveNote",
      videoId: videoInfo.bvid,
      timestamp: currentTime,
      videoTitle: videoInfo.title,
      channelName: videoInfo.channelName,
      platform: "bilibili",
    });

    if (result.success) {
      if (button) {
        button.textContent = "SAVED";
        button.style.background = "#7c8b6f";
      }
      showNoteSavedToast(result.note);
    } else {
      if (button) button.textContent = "ERROR";
      console.error("[Bilibili Digest] Save note error:", result.error);
    }
  } catch (err) {
    if (button) button.textContent = "ERROR";
    console.error("[Bilibili Digest] Save note exception:", err);
  }

  setTimeout(() => {
    if (button) {
      button.innerHTML = originalContent;
      button.style.background = "#c8674f";
      button.style.pointerEvents = "auto";
    }
  }, 2000);
}

function escapeHtmlForContent(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function showNoteSavedToast(note) {
  const existing = document.getElementById("ytd-note-toast-bilibili");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "ytd-note-toast-bilibili";
  toast.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 6px; color: #c8674f;">📝 Note saved</div>
    <div style="font-size: 12px; color: #6b6258; margin-bottom: 8px;">${escapeHtmlForContent(note.timestamp)} — ${escapeHtmlForContent(note.videoTitle)}</div>
    <div style="font-size: 13px; line-height: 1.55; color: #2e2a24;">"${escapeHtmlForContent(note.text)}"</div>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    background: #ffffff;
    border: 1px solid #ece5d9;
    border-radius: 14px;
    padding: 16px 20px;
    max-width: 350px;
    box-shadow: 0 12px 32px rgba(50, 42, 32, 0.2);
    font-family: system-ui, sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// ============================================================
// NAVIGATION DETECTION
// ============================================================
// Bilibili doesn't fire a custom "navigation finished" event like YouTube's
// yt-navigate-finish, so we poll the URL. Cheap and reliable enough for a
// once-per-second check.

function setupNavigationWatcher() {
  setInterval(() => {
    if (location.href === lastKnownUrl) return;
    lastKnownUrl = location.href;

    document.getElementById("ytd-digest-button-bilibili")?.remove();
    document.getElementById("ytd-note-button-bilibili")?.remove();
    bilibiliDigestButton = null;
    bilibiliNoteButton = null;

    scheduleInjectButtons(600);
  }, 1000);
}
