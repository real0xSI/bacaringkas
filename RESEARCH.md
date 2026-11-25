# #BuildHybridAI 2026 — verified research (read 2026-11-25 ~05:00 EST)

Sources actually fetched (not guessed):
- https://firebasehybridaihackathon.devpost.com/ (main page)
- https://firebasehybridaihackathon.devpost.com/rules (Official Rules)
- https://firebase.google.com/docs/ai-logic/hybrid-on-device-inference (Firebase AI Logic hybrid web guide)

## 1. Contest

- Sponsor: Google LLC; admin: Devpost, Inc. Hackathon: **#BuildHybridAI 2026**.
- Concept: build apps that run prompts **on-device when a local model is available and
  fall back to the cloud when it isn't**, via the Firebase AI Logic Hybrid Inference SDK.
- Platforms (pick ≥1; multi-platform preferred, strong consideration for Grand Prize):
  - **Web (Chrome)**: Gemini Nano 4 via Firebase AI Logic — web app or Chrome extension.
  - **Android**: Gemini Nano 4 via Firebase AI Logic.
  - **iOS**: Apple Foundation Models API for local execution via Firebase AI Logic.
- This scaffold targets **Web (Chrome)** — the only platform testable without a Mac /
  Android device, and the one Principal can demo from a browser.

## 2. Deadlines (verified, all three agree)

| Event | Time |
|---|---|
| Submission period | Tue 11 Nov 2026 13:30 PT → **Mon 30 Nov 2026 14:00 PT** |
| Deadline in EST | Mon 30 Nov 2026 **17:00 EST** |
| Deadline in WIB | **Tue 1 Dec 2026 05:00 WIB** |
| Judging | 10 Dec 2026 09:00 PT → 16 Dec 2026 14:00 PT |
| Winners announced | on/around 21 Dec 2026 12:00 PT |

## 3. Prizes (total $30,000)

- Grand Prize $10,000 (1) + interview + featured blog post + social mention
- 1st Runner Up $7,000 (1) + interview + blog post + mention
- 2nd Runner Up $4,000 (1) + mention
- Best iOS App $3,000 · Best Android App $3,000 · Best Web/Chrome App $3,000
- One submission can win the Grand Prize + at most one "Best of" category prize.

## 4. Eligibility (verified from Official Rules §3)

- Above the age of majority in country of residence (≥20 in Taiwan); internet access as of 11 Nov 2026.
- **Void / ineligible residents:** Brazil, Italy, Quebec, Crimea, Cuba, Iran, Syria,
  North Korea, Sudan, Belarus, Russia + US-sanctioned countries. **Indonesia is NOT on
  the excluded list — Principal (Indonesia) is eligible on residence.**
- Individuals, teams, and organizations allowed. Google/Devpost employees & families excluded.
- Winners must complete identity verification + prize affidavit (10 business days) and
  tax forms (W-9 US / **W-8BEN non-US** — applies to Principal if he wins).

## 5. What to build / submit (verified)

- Gen AI app using **Firebase AI Logic** + supported Firebase products (App Check,
  Remote Config, Firestore, Authentication). **App Check is required; debug tokens are
  accepted in submissions.**
- Repo **public on GitHub or GitLab, with an open-source license** (Apache preferred,
  any OSI license OK) — license must be detectable/visible at the top of the repo page.
- **Firebase AI Logic must be imported AND actually called at runtime** in the code —
  not just named in the README.
- Text description (English): how Firebase AI Logic was used, features, value proposition.
  Existing apps: also a summary of what was built during the submission period.
- **Demo video ≤ 3 minutes**, public on **YouTube**, English or English subtitles,
  showing the project functioning on its platform(s). Only the first 3 min are judged.
- Hosted project URL strongly encouraged. Project must be free of charge.
- Multiple submissions allowed if substantially different.
- **Do NOT include in repo/submission:** production API keys, live Google Cloud project
  secrets, confidential commercial data, or PII. Judges must be able to test free of
  charge until the Judging Period ends.

## 6. Judging (Stage 1 pass/fail, Stage 2 scored 1–5 each, equally weighted)

1. Technological Implementation — how well built, how effectively hybrid inference is used
2. Design — complete, coherent product experience, not just a tech demo
3. Potential Impact — credible, specific case for a real problem / real audience
4. Quality of the Idea — creative, non-obvious use of Firebase AI Logic

## 7. Firebase AI Logic — hybrid inference, web (verified from Firebase docs)

- On-device inference needs **Firebase AI Logic SDK v12.5.0+** and **Chrome on Desktop
  version 139 or higher**. In-cloud uses Gemini Developer API or Agent Platform Gemini API
  (formerly Vertex AI); on-device uses Chrome's **Prompt API** (`LanguageModel`).
