# SUBMISSION.md — checklist submit Devpost (diisi Principal, jangan oleh agen)

Deadline: **Senin 30 Nov 2026 14:00 PT = 17:00 EST = Selasa 1 Des 2026 05:00 WIB**

## Checklist

- [ ] Akun Devpost dibuat + registrasi ke hackathon
- [x] Repo publik di GitHub (akun real0xSI) — **DONE 25 Nov 2026 ~12:41 EST:
      https://github.com/real0xSI/bacaringkas (public, main, 19 files, MIT
      licence visible, verified HTTP 200 + secret sweep clean)**
- [x] Firebase project dibuat + aplikasi jalan di URL hosting (SETUP.md)
      — **DONE 25 Nov 2026 ~13:06 EST: project `bacaringkas-29c27` (Spark $0),
      live di https://bacaringkas.pages.dev (Cloudflare Pages, HTTP 200
      terverifikasi). ⚠️ Satu langkah console tersisa: daftarkan App Check
      debug token (`VITE_APPCHECK_DEBUG_TOKEN` dari `.env`) di console >
      Security > App Check > Manage debug tokens — tanpa itu panggilan AI
      ditolak (401/403 terverifikasi). Firestore rules juga belum ter-deploy
      (tempel `firestore.rules` di console).**
- [ ] "Nano test input" lolos di Chrome desktop — badge on-device terekam (RESEARCH.md §8)
- [ ] Video demo ≤3 menit, publik di YouTube, subtitle/narasi Inggris
      — **STATUS 25 Nov 2026: rehearsal pipeline DONE (34.1s, Xvfb + Chromium +
      ffmpeg + CDP, file video/narration-en-energetic-male.mp3 32.2s siap);
      video submission BELUM BISA direkam dari VM — Chromium VM tidak bisa
      mencapai internet publik (generativelanguage.googleapis.com gagal
      ERR_TUNNEL_CONNECTION_FAILED) + belum ada Firebase project. Rute yang
      bisa: rekam di Chrome HP Principal, atau cloud browser untuk screenshot.
      Detail: video/VIDEO-STATUS.md + RESEARCH.md §12. JANGAN palsukan hasil.**
- [ ] Text description (Inggris) diisi di form Devpost
- [ ] Platform dipilih: **Web**
- [ ] Submit sebelum deadline — draft boleh disimpan dulu, submit final jangan mepet

## Draft text description (Inggris — edit sebelum submit)

> **BacaRingkas** is an offline-first reading companion for students with slow or
> expensive internet. Paste a passage and it summarizes it, explains difficult words,
> or turns it into a quiz. Short passages run **on-device with Gemini Nano 4** through
> Firebase AI Logic hybrid inference (`PREFER_ON_DEVICE`) — private, free, and working
> offline. Long documents and photos of textbook pages fall back to cloud Gemini
> (`PREFER_IN_CLOUD`). Every result shows which route actually ran, so the hybrid
> behavior is visible, not just claimed.
>
> **How Firebase AI Logic is used:** the web app initializes the Firebase AI Logic SDK
> (`firebase/ai`, v12.5.0+) with the Gemini Developer API backend, creates a
> `GenerativeModel` with `InferenceMode.PREFER_ON_DEVICE` / `PREFER_IN_CLOUD`, calls
> `initializeDeviceModel()` on the user's button click, then `generateContent()` for
> single-turn text generation (the only mode on-device inference supports — no chat).
> Firebase App Check protects the API (debug tokens for local development), anonymous
> Authentication + Firestore store the user's saved results, and Remote Config holds
> the prompt templates and the long-text routing threshold.
>
> **Value proposition:** students in low-bandwidth areas get instant, private AI help
> without paying for data or cloud calls for everyday reading; the cloud is only spent
> where it is actually needed.

## Video demo — outline (≤3 menit)

| Waktu | Isi |
|---|---|
| 0:00–0:20 | Masalah: siswa internet lambat/mahal, butuh ringkasan cepat |
| 0:20–1:00 | Demo 1 (Chrome desktop): teks pendek → badge **on-device (Gemini Nano)** |
| 1:00–1:40 | Demo 2: teks panjang → badge **cloud**; foto halaman → ringkasan |
| 1:40–2:20 | Demo 3: buat kuis (JSON), simpan ke riwayat (Firestore) |
| 2:20–3:00 | Arsitektur singkat (diagram) + penutup |

Rekam di Chrome desktop sungguhan — badge on-device adalah bukti utama hybrid inference.
> CATATAN 25 Nov 2026: dari VM ini TIDAK BISA — Chromium VM tidak mencapai
> internet publik (proxy blokir generativelanguage.googleapis.com) dan Nano
> tidak tersedia di browser cloud. Rute yang bisa: Chrome HP Principal
> (cloud fallback jalan, Nano tidak) atau cloud browser untuk screenshot.
> Lihat video/VIDEO-STATUS.md + RESEARCH.md §12. Jangan palsukan hasil.
