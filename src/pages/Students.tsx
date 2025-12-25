import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";


export default function Students() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    getDocs(collection(db, "students")).then((snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      {students.map(s => (
        <div key={s.id}>
          {s.name} - {s.email}
        </div>
      ))}
    </Layout>
  );
}
