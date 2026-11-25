// Firebase init + App Check. No credentials live in this repo:
// fill .env (see .env.example) from YOUR Firebase console web config.
// App Check is REQUIRED by Firebase AI Logic; the debug provider is used
// on localhost only (rules: debug tokens are accepted in submissions).
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";
import { getRemoteConfig } from "firebase/remote-config";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "Firebase config belum diisi. Salin .env.example ke .env dan isi dari Firebase console (lihat SETUP.md)."
  );
}

export const app = initializeApp(firebaseConfig);

// Localhost: the debug flag makes the SDK use the App Check debug provider
// instead of reCAPTCHA; the debug token printed in DevTools must be
// registered in the Firebase console: Security > App Check > Apps > Manage debug tokens.
if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const remoteConfig = getRemoteConfig(app);

// Anonymous auth is enough for per-user history; no email/password needed.
export async function ensureSignedIn() {
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser;
}
