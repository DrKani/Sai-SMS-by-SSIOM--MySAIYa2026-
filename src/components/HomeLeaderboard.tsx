import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type LeaderboardTab = 'centres' | 'states' | 'devotees';

interface CentreEntry {
    rank: number;
    name: string;
    state: string;
    count: number;
}

interface StateEntry {
    rank: number;
    name: string;
    count: number;
}

interface DevoteeEntry {
    rank: number;
    uid: string;
    name: string;
    centre: string;
    state: string;
    count: number;
    photoURL?: string;
    gender?: 'male' | 'female';
}

interface RollupData {
    byCentre: Record<string, { count: number; state?: string }>;
    byState: Record<string, number>;
    byMember: Array<{ uid: string; name: string; centre: string; state: string; count: number; photoURL?: string; gender?: 'male' | 'female' }>;
    lastUpdated?: string;
    timestamp?: string;
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
    const badgeStyle =
        rank === 1
            ? 'bg-[#D2AC47] text-white shadow-[0_0_14px_rgba(210,172,71,0.6)]'
            : rank === 2
                ? 'bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] text-white'
                : rank === 3
                    ? 'bg-gradient-to-br from-[#CD7F32] to-[#A0522D] text-white'
                    : 'bg-[#001224] text-white/70';
    return (
        <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black shrink-0 ${badgeStyle} ${rank === 1 ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}`}
        >
            {rank}
        </span>
    );
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar: React.FC<{ ratio: number }> = ({ ratio }) => (
    <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden hidden sm:block">
        <div
            className="h-full rounded-full transition-all duration-700"
            style={{
                width: `${Math.max(4, ratio * 100)}%`,
                background: `linear-gradient(90deg, #D2AC47 0%, #F5C842 60%, #E6A817 100%)`,
                opacity: ratio === 1 ? 1 : 0.65 + ratio * 0.35,
            }}
        />
    </div>
);

// ─── Row styling helpers ──────────────────────────────────────────────────────

const rowBg = (rank: number) =>
    rank === 1
        ? 'bg-[rgba(210,172,71,0.12)] border-l-4 border-[#D2AC47]'
        : rank === 2
            ? 'bg-[rgba(192,192,192,0.10)] border-l-3 border-[#C0C0C0]'
            : rank === 3
                ? 'bg-[rgba(205,127,50,0.10)] border-l-3 border-[#CD7F32]'
                : '';

const nameClass = (rank: number) =>
    rank === 1
        ? 'font-serif italic text-[#D2AC47] text-base'
        : rank === 2
            ? 'font-semibold text-[#C8C8C8] text-sm'
            : rank === 3
                ? 'font-semibold text-[#CD7F32] text-sm'
                : 'font-medium text-white/80 text-sm';

// ─── Podium Card (desktop) ────────────────────────────────────────────────────

