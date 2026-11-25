# BacaRingkas — Offline-first reading companion (Web, Chrome)

> **#BuildHybridAI 2026** — Gen AI web app built on **Firebase AI Logic hybrid inference**:
> short passages are summarized / explained **on-device by Gemini Nano 4** (private,
> free, works offline); long documents and photos of pages fall back to **cloud Gemini**.
> Single-turn text generation only — that is all on-device inference supports.

## What it does (MVP)

1. Paste text (or upload a JPEG/PNG photo of a textbook page).
2. Pick a task: **Ringkas** (summarize), **Jelaskan kata sulit** (explain hard words),
   **Buat kuis** (generate a 3-question quiz, JSON structured output).
3. The app routes the prompt:
   - short text → `InferenceMode.PREFER_ON_DEVICE` (Gemini Nano on desktop Chrome ≥139)
   - long text / image input → cloud Gemini (fallback is automatic in the SDK)
4. Every result shows a **route badge**: `on-device (Gemini Nano)` or `cloud (Gemini)` —
   judges can see hybrid inference actually working, not just claimed.
5. Results can be saved to Firestore (anonymous auth) and re-opened from history.
   Remote Config holds the prompt templates + the long-text threshold, so prompts can
   be tuned without redeploying.

## Tech

- Vite + vanilla JS (no framework — keeps the demo auditable)
- `firebase` JS SDK **v12.5.0+** (`firebase/ai` — hybrid inference needs ≥ 12.5.0)
- Firebase AI Logic, Gemini Developer API backend (free tier, no billing)
- Firebase App Check (required by AI Logic; debug provider for localhost)
- Firestore (history), Anonymous Auth, Remote Config (prompt templates)
- Firebase Hosting for the demo URL

## Quick start (local)

```bash
npm install
cp .env.example .env        # fill in YOUR Firebase web config (see SETUP.md)
npm run dev                  # http://localhost:5173
```

Then follow **SETUP.md** — especially the Chrome / Gemini Nano steps. Without them the
app still works, but every request runs in the cloud and the on-device path is untested.

## Repo layout

```
index.html            entry page
src/main.js           UI wiring (single-turn actions only — no chat)
src/firebase.js       Firebase init + App Check (debug provider on localhost)
src/ai.js             hybrid model setup: PREFER_ON_DEVICE, initializeDeviceModel,
                      generateContent / generateContentStream, route detection
src/config.js         Remote Config defaults (prompt templates, thresholds)
src/history.js        Firestore save/load (anonymous auth)
public/               static assets
firebase.json         Hosting + Firestore rules deploy config
firestore.rules       history is per-anonymous-user, read/write own docs only
```

## Status

- **Repo publik: https://github.com/real0xSI/bacaringkas** (DONE 25 Nov 2026
  ~12:41 EST — public, main, 19 files, MIT, verified HTTP 200).
- Firebase project NOT created yet, no credentials in this repo — needs a
  browser + Principal's Google account (SETUP.md steps 1–2).
- Demo video: rehearsal pipeline DONE, submission video BLOCKED until the
  Firebase project exists + a real browser can reach Google's AI endpoints
  (this VM's Chromium cannot — see video/VIDEO-STATUS.md + RESEARCH.md §12).
- Narration ready: video/narration-en-energetic-male.mp3 (32.2s, English).
