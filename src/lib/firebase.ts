
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";

// Config will be populated after app creation or from environment variables
// For now, we set up the structure to be ready for the config values
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);

// Explicitly set persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Firebase auth persistence error:", error);
});

export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with offline persistence
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export const storage = getStorage(app);

// Analytics defaults to null if not supported (e.g. in some SSR contexts or restricted environments)
export let analytics = null;
isSupported().then(yes => yes && (analytics = getAnalytics(app)));

// Messaging
export let messaging = null;
isMessagingSupported().then(yes => {
    if (yes) {
        try {
            messaging = getMessaging(app);
        } catch (e) {
            console.error('Failed to initialize messaging', e);
        }
    }
});

export default app;
