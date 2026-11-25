// Firestore history: one doc per saved result, owned by the anonymous user.
// Rules (firestore.rules) allow only the owning uid to read/write.
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
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
  const snap = await getDocs(
    query(collection(db, "results"), where("uid", "==", user.uid), orderBy("createdAt", "desc"))
  );
  return snap.docs.slice(0, limit).map((d) => ({ id: d.id, ...d.data() }));
}