- **On-device supports ONLY single-turn text generation (NOT chat)** — streaming or
  non-streaming; text-only input, text+image (JPEG/PNG), structured output (JSON/enums).
- Modes: `PREFER_ON_DEVICE` (on-device if available, else cloud fallback),
  `ONLY_ON_DEVICE` (throws if unavailable), `PREFER_IN_CLOUD`, `ONLY_IN_CLOUD`.
- Setup: Firebase project → console **AI Services > AI Logic > Get started** → choose
  Gemini API provider (**Gemini Developer API recommended — free, no billing**; Vertex /
  Agent Platform needs billing). App Check is auto-enforced for AI Logic; use the
  **App Check debug provider + registered debug token** for localhost.
- `initializeDeviceModel()` must be called **after/on a user interaction (button click)**
  and **before** any `generateContent()` call.
- Text inference with Firebase AI Logic is **free within usage limits** (per Devpost page).

## 8. "Nano test input" — what the board note means (VERIFIED interpretation)

- The phrase **"Nano test input" does NOT appear verbatim** anywhere on the Devpost main
  page, the Official Rules, or the Firebase hybrid-inference docs (all three fetched
  2026-11-25). It is board shorthand, not an official term.
- What it actually refers to, verified from the Firebase docs: **testing the Gemini Nano
  on-device path with a real test prompt ("test input")** — i.e. proving the app really
  runs inference on-device, not only in the cloud. The verified procedure is:
  1. Desktop Chrome ≥139 → enable flag `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` → restart.
  2. DevTools console: `await LanguageModel.availability()` → must return `available`
     (or `downloading`/`downloadable`; if `downloadable`, run `await LanguageModel.create()`
     to download the on-device model — a multi-hundred-MB download).
  3. In the app, click the action button (user activation required), which calls
     `model.initializeDeviceModel(...)`, then send a real test prompt and confirm the
     route badge reads **on-device (Gemini Nano)**.
  4. Also test the fallback: same prompt with on-device unavailable → badge reads cloud.
- **Blocker: this test needs Chrome on Desktop. Principal is phone-only — he has no
  desktop Chrome, so he cannot run the Nano on-device test himself.** Options: (a) a
  cloud/desktop browser session runs it, (b) the demo video records the on-device path
  from a desktop, (c) ship with cloud fallback proven and on-device path code-verified
  but untested (weaker for judging — Technological Implementation is a scored criterion).
- The demo video MUST show the project functioning on its platform — for Web that means
  real Chrome footage, ideally showing the on-device badge.

## 9. Google Account Quota (optional, time-critical)

- Only needed for **billing-required models** (e.g. image generation). Text inference is
  free within limits; **this scaffold does not need it** (text-only + optional image input).
- If wanted anyway: request via the Google Form linked on the Devpost page. One account
  per entrant per project per sprint; account valid **4 days** from issuance; approval at
  Google's discretion; user pays fees beyond the quota / after the 4 days.
- **Sprint 3 (final): request by Wed 25 Nov 2026 10:00 AM PT (= Thu 26 Nov 01:00 WIB),
  account sent Fri 27 Nov.** At time of writing (~05:00 EST 25 Nov) ~8 hours remain.
  Requesting = filling a Google Form as Principal — cannot be done by an agent.
- Sprints 1 & 2 are over (sent 12 & 19 Nov).

## 10. What needs Principal (and only him)

1. **Google account** — create/own the Firebase project + enable AI Logic in the Firebase
   console (sign-in, project creation, "Get started" workflow, choosing Gemini Developer
   API). No agent may do this with his account.
2. **Devpost account + registration + submission** — sign up on Devpost, register for the
   hackathon, fill the submission form, paste repo + YouTube links. Only he can submit.
3. **Google Account Quota form** (optional, see §9) — only if he wants image-gen models;
   deadline today 10:00 PT.
4. **Nano on-device test** (see §8) — needs desktop Chrome; he has no desktop, so this
   needs a desktop browser session or a teammate with a desktop.
5. **Demo video** — record in real Chrome (desktop), upload public to YouTube, English
   narration/subtitles. He records it, or someone with a desktop does.
6. **GitHub repo** — create the public repo under his account (real0xSI) and push this code.
7. **If he wins**: prize affidavit + W-8BEN tax form within 10 business days of notification.

## 12. Recording findings (VERIFIED live 25 Nov 2026 ~12:41–12:48 EST)

- **Repo public:** https://github.com/real0xSI/bacaringkas (19 files, MIT, main).
- **VM screen recording WORKS** (Tari method, reproduced): Xvfb :99 1280×720 +
  managed Chromium `/opt/meta-chromium/chrome` (157.0.8103.81) + ffmpeg x11grab
  + CDP real clicks (websocket-client) + xdotool cursor. Rehearsal video
  `video/bacaringkas-rehearsal-2026-11-25.mp4` (34.1s, 1280×720, 30fps).
