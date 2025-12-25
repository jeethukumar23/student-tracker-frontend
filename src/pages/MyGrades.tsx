import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Grades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, "grades"), where("studentId", "==", user.uid));
    getDocs(q).then(snap => setGrades(snap.docs.map(d => d.data())));
  }, [user]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">My Grades</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grades.map((g,i)=>(
          <Card key={i}>
            <CardHeader>
              <CardTitle>{g.subjectName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">Score: <b>{g.score}/10</b></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
