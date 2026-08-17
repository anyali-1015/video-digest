# Video Digest (YouTube + Bilibili)

[English](README.md) | [简体中文](README.zh-CN.md)

Turn YouTube and Bilibili videos into a resource for deep learning. Video Digest brings transcripts, bilingual translation, AI overviews, an in-panel AI chat for anything you don't understand, and exportable timestamped notes into one Chrome side panel, so you can study ideas and language without losing your place.

- Turn captions (YouTube) or official subtitles (Bilibili) into a readable, searchable learning resource.
- Learn languages with the original transcript, a Simplified Chinese translation, or an aligned bilingual view.
- Ask a floating in-panel AI chat about any word, name, or concept you don't understand, with a saved history per video.
- Build understanding with an AI overview, chapters, key quotes, and selected-text explanations.
- Navigate long videos by clicking timestamps in the transcript, overview, or notes.
- Save timestamped notes as you watch, and export them to Markdown with one click.
- Keep control of your data with your own API keys, local Chrome storage, and no analytics or telemetry.

> This is a personal remix of [zarazhangrui/youtube-digest](https://github.com/zarazhangrui/youtube-digest), extended to also support Bilibili, add the in-panel chat, and add one-click note export. See [Remix it with your coding agent](#remix-it-with-your-coding-agent) below: the original project explicitly invites this.

Video Digest is a GitHub-only, bring-your-own-key project installed locally from GitHub. It is not available through the Chrome Web Store, does not include API credits, and does not run a developer-operated server.

## Install with your coding agent

You do not need to understand the code or use the command line. Send this message to your coding agent:

> Download or clone this project into a permanent folder I choose, tell me its exact full path, and use that same folder for Chrome's Load unpacked step. If I need a suggestion during this first installation, offer `~/Documents/video-digest` on macOS or Linux, or `%USERPROFILE%\Documents\video-digest` on Windows, but do not assume either path. Walk me through installation and setup in simple terms. https://github.com/anyali-1015/video-digest

Your agent should:

1. Ask where you want to keep the project, download or clone it there, and tell you the exact full path.
2. Open the official Supadata and DeepSeek pages below and help you create your own accounts.
3. Walk you through selecting the exact project folder you chose in Chrome with **Load unpacked**.
4. Show you where to enter your API keys in the extension's **Settings** page.
5. Open a YouTube or Bilibili video with subtitles and confirm the transcript and translation work.

Keep this folder in the same place after installation. If you move or delete it, Chrome's unpacked extension stops working until you load the extension again from its new permanent folder.

Never paste an API key into an AI chat, source file, screenshot, or public message. Enter keys yourself, directly in the Video Digest Settings page. Your coding agent can point to the correct field without seeing the key.

## Install manually

If you prefer to do it yourself:

1. Open [github.com/anyali-1015/video-digest](https://github.com/anyali-1015/video-digest).
2. Choose **Code**, then **Download ZIP**.
3. Choose a permanent folder and unzip the project there.
4. In Chrome, open `chrome://extensions`.
5. Turn on **Developer mode**.
6. Click **Load unpacked**.
7. Select the exact project folder you chose, which must contain `manifest.json`.
8. Pin Video Digest from Chrome's Extensions menu if you want quick access.

Because this is an unpacked extension, it does not update automatically. After downloading an update or changing local files, click **Reload** on the Video Digest card at `chrome://extensions`, then refresh open video tabs.

## Set up your API keys

Video Digest needs two keys under your own provider accounts. Both power the YouTube path; Bilibili subtitles use Bilibili's own public endpoints and need neither key, though DeepSeek is used to restore punctuation on Bilibili's frequently unpunctuated subtitles.

1. A **Supadata API key** to retrieve YouTube transcripts.
2. A **DeepSeek API key** for overviews, explanations, translation, chat, note polishing, and Bilibili punctuation restoration.

### Get a Supadata API key

1. Open the official [Supadata sign-up page](https://dash.supadata.ai/auth/sign-up).
2. Create an account and complete the short onboarding flow.
3. Supadata generates an API key automatically during onboarding.
4. Open the [Supadata dashboard](https://dash.supadata.ai/) whenever you need to find or manage the key.
5. Copy the key and paste it into **Supadata API key** in Video Digest Settings.

### Get a DeepSeek API key

1. Open the official [DeepSeek API Keys page](https://platform.deepseek.com/api_keys).
2. Sign in or create a DeepSeek Platform account when prompted.
3. Choose **Create new API key**, give it a recognizable name such as `Video Digest`, and create it.
4. Copy the key immediately. The full key may only be shown once.
5. Paste it into **DeepSeek API key** in Video Digest Settings.
6. If DeepSeek reports insufficient balance, add credit in your DeepSeek Platform account and try again.

Open **Settings** from the side panel. Paste keys only into these Settings fields. Never paste a key into an AI chat, repository file, screenshot, or public message.

The published version supports DeepSeek V4 Flash as its only AI provider:

```text
Base URL: https://api.deepseek.com
Model: deepseek-v4-flash
```

Keys and settings are stored in Chrome's local extension storage on your device.

## Use Video Digest

1. Open a standard YouTube watch page, or a Bilibili `bilibili.com/video/BVxxxx` page, with subtitles available.
2. Click the Video Digest extension icon, or the floating **Digest** button on the page, to open the side panel.
3. Read the timestamped transcript, or choose **Original**, **中文**, or **双语**.
4. Open **Overview** when you want AI-generated chapters and key quotes.
5. Select transcript text when you want an AI explanation, or click the floating 💬 chat button to ask anything else. Every answer is saved to that video's chat history.
6. Save a note from the video player (hover and click 📝 Note, or press "n"), then revisit it from **Notes**.
7. Click **⬇ Export** on the Notes tab to download your notes as a Markdown file.

## What works today

- Google Chrome 116 or newer, using the Side Panel API.
- Standard `youtube.com/watch` pages and `bilibili.com/video/BVxxxx` pages.
- **YouTube**: native subtitle tracks returned by Supadata, in `mode=native` only (no AI-generated fallback).
- **Bilibili**: official CC subtitles fetched directly from Bilibili's own (unofficial, WBI-signed) endpoints, using no Supadata credits. Videos without any official subtitles are not supported yet; there is no audio transcription fallback for Bilibili in this version.
- An automatic DeepSeek punctuation-restoration pass for Bilibili subtitles, which are frequently returned as unpunctuated run-on text.
- Original, Simplified Chinese, and aligned bilingual transcript views.
- AI overviews, selected-text explanations, translation, automatic note polishing, and a floating free-form chat with per-video history.
- Local notes with one-click Markdown export, and a local cache for recent transcript and digest results.

Shorts, live streams, private or access-restricted videos, and videos without an available native transcript may not work. Firefox, Safari, mobile browsers, and other Chromium browsers are not currently tested or supported.

Bilibili's subtitle endpoints are unofficial and undocumented by Bilibili. They're reverse-engineered by the community and can change or break without notice. If Bilibili subtitles stop working, that's the likely reason.

## Supadata free tier and request costs (YouTube path only)

The [Supadata pricing page](https://supadata.ai/pricing) lists a free tier with **100 credits per month**, no credit card required. A native transcript request uses 1 credit regardless of video duration. Supadata pricing can change, so check the current page before relying on these numbers. This only applies to YouTube; the Bilibili path never calls Supadata.

## DeepSeek cost estimate

DeepSeek's [pricing page](https://api-docs.deepseek.com/quick_start/pricing/) lists costs per 1 million tokens, on the order of a few cents (USD) per hour of video for translation or chat use, based on measurements in the original project this was remixed from. Bilibili's automatic punctuation-restoration pass adds a similarly small cost on top, since it's a short, cheap prompt run in small batches. Set spending limits in your DeepSeek account if you want a hard ceiling.

## Remix it with your coding agent

This is a personal remix project, itself remixed from [zarazhangrui/youtube-digest](https://github.com/zarazhangrui/youtube-digest). Issues and pull requests are not accepted here. If something breaks or you want a new feature, download or fork your own copy and ask your coding agent to fix, remix, or personalize it for you, exactly as this fork was made.

Video Digest uses plain HTML, CSS, and JavaScript with no build step, so it's a friendly starting point for agent-assisted projects. Ideas to try:

- Add audio transcription (ASR) for Bilibili videos that don't have official subtitles.
- Add more platforms (e.g. Xiaohongshu, X/Twitter video).
- Add more translation languages.
- Build a standalone vocabulary notebook from the chat history, with spaced-repetition export.
- Add optional local-model support for a different privacy and cost tradeoff.

Ask your agent to preserve the bring-your-own-key model, keep secrets out of source files, run the checks below, and test the remix on real videos.

If you want another AI provider or model, first open the exact Video Digest project folder that Chrome loaded through **Load unpacked** in your coding agent. Then open Video Digest Settings and use **Copy customization prompt**. Replace the `[PROVIDER]` and `[MODEL]` placeholders before sending it. Do not include any API key in the prompt or chat. After the agent updates your local copy, enter the key yourself in the Settings field it identifies.

## Privacy and data flow

Video Digest makes provider requests directly from the extension:

1. It sends the canonical YouTube video URL to Supadata, or calls Bilibili's own endpoints directly, to request the transcript/subtitles.
2. It sends transcript text and relevant video metadata to DeepSeek when you request AI features (overview, explanation, translation, chat, note polishing, or Bilibili punctuation restoration).
3. It stores keys, settings, notes, and chat history locally in Chrome.

There is no Video Digest account system, advertising, analytics, or telemetry. Supadata, DeepSeek, and Bilibili still receive data under their own terms and privacy policies. See [PRIVACY.md](PRIVACY.md) for details.

## Troubleshooting

### The Digest button is missing on a video page

- At `chrome://extensions`, find Video Digest and click **Reload**, then refresh the tab.
- Confirm you're on a standard watch page: `https://www.youtube.com/watch?...` or `https://www.bilibili.com/video/BVxxxx`.
- On Bilibili, the button floats over the player rather than sitting in Bilibili's own action bar. Look at the top-left/top-right corners of the video.

### No transcript is found (YouTube)

- Confirm the video is public and has native captions, and check your Supadata key, remaining credits, and rate limit.

### No transcript is found (Bilibili)

- Confirm the video has official CC subtitles; this version doesn't transcribe videos without them.
- Bilibili's subtitle API is unofficial and can change; if this used to work and suddenly doesn't, that's the most likely cause. Ask your coding agent to inspect `bilibili-wbi.js` and `background.js`'s Bilibili fetch path.

### AI requests fail

- A `401` or `403` usually means the DeepSeek key or account access is invalid.
- A `429` usually means a DeepSeek rate or spending limit was reached.

Never share API keys, private transcripts, or personal notes in chats, screenshots, or logs.

## Checks for coding agents

Ask your coding agent to run these commands after changing the project:

```bash
npm test
npm run check
npm run package
```

The agent should also reload the unpacked extension in Chrome and test several real videos on both platforms. Automated checks do not prove that live provider requests and page interactions work.

## License

MIT. See [LICENSE](LICENSE). Based on [zarazhangrui/youtube-digest](https://github.com/zarazhangrui/youtube-digest) (MIT).
