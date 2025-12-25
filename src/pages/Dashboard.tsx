import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();

  const [students, setStudents] = useState(0);
  const [teachers, setTeachers] = useState(0);

  const [mySubjects, setMySubjects] = useState<any[]>([]);
  const [attendanceGraphData, setAttendanceGraphData] = useState<any[]>([]);
  const [gradeGraphData, setGradeGraphData] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // ADMIN: count from users collection
    if (user.role === "admin") {
      const usersRef = collection(db, "users");

      getDocs(query(usersRef, where("role", "==", "student"))).then(s => setStudents(s.size));
      getDocs(query(usersRef, where("role", "==", "teacher"))).then(t => setTeachers(t.size));
    }

    // TEACHER: load assigned subjects
    if (user.role === "teacher") {
      const q = query(collection(db, "subjects"), where("teacherId", "==", user.uid));
      getDocs(q).then((snap) => {
        setMySubjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    }

    // STUDENT: load graphs
    if (user.role === "student") {
      loadAttendance();
      loadGrades();
    }
  }, [user]);

  // ---------------- Attendance
  const loadAttendance = async () => {
    const q = query(collection(db, "attendance"), where("studentId", "==", user.uid));
    const snap = await getDocs(q);

    const graph = snap.docs.map((d) => {
      const r:any = d.data();
      return {
        date: r.date,
        value: r.status === "present" ? 1 : r.status === "late" ? 0.5 : 0
      };
    });

    setAttendanceGraphData(graph);
  };

  // ---------------- Grades
  const loadGrades = async () => {
    const q = query(collection(db, "grades"), where("studentId", "==", user.uid));
    const snap = await getDocs(q);

    const graph = snap.docs.map((d) => {
      const g:any = d.data();
      return {
        subject: g.subject,
        value: Number(g.score)
      };
    });

    setGradeGraphData(graph);
  };

  // ---------------- PDF
  const downloadReport = async () => {
    const el = document.getElementById("report");
    if (!el) return;

    const canvas = await html2canvas(el);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 10, 10, 190, 0);
    pdf.save("student-report.pdf");
  };

  return (
    <Layout>
      <div id="report" className="space-y-8">

        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* ADMIN */}
        {user?.role === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-orange-500 text-white">
              <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
              <CardContent className="text-5xl font-bold">{students}</CardContent>
            </Card>

            <Card className="bg-blue-500 text-white">
              <CardHeader><CardTitle>Total Teachers</CardTitle></CardHeader>
              <CardContent className="text-5xl font-bold">{teachers}</CardContent>
            </Card>
          </div>
        )}

        {/* TEACHER */}
        {user?.role === "teacher" && (
          <>
            <h2 className="text-2xl font-semibold">My Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySubjects.map((s) => (
                <Card key={s.id}>
                  <CardHeader>
                    <CardTitle>{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent>Assigned to you</CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* STUDENT */}
        {user?.role === "student" && (
          <>
            <Card>
              <CardHeader><CardTitle>Attendance Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={attendanceGraphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" stroke="#ff7a00" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Grades</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={gradeGraphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Button onClick={downloadReport}>Download Report</Button>
          </>
        )}

      </div>
    </Layout>
  );
}
