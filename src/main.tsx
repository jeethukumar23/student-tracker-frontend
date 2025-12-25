import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import App from "./App.tsx";
import "./index.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function Root() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);
