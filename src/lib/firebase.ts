import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function hasFirebaseConfig(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

function createFirebaseApp(): FirebaseApp | undefined {
  if (typeof window === 'undefined' || !hasFirebaseConfig()) {
    return undefined;
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

const appInstance = createFirebaseApp();
export const auth: Auth | undefined = appInstance ? getAuth(appInstance) : undefined;
export const googleProvider = appInstance ? new GoogleAuthProvider() : undefined;

let analytics: ReturnType<typeof getAnalytics> | undefined;
if (appInstance) {
  try {
    analytics = getAnalytics(appInstance);
  } catch {
    analytics = undefined;
  }
}

export { analytics };
export default appInstance;