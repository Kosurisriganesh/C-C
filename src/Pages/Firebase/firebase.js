import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, sendEmailVerification } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your wbaseapp.comeb app's Firebase configuration
// Replace with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyDekzRF-y-CYsqf7D9IQIdVD8PBYEKPVNk",
  authDomain: "candles---capitals.firebaseapp.com",
  projectId: "candles---capitals",
  storageBucket: "candles---capitals.firebasestorage.app",
  messagingSenderId: "809266000519",
  appId: "1:809266000519:web:021af6d2420be56073be22",
  measurementId : "G-VH3KZQ9L4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, sendEmailVerification };
