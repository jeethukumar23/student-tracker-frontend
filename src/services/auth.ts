import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function signup(name: string, email: string, password: string, role: string) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    name,
    email,
    role
  });
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}

export async function getUserRole() {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  const snap = await getDoc(doc(db, "users", uid));
  return snap.data()?.role;
}
