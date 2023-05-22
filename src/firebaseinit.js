// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlccK7tRgBYTWH-scGxvjDcYmrZKlHr-8",
  authDomain: "monkeymart-550c3.firebaseapp.com",
  projectId: "monkeymart-550c3",
  storageBucket: "monkeymart-550c3.appspot.com",
  messagingSenderId: "277170397675",
  appId: "1:277170397675:web:7e51b22144f096ca94b9ae",
  databaseURL: "https://monkeymart-550c3-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);