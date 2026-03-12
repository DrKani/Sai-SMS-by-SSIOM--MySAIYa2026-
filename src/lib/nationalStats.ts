import { db } from './firebase';
import {
    doc, onSnapshot, updateDoc, increment, setDoc, getDoc,
    collection, addDoc, query, where, getDocs, orderBy, limit
} from 'firebase/firestore';

// ── Mantra type enum ──────────────────────────────────────────────────────────
export type MantraType = 'GAYATHRI' | 'SAI_GAYATHRI' | 'OM_SAI_RAM';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface StateStat {
    chants: number;
    participants: number;
    totalMantra: number;      // Gayathri + Sai Gayathri
    totalOmSaiRam: number;    // Om Sai Ram only
}

export interface CentreStat {
    memberCount: number;
    totalMantra: number;      // Gayathri + Sai Gayathri
    totalOmSaiRam: number;
    totalChants: number;      // All combined
}

export interface MantraBreakdown {
    gayathri: number;
    saiGayathri: number;
    likitha: number;
}

export interface NationalStats {
    totalChants: number;           // All chant types combined (= Total Namasmarana)
    totalParticipants: number;
    goalPercent: number;
    gayathriTotal: number;
    saiGayathriTotal: number;
    omSaiRamTotal: number;
    states: Record<string, StateStat>;
    centres: Record<string, CentreStat>;
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

// ── Firestore paths ───────────────────────────────────────────────────────────
const STATS_DOC_PATH = 'metadata/national_stats';
const PARTICIPANTS_COLLECTION = 'metadata/national_stats/participants';
const MANTRA_COUNT_COLLECTION = 'mantraCount';           // Raw transaction log
const AGG_NATIONAL_PATH = 'aggregates/national';
const AGG_BY_CENTRE_COLLECTION = 'aggregates_byCentre';  // doc per centre
const AGG_BY_STATE_COLLECTION = 'aggregates_byState';    // doc per state
const AGG_BY_USER_COLLECTION = 'aggregates_byUser';      // doc per user

// ── Participant cache ─────────────────────────────────────────────────────────
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
    } catch { /* quota exceeded */ }
}

// ── Helper: map internal chant type string to MantraType ──────────────────────
export function toMantraType(type: 'gayathri' | 'saiGayathri' | 'likitha'): MantraType {
    switch (type) {
        case 'gayathri': return 'GAYATHRI';
        case 'saiGayathri': return 'SAI_GAYATHRI';
        case 'likitha': return 'OM_SAI_RAM';
    }
}

/**
 * Records a sadhana offering:
 *  1. Writes a raw transaction record to mantraCount collection
 *  2. Updates the legacy metadata/national_stats doc (homepage real-time)
 *  3. Updates aggregate docs (national, centre, state, user)
 */
