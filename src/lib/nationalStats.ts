import { db } from './firebase';
import { doc, onSnapshot, updateDoc, increment, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface StateStat {
    chants: number;
    participants: number;
}

export interface NationalStats {
    totalChants: number;
    totalParticipants: number;
    goalPercent: number;
    states: Record<string, StateStat>;
    lastUpdated: any;
}

const STATS_DOC_PATH = 'metadata/national_stats';
const PARTICIPANTS_COLLECTION = 'metadata/national_stats/participants';

// ── Participant cache ─────────────────────────────────────────────────────────
// Avoids a getDoc read on every chant submission after the first one per user.
const PARTICIPANT_CACHE_KEY = 'sms_known_participant';
const _knownParticipants: Set<string> = (() => {
    try {
        const stored = localStorage.getItem(PARTICIPANT_CACHE_KEY);
        return new Set<string>(stored ? JSON.parse(stored) : []);
    } catch { return new Set<string>(); }
})();

function cacheParticipant(uid: string): void {
    _knownParticipants.add(uid);
    try {
        localStorage.setItem(PARTICIPANT_CACHE_KEY, JSON.stringify([..._knownParticipants]));
    } catch { /* quota exceeded — ignore */ }
}

/**
 * Increments national and state-wise stats in Firestore.
 * Handles participant counting by checking a sub-collection.
 * Uses an in-memory + localStorage cache so the participant-check read
 * only happens once per user (instead of on every single submission).
 */
export const recordSadhanaOffering = async (uid: string, state: string, chantCount: number) => {
    try {
        const statsRef = doc(db, STATS_DOC_PATH);

        // 1. Determine if participant is new (cached → skip Firestore read)
        let isNewParticipant = false;
        if (!_knownParticipants.has(uid)) {
            const participantRef = doc(db, PARTICIPANTS_COLLECTION, uid);
            const participantSnap = await getDoc(participantRef);
            if (participantSnap.exists()) {
                // Already recorded in Firestore — cache it locally
                cacheParticipant(uid);
            } else {
                isNewParticipant = true;
                await setDoc(participantRef, { addedAt: new Date().toISOString() });
                cacheParticipant(uid);
            }
        }

        // 2. Prepare updates
        const updates: any = {
            totalChants: increment(chantCount),
            [`states.${state}.chants`]: increment(chantCount),
            lastUpdated: new Date().toISOString()
        };

        if (isNewParticipant) {
            updates.totalParticipants = increment(1);
            updates[`states.${state}.participants`] = increment(1);
        }

        // 3. Update main stats doc
        await updateDoc(statsRef, updates).catch(async (err) => {
            // If doc doesn't exist, initialize it
            if (err.code === 'not-found') {
                await setDoc(statsRef, {
                    totalChants: chantCount,
                    totalParticipants: 1,
                    states: {
                        [state]: { chants: chantCount, participants: 1 }
                    },
                    lastUpdated: new Date().toISOString()
                });
            } else {
                throw err;
            }
        });
    } catch (error) {
        console.error('[NationalStats] Failed to record offering:', error);
        throw error;
    }
};

/**
 * Real-time subscription to national stats.
 */
export const subscribeToNationalStats = (onUpdate: (stats: NationalStats) => void) => {
    const statsRef = doc(db, STATS_DOC_PATH);
    return onSnapshot(statsRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data() as NationalStats;
            // Calculate goal percentage (target: 1 million)
            data.goalPercent = Math.min(100, Math.floor((data.totalChants / 1000000) * 100));
            onUpdate(data);
        } else {
            // Document doesn't exist yet — provide zeroed stats so the page can render
            onUpdate({
                totalChants: 0,
                totalParticipants: 0,
                goalPercent: 0,
                states: {},
                lastUpdated: null
            });
        }
    }, (error) => {
        // On permission error or network failure, still unblock the loading state
        console.warn('[NationalStats] Snapshot error:', error);
        onUpdate({
            totalChants: 0,
            totalParticipants: 0,
            goalPercent: 0,
            states: {},
            lastUpdated: null
        });
    });
};

export const MALAYSIA_STATES = [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
    'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
    'Terengganu', 'W.P. Kuala Lumpur', 'W.P. Labuan', 'W.P. Putrajaya'
];
