import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";

import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, "attendance"), where("studentId", "==", user.uid));

    getDocs(q).then((snap) => {
      setRecords(snap.docs.map(d => d.data()));
      setLoading(false);
    });
  }, [user]);

  const badge = (s:string) =>
    <Badge variant={s==="present"?"default":s==="absent"?"destructive":"secondary"}>{s}</Badge>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">My Attendance</h1>

      <Card>
        <CardHeader><CardTitle>Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((r,i)=>(
                <TableRow key={i}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.subjectName}</TableCell>
                  <TableCell>{badge(r.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}
