import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 🔥 Firebase Login
      const res = await signInWithEmailAndPassword(auth, email, password);

      // 🔥 Get user role from Firestore
      const snap = await getDoc(doc(db, "users", res.user.uid));
      const data = snap.data();

      if (!data) throw new Error("User not found");

      setUser({
        uid: res.user.uid,
        email: res.user.email,
        name: data.name,
        role: data.role,
      });

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-orange-500 mb-10">
        Student Tracker
      </h1>

      <div className="max-w-md w-full bg-white border rounded-lg shadow p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/signup")}
          >
            Create an account
          </Button>
        </div>
      </div>
    </div>
  );
}
