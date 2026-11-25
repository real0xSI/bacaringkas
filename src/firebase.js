// Firebase init + App Check. No credentials live in this repo:
// fill .env (see .env.example) from YOUR Firebase console web config.
// App Check is REQUIRED by Firebase AI Logic. Two paths:
//  - reCAPTCHA Enterprise site key in .env -> ReCaptchaEnterpriseProvider.
//  - otherwise -> App Check debug provider with a STABLE debug token from
//    .env (VITE_APPCHECK_DEBUG_TOKEN). The contest allows debug tokens;
//    register that token once in the console: Security > App Check > Apps >
//    Manage debug tokens. In debug mode the SDK ignores the provider below,
//    so the CustomProvider is only a fallback that throws if ever called.
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, CustomProvider } from "firebase/app-check";
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

const siteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY;
const debugToken = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN;
if (siteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
} else {
  // Stable debug token (registered once in the console) or, on localhost
  // with no token at all, an auto-generated one (printed in DevTools).
  if (debugToken) self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  else if (import.meta.env.DEV) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  initializeAppCheck(app, {
    provider: new CustomProvider({
      getToken: async () => {
        throw new Error(
          "App Check: no reCAPTCHA key configured — register the debug token in the Firebase console (SETUP.md langkah 4)."
        );
      },
    }),
    isTokenAutoRefreshEnabled: true,
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const remoteConfig = getRemoteConfig(app);

// Anonymous auth is enough for per-user history; no email/password needed.
export async function ensureSignedIn() {
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser;
}
