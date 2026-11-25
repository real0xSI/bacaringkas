# SETUP.md — dari nol sampai jalan (hanya Principal yang bisa langkah 1–4)

## 0. Prasyarat

- Node.js ≥ 20, `npm install -g firebase-tools` (untuk deploy; opsional untuk dev lokal)
- **Chrome Desktop versi 139+** untuk menguji jalur on-device Gemini Nano.
  Tanpa desktop Chrome, aplikasi tetap jalan — tapi semua request lari ke cloud.

## 1. Buat Firebase project (Principal, di browser — ~10 menit)

1. Buka https://console.firebase.google.com/ , sign in dengan akun Google Principal.
2. Create project → beri nama (mis. `bacaringkas`) → **Google Analytics: OFF** (tidak perlu).
3. Di console: **AI Services > AI Logic > Get started** → ikuti workflow.
4. Saat ditanya "Gemini API provider": pilih **Gemini Developer API** (gratis, tanpa billing).
   Jangan pilih Agent Platform Gemini API (dulu Vertex AI) — itu butuh billing.
5. Workflow ini otomatis mengaktifkan **App Check** untuk AI Logic — itu wajib.

## 2. Daftarkan web app + isi `.env`

1. Project settings > Your apps > Add app > Web → catat config-nya.
2. `cp .env.example .env` lalu isi semua `VITE_FIREBASE_*` dari config tersebut.
3. App Check > Apps > daftarkan app dengan **reCAPTCHA Enterprise** → isi
   `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` di `.env`.

## 3. Aktifkan produk pendukung (console, gratis)

- **Authentication** > Sign-in method > **Anonymous** > Enable.
- **Firestore Database** > Create database (production mode) > lokasi bebas.
- **Remote Config** > buat parameter berikut (atau biarkan default di `src/config.js`):
  `long_text_threshold_chars` (=4000), `prompt_summarize`, `prompt_explain`,
  `prompt_quiz`, `prompt_image`.

## 4. App Check debug token (localhost saja)

1. `npm run dev` → buka http://localhost:5173 → buka DevTools Console.
2. Salin token dari baris `AppCheck debug token: "..."`.
3. Console > **Security > App Check > Apps > Manage debug tokens** → Add debug token.
4. Refresh halaman. (Token debug diterima di submission — lihat RESEARCH.md §5.)

## 5. "Nano test input" — uji jalur on-device Gemini Nano (WAJIB desktop Chrome)

> HASIL TES 25 Nov 2026: browser cloud Gorith TIDAK BISA — dicek di 2 demo resmi
> Chrome (Prompt API Playground + Built-In AI Playground), keduanya bilang
> "The Prompt API is unavailable on this device" / availability `unavailable`
> (bukan `downloadable`, nggak ada tawaran download model, DevTools + chrome://
> juga nggak bisa dibuka dari browser cloud). Jadi badge on-device + rekaman
> video TETAP butuh Chrome desktop ≥139 beneran — bukan dari sini.

Ini yang dimaksud catatan board "Nano test input": membuktikan aplikasi benar-benar
menjalankan inference on-device dengan satu prompt uji nyata.

1. Chrome Desktop ≥139 → buka `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`
   → **Enabled** → restart Chrome.
2. DevTools Console → jalankan `await LanguageModel.availability()`.
   Harus keluar `available`, `downloading`, atau `downloadable`.
   Jika `downloadable`, jalankan `await LanguageModel.create()` untuk mengunduh model
   (ratusan MB — tunggu sampai selesai).
3. Buka aplikasi → tempel teks PENDEK (<4000 karakter) → klik **Jalankan**.
   Badge harus berbunyi **on-device (Gemini Nano)**.
4. Uji fallback: tempel teks PANJANG (>4000 karakter) → badge harus berbunyi **cloud**.
5. Uji gambar: upload foto halaman → badge **cloud** (input gambar selalu cloud).
6. Rekam langkah 3–5 untuk video demo — juri harus MELIHAT badge on-device menyala.

## 6. Deploy (opsional tapi sangat disarankan — hosted URL "strongly encouraged")

```bash
firebase login            # akun Google Principal
# isi project id asli di .firebaserc (ganti YOUR-FIREBASE-PROJECT-ID)
npm run build
firebase deploy           # Hosting + Firestore rules
```

## 7. Cek sebelum submit

- [ ] `npm run build` sukses tanpa error
- [ ] Badge on-device muncul di Chrome desktop (langkah 5.3)
- [ ] Badge cloud muncul untuk teks panjang & gambar (5.4–5.5)
- [ ] Simpan ke riwayat bekerja (Firestore)
- [ ] Tidak ada API key / secret di repo (`git grep` untuk `AIza`, `.env` tidak ter-commit)
- [ ] Repo publik + LICENSE terlihat di halaman repo
- [ ] Video demo ≤3 menit di YouTube (publik, subtitle Inggris)
