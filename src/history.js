// Firestore history: one doc per saved result, owned by the anonymous user.
// Rules (firestore.rules) allow only the owning uid to read/write.
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db, ensureSignedIn } from "./firebase.js";

export async function saveResult({ task, lang, text, result, mode }) {
  const user = await ensureSignedIn();
  await addDoc(collection(db, "results"), {
    uid: user.uid,
    task,
    lang,
    input: text.slice(0, 4000),
    output: result.slice(0, 20000),
    mode,
    createdAt: serverTimestamp(),
  });
}

export async function loadHistory(limit = 10) {
  const user = await ensureSignedIn();
  // No orderBy here on purpose: where(uid == ...) + orderBy(createdAt)
  // needs a composite index created in the Firebase console. A single
  // equality filter is auto-indexed, so sort client-side instead.
  const snap = await getDocs(
    query(collection(db, "results"), where("uid", "==", user.uid))
  );
  const ts = (d) => d?.createdAt?.toMillis?.() ?? 0;
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => ts(b) - ts(a))
    .slice(0, limit);
}
