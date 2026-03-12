import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Mic, Target, Trophy, ChevronDown, User, ArrowRight, Medal, Crown } from 'lucide-react';
import { NationalStats, MantraBreakdown } from '../lib/nationalStats';
import { UserProfile } from '../types';
import { doc, getDoc, collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ─── Animated Number ────────────────────────────────────────────────────────
const AnimatedNumber: React.FC<{ value: number; className?: string; style?: React.CSSProperties }> = ({ value, className, style }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (value === 0) { setDisplay(0); return; }
        const duration = 1200;
        const steps = 40;
        const stepTime = duration / steps;
        let current = 0;
        const inc = value / steps;
        const timer = setInterval(() => {
            current += inc;
            if (current >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(Math.floor(current));
            }
        }, stepTime);
        return () => clearInterval(timer);
    }, [value]);

    return <span className={className} style={style}>{display.toLocaleString()}</span>;
};

// ─── Types & Configuration ──────────────────────────────────────────────────
type LeaderboardTab = 'centres' | 'states' | 'devotees';

interface LeaderboardEntry {
    rank: number;
    id: string; // generic id for uid/centre/state
    name: string;
    sub: string;
    count: number;
}

const MANTRA_LABELS: Record<keyof MantraBreakdown, { label: string; color: string }> = {
    gayathri: { label: 'Gayathri', color: 'bg-amber-500' },
    saiGayathri: { label: 'Sai Gayathri', color: 'bg-rose-500' },
    likitha: { label: 'Om Sai Ram', color: 'bg-teal-500' },
};

const MEDAL_COLORS = ['text-yellow-500', 'text-gray-400', 'text-amber-700'] as const;

