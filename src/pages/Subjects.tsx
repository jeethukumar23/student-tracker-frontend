import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function Subjects() {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");

  // Load data
  useEffect(() => {
    if (!user) return;

    loadSubjects();

    if (user.role === "admin") {
      getDocs(collection(db, "teachers")).then((snap) =>
        setTeachers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
    }
  }, [user]);

  const loadSubjects = async () => {
    let q;

    if (user.role === "teacher") {
      q = query(collection(db, "subjects"), where("teacherId", "==", user.uid));
    } else {
      q = collection(db, "subjects");
    }

    const snap = await getDocs(q);
    setSubjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const addSubject = async () => {
    if (!name) return alert("Enter subject name");

    await addDoc(collection(db, "subjects"), {
      name,
      teacherId: user.role === "teacher" ? user.uid : teacherId,
    });

    setName("");
    setTeacherId("");
    loadSubjects();
  };

  const removeSubject = async (id: string) => {
    await deleteDoc(doc(db, "subjects", id));
    loadSubjects();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>

      {/* Add subject */}
      {(user.role === "admin" || user.role === "teacher") && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Subject Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {user.role === "admin" && (
              <select
                className="w-full p-2 border rounded"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}

            <Button className="w-full" onClick={addSubject}>
              Add Subject
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Subjects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Teacher ID: {s.teacherId}</p>

              {(user.role === "admin" || user.role === "teacher") && (
                <Button
                  className="mt-3"
                  variant="destructive"
                  onClick={() => removeSubject(s.id)}
                >
                  Delete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
