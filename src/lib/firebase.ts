import { initializeApp, getApps, getApp } from "firebase/app";
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

// Initialize Firebase safely on client only
const appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(appInstance);
export const googleProvider = new GoogleAuthProvider();

let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(appInstance);
  } catch {
    analytics = undefined;
  }
}

export { analytics };
export default appInstance;