export const recordSadhanaOffering = async (
    uid: string,
    state: string,
    chantCount: number,
    mantraType: MantraType = 'GAYATHRI',
    centre: string = 'Unknown'
) => {
    try {
        const statsRef = doc(db, STATS_DOC_PATH);
        const now = new Date().toISOString();

        // ── 1. Write raw transaction record ───────────────────────────────
        try {
            await addDoc(collection(db, MANTRA_COUNT_COLLECTION), {
                'User ID': uid,
                'Centre': centre,
                'State': state,
                'Mantra Type': mantraType,
                'Count': chantCount,
                'Date': now,
            });
        } catch (e) {
            console.warn('[NationalStats] Raw record write failed:', e);
        }

        // ── 2. Determine if participant is new ────────────────────────────
        let isNewParticipant = false;
        if (!_knownParticipants.has(uid)) {
            const participantRef = doc(db, PARTICIPANTS_COLLECTION, uid);
            const participantSnap = await getDoc(participantRef);
            if (participantSnap.exists()) {
                cacheParticipant(uid);
            } else {
                isNewParticipant = true;
                await setDoc(participantRef, { addedAt: now, centre, state });
                cacheParticipant(uid);
            }
        }

        // ── 3. Determine mantra category flags ───────────────────────────
        const isMantra = mantraType === 'GAYATHRI' || mantraType === 'SAI_GAYATHRI';
        const isOmSaiRam = mantraType === 'OM_SAI_RAM';

        // Map MantraType back to mantras.* key for backward compat
        const mantrasKey = mantraType === 'GAYATHRI' ? 'gayathri'
            : mantraType === 'SAI_GAYATHRI' ? 'saiGayathri'
            : 'likitha';

        // ── 4. Update main national_stats doc (real-time homepage) ────────
        const statsUpdates: any = {
            totalChants: increment(chantCount),
            [`states.${state}.chants`]: increment(chantCount),
            [`mantras.${mantrasKey}`]: increment(chantCount),
            lastUpdated: now,
        };

        // Track per-type totals
        if (mantraType === 'GAYATHRI') statsUpdates.gayathriTotal = increment(chantCount);
        else if (mantraType === 'SAI_GAYATHRI') statsUpdates.saiGayathriTotal = increment(chantCount);
        else if (mantraType === 'OM_SAI_RAM') statsUpdates.omSaiRamTotal = increment(chantCount);

        // Track per-state mantra/omSaiRam subtotals
        if (isMantra) statsUpdates[`states.${state}.totalMantra`] = increment(chantCount);
        if (isOmSaiRam) statsUpdates[`states.${state}.totalOmSaiRam`] = increment(chantCount);

        // Track per-centre totals
        if (centre && centre !== 'Unknown') {
            statsUpdates[`centres.${centre}.totalChants`] = increment(chantCount);
            if (isMantra) statsUpdates[`centres.${centre}.totalMantra`] = increment(chantCount);
            if (isOmSaiRam) statsUpdates[`centres.${centre}.totalOmSaiRam`] = increment(chantCount);
            if (isNewParticipant) statsUpdates[`centres.${centre}.memberCount`] = increment(1);
        }

        if (isNewParticipant) {
            statsUpdates.totalParticipants = increment(1);
            statsUpdates[`states.${state}.participants`] = increment(1);
        }

        await updateDoc(statsRef, statsUpdates).catch(async (err) => {
            if (err.code === 'not-found') {
                const initData: any = {
                    totalChants: chantCount,
                    totalParticipants: 1,
                    gayathriTotal: mantraType === 'GAYATHRI' ? chantCount : 0,
                    saiGayathriTotal: mantraType === 'SAI_GAYATHRI' ? chantCount : 0,
                    omSaiRamTotal: mantraType === 'OM_SAI_RAM' ? chantCount : 0,
                    mantras: {
                        gayathri: mantrasKey === 'gayathri' ? chantCount : 0,
                        saiGayathri: mantrasKey === 'saiGayathri' ? chantCount : 0,
                        likitha: mantrasKey === 'likitha' ? chantCount : 0,
                    },
                    states: {
                        [state]: {
                            chants: chantCount,
                            participants: 1,
                            totalMantra: isMantra ? chantCount : 0,
                            totalOmSaiRam: isOmSaiRam ? chantCount : 0,
                        }
                    },
                    centres: {},
                    lastUpdated: now,
                };
                if (centre && centre !== 'Unknown') {
                    initData.centres[centre] = {
                        totalChants: chantCount,
                        totalMantra: isMantra ? chantCount : 0,
                        totalOmSaiRam: isOmSaiRam ? chantCount : 0,
                        memberCount: 1,
                    };
                }
                await setDoc(statsRef, initData);
            } else {
                throw err;
            }
        });

        // ── 5. Update aggregate docs (fire-and-forget, non-blocking) ─────
        updateAggregates(uid, state, centre, mantraType, chantCount, isNewParticipant).catch(e =>
            console.warn('[NationalStats] Aggregate update failed:', e)
        );
    } catch (error) {
        console.error('[NationalStats] Failed to record offering:', error);
        throw error;
    }
};

const ZERO_MANTRAS: MantraBreakdown = { gayathri: 0, saiGayathri: 0, likitha: 0 };

/**
 * Updates the structured aggregate documents used by the Admin Hub.
 */
