// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Types
import type { User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPXL1iR7-htf7VwqFC5me-Ef2mD_VkoGA",
  authDomain: "clear-essence-bd76a.firebaseapp.com",
  projectId: "clear-essence-bd76a",
  storageBucket: "clear-essence-bd76a.firebasestorage.app",
  messagingSenderId: "945966632701",
  appId: "1:945966632701:web:6da180d520937cc239b894",
  measurementId: "G-X3J1JLFB30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Export app instances and auth methods
export {
  app,
  auth,
  analytics,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};

// Export types
export type { User };
