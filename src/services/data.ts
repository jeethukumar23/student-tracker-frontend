import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getSubjects() {
  const snap = await getDocs(collection(db, "subjects"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getStudents() {
  const snap = await getDocs(collection(db, "students"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getTeachers() {
  const snap = await getDocs(collection(db, "teachers"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAttendance() {
  const snap = await getDocs(collection(db, "attendance"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getMarks() {
  const snap = await getDocs(collection(db, "marks"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