// ─── Rank Badge ─────────────────────────────────────────────────────────────
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
    const badgeStyle =
        rank === 1
            ? 'bg-[#D2AC47] text-white shadow-[0_0_10px_rgba(210,172,71,0.5)]'
            : rank === 2
                ? 'bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] text-white'
                : rank === 3
                    ? 'bg-gradient-to-br from-[#CD7F32] to-[#A0522D] text-white'
                    : 'bg-navy-800 text-white/70';
    return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black shrink-0 ${badgeStyle}`}>
            {rank}
        </span>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────

interface UnifiedOfferingTileProps {
    globalStats: NationalStats | null;
    user: UserProfile | null;
}

const UnifiedOfferingTile: React.FC<UnifiedOfferingTileProps> = ({ globalStats, user }) => {
    const navigate = useNavigate();

    // Leaderboard State
    const [activeTab, setActiveTab] = useState<LeaderboardTab>('centres');
    const [centres, setCentres] = useState<LeaderboardEntry[]>([]);
    const [states, setStates] = useState<LeaderboardEntry[]>([]);
    const [devotees, setDevotees] = useState<LeaderboardEntry[]>([]);
    const [isLoadingLb, setIsLoadingLb] = useState(true);
    // Registered user count — separate from chanting participants
    const [registeredCount, setRegisteredCount] = useState<number | null>(null);

    // Fetch real registered user count once on mount
    useEffect(() => {
        getCountFromServer(collection(db, 'users'))
            .then(snap => setRegisteredCount(snap.data().count))
            .catch(() => setRegisteredCount(null));
    }, []);

    // Fetch Leaderboard Logic (adapted from HomeLeaderboard.tsx)
    const fetchLeaderboardData = useCallback(async () => {
        setIsLoadingLb(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const rollupRef = doc(db, 'rollups', today);
            const rollupSnap = await getDoc(rollupRef);

            if (rollupSnap.exists()) {
                const data = rollupSnap.data() as any;
                if (data.byCentre) {
                    setCentres(Object.entries(data.byCentre)
                        .map(([name, val]: [string, any]) => ({
                            id: name, name, sub: val.state || '', count: typeof val === 'number' ? val : val.count || 0, rank: 0
                        }))
                        .sort((a, b) => b.count - a.count).slice(0, 5).map((e, i) => ({ ...e, rank: i + 1 })));
                }
                if (data.byState) {
                    setStates(Object.entries(data.byState)
                        .map(([name, count]) => ({ id: name, name, sub: 'Malaysian State', count: count as number, rank: 0 }))
                        .sort((a, b) => b.count - a.count).slice(0, 5).map((e, i) => ({ ...e, rank: i + 1 })));
                }
                if (data.byMember) {
                    setDevotees(data.byMember.slice(0, 5).map((m: any, i: number) => ({
                        id: m.uid, name: m.name, sub: `${m.centre || ''}${m.state ? ` · ${m.state}` : ''}`, count: m.count, rank: i + 1
                    })));
                }
            } else {
                // Fallback: live aggregation from ALL users — no publicLeaderboard filter
                // so every devotee who submits chants appears immediately
                const snap = await getDocs(collection(db, 'users'));
                const cTotals: Record<string, { count: number; state: string }> = {};
                const sTotals: Record<string, number> = {};
                const mList: any[] = [];

                snap.docs.forEach(d => {
                    const data = d.data() as UserProfile;
                    const stats = (data as any).stats || {};
                    const total = (stats.gayathri || 0) + (stats.saiGayathri || 0) + (stats.mantras || 0) + ((stats.likitha || 0) * 11);

                    if (total === 0) return;

                    const cKey = `${data.centre || 'SSIOM'}, ${data.state || 'Malaysia'}`;
                    if (!cTotals[cKey]) cTotals[cKey] = { count: 0, state: data.state || '' };
                    cTotals[cKey].count += total;

                    const sKey = data.state || 'Unknown';
                    sTotals[sKey] = (sTotals[sKey] || 0) + total;

                    mList.push({ id: d.id, name: data.name || 'Devotee', sub: `${data.centre || ''} · ${data.state || ''}`, count: total });
                });

                setCentres(Object.entries(cTotals).map(([name, val]) => ({ id: name, name: name.split(', ')[0], sub: val.state, count: val.count, rank: 0 }))
                    .sort((a, b) => b.count - a.count).slice(0, 5).map((e, i) => ({ ...e, rank: i + 1 })));

                setStates(Object.entries(sTotals).map(([name, count]) => ({ id: name, name, sub: 'State', count, rank: 0 }))
                    .sort((a, b) => b.count - a.count).slice(0, 5).map((e, i) => ({ ...e, rank: i + 1 })));

                setDevotees(mList.sort((a, b) => b.count - a.count).slice(0, 5).map((e, i) => ({ ...e, rank: i + 1 })));
            }
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
        } finally {
            setIsLoadingLb(false);
        }
    }, []);

    useEffect(() => { fetchLeaderboardData(); }, [fetchLeaderboardData]);

    const hasStats = globalStats && globalStats.totalChants > 0;
    const mantras = globalStats?.mantras || { gayathri: 0, saiGayathri: 0, likitha: 0 };

    const activeList = activeTab === 'centres' ? centres : activeTab === 'states' ? states : devotees;

    return (
        <section className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-navy-50 relative overflow-hidden">
            {/* Decorative Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-gold-500 to-orange-500 w-full"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-1">Our Collective Prayer</h2>
                    <p className="text-navy-500 text-sm font-medium">Offered with Love and Reverence to Bhagawan Sri Sathya Sai Baba</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-full border border-green-100 flex items-center gap-2 shadow-inner">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800">Live Connect</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* LEFT COMPONENT: National Grand Total */}
                <div className="bg-gradient-to-br from-gold-50 via-white to-orange-50 rounded-[2rem] p-8 border-2 border-gold-100 relative overflow-hidden flex flex-col justify-center shadow-lg">
                    <div className="relative z-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-800 mb-3 block">
                            Grand Total Chants
                        </p>
                        <div className="mb-6">
                            <AnimatedNumber
                                value={hasStats ? globalStats.totalChants : 0}
                                className="text-5xl lg:text-7xl font-serif font-black text-navy-900 tracking-tight"
                            />
                        </div>

                        {/* Sub Metrics Row */}
                        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
                            {(Object.keys(MANTRA_LABELS) as (keyof MantraBreakdown)[]).map(key => (
                                <div key={key} className="bg-white rounded-xl p-3 border border-neutral-100 shadow-sm">
                                    <div className={`w-2 h-2 ${MANTRA_LABELS[key].color} rounded-full mx-auto mb-2`} />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-navy-400 mb-1">
                                        {MANTRA_LABELS[key].label}
                                    </p>
                                    <p className="text-lg font-black text-navy-900">
                                        {(mantras[key] || 0).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Stats Row & CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-navy-100">
                            <div className="flex gap-6">
                                <div className="text-left">
                                    <div className="flex items-center gap-1.5 mb-1 text-amber-800">
                                        <Users size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Devotees</span>
                                    </div>
                                    <p className="text-xl font-bold text-navy-900">
                                        {registeredCount !== null ? registeredCount.toLocaleString() : (globalStats?.totalParticipants ?? 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-left hidden sm:block">
                                    <div className="flex items-center gap-1.5 mb-1 text-amber-800">
                                        <Target size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Goal</span>
                                    </div>
                                    <p className="text-xl font-bold text-navy-900">{globalStats?.goalPercent}%</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/namasmarana')}
                                className="w-full sm:w-auto px-6 py-3 bg-navy-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-navy-800 hover:-translate-y-0.5 shadow-lg shadow-navy-900/20 transition-all"
                            >
                                <Mic size={14} /> Offer Chants <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COMPONENT: Who Contributed (Compact Leaderboard) */}
                <div className="bg-white rounded-[2rem] p-6 border-2 border-navy-100 flex flex-col shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-serif font-bold text-navy-900 flex items-center gap-2">
                            <Trophy size={18} className="text-gold-500" />
                            Contribution Summary
                        </h3>
                        <Link to="/leaderboard" className="text-[9px] font-black uppercase tracking-widest text-navy-600 hover:text-navy-900 transition-colors">
                            Full List →
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                        {(['centres', 'states', 'devotees'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${activeTab === tab
                                    ? 'bg-gold-50 border-gold-500 text-gold-700 shadow-sm'
                                    : 'bg-white border-neutral-100 text-navy-700 hover:bg-navy-50 hover:border-navy-200 hover:text-navy-900'
                                    }`}
                            >
                                Top {tab}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="flex-grow space-y-2 relative min-h-[200px]">
                        {isLoadingLb ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-navy-200 border-t-gold-500 rounded-full animate-spin"></div>
                            </div>
                        ) : activeList.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-navy-300">
                                <p className="text-xs font-bold font-serif italic text-center">No data available yet.<br />Start chanting to appear here!</p>
                            </div>
                        ) : (
                            activeList.map((entry) => {
                                const isCurrentUser = !!(user && !user.isGuest && activeTab === 'devotees' && entry.id === user.uid);
                                return (
                                    <div
                                        key={entry.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl bg-white border-2 transition-all hover:shadow-md hover:-translate-y-0.5 ${isCurrentUser ? 'border-navy-500 ring-2 ring-navy-200 bg-navy-50/50' : 'border-neutral-100'
                                            }`}
                                    >
                                        <RankBadge rank={entry.rank} />
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm truncate font-bold ${entry.rank === 1 ? 'text-gold-700' : 'text-navy-900'}`}>
                                                    {entry.name}
                                                </p>
                                                {isCurrentUser && (
                                                    <span className="text-[9px] bg-navy-900 text-gold-500 font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-500 truncate">
                                                {entry.sub}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                                            <p className="text-sm font-black text-navy-900">{entry.count.toLocaleString()}</p>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-navy-400">Chants</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {(!user || user.isGuest) && activeTab === 'devotees' && (
                        <div className="mt-4 pt-4 border-t border-navy-100 text-center">
                            <Link to="/signin" className="text-[9px] font-black text-navy-600 uppercase tracking-widest hover:text-gold-600 transition-colors">
                                Sign in to see your rank
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UnifiedOfferingTile;
