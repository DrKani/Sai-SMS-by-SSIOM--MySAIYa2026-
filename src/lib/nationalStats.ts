import { db } from './firebase';
import { doc, onSnapshot, updateDoc, increment, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export interface StateStat {
    chants: number;
    participants: number;
}

export interface MantraBreakdown {
    gayathri: number;
    saiGayathri: number;
    likitha: number;
}

export interface NationalStats {
    totalChants: number;
    totalParticipants: number;
    goalPercent: number;
    states: Record<string, StateStat>;
    mantras: MantraBreakdown;
    lastUpdated: any;
}

export interface CentreLeaderboardEntry {
    centre: string;
    totalChants: number;
    memberCount: number;
    participationRate: number;
}

export type LeaderboardTab = 'engaged' | 'chanting' | 'participation';

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
export const recordSadhanaOffering = async (uid: string, state: string, chantCount: number, mantraType?: 'gayathri' | 'saiGayathri' | 'likitha') => {
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

        // Track mantra type breakdown
        if (mantraType) {
            updates[`mantras.${mantraType}`] = increment(chantCount);
        }

        if (isNewParticipant) {
            updates.totalParticipants = increment(1);
            updates[`states.${state}.participants`] = increment(1);
        }

        // 3. Update main stats doc
        await updateDoc(statsRef, updates).catch(async (err) => {
            // If doc doesn't exist, initialize it
            if (err.code === 'not-found') {
                const initData: any = {
                    totalChants: chantCount,
                    totalParticipants: 1,
                    mantras: { gayathri: 0, saiGayathri: 0, likitha: 0 },
                    states: {
                        [state]: { chants: chantCount, participants: 1 }
                    },
                    lastUpdated: new Date().toISOString()
                };
                if (mantraType) {
                    initData.mantras[mantraType] = chantCount;
                }
                await setDoc(statsRef, initData);
            } else {
                throw err;
            }
        });
    } catch (error) {
        console.error('[NationalStats] Failed to record offering:', error);
        throw error;
    }
};

const ZERO_MANTRAS: MantraBreakdown = { gayathri: 0, saiGayathri: 0, likitha: 0 };

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
            data.mantras = data.mantras || { ...ZERO_MANTRAS };
            onUpdate(data);
        } else {
            onUpdate({
                totalChants: 0,
                totalParticipants: 0,
                goalPercent: 0,
                states: {},
                mantras: { ...ZERO_MANTRAS },
                lastUpdated: null
            });
        }
    }, (error) => {
        console.warn('[NationalStats] Snapshot error:', error);
        onUpdate({
            totalChants: 0,
            totalParticipants: 0,
            goalPercent: 0,
            states: {},
            mantras: { ...ZERO_MANTRAS },
            lastUpdated: null
        });
    });
};

/**
 * Fetches centre leaderboard data by aggregating user documents.
 * Results are cached in sessionStorage with a 5-minute TTL.
 */
export const fetchCentreLeaderboard = async (): Promise<CentreLeaderboardEntry[]> => {
    const CACHE_KEY = 'sms_centre_leaderboard';
    const CACHE_TTL = 5 * 60 * 1000;

    try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
            const { data, ts } = JSON.parse(raw);
            if (Date.now() - ts < CACHE_TTL && Array.isArray(data)) {
                return data;
            }
        }
    } catch { /* cache miss */ }

    try {
        const snap = await getDocs(
            query(collection(db, 'users'), where('publicLeaderboard', '==', true))
        );

        const centreMap: Record<string, { totalChants: number; members: Set<string>; activeMembers: number }> = {};

        snap.docs.forEach(d => {
            const data = d.data();
            const centre = data.centre || '';
            if (!centre) return;

            if (!centreMap[centre]) {
                centreMap[centre] = { totalChants: 0, members: new Set(), activeMembers: 0 };
            }

            const stats = data.stats || {};
            const userChants = (stats.gayathri || 0) + (stats.saiGayathri || 0) + ((stats.likitha || 0) * 11);
            centreMap[centre].totalChants += userChants;
            centreMap[centre].members.add(d.id);
            if (userChants > 0) centreMap[centre].activeMembers++;
        });

        const entries: CentreLeaderboardEntry[] = Object.entries(centreMap).map(([centre, data]) => ({
            centre,
            totalChants: data.totalChants,
            memberCount: data.members.size,
            participationRate: data.members.size > 0
                ? Math.round((data.activeMembers / data.members.size) * 100)
                : 0
        }));

        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: entries, ts: Date.now() }));
        } catch { /* quota — ignore */ }

        return entries;
    } catch (error) {
        console.warn('[NationalStats] Centre leaderboard fetch failed:', error);
        return [];
    }
};

export const MALAYSIA_STATES = [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
    'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Selangor',
    'Terengganu', 'W.P. Kuala Lumpur', 'W.P. Labuan', 'W.P. Putrajaya'
];
