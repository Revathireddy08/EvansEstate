// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAuaaLHevDjJm9vZb12UqE26u4vl-u7glM",
  authDomain: "mern-real-estate-auth.firebaseapp.com",
  projectId: "mern-real-estate-auth",
  storageBucket: "mern-real-estate-auth.firebasestorage.app",
  messagingSenderId: "426104744771",
  appId: "1:426104744771:web:c99035eea89b7ef5615df6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };