// BacaRingkas UI wiring. Design constraint: single-turn actions only —
// on-device Gemini Nano does NOT support chat, so there is no chat loop.
import { ensureSignedIn } from "./firebase.js";
import { initDeviceModel, modelFor, probeOnDevice, runOnce } from "./ai.js";
import { fill, loadConfig } from "./config.js";
import { loadHistory, saveResult } from "./history.js";

const $ = (id) => document.getElementById(id);
const els = {
  status: $("deviceStatus"), text: $("inputText"), image: $("imageInput"),
  task: $("task"), lang: $("lang"), run: $("runBtn"), badge: $("routeBadge"),
  progress: $("progress"), output: $("output"), save: $("saveBtn"), copy: $("copyBtn"),
  history: $("history"),
};

let cfg = null;
let lastResult = null;
let nanoState = "unknown";

async function refreshStatus() {
  nanoState = await probeOnDevice();
  const map = {
    available: "✅ Gemini Nano on-device: TERSEDIA — ringkasan pendek jalan di perangkat.",
    downloading: "⏳ Gemini Nano sedang diunduh… ringkasan pendek tetap jalan (cloud fallback aktif).",
    downloadable: "⬇️ Gemini Nano bisa diunduh — klik Jalankan sekali untuk mulai mengunduh model.",
    unavailable: "☁️ On-device tidak tersedia di browser ini — semua request jalan di cloud.",
    unsupported: "☁️ Browser ini tidak mendukung on-device AI (butuh Chrome Desktop ≥139) — cloud fallback aktif.",
    unknown: "❓ Status on-device tidak bisa dicek — cloud fallback aktif.",
  };
  els.status.textContent = map[nanoState] ?? map.unknown;
}

function fileToPart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result).split(",")[1];
      resolve({ inlineData: { data: base64, mimeType: file.type } });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

els.run.addEventListener("click", async () => {
  const text = els.text.value.trim();
  const file = els.image.files?.[0];
  if (!text && !file) { els.output.textContent = "Tempel teks atau pilih foto halaman dulu."; return; }
  if (!cfg) cfg = await loadConfig();

  els.run.disabled = true;
  els.progress.hidden = false;
  els.badge.hidden = true;
  try {
    const hasImage = Boolean(file);
    const longInput = text.length > cfg.longThreshold;
    const { model, mode } = modelFor({ longInput, hasImage });

    // User activation (this click) + before any generateContent() — required.
    els.progress.textContent = "Menyiapkan model on-device…";
    initDeviceModel(model, (pct) => { els.progress.textContent = `Mengunduh model on-device: ${pct}%`; });

    const lang = els.lang.value;
    const task = els.task.value;
    let prompt;
    let imagePart = null;
    if (hasImage) {
      imagePart = await fileToPart(file);
      prompt = fill(cfg.prompts.image, { lang });
      if (text) prompt += `\n\nKonteks tambahan dari pengguna:\n${text}`;
    } else {
      prompt = fill(cfg.prompts[task], { text, lang });
    }

    els.progress.textContent = "Memproses…";
    const { text: out } = await runOnce({ model, mode }, prompt, imagePart);

    els.output.textContent = out;
    lastResult = { task, lang, text, result: out, mode };
    els.save.disabled = false;
    els.copy.disabled = false;

    // Honest badge: requested mode + live Nano probe (the SDK does not
    // document a per-response "actual route" field — see src/ai.js).
    els.badge.hidden = false;
    if (hasImage || longInput) {
      els.badge.textContent = "☁️ Rute: cloud (Gemini) — input panjang/gambar";
    } else if (nanoState === "available") {
      els.badge.textContent = "📱 Rute: on-device (Gemini Nano) — mode PREFER_ON_DEVICE, Nano tersedia";
    } else {
      els.badge.textContent = `☁️ Rute: cloud fallback — mode PREFER_ON_DEVICE, Nano ${nanoState}`;
    }
  } catch (err) {
    els.output.textContent = `Gagal: ${err?.message ?? err}\n\nCoba lagi. Jika error App Check, cek debug token (SETUP.md langkah 4).`;
  } finally {
    els.progress.hidden = true;
    els.run.disabled = false;
  }
});

els.save.addEventListener("click", async () => {
  if (!lastResult) return;
  els.save.disabled = true;
  try { await saveResult(lastResult); await renderHistory(); } catch (e) { els.output.textContent = `Gagal menyimpan: ${e?.message ?? e}`; }
  els.save.disabled = false;
});

els.copy.addEventListener("click", async () => {
  if (lastResult) await navigator.clipboard.writeText(lastResult.result);
});

async function renderHistory() {
  try {
    const items = await loadHistory();
    els.history.innerHTML = items.length
      ? items.map((i) => `<li><b>${i.task}</b> (${i.mode}) — ${String(i.output).slice(0, 120)}…</li>`).join("")
      : "<li>Belum ada riwayat tersimpan.</li>";
  } catch { els.history.innerHTML = "<li>Riwayat belum bisa dimuat (cek Firebase setup).</li>"; }
}

ensureSignedIn().catch(() => {});
refreshStatus();
renderHistory();
