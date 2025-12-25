import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function GradeManagement() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    getDocs(query(collection(db,"users"), where("role","==","student")))
      .then(snap => setStudents(snap.docs.map(d => ({id:d.id,...d.data()}))));

    getDocs(query(collection(db,"subjects"), where("teacherId","==",user.uid)))
      .then(snap => setSubjects(snap.docs.map(d => ({id:d.id,...d.data()}))));
  }, []);

  const save = async () => {
    for (const s of students) {
      await addDoc(collection(db,"grades"), {
        studentId: s.id,
        subjectId,
        score: Number(scores[s.id] || 0)
      });
    }
    alert("Grades saved");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Post Grades</h1>

      <select onChange={e=>setSubjectId(e.target.value)}>
        <option>Select Subject</option>
        {subjects.map(s=>(
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      {students.map(s=>(
        <div key={s.id} className="flex gap-4 my-2">
          {s.name}
          <input type="number" min={0} max={10}
            onChange={e=>setScores({...scores,[s.id]:Number(e.target.value)})}/>
        </div>
      ))}

      <Button onClick={save}>Save Grades</Button>
    </Layout>
  );
}
