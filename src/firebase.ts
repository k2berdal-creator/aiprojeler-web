import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAxVVf0daKdEHMoGj2LO5CfQbfwxIs1Ghs",
  authDomain: "aiprojeler-web.firebaseapp.com",
  projectId: "aiprojeler-web",
  storageBucket: "aiprojeler-web.firebasestorage.app",
  messagingSenderId: "1034429671949",
  appId: "1:1034429671949:web:dafe249e098ec8f6324344",
  measurementId: "G-WV04NK9F51"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
