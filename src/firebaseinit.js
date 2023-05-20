// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlccK7tRgBYTWH-scGxvjDcYmrZKlHr-8",
  authDomain: "monkeymart-550c3.firebaseapp.com",
  projectId: "monkeymart-550c3",
  storageBucket: "monkeymart-550c3.appspot.com",
  messagingSenderId: "277170397675",
  appId: "1:277170397675:web:7e51b22144f096ca94b9ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };