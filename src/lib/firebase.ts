
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { getFunctions } from "firebase/functions";

const FALLBACK_FIREBASE_CONFIG = {
    apiKey: "AIzaSyB55m8MjdqJHgkZK4_XOA964It1jqXO7p4",
    authDomain: "sai-sms-by-ssiom-mysaiya-2026.firebaseapp.com",
    projectId: "sai-sms-by-ssiom-mysaiya-2026",
    storageBucket: "sai-sms-by-ssiom-mysaiya-2026.firebasestorage.app",
    messagingSenderId: "136292931128",
    appId: "1:136292931128:web:4946db8389f5e5386f38cd",
    measurementId: "G-TL5P16CYW9"
};

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || FALLBACK_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || FALLBACK_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || FALLBACK_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || FALLBACK_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || FALLBACK_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || FALLBACK_FIREBASE_CONFIG.appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || FALLBACK_FIREBASE_CONFIG.measurementId
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
export const functions = getFunctions(app);

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
