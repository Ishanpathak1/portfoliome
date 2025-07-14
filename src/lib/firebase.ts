import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0YzH_fDuELlxQdyXdvU1flUTxKDh92AM",
  authDomain: "portfoliome-47ef9.firebaseapp.com",
  projectId: "portfoliome-47ef9",
  storageBucket: "portfoliome-47ef9.firebasestorage.app",
  messagingSenderId: "462156892213",
  appId: "1:462156892213:web:8c85c6a486a484abde497c",
  measurementId: "G-2YWWZ2SNDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize providers
export const googleProvider = new GoogleAuthProvider();

export { analytics };
export default app; 