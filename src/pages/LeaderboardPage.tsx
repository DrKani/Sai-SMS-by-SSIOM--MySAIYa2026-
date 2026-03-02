
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs, Timestamp } from 'firebase/firestore';
import { Trophy, Medal, Users, MapPin, Building, Calendar, ArrowUp, Zap, Search, Activity, Loader2, Globe } from 'lucide-react';
import SaiAvatar from '../components/SaiAvatar';
import { UserProfile } from '../types';
import Skeleton from '../components/Skeleton';

interface LeaderboardEntry {
    uid: string;
    name: string;
    count: number;
    state: string;
    centre: string;
    photoURL?: string;
    gender?: 'male' | 'female';
    rank?: number;
}

interface SadhanaDoc extends UserProfile {
    uid: string;
    userName?: string;
    count?: number;
}

const LeaderboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'National' | 'State' | 'Centre'>('National');
    const [timePeriod, setTimePeriod] = useState<'Today' | 'Week' | 'Month' | 'AllTime'>('AllTime');
    const [searchQuery, setSearchQuery] = useState('');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('sms_user');
        if (saved) setUser(JSON.parse(saved));
    }, []);

    const getStartOfPeriod = (period: string) => {
        const date = new Date();
        if (period === 'Today') {
            date.setHours(0, 0, 0, 0);
        } else if (period === 'Week') {
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
            date.setDate(diff);
            date.setHours(0, 0, 0, 0);
        } else if (period === 'Month') {
            date.setDate(1);
            date.setHours(0, 0, 0, 0);
        } else {
            return null;
        }
        return date.toISOString();
    };

    useEffect(() => {
        setIsLoading(true);
        let unsub: () => void = () => { };

        const fetchLeaderboard = async () => {
            try {
                const startISO = getStartOfPeriod(timePeriod);

                let q;
                if (timePeriod === 'AllTime') {
                    // For All Time, we can query the users collection directly for faster performance
                    q = query(
                        collection(db, 'users'),
                        where('publicLeaderboard', '==', true),
                        orderBy('stats.gayathri', 'desc'), // Just one metric for sort or calculate sum?
                        limit(100)
                    );

                    const snap = await getDocs(q);
                    const entries: LeaderboardEntry[] = snap.docs.map(doc => {
                        const data = doc.data() as SadhanaDoc;
                        const stats = data.stats || { gayathri: 0, saiGayathri: 0, likitha: 0, mantras: 0 };
                        // Calculate total aggregate
                        const total = (stats.gayathri || 0) + (stats.saiGayathri || 0) + ((stats.likitha || 0) * 11) + (stats.mantras || 0);
                        return {
                            uid: doc.id,
                            name: data.name || 'Anonymous',
                            count: total,
                            state: data.state || 'Other',
                            centre: data.centre || 'SSIOM',
                            photoURL: data.photoURL,
                            gender: data.gender || 'male'
                        };
                    });

                    // Re-sort because we calculated total manually
                    entries.sort((a, b) => b.count - a.count);
                    setLeaderboard(entries.map((e, idx) => ({ ...e, rank: idx + 1 })));
                    setIsLoading(false);
                } else {
                    // For periodic stats, we MUST query sadhanaDaily
                    q = query(
                        collection(db, 'sadhanaDaily'),
                        where('timestamp', '>=', startISO),
                        where('publicLeaderboard', '==', true),
                        orderBy('timestamp', 'desc')
                    );

                    const snap = await getDocs(q);
                    const userTotals: Record<string, LeaderboardEntry> = {};

                    snap.forEach(doc => {
                        const data = doc.data() as SadhanaDoc;
                        const uid = data.uid || doc.id;
                        if (!userTotals[uid]) {
                            userTotals[uid] = {
                                uid: uid,
                                name: data.userName || data.name || 'Anonymous',
                                count: 0,
                                state: data.state || 'Other',
                                centre: data.centre || 'SSIOM',
                                photoURL: data.photoURL,
                                gender: data.gender || 'male'
                            };
                        }
                        userTotals[uid].count += data.count || 0;
                    });

                    // Convert to array, sort, and rank
                    const entries = Object.values(userTotals).sort((a, b) => b.count - a.count);
                    setLeaderboard(entries.map((e, idx) => ({ ...e, rank: idx + 1 })));
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [timePeriod, activeTab]);

    const filteredLeaderboard = useMemo(() => {
        let list = leaderboard;
        if (searchQuery) {
            list = list.filter(e =>
                e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.centre.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (activeTab === 'State' && user?.state) {
            list = list.filter(e => e.state === user.state);
        } else if (activeTab === 'Centre' && user?.centre) {
            list = list.filter(e => e.centre === user.centre);
        }

        return list;
    }, [leaderboard, searchQuery, activeTab, user]);

    const topThree = filteredLeaderboard.slice(0, 3);
    const theRest = filteredLeaderboard.slice(3);

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-12 min-h-screen">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-serif font-black text-navy-900 tracking-tight">National Leaderboard</h1>
                <p className="text-navy-500 font-medium italic">"Life is a game, play it." — Swami's National Sadhana Journey.</p>
            </div>

            {/* Controls */}
            <div className="bg-white p-8 rounded-bento shadow-xl border border-navy-50 space-y-8 sticky top-24 z-30">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex bg-neutral-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                        {(['National', 'State', 'Centre'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-navy-900 text-gold-500 shadow-lg' : 'text-navy-400 hover:text-navy-900'}`}
                            >
                                {tab === 'State' ? user?.state || 'My State' : tab === 'Centre' ? user?.centre || 'My Centre' : tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-neutral-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                        {(['Today', 'Week', 'Month', 'AllTime'] as const).map(period => (
                            <button
                                key={period}
                                onClick={() => setTimePeriod(period)}
                                className={`flex-1 md:flex-none px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timePeriod === period ? 'bg-gold-500 text-navy-900 shadow-md' : 'text-navy-400 hover:text-navy-900'}`}
                            >
                                {period === 'AllTime' ? 'All Time' : period}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" size={20} />
                    <input
                        type="text"
                        placeholder="Search spiritual warriors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-neutral-50 border border-navy-50 rounded-2xl text-sm font-bold focus:border-gold-500 outline-none shadow-inner"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 size={48} className="text-gold-500 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-navy-300">Syncing rankings...</p>
                </div>
            ) : filteredLeaderboard.length === 0 ? (
                <div className="bg-white p-20 rounded-bento text-center border-2 border-dashed border-navy-50 shadow-sm">
                    <Globe size={64} className="mx-auto text-navy-100 mb-6" />
                    <h3 className="text-2xl font-serif font-bold text-navy-900">No Warriors Found</h3>
                    <p className="text-navy-400 max-w-sm mx-auto mt-2">Start your sadhana today to see your name on the board.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end px-4">
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <div className="order-2 md:order-1 flex flex-col items-center">
                                <div className="relative mb-6 group cursor-pointer">
                                    <div className="p-1 bg-neutral-300 rounded-full shadow-lg group-hover:scale-105 transition-transform">
                                        <SaiAvatar gender={topThree[1].gender} photoURL={topThree[1].photoURL} size={100} />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-neutral-100 border-4 border-white text-neutral-500 rounded-full flex items-center justify-center font-black shadow-md">2</div>
                                </div>
                                <div className="text-center">
                                    <h4 className="font-bold text-navy-900">{topThree[1].name}</h4>
                                    <p className="text-[10px] text-navy-400 font-black uppercase tracking-widest">{topThree[1].centre}</p>
                                    <p className="text-xl font-black text-navy-900 mt-2">{topThree[1].count.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* 1st Place */}
                        {topThree[0] && (
                            <div className="order-1 md:order-2 flex flex-col items-center">
                                <div className="relative mb-8 group cursor-pointer">
                                    <Zap size={32} className="absolute -top-10 left-1/2 -translate-x-1/2 text-gold-500 animate-bounce" />
                                    <div className="p-1.5 bg-gold-gradient rounded-full shadow-2xl group-hover:scale-110 transition-transform">
                                        <SaiAvatar gender={topThree[0].gender} photoURL={topThree[0].photoURL} size={140} />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gold-500 border-4 border-white text-navy-900 rounded-full flex items-center justify-center font-black shadow-xl">1</div>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl font-bold text-navy-900">{topThree[0].name}</h4>
                                    <p className="text-xs text-navy-400 font-black uppercase tracking-widest">{topThree[0].centre}</p>
                                    <p className="text-3xl font-black text-gold-600 mt-2 shadow-gold-500/10">{topThree[0].count.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <div className="order-3 flex flex-col items-center">
                                <div className="relative mb-6 group cursor-pointer">
                                    <div className="p-1 bg-orange-200 rounded-full shadow-lg group-hover:scale-105 transition-transform">
                                        <SaiAvatar gender={topThree[2].gender} photoURL={topThree[2].photoURL} size={100} />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-50 border-4 border-white text-orange-700 rounded-full flex items-center justify-center font-black shadow-md">3</div>
                                </div>
                                <div className="text-center">
                                    <h4 className="font-bold text-navy-900">{topThree[2].name}</h4>
                                    <p className="text-[10px] text-navy-400 font-black uppercase tracking-widest">{topThree[2].centre}</p>
                                    <p className="text-xl font-black text-navy-900 mt-2">{topThree[2].count.toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* List */}
                    <div className="bg-white rounded-bento shadow-xl border border-navy-50 overflow-hidden">
                        <div className="divide-y divide-navy-50">
                            {theRest.map((entry) => (
                                <div
                                    key={entry.uid}
                                    className={`flex items-center gap-6 p-6 hover:bg-neutral-50 transition-all ${entry.uid === user?.uid ? 'bg-gold-50/50' : ''}`}
                                >
                                    <div className="w-12 text-center font-black text-navy-300 text-lg">
                                        {entry.rank}
                                    </div>
                                    <div className="relative">
                                        <SaiAvatar gender={entry.gender} photoURL={entry.photoURL} size={48} />
                                        {entry.uid === user?.uid && (
                                            <div className="absolute -top-1 -right-1 bg-teal-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm">
                                                <ArrowUp size={10} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h5 className={`font-bold text-sm truncate ${entry.uid === user?.uid ? 'text-navy-900' : 'text-navy-700'}`}>
                                            {entry.name} {entry.uid === user?.uid && <span className="ml-2 text-[8px] bg-navy-900 text-gold-500 px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>}
                                        </h5>
                                        <div className="flex items-center gap-3 text-[10px] text-navy-300 font-black uppercase tracking-widest truncate">
                                            <span className="flex items-center gap-1"><MapPin size={10} /> {entry.state}</span>
                                            <span className="hidden sm:flex items-center gap-1"><Building size={10} /> {entry.centre}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-lg font-black text-navy-900">{entry.count.toLocaleString()}</div>
                                        <div className="text-[8px] font-black uppercase text-navy-300 tracking-widest flex items-center justify-end gap-1">
                                            <Activity size={8} /> Chants
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {theRest.length === 0 && topThree.length > 0 && (
                            <div className="p-12 text-center border-t border-navy-50">
                                <p className="text-sm font-medium text-navy-400 italic">"There is no end to the ocean of spiritual wisdom." — Keep growing!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Stats Summary Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-navy-900 p-8 rounded-bento text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 transition-transform group-hover:scale-110 duration-700"><Trophy size={100} /></div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500 mb-2">Total Combined Offering</h4>
                    <p className="text-4xl font-black text-white">{leaderboard.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-8 rounded-bento border border-navy-50 relative overflow-hidden group">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-navy-300 mb-2">Total Active Sadhakas</h4>
                    <p className="text-4xl font-black text-navy-900">{leaderboard.length.toLocaleString()}</p>
                </div>
                <div className="bg-gold-gradient p-8 rounded-bento text-navy-900 relative overflow-hidden group shadow-xl shadow-gold-500/10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-navy-700 mb-2">My Current Rank</h4>
                    <p className="text-4xl font-black text-navy-900">
                        {leaderboard.find(e => e.uid === user?.uid)?.rank || '—'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
