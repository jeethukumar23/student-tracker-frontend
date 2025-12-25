import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzZVJ4LdVukAST547LN-gLId4U2ef3SZE",
  authDomain: "studenttracker-23.firebaseapp.com",
  projectId: "studenttracker-23",
  storageBucket: "studenttracker-23.firebasestorage.app",
  messagingSenderId: "347662422648",
  appId: "1:347662422648:web:a6f7cf5fa00b21ac48138d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
