// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3ZDF7HQsSqvzbBzOOclBnk2smOH9Jxig",
  authDomain: "issacasimovlab.firebaseapp.com",
  projectId: "issacasimovlab",
  storageBucket: "issacasimovlab.firebasestorage.app",
  messagingSenderId: "853441845230",
  appId: "1:853441845230:web:78cc1ca65a8649926d20ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;