const PodiumCard: React.FC<{
    rank: number;
    name: string;
    sub: string;
    count: number;
    isYou?: boolean;
}> = ({ rank, name, sub, count, isYou }) => {
    const heights = { 1: 'h-36', 2: 'h-24', 3: 'h-20' } as Record<number, string>;
    const colors: Record<number, string> = {
        1: 'border-[#D2AC47] bg-[rgba(210,172,71,0.12)]',
        2: 'border-[#C0C0C0] bg-[rgba(192,192,192,0.08)]',
        3: 'border-[#CD7F32] bg-[rgba(205,127,50,0.08)]',
    };
    const medal: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

    return (
        <div
            className={`flex flex-col items-center justify-end rounded-2xl border ${colors[rank]} p-4 pb-5 transition-all duration-300 hover:scale-[1.02]`}
            style={{ minWidth: 0 }}
        >
            <span className="text-3xl mb-2">{medal[rank]}</span>
            <p className={`text-center truncate w-full ${nameClass(rank)} mb-0.5`}>{name}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest truncate w-full text-center">{sub}</p>
            <p className="text-lg font-black text-white mt-2">{count.toLocaleString()}</p>
            {isYou && (
                <span className="mt-1 text-[9px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    You
                </span>
            )}
            {/* Podium base */}
            <div className={`w-full mt-3 rounded-lg ${heights[rank]} bg-white/5 border border-white/10`} />
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface HomeLeaderboardProps {
    globalTotalChants?: number;
    globalTotalParticipants?: number;
}

const HomeLeaderboard: React.FC<HomeLeaderboardProps> = ({ globalTotalChants = 0, globalTotalParticipants = 0 }) => {
    const [activeTab, setActiveTab] = useState<LeaderboardTab>('centres');
    const [centres, setCentres] = useState<CentreEntry[]>([]);
    const [states, setStates] = useState<StateEntry[]>([]);
    const [devotees, setDevotees] = useState<DevoteeEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [userDevoteeRank, setUserDevoteeRank] = useState<{ rank: number; count: number } | null>(null);

    // Read user from localStorage — no auth gate
    useEffect(() => {
        const saved = localStorage.getItem('sms_user');
        if (saved) {
            try { setUser(JSON.parse(saved)); } catch { /* silent */ }
        }
    }, []);

    const fetchLeaderboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Try today's rollup document
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const rollupRef = doc(db, 'rollups', today);
            const rollupSnap = await getDoc(rollupRef);

            if (rollupSnap.exists()) {
                const data = rollupSnap.data() as RollupData;
                applyRollupData(data);
                const ts = data.lastUpdated || data.timestamp || null;
                setLastUpdated(ts);
            } else {
                // Fallback: aggregate from live users collection
                await aggregateFromUsers();
                setLastUpdated(new Date().toISOString());
            }
        } catch (err) {
            console.warn('[HomeLeaderboard] Rollup fetch failed, falling back to live aggregation:', err);
            try {
                await aggregateFromUsers();
                setLastUpdated(new Date().toISOString());
            } catch (fallbackErr) {
                console.warn('[HomeLeaderboard] Fallback aggregation also failed:', fallbackErr);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const applyRollupData = (data: RollupData) => {
        // Process centres
        if (data.byCentre) {
            const centreList: CentreEntry[] = Object.entries(data.byCentre)
                .map(([name, val]) => ({
                    name,
                    state: (val as any).state || '',
                    count: typeof val === 'number' ? val : (val as any).count || 0,
                    rank: 0,
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((e, i) => ({ ...e, rank: i + 1 }));
            setCentres(centreList);
        }

        // Process states
        if (data.byState) {
            const stateList: StateEntry[] = Object.entries(data.byState)
                .map(([name, count]) => ({
                    name,
                    count: typeof count === 'number' ? count : 0,
                    rank: 0,
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((e, i) => ({ ...e, rank: i + 1 }));
            setStates(stateList);
        }

        // Process devotees
        if (data.byMember) {
            const devoteeList: DevoteeEntry[] = data.byMember
                .slice(0, 10)
                .map((m, i) => ({ ...m, rank: i + 1 }));
            setDevotees(devoteeList);
        }
    };

    const aggregateFromUsers = async () => {
        const snap = await getDocs(
            query(collection(db, 'users'), where('publicLeaderboard', '==', true), limit(200))
        );

        const centreTotals: Record<string, { count: number; state: string }> = {};
        const stateTotals: Record<string, number> = {};
        const memberList: DevoteeEntry[] = [];

        snap.docs.forEach(d => {
            const data = d.data() as UserProfile;
            const stats = (data as any).stats || {};
            const total = (stats.gayathri || 0) + (stats.saiGayathri || 0) + (stats.mantras || 0) + ((stats.likitha || 0) * 11);

            const centreKey = `${data.centre || 'SSIOM'}, ${data.state || 'Malaysia'}`;
            if (!centreTotals[centreKey]) centreTotals[centreKey] = { count: 0, state: data.state || '' };
            centreTotals[centreKey].count += total;

            const stateKey = data.state || 'Unknown';
            stateTotals[stateKey] = (stateTotals[stateKey] || 0) + total;

            memberList.push({
                uid: d.id,
                name: data.name || 'Devotee',
                centre: data.centre || 'SSIOM',
                state: data.state || '',
                count: total,
                photoURL: data.photoURL,
                gender: data.gender || 'male',
                rank: 0,
            });
        });

        const sorted = memberList.sort((a, b) => b.count - a.count);

        setCentres(
            Object.entries(centreTotals)
                .map(([name, val]) => ({ name: name.split(', ')[0], state: val.state, count: val.count, rank: 0 }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((e, i) => ({ ...e, rank: i + 1 }))
        );

        setStates(
            Object.entries(stateTotals)
                .map(([name, count]) => ({ name, count, rank: 0 }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((e, i) => ({ ...e, rank: i + 1 }))
        );

        setDevotees(sorted.slice(0, 10).map((e, i) => ({ ...e, rank: i + 1 })));
    };

    useEffect(() => { fetchLeaderboardData(); }, [fetchLeaderboardData]);

    // Compute user's personal rank if they're a member but not in top 5
    useEffect(() => {
        if (!user || user.isGuest) { setUserDevoteeRank(null); return; }
        const found = devotees.find(d => d.uid === user.uid);
        if (!found) {
            // Try to compute from localStorage stats
            const stats = (user as any).stats || {};
            const total = (stats.gayathri || 0) + (stats.saiGayathri || 0) + (stats.mantras || 0) + ((stats.likitha || 0) * 11);
            if (total > 0) setUserDevoteeRank({ rank: 0, count: total }); // rank 0 = not in top list
            else setUserDevoteeRank(null);
        } else {
            setUserDevoteeRank(null); // they appear in the list already
        }
    }, [devotees, user]);

    // Format the lastUpdated timestamp
    const formattedTimestamp = (() => {
        if (!lastUpdated) return 'Updated daily';
        try {
            const d = new Date(lastUpdated);
            return `Last updated: ${d.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}, ${d.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
        } catch { return 'Updated daily'; }
    })();

    // ─── Tab views ──────────────────────────────────────────────────────────────

    const tabs: { id: LeaderboardTab; label: string; emoji: string }[] = [
        { id: 'centres', label: 'Top Centres', emoji: '🏛️' },
        { id: 'states', label: 'Top States', emoji: '🗺️' },
        { id: 'devotees', label: 'Top Devotees', emoji: '👤' },
    ];

    // Get top 5 for each view
    const topCentres = centres.slice(0, 5);
    const topStates = states.slice(0, 5);
    const topDevotees = devotees.slice(0, 5);
    const maxCentre = topCentres[0]?.count || 1;
    const maxState = topStates[0]?.count || 1;
    const maxDevotee = topDevotees[0]?.count || 1;

    // Check if current user is in devotees top 5
    const userInTopDevotees = user && !user.isGuest && topDevotees.some(d => d.uid === user.uid);

    return (
        <section
            id="collective-offering"
            aria-label="Our Collective Offering Leaderboard"
            className="relative overflow-hidden mt-12 mb-12"
            style={{
                background: '#001224',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            }}
        >
            {/* Gold top-edge strip */}
            <div
                className="absolute top-0 left-0 right-0 h-[5px] rounded-t-[1.5rem]"
                style={{ background: 'linear-gradient(90deg, #D2AC47 0%, #F5C842 50%, #D2AC47 100%)' }}
            />

            <div className="px-6 md:px-10 pt-8 pb-10 space-y-0">
                {/* ── Section Header ── */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 mb-2">
                    <div>
                        <p
                            className="text-[10px] font-black uppercase tracking-[0.3em] mb-2"
                            style={{ color: '#D2AC47', fontFamily: "'Poppins', sans-serif" }}
                        >
                            Tracking Our Collective Sadhana Progress
                        </p>
                        <h2
                            className="text-3xl md:text-4xl font-bold text-white mb-1 leading-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Our Collective Offering
                        </h2>
                        <p
                            className="text-sm"
                            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Open Sans', sans-serif" }}
                        >
                            Updated daily. Every chant counts.{' '}
                            <span style={{ color: '#D2AC47' }}>Sai Ram.</span>
                        </p>
                    </div>
                    <p
                        className="text-[10px] text-right shrink-0"
                        style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Open Sans', sans-serif" }}
                    >
                        {formattedTimestamp}
                    </p>
                </div>

                {/* ── National Hero Number ── */}
                {globalTotalChants > 0 && (
                    <div className="text-center py-6 border-b border-white/10 mb-4">
                        <p
                            className="text-5xl md:text-6xl font-black tracking-tight"
                            style={{
                                color: '#D2AC47', fontFamily: "'Poppins', sans-serif",
                                textShadow: '0 0 40px rgba(210,172,71,0.35)'
                            }}
                        >
                            {globalTotalChants.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 mt-1">
                            🕉 Mantras offered nationwide 🇲🇾
                        </p>
                        {globalTotalParticipants > 0 && (
                            <p className="text-[10px] text-white/40 mt-1">
                                {globalTotalParticipants.toLocaleString()} devotees are part of this offering
                            </p>
                        )}
                    </div>
                )}

                {/* ── Spiritual Framing (desktop only) ── */}
                <p
                    className="hidden md:block text-center italic text-sm text-white/40 px-8 py-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', lineHeight: 1.7 }}
                >
                    "We do not chant to compete. We chant to offer. And yet, when we see devotion in numbers, we are inspired to give more."
                </p>

                {/* ── Tab Bar ── */}
                <div className="flex overflow-x-auto no-scrollbar gap-1 py-1 border-b border-white/10 mb-6 w-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 relative whitespace-nowrap"
                            style={{
                                color: activeTab === tab.id ? '#F5C842' : 'rgba(255,255,255,0.45)',
                                fontFamily: "'Poppins', sans-serif",
                                background: 'transparent',
                                border: 'none',
                            }}
                        >
                            <span>{tab.emoji}</span>
                            <span>{tab.label}</span>
                            {/* Active underline */}
                            {activeTab === tab.id && (
                                <span
                                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #D2AC47, #F5C842)' }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Content Area ── */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="w-10 h-10 border-2 border-[#D2AC47] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Loading leaderboard…</p>
                    </div>
                ) : (
                    <>
                        {/* ── TOP CENTRES ── */}
                        {activeTab === 'centres' && (
                            <div className="space-y-3">
                                {/* Podium (desktop) — top 3 */}
                                {topCentres.length >= 3 && (
                                    <div className="hidden md:grid grid-cols-3 gap-4 mb-8 items-end">
                                        <PodiumCard rank={2} name={topCentres[1].name} sub={topCentres[1].state} count={topCentres[1].count} />
                                        <PodiumCard rank={1} name={topCentres[0].name} sub={topCentres[0].state} count={topCentres[0].count} />
                                        <PodiumCard rank={3} name={topCentres[2].name} sub={topCentres[2].state} count={topCentres[2].count} />
                                    </div>
                                )}
                                {/* Ranked list */}
                                <div className="space-y-2">
                                    {topCentres.map(entry => (
                                        <div
                                            key={entry.rank}
                                            className={`rounded-xl px-4 py-3 ${rowBg(entry.rank)} transition-all hover:brightness-110`}
                                            style={{ borderLeftColor: entry.rank === 1 ? '#D2AC47' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : 'transparent' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <RankBadge rank={entry.rank} />
                                                <div className="flex-grow min-w-0">
                                                    <p className={`${nameClass(entry.rank)} truncate leading-tight`}
                                                        style={{ fontFamily: entry.rank === 1 ? "'Playfair Display', serif" : "'Poppins', sans-serif" }}>
                                                        {entry.name}
                                                    </p>
                                                    <p className="text-[10px] text-white/40 uppercase tracking-widest truncate"
                                                        style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                        {entry.state}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                        {entry.count.toLocaleString()}
                                                    </p>
                                                    <p className="text-[9px] text-white/30 uppercase tracking-widest">mantras</p>
                                                </div>
                                            </div>
                                            <ProgressBar ratio={entry.count / maxCentre} />
                                        </div>
                                    ))}
                                    {topCentres.length === 0 && (
                                        <p className="text-center text-white/30 text-sm py-8 italic">No centre data yet — be the first!</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── TOP STATES ── */}
                        {activeTab === 'states' && (
                            <div className="space-y-2">
                                {topStates.length >= 3 && (
                                    <div className="hidden md:grid grid-cols-3 gap-4 mb-8 items-end">
                                        <PodiumCard rank={2} name={topStates[1].name} sub="State" count={topStates[1].count} />
                                        <PodiumCard rank={1} name={topStates[0].name} sub="State" count={topStates[0].count} />
                                        <PodiumCard rank={3} name={topStates[2].name} sub="State" count={topStates[2].count} />
                                    </div>
                                )}
                                {topStates.map(entry => (
                                    <div
                                        key={entry.rank}
                                        className={`rounded-xl px-4 py-3 ${rowBg(entry.rank)} transition-all hover:brightness-110`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RankBadge rank={entry.rank} />
                                            <div className="flex-grow min-w-0">
                                                <p className={`${nameClass(entry.rank)} truncate`}
                                                    style={{ fontFamily: entry.rank === 1 ? "'Playfair Display', serif" : "'Poppins', sans-serif" }}>
                                                    {entry.name}
                                                </p>
                                                <p className="text-[9px] text-white/30 uppercase tracking-widest"
                                                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                    Malaysian State
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                    {entry.count.toLocaleString()}
                                                </p>
                                                <p className="text-[9px] text-white/30 uppercase tracking-widest">mantras</p>
                                            </div>
                                        </div>
                                        <ProgressBar ratio={entry.count / maxState} />
                                    </div>
                                ))}
                                {topStates.length === 0 && (
                                    <p className="text-center text-white/30 text-sm py-8 italic">No state data yet.</p>
                                )}
                            </div>
                        )}

                        {/* ── TOP DEVOTEES ── */}
                        {activeTab === 'devotees' && (
                            <div className="space-y-3">
                                {/* Podium (desktop) */}
                                {topDevotees.length >= 3 && (
                                    <div className="hidden md:grid grid-cols-3 gap-4 mb-8 items-end">
                                        <PodiumCard
                                            rank={2}
                                            name={topDevotees[1].name}
                                            sub={topDevotees[1].centre}
                                            count={topDevotees[1].count}
                                            isYou={!!(user && topDevotees[1].uid === user.uid)}
                                        />
                                        <PodiumCard
                                            rank={1}
                                            name={topDevotees[0].name}
                                            sub={topDevotees[0].centre}
                                            count={topDevotees[0].count}
                                            isYou={!!(user && topDevotees[0].uid === user.uid)}
                                        />
                                        <PodiumCard
                                            rank={3}
                                            name={topDevotees[2].name}
                                            sub={topDevotees[2].centre}
                                            count={topDevotees[2].count}
                                            isYou={!!(user && topDevotees[2].uid === user.uid)}
                                        />
                                    </div>
                                )}

                                {/* Ranked list */}
                                <div className="space-y-2">
                                    {topDevotees.map(entry => {
                                        const isCurrentUser = !!(user && !user.isGuest && entry.uid === user.uid);
                                        return (
                                            <div
                                                key={entry.uid}
                                                className={`rounded-xl px-4 py-3 transition-all hover:brightness-110 ${isCurrentUser
                                                        ? 'ring-1 ring-blue-400/40 shadow-[0_0_16px_rgba(59,130,246,0.15)]'
                                                        : ''
                                                    } ${rowBg(entry.rank)}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <RankBadge rank={entry.rank} />
                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p
                                                                className={`${nameClass(entry.rank)} truncate`}
                                                                style={{ fontFamily: entry.rank === 1 ? "'Playfair Display', serif" : "'Poppins', sans-serif" }}
                                                            >
                                                                {entry.name}
                                                            </p>
                                                            {isCurrentUser && (
                                                                <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-widest truncate"
                                                            style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                            {entry.centre}{entry.state ? ` · ${entry.state}` : ''}
                                                        </p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-sm font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                            {entry.count.toLocaleString()}
                                                        </p>
                                                        <p className="text-[9px] text-white/30 uppercase tracking-widest">mantras</p>
                                                    </div>
                                                </div>
                                                <ProgressBar ratio={entry.count / maxDevotee} />
                                            </div>
                                        );
                                    })}
                                    {topDevotees.length === 0 && (
                                        <p className="text-center text-white/30 text-sm py-8 italic">
                                            {globalTotalParticipants > 0
                                                ? `${globalTotalParticipants} devotees are chanting. Enable public profile to appear here.`
                                                : 'No public devotee data yet — be the first!'}
                                        </p>
                                    )}
                                </div>

                                {/* Divider before personal section */}
                                {activeTab === 'devotees' && (
                                    <div className="mt-6 pt-4 border-t border-white/10">
                                        {/* Signed-in member not in top 5 */}
                                        {user && !user.isGuest && !userInTopDevotees && userDevoteeRank && (
                                            <div className="rounded-xl px-4 py-3 bg-blue-500/10 border border-blue-400/20">
                                                <p className="text-[10px] text-blue-300/70 uppercase tracking-widest mb-1"
                                                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                    Your Standing
                                                </p>
                                                <p className="text-sm text-white/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                    Your count: <span className="font-black text-white">{userDevoteeRank.count.toLocaleString()}</span>{' '}
                                                    Namasmarana — Keep going, Sai Ram 🙏
                                                </p>
                                            </div>
                                        )}

                                        {/* Guest CTA */}
                                        {(!user || user.isGuest) && (
                                            <div className="rounded-2xl px-6 py-5 text-center"
                                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <p className="text-sm text-white/60 mb-3" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                                                    Sign in to track your rank and see where you stand in the national sangha.
                                                </p>
                                                <Link
                                                    to="/signin"
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #D2AC47 0%, #F5C842 100%)',
                                                        color: '#001224',
                                                        fontFamily: "'Poppins', sans-serif",
                                                    }}
                                                >
                                                    Sign In — Sai Ram 🙏
                                                </Link>
                                            </div>
                                        )}

                                        {/* Signed-in member no count yet */}
                                        {user && !user.isGuest && !userInTopDevotees && !userDevoteeRank && (
                                            <div className="text-center">
                                                <p className="text-sm text-white/40 italic" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                                                    Start your Namasmarana to appear on the leaderboard.
                                                </p>
                                                <Link
                                                    to="/namasmarana"
                                                    className="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #D2AC47 0%, #F5C842 100%)',
                                                        color: '#001224',
                                                        fontFamily: "'Poppins', sans-serif",
                                                    }}
                                                >
                                                    + Add Your Count Today
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ── Footer ── */}
                <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/10">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Showing Top 5 — Full leaderboard →
                    </p>
                    <Link
                        to="/leaderboard"
                        className="text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-80 flex items-center gap-1"
                        style={{ color: '#D2AC47', fontFamily: "'Poppins', sans-serif" }}
                    >
                        View Full Leaderboard →
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeLeaderboard;
