// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_FiqT9R6j7DrGP6SttwGhTbzqJMZVkro",
  authDomain: "orbital-d8bd4.firebaseapp.com",
  projectId: "orbital-d8bd4",
  storageBucket: "orbital-d8bd4.appspot.com",
  messagingSenderId: "378839224959",
  appId: "1:378839224959:web:bfecb7074d1902e4af654a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