- **Managed Chromium needs a WebGL domain policy to start at all:**
  file `/tmp/webgl-policy.txt` containing exactly `hatch-webgl-all-origins-v1`
  + trailing newline, plus flags
  `--hatch-webgl-allowed-domains-file=/tmp/webgl-policy.txt
  --hatch-webgl-allowed-domains-sha256=<sha256 of the file>`.
  (A `v1` header + domain list is the other form; `localhost` is rejected as
  non-registrable. Validate with `--hatch-validate-webgl-allowed-domains --version`.)
- **localhost is blocked in this Chromium** by Local Network Access checks
  (`ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS` for 127.0.0.1:4173, even with
  `--disable-features=LocalNetworkAccessChecks`). Workaround (same as Tari):
  build with relative paths (`npx vite build --base ./ --outDir /tmp/...`)
  and load via `file://` + `--allow-file-access-from-files`. Kiosk mode
  (`--kiosk`) hides the address bar and the `--no-sandbox` banner.
- **This Chromium cannot reach public HTTPS at all:** `example.com` AND
  `generativelanguage.googleapis.com` both fail `ERR_TUNNEL_CONNECTION_FAILED`
  (egress proxy). Consequence: even with a real Firebase project, a live
  cloud AI result CANNOT be recorded in this Chromium — the call hangs the
  same way the rehearsal did. The on-device Nano path is also unavailable
  here (Prompt API "unavailable", proven 25 Nov). Real routes to a working
  demo video are in `video/VIDEO-STATUS.md` (Principal's phone Chrome, or a
  cloud-browser run for stills + a narrated tour).
- **Rehearsal behavior (dummy config):** UI loads, probe status line reads
  "On-device tidak tersedia di browser ini — semua request jalan di cloud",
  paste (311 chars) + language switch to English + real Jalankan click all
  work, then the run hangs on "Memproses…" (Remote Config / AI call never
  returns). No fake result was produced or recorded.
- **Narration ready:** `video/narration-en-energetic-male.mp3` (32.2s, Fish
  Audio Energetic Male, s2.1-pro-free, English) — mux under the final video.

## 13. NOT verified / open questions

- Devpost **Resources page** (per-platform guides) was not fetched — the main page links
  to it but its URL was not in the fetched text; re-check before finalizing platform docs.
- Whether the Devpost Discord / Build Session recording (12 Nov) has extra requirements.
- Exact free-tier quota numbers for Firebase AI Logic text inference (page says only
  "free within usage limits" — no numbers published on the pages fetched).
- The quota-form URL itself (forms.gle link on the Devpost page) — not copied here; open
  it from the Devpost page, do not guess it.

## 14. Cloud model fix — SDK `inCloudParams` gotcha (verified 25 Nov 2026 ~08:47 EST)

- **Symptom (browser-verified 25 Nov 08:30 EST, twice):** app calls AI, Google
  returns 404: "This model models/gemini-2.5-flash-lite is no longer available
  to new users. Please update your code to use models/gemini-3.5-flash-lite."
- **Root cause (verified in the installed SDK source,
  `node_modules/firebase/firebase-ai.js`, firebase 12.19.0 / @firebase/ai
  2.16.0):** `getGenerativeModel()` with a `mode` set IGNORES a top-level
  `model` and uses `inCloudParams || { model: "gemini-2.5-flash-lite" }` for
  the cloud path. The app passed `{ model: "gemini-2.5-flash", mode }`, so the
  cloud call always went to the retired `gemini-2.5-flash-lite`. The string
  also ships inside the SDK bundle itself — it is the SDK's default, not app
  code (the app's own `src/` never contained `gemini-2.5-flash-lite`).
- **Fix (`src/ai.js` `modelFor()`):** pass the cloud model via
  `inCloudParams: { model: "gemini-3.5-flash-lite" }` (Google's own
  recommendation in the error). On-device Nano path untouched.
- **Verified live:** Node end-to-end test mirroring the app flow (anonymous
  sign-in → `PREFER_ON_DEVICE` → `generateContent`) returned a genuine
  4-sentence / 518-char English summary in 1791 ms; Firestore save + list
  (`where uid == own uid`, no orderBy) also OK. Redeployed to
  https://bacaringkas.pages.dev (HTTP 200, new bundle `index-BCbMLClB.js`
  contains `gemini-3.5-flash-lite` + `inCloudParams`).
- **History fix in the same change:** `firestore.rules` splits `read` into
  `get`/`list` (combined `read` leaning on `resource.data.uid` fails list
  evaluation); `src/history.js` drops `orderBy(createdAt)` (that plus
  `where(uid == ...)` needs a composite index in the console) and sorts
  client-side instead. Rules file must still be pasted in the Firebase
  console (Firestore > Rules > Publish) — no Firebase CLI auth in this VM.
