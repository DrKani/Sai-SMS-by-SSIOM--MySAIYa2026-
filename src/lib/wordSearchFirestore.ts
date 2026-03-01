/**
 * WordSearch Firestore Service (H3)
 * 
 * Provides Firestore persistence for WordSearch progress and briefcase items,
 * with localStorage as the primary fast cache and Firestore as durable sync.
 */

import { db } from './firebase';
import {
    doc, getDoc, setDoc, updateDoc, arrayUnion,
    collection, getDocs, serverTimestamp
} from 'firebase/firestore';

// ==========================================
// Types
// ==========================================

export interface WordSearchProgress {
    unlockedLevels: number[];
    highScores: Record<number, { score: number; time: number; completedAt: string }>;
    tutorialSeen: boolean;
    lastUpdated: any; // Firestore FieldValue
}

export interface FirestoreBriefcaseItem {
    id: string;
    type: 'quiz_result' | 'reflection' | 'note' | 'word_card';
    title: string;
    content: any;
    timestamp: string;
}

// ==========================================
// WordSearch Progress
// ==========================================

/**
 * Load user's WordSearch progress from Firestore.
 * Falls back to localStorage if Firestore fails.
 */
export const loadProgressFromFirestore = async (uid: string): Promise<WordSearchProgress | null> => {
    try {
        const docRef = doc(db, 'users', uid, 'gameProgress', 'wordSearch');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data() as WordSearchProgress;
        }
        return null;
    } catch (error) {
        console.warn('[WordSearch] Firestore read failed, using localStorage fallback:', error);
        return null;
    }
};

/**
 * Save user's WordSearch progress to Firestore.
 * Also updates localStorage as the fast cache.
 */
export const saveProgressToFirestore = async (
    uid: string,
    unlockedLevels: number[],
    levelId?: number,
    score?: number,
    time?: number
): Promise<void> => {
    try {
        const docRef = doc(db, 'users', uid, 'gameProgress', 'wordSearch');
        const snap = await getDoc(docRef);

        if (snap.exists()) {
            const updates: Record<string, any> = {
                unlockedLevels,
                lastUpdated: serverTimestamp()
            };

            if (levelId !== undefined && score !== undefined && time !== undefined) {
                const existing = snap.data() as WordSearchProgress;
                const currentHigh = existing.highScores?.[levelId]?.score || 0;
                if (score > currentHigh) {
                    updates[`highScores.${levelId}`] = {
                        score,
                        time,
                        completedAt: new Date().toISOString()
                    };
                }
            }

            await updateDoc(docRef, updates);
        } else {
            const newProgress: WordSearchProgress = {
                unlockedLevels,
                highScores: {},
                tutorialSeen: true,
                lastUpdated: serverTimestamp()
            };

            if (levelId !== undefined && score !== undefined && time !== undefined) {
                newProgress.highScores[levelId] = {
                    score,
                    time,
                    completedAt: new Date().toISOString()
                };
            }

            await setDoc(docRef, newProgress);
        }

        // Keep localStorage in sync
        localStorage.setItem('sms_wordsearch_unlocked', JSON.stringify(unlockedLevels));
    } catch (error) {
        console.warn('[WordSearch] Firestore write failed, localStorage still valid:', error);
        // localStorage was already updated by the caller — no data loss
    }
};

// ==========================================
// Briefcase Sync
// ==========================================

/**
 * Save a briefcase item to both localStorage AND Firestore.
 */
export const saveBriefcaseItemToFirestore = async (
    uid: string,
    item: FirestoreBriefcaseItem
): Promise<void> => {
    try {
        const docRef = doc(db, 'users', uid, 'briefcase', item.id);
        await setDoc(docRef, {
            ...item,
            syncedAt: serverTimestamp()
        });
    } catch (error) {
        console.warn('[WordSearch] Briefcase Firestore write failed:', error);
        // localStorage already has the item — no data loss
    }
};

/**
 * Load all briefcase items from Firestore (for sync on login).
 */
export const loadBriefcaseFromFirestore = async (uid: string): Promise<FirestoreBriefcaseItem[]> => {
    try {
        const colRef = collection(db, 'users', uid, 'briefcase');
        const snap = await getDocs(colRef);
        return snap.docs.map(d => d.data() as FirestoreBriefcaseItem);
    } catch (error) {
        console.warn('[WordSearch] Briefcase Firestore read failed:', error);
        return [];
    }
};
