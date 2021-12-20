// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

import { FIREBASE_API_KEY } from "@env";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "im-asleep-are-you.firebaseapp.com",
  projectId: "im-asleep-are-you",
  storageBucket: "im-asleep-are-you.appspot.com",
  messagingSenderId: "105944100002",
  appId: "1:105944100002:web:3a5635b442b37c2f813bfb",
  measurementId: "G-SHWEGFDSQL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
