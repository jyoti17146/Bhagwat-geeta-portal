import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  Auth
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAco7hVGeZXXNCEM0Rawvi0m5I0ObWyrEo",
  authDomain: "gita-portal.firebaseapp.com",
  projectId: "gita-portal",
  storageBucket: "gita-portal.firebasestorage.app",
  messagingSenderId: "393859484462",
  appId: "1:393859484462:web:4282f4389321db2949c8bf",
  measurementId: "G-18CFS6Q3KX"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);
export { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
};
