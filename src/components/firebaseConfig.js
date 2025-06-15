// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrpmn7fEj25BQJn0S0KgyJSXspXLf43LE",
  authDomain: "student-portal-8765f.firebaseapp.com",
  projectId: "student-portal-8765f",
  storageBucket: "student-portal-8765f.firebasestorage.app",
  messagingSenderId: "128827295354",
  appId: "1:128827295354:web:3f6b8daad2e0d8e1bf1dc3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export default app