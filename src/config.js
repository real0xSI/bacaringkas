// Remote Config: prompt templates + routing threshold, tunable without redeploy.
// Defaults below are the fallback if Remote Config has never been published.
import { fetchAndActivate, getValue } from "firebase/remote-config";
import { remoteConfig } from "./firebase.js";

export const DEFAULTS = {
  long_text_threshold_chars: 4000,
  prompt_summarize: "Ringkas teks berikut dalam 3-5 kalimat, dalam bahasa {lang}. Teks:\n\n{text}",
  prompt_explain:
    "Dari teks berikut, daftar kata-kata sulit beserta penjelasan singkatnya, dalam bahasa {lang}. Jawab sebagai daftar bernomor. Teks:\n\n{text}",
  prompt_quiz:
    "Buat 3 soal pilihan ganda (A-D) dari teks berikut, dalam bahasa {lang}. Jawab HANYA dengan JSON valid: {\"questions\":[{\"q\":\"...\",\"options\":[\"...\",\"...\",\"...\",\"...\"],\"answer\":0}]}. Teks:\n\n{text}",
  prompt_image:
    "Jelaskan isi foto halaman ini lalu ringkas dalam 3-5 kalimat, dalam bahasa {lang}.",
};

export async function loadConfig() {
  remoteConfig.defaultConfig = DEFAULTS;
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  try {
    await fetchAndActivate(remoteConfig);
  } catch {
    // Offline / not yet published in console: defaults apply. Not fatal.
  }
  return {
    longThreshold: Number(getValue(remoteConfig, "long_text_threshold_chars").asString()) || DEFAULTS.long_text_threshold_chars,
    prompts: {
      summarize: getValue(remoteConfig, "prompt_summarize").asString() || DEFAULTS.prompt_summarize,
      explain: getValue(remoteConfig, "prompt_explain").asString() || DEFAULTS.prompt_explain,
      quiz: getValue(remoteConfig, "prompt_quiz").asString() || DEFAULTS.prompt_quiz,
      image: getValue(remoteConfig, "prompt_image").asString() || DEFAULTS.prompt_image,
    },
  };
}

export function fill(template, { text, lang }) {
  return template.replaceAll("{text}", text ?? "").replaceAll("{lang}", lang === "id" ? "Bahasa Indonesia" : "English");
}
