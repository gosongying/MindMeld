// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW9gyTZcDHmnAIzCXQKfKmrz1yCrot2ZQ",
  authDomain: "orbital-265b4.firebaseapp.com",
  databaseURL: "https://orbital-265b4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "orbital-265b4",
  storageBucket: "orbital-265b4.appspot.com",
  messagingSenderId: "927371819112",
  appId: "1:927371819112:web:0320800c1c8e8edf9763dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const database = getDatabase(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

