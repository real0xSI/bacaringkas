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
3. App Check: **tidak ada site key reCAPTCHA Enterprise yang dibuat**
   (25 Nov 2026) — dipakai jalur debug token, lihat §4. Kalau nanti dibuat,
   isi `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` di `.env`.

## 3. Aktifkan produk pendukung (console, gratis)

- **Authentication** > Sign-in method > **Anonymous** > Enable.
- **Firestore Database** > Create database (production mode) > lokasi bebas.
- **Remote Config** > buat parameter berikut (atau biarkan default di `src/config.js`):
  `long_text_threshold_chars` (=4000), `prompt_summarize`, `prompt_explain`,
  `prompt_quiz`, `prompt_image`.
  > UPDATE 25 Nov 2026: Remote Config v1 SUDAH terbit dengan `minChars=100`,
  > `maxChars=5000`, `minJaccard/minCosine/minOverlap=0.3` — nama-nama ini
  > TIDAK dibaca `src/config.js` (yang dibaca: `long_text_threshold_chars` +
  > `prompt_*`), jadi default kode yang berlaku. Tidak merusak apa-apa.

## 4. App Check debug token (WAJIB — bukan cuma localhost)

Endpoint AI Logic MENOLAK request tanpa token App Check yang valid (401
terverifikasi 25 Nov 2026) dan exchange debug token gagal 403 kalau tokennya
belum terdaftar. Jadi token ini harus didaftarkan sekali di console — kalau
tidak, tombol Jalankan di aplikasi akan gagal.

1. Token stabil sudah ada di `.env` sebagai `VITE_APPCHECK_DEBUG_TOKEN`
   (dibuat 25 Nov 2026; JANGAN commit `.env`, JANGAN taruh token di repo).
2. Console > **Security > App Check > Apps > Manage debug tokens** → Add debug
   token → tempel nilai token itu → Save.
3. (Alternatif localhost saja) `npm run dev` → DevTools Console → salin token
   dari baris `AppCheck debug token: "..."` → daftarkan dengan cara yang sama.
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

> UPDATE 25 Nov 2026: deploy yang jalan dari VM ini adalah **Cloudflare Pages**
> (Firebase CLI tidak bisa login tanpa browser): project `bacaringkas`
> → https://bacaringkas.pages.dev. Deploy ulang: `wrangler pages deploy dist
> --project-name bacaringkas --branch main` (butuh `CLOUDFLARE_API_TOKEN`).
> Firestore rules TIDAK ikut ter-deploy lewat Pages — tempel `firestore.rules`
> di console (Firestore > Rules) atau `firebase deploy --only firestore:rules`
> dari mesin yang sudah `firebase login`. Sampai rules ter-deploy, simpan
> riwayat akan gagal permission-denied (alur AI tidak tergantung Firestore).

## 8. Rekam video demo (VM — pipeline terbukti 25 Nov 2026, lihat RESEARCH.md §12)

> Rekaman REHEARSAL 25 Nov membuktikan pipeline-nya jalan (Xvfb + Chromium +
> ffmpeg + CDP). Tapi video SUBMISSION yang nunjukkin hasil AI live BELUM
> BISA direkam dari VM ini — Chromium di VM nggak bisa mencapai internet
> publik sama sekali (termasuk generativelanguage.googleapis.com). Rute yang
> bisa: rekam di Chrome HP Principal (internet beneran, cloud fallback jalan)
> atau jalankan app di cloud browser untuk screenshot tiap langkah. JANGAN
> palsukan hasil (no fake summary, no fake on-device badge). Detail lengkap:
> `video/VIDEO-STATUS.md`. Script rekaman: `video/record-rehearsal.py`.

Perintah yang terbukti jalan (untuk re-record setelah Firebase project ada):

```bash
# 1. Kebijakan WebGL (wajib — Chromium nggak mau start tanpanya)
printf 'hatch-webgl-all-origins-v1\n' > /tmp/webgl-policy.txt
# 2. Xvfb + Chromium kiosk (file:// — localhost diblokir LNA checks)
Xvfb :99 -screen 0 1280x720x24 &
H=$(sha256sum /tmp/webgl-policy.txt | cut -d' ' -f1)
DISPLAY=:99 /opt/meta-chromium/chrome --disable-gpu --no-sandbox \
  --disable-dev-shm-usage --user-data-dir=/tmp/chrome-profile-xvfb \
  --remote-debugging-port=9222 --window-size=1280,720 --kiosk \
  --allow-file-access-from-files \
  --hatch-webgl-allowed-domains-file=/tmp/webgl-policy.txt \
  --hatch-webgl-allowed-domains-sha256=$H \
  file:///tmp/baca-rehearsal/index.html &
# 3. Build dengan path relatif + jalankan script rekaman
npx vite build --base ./ --outDir /tmp/baca-rehearsal
python3 video/record-rehearsal.py   # butuh websocket-client di venv scrapling
# 4. Narasi (sudah jadi): video/narration-en-energetic-male.mp3 (32.2s)
```

## 9. Cek sebelum submit

- [ ] `npm run build` sukses tanpa error
- [ ] Badge on-device muncul di Chrome desktop (langkah 5.3)
- [ ] Badge cloud muncul untuk teks panjang & gambar (5.4–5.5)
- [ ] Simpan ke riwayat bekerja (Firestore)
- [ ] Tidak ada API key / secret di repo (`git grep` untuk `AIza`, `.env` tidak ter-commit)
- [ ] Repo publik + LICENSE terlihat di halaman repo
- [ ] Video demo ≤3 menit di YouTube (publik, subtitle Inggris)
