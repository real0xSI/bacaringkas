// Hybrid inference with Firebase AI Logic (firebase/ai, SDK v12.5.0+).
// On-device = Chrome Prompt API / Gemini Nano 4 (desktop Chrome >= 139).
// Cloud fallback = Gemini Developer API (free tier, no billing).
// CONSTRAINT (Firebase docs): on-device supports ONLY single-turn text
// generation — NOT chat. So every action below is one prompt, one answer.
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";
import { app } from "./firebase.js";

const ai = getAI(app, { backend: new GoogleAIBackend() });

// Short prompts prefer the on-device model; long prompts and image prompts
// go to the cloud (Nano is single-turn, small-context; long docs are the
// documented cloud case). Threshold comes from Remote Config (see config.js).
// Returns { model, mode } — the mode is carried alongside because the SDK
// model object does not document a public `.mode` accessor.
export function modelFor({ longInput, hasImage }) {
  const mode = longInput || hasImage ? InferenceMode.PREFER_IN_CLOUD : InferenceMode.PREFER_ON_DEVICE;
  return { model: getGenerativeModel(ai, { model: "gemini-2.5-flash", mode }), mode };
}

// MUST be called after/on a user interaction (button click) and BEFORE any
// generateContent() call. Shows the Nano model download progress.
export function initDeviceModel(model, onProgress) {
  model.initializeDeviceModel((val) => {
    if (onProgress) onProgress(Math.round(val * 10000) / 100);
  });
}

// One single-turn generation. Returns { text, mode } where mode is the
// InferenceMode requested. NOTE (to verify against the installed SDK):
// the JS SDK does not document a per-response "route actually used" field,
// so the UI badge reports the requested mode + the live Nano availability
// probe (see main.js) instead of claiming a route the SDK never told us.
// Do not invent a response.inferenceRoute field — check the installed
// firebase/ai version's typings first; if it exposes one, wire it here.
export async function runOnce({ model, mode }, prompt, imagePart) {
  const parts = imagePart ? [prompt, imagePart] : [prompt];
  const result = await model.generateContent(parts);
  const response = result.response;
  return { text: response.text(), mode };
}

// Quick capability probe for the status line (Chrome Prompt API only).
export async function probeOnDevice() {
  const lm = globalThis.LanguageModel;
  if (!lm || typeof lm.availability !== "function") return "unsupported";
  try {
    return await lm.availability(); // "available" | "downloading" | "downloadable" | "unavailable"
  } catch {
    return "unknown";
  }
}
