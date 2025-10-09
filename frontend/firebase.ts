// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtH89pwtZOjl-ACw5WzJGnH0ay6HkQW_Q",
  authDomain: "financeflow-17896.firebaseapp.com",
  projectId: "financeflow-17896",
  storageBucket: "financeflow-17896.firebasestorage.app",
  messagingSenderId: "152541660785",
  appId: "1:152541660785:web:5d339ad1f646a5719ebdd0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firebase Auth instance
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;