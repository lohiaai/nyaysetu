import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTU30-3cmriVIdmknWUkKmW5fyBnSX604",
  authDomain: "adv-lakhi-lohia.firebaseapp.com",
  projectId: "adv-lakhi-lohia",
  storageBucket: "adv-lakhi-lohia.firebasestorage.app",
  messagingSenderId: "223805611647",
  appId: "1:223805611647:web:e102f3c9c6b1b7053ae94a"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
