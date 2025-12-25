import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function AttendanceManagement() {
  const { user } = useAuth();

  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    // load students
    getDocs(query(collection(db,"users"), where("role","==","student")))
      .then(snap => setStudents(snap.docs.map(d => ({id:d.id, ...d.data()}))));

    // load teacher subjects
    getDocs(query(collection(db,"subjects"), where("teacherId","==",user.uid)))
      .then(snap => setSubjects(snap.docs.map(d => ({id:d.id, ...d.data()}))));
  }, []);

  const save = async () => {
    for (const s of students) {
      await addDoc(collection(db,"attendance"), {
        studentId: s.id,
        subjectId,
        date,
        status: status[s.id] || "present"
      });
    }
    alert("Attendance Saved");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>

      <select onChange={e=>setSubjectId(e.target.value)}>
        <option>Select Subject</option>
        {subjects.map(s=>(
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <input type="date" onChange={e=>setDate(e.target.value)} />

      {students.map(s=>(
        <div key={s.id} className="flex gap-4 my-2">
          {s.name}
          <select onChange={e=>setStatus({...status,[s.id]:e.target.value})}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>
      ))}

      <Button onClick={save}>Save Attendance</Button>
    </Layout>
  );
}