async function updateAggregates(
    uid: string, state: string, centre: string,
    mantraType: MantraType, count: number, isNewParticipant: boolean
) {
    const isMantra = mantraType === 'GAYATHRI' || mantraType === 'SAI_GAYATHRI';
    const isOmSaiRam = mantraType === 'OM_SAI_RAM';
    const now = new Date().toISOString();

    // aggregates/national
    const natRef = doc(db, AGG_NATIONAL_PATH);
    const natUpdates: any = {
        'Total Chants': increment(count),
        'Last Updated': now,
    };
    if (mantraType === 'GAYATHRI') natUpdates['Gayathri Total'] = increment(count);
    if (mantraType === 'SAI_GAYATHRI') natUpdates['Sai Gayathri Total'] = increment(count);
    if (mantraType === 'OM_SAI_RAM') natUpdates['Om Sai Ram Total'] = increment(count);

    await updateDoc(natRef, natUpdates).catch(async (err) => {
        if (err.code === 'not-found') {
            await setDoc(natRef, {
                'Total Chants': count,
                'Gayathri Total': mantraType === 'GAYATHRI' ? count : 0,
                'Sai Gayathri Total': mantraType === 'SAI_GAYATHRI' ? count : 0,
                'Om Sai Ram Total': mantraType === 'OM_SAI_RAM' ? count : 0,
                'Last Updated': now,
            });
        }
    });

    // aggregates/byCentre/{centre}
    if (centre && centre !== 'Unknown') {
        const centreRef = doc(db, AGG_BY_CENTRE_COLLECTION, centre);
        const centreUpdates: any = {
            'Sai Centre': centre,
            'Total Chants': increment(count),
            'Last Updated': now,
        };
        if (isMantra) centreUpdates['Total Chants (Mantra)'] = increment(count);
        if (isOmSaiRam) centreUpdates['Total Om Sai Ram'] = increment(count);
        if (isNewParticipant) centreUpdates['Member Count'] = increment(1);

        await updateDoc(centreRef, centreUpdates).catch(async (err) => {
            if (err.code === 'not-found') {
                await setDoc(centreRef, {
                    'Sai Centre': centre,
                    'Member Count': isNewParticipant ? 1 : 0,
                    'Total Chants (Mantra)': isMantra ? count : 0,
                    'Total Om Sai Ram': isOmSaiRam ? count : 0,
                    'Total Chants': count,
                    'Last Updated': now,
                });
            }
        });
    }

    // aggregates/byState/{state}
    const stateRef = doc(db, AGG_BY_STATE_COLLECTION, state);
    const stateUpdates: any = {
        'State / Region': state,
        'Total Namasmarana': increment(count),
        'Last Updated': now,
    };
    if (isMantra) stateUpdates['Total Mantra'] = increment(count);
    if (isOmSaiRam) stateUpdates['Om Sai Ram Count'] = increment(count);

    await updateDoc(stateRef, stateUpdates).catch(async (err) => {
        if (err.code === 'not-found') {
            await setDoc(stateRef, {
                'State / Region': state,
                'Total Mantra': isMantra ? count : 0,
                'Om Sai Ram Count': isOmSaiRam ? count : 0,
                'Total Namasmarana': count,
                'Last Updated': now,
            });
        }
    });

    // aggregates/byUser/{uid}
    const userRef = doc(db, AGG_BY_USER_COLLECTION, uid);
    const userUpdates: any = {
        'User ID': uid,
        'Total Chants': increment(count),
        'Last Updated': now,
    };
    if (isMantra) userUpdates['Total Chants (Mantra)'] = increment(count);
    if (isOmSaiRam) userUpdates['Total Om Sai Ram'] = increment(count);

    await updateDoc(userRef, userUpdates).catch(async (err) => {
        if (err.code === 'not-found') {
            await setDoc(userRef, {
                'User ID': uid,
                'Total Chants (Mantra)': isMantra ? count : 0,
                'Total Om Sai Ram': isOmSaiRam ? count : 0,
                'Total Chants': count,
                'Week of completed book reading': 0, // placeholder
                'Last Updated': now,
            });
        }
    });
}

/**
 * Real-time subscription to national stats (used by homepage tile).
 */
export const subscribeToNationalStats = (onUpdate: (stats: NationalStats) => void) => {
    const statsRef = doc(db, STATS_DOC_PATH);
    return onSnapshot(statsRef, (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            const stats: NationalStats = {
                totalChants: data.totalChants || 0,
                totalParticipants: data.totalParticipants || 0,
                goalPercent: Math.min(100, Math.floor(((data.totalChants || 0) / 1000000) * 100)),
                gayathriTotal: data.gayathriTotal || 0,
                saiGayathriTotal: data.saiGayathriTotal || 0,
                omSaiRamTotal: data.omSaiRamTotal || 0,
                states: data.states || {},
                centres: data.centres || {},
                mantras: data.mantras || { ...ZERO_MANTRAS },
                lastUpdated: data.lastUpdated || null,
            };
            onUpdate(stats);
        } else {
            onUpdate({
                totalChants: 0,
                totalParticipants: 0,
                goalPercent: 0,
                gayathriTotal: 0,
                saiGayathriTotal: 0,
                omSaiRamTotal: 0,
                states: {},
                centres: {},
                mantras: { ...ZERO_MANTRAS },
                lastUpdated: null,
            });
        }
    }, (error) => {
        console.warn('[NationalStats] Snapshot error:', error);
        onUpdate({
            totalChants: 0,
            totalParticipants: 0,
            goalPercent: 0,
            gayathriTotal: 0,
            saiGayathriTotal: 0,
            omSaiRamTotal: 0,
            states: {},
            centres: {},
            mantras: { ...ZERO_MANTRAS },
            lastUpdated: null,
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
