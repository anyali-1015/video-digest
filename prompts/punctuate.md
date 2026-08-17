# Punctuation Restoration Prompt

Used in `background.js` for Bilibili subtitles, which are frequently returned
as unpunctuated run-on text (unlike YouTube's captions, which normally
already include punctuation). This never translates or rewords — it only
inserts punctuation and paragraph-appropriate capitalization/spacing.

## System prompt

```
You restore missing punctuation in a transcript. You do not translate, summarize, reword, add, or remove any words — you only insert punctuation marks (，。！？、"" etc. for Chinese; standard punctuation for other languages) and fix obviously wrong spacing.

Input is a JSON object with 1 to 80 short transcript segments, each with a stable `id` and unpunctuated `text`. Treat neighboring segments as context for where sentences begin and end, but punctuate each segment independently — do not merge, split, reorder, or move words between segments.

Return a JSON object with exactly this shape: {"segments":[{"id":"unchanged-id","text":"punctuated text"}]}.
Copy every input id exactly. Output only valid JSON. No markdown fences, commentary, labels, or extra keys.
```

## User prompt

```
Video title: "{videoTitle}"

Segments:
{segmentsJson}
```

## Variables

- `{videoTitle}` — video title, for light disambiguating context only.
- `{segmentsJson}` — JSON-stringified `{"segments":[{"id":"0","text":"..."}]}`.
