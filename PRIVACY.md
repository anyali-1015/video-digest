# Privacy

Effective: August 17, 2026

Video Digest is a GitHub-only, bring-your-own-key Chrome extension. It has no Video Digest account, developer-operated backend, analytics, advertising, or telemetry.

## Data the extension handles

Depending on the feature you use, Video Digest handles:

- the canonical URL and video ID of the active YouTube or Bilibili video;
- transcript/subtitle text and timestamps;
- video metadata such as title, channel/uploader, description, and duration;
- text you select in the transcript and nearby transcript context;
- transcript context around a timestamped note;
- content you ask to translate;
- questions you ask in the floating chat panel, and the resulting answers;
- notes you save, and notes you export to a local Markdown file (the export never leaves your device);
- Supadata and DeepSeek configuration, including API keys; and
- cached transcript, digest, and translation results.

## Where data goes

### Supadata (YouTube only)

For YouTube videos, Video Digest sends the canonical YouTube video URL to `https://api.supadata.ai` with your Supadata API key. Supadata returns the transcript and timestamps. A Supadata key is required for YouTube transcript retrieval. Supadata is never used for Bilibili.

### Bilibili

For Bilibili videos, Video Digest calls Bilibili's own public endpoints directly (`https://api.bilibili.com` and subtitle files hosted on `https://*.hdslb.com`) to look up the video's subtitle track. These are unofficial, undocumented endpoints; no API key of yours is sent to Bilibili, since none is required.

### DeepSeek

The published version sends AI feature content to DeepSeek V4 Flash at `https://api.deepseek.com`:

- transcript plus relevant title, channel, description, or duration for an overview;
- selected text plus nearby transcript context for an explanation;
- small semantic transcript batches currently needed for progressive Chinese
  translation, or requested overview or explanation content;
- nearby transcript context and video metadata when polishing a saved note;
- your question, recent chat history for that video, and optional selected context, when you use the floating chat panel;
- raw Bilibili subtitle text, in small batches, to restore punctuation.

The endpoint and `deepseek-v4-flash` model are fixed in the published Settings page. You provide one DeepSeek API key. To use another provider or model, you must adapt your own local source copy and its permissions. The Settings page provides a coding-agent prompt for that purpose and warns you never to include an API key in the prompt or chat.

Requests go directly from the extension to Supadata, Bilibili, or DeepSeek. They are authenticated with the keys you supply (where a key is required). Video Digest's developer does not proxy or receive these requests.

Those services process data under their own terms, privacy policies, retention practices, and account settings. Do not send confidential, personal, or regulated content unless their terms and your obligations permit it.

## Local storage and retention

Video Digest uses Chrome's local extension storage, not a Video Digest cloud service.

- Supadata and DeepSeek settings and API keys remain on the device in Chrome's extension storage.
- Saved notes remain until you delete them or remove/clear the extension's data. The extension keeps up to 100 notes.
- Chat panel history (your questions and the answers) remains locally until you clear the extension's data. Up to 300 entries are kept across all videos, oldest first evicted.
- Recent transcript, digest, and per-segment translation cache entries are stored
  locally. The cache is limited to 20 videos, and entries older than 30 days are
  removed when the side panel opens.

Chrome extension storage is not a password vault. Anyone with sufficient access to your browser profile or device may be able to recover locally stored keys or content. Use scoped keys where providers support them, set spending limits, and rotate or revoke a key if the device or browser profile is compromised.

To remove data:

- delete individual saved notes in Video Digest;
- use the Options page to clear cached digests, delete all notes, or reset all extension data;
- remove the extension or clear its stored data from Chrome to delete all local settings, keys, notes, chat history, and cache entries; and
- revoke keys in the Supadata or DeepSeek dashboard to stop their future use.

Clearing local data does not delete information already processed or retained by Supadata or DeepSeek. Use each service's controls for service-side requests.

## Permissions

Video Digest uses Chrome permissions for these purposes:

- `sidePanel`: display the Video Digest interface beside the video.
- `storage`: store settings, keys, notes, chat history, and cached results locally.
- `tabs`: identify and interact with the active YouTube/Bilibili tab.
- `scripting`: coordinate the extension's page controls.
- YouTube host access: read the active video's URL and metadata and provide timestamp controls.
- Bilibili host access (`bilibili.com`, `api.bilibili.com`, `*.hdslb.com`): read the active video's URL/metadata, provide timestamp controls, and retrieve subtitles.
- Supadata host access: retrieve YouTube transcripts.
- DeepSeek host access: provide AI overviews, explanations, translation, chat, note polishing, and Bilibili punctuation restoration through DeepSeek V4 Flash.

Video Digest does not use these permissions to monitor general browsing activity.

## No sale or advertising use

Video Digest does not sell personal information, build advertising profiles, or share data with data brokers. It does not include analytics SDKs.

## Changes

Privacy-relevant changes will be documented in this file and in the repository history. Review updates before installing a new version.

## Questions

This repository does not provide a public support or issue channel. Review this policy, the source code, and each provider's documentation before using the extension. For a vulnerability or accidental secret exposure, follow the private process in [SECURITY.md](SECURITY.md).
