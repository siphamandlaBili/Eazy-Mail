// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbqifzB85zWufAGHoqSulCR3R6A2qe1U4",
  authDomain: "easymailai.firebaseapp.com",
  projectId: "easymailai",
  storageBucket: "easymailai.appspot.com",
  messagingSenderId: "817500433015",
  appId: "1:817500433015:web:663417cd9f0d309952f472"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app)
export default app;