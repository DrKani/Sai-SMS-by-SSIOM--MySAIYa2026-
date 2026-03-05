import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Mic, Target, ArrowRight, Trophy, Medal, ChevronDown, Crown, User } from 'lucide-react';
import {
  NationalStats, MantraBreakdown,
  CentreLeaderboardEntry, LeaderboardTab,
  fetchCentreLeaderboard
} from '../lib/nationalStats';
import { UserProfile } from '../types';

// ── Animated Counter ────────────────────────────────────────────────────────

const AnimatedNumber: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
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

  return <span className={className}>{display.toLocaleString()}</span>;
};

// ── Mantra Type Pill ────────────────────────────────────────────────────────

const MANTRA_LABELS: Record<keyof MantraBreakdown, { label: string; color: string }> = {
  gayathri: { label: 'Gayathri', color: 'bg-amber-500' },
  saiGayathri: { label: 'Sai Gayathri', color: 'bg-rose-500' },
  likitha: { label: 'Om Sai Ram', color: 'bg-teal-500' },
};

// ── Podium Medal ────────────────────────────────────────────────────────────

const MEDAL_COLORS = ['text-yellow-500', 'text-gray-400', 'text-amber-700'] as const;
const MEDAL_BG = ['bg-yellow-50 border-yellow-200', 'bg-gray-50 border-gray-200', 'bg-amber-50 border-amber-200'] as const;
const MEDAL_LABELS = ['Gold', 'Silver', 'Bronze'] as const;

// ── Tab Config ──────────────────────────────────────────────────────────────

const TAB_CONFIG: Record<LeaderboardTab, { label: string; sortKey: keyof CentreLeaderboardEntry; suffix: string }> = {
  engaged: { label: 'Most Engaged', sortKey: 'memberCount', suffix: 'members' },
  chanting: { label: 'Most Chanting', sortKey: 'totalChants', suffix: 'chants' },
  participation: { label: 'Participation Rate', sortKey: 'participationRate', suffix: '%' },
};

// ── Main Component ──────────────────────────────────────────────────────────

interface CollectivePrayerSectionProps {
  globalStats: NationalStats | null;
  user: UserProfile | null;
}

const CollectivePrayerSection: React.FC<CollectivePrayerSectionProps> = ({ globalStats, user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('chanting');
  const [timeFilter, setTimeFilter] = useState<'month' | 'all'>('all');
  const [centreData, setCentreData] = useState<CentreLeaderboardEntry[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchCentreLeaderboard().then(setCentreData).catch(() => {});
  }, []);

  const sortedCentres = useMemo(() => {
    const key = TAB_CONFIG[activeTab].sortKey;
    return [...centreData].sort((a, b) => (b[key] as number) - (a[key] as number));
  }, [centreData, activeTab]);

  const top3 = sortedCentres.slice(0, 3);
  const rest = sortedCentres.slice(3, 8);

  // Find user's centre rank
  const userCentre = user?.centre;
  const userCentreRank = useMemo(() => {
    if (!userCentre) return null;
    const idx = sortedCentres.findIndex(c => c.centre === userCentre);
    return idx >= 0 ? { rank: idx + 1, entry: sortedCentres[idx] } : null;
  }, [sortedCentres, userCentre]);

  // Personal stats
  const personalStats = useMemo(() => {
    if (!user) return null;
    try {
      const raw = localStorage.getItem(`sms_stats_${user.uid}`);
      if (!raw) return null;
      const stats = JSON.parse(raw);
      return {
        gayathri: stats.gayathri || 0,
        saiGayathri: stats.saiGayathri || 0,
        likitha: stats.likitha || 0,
        total: (stats.gayathri || 0) + (stats.saiGayathri || 0) + ((stats.likitha || 0) * 11)
      };
    } catch { return null; }
  }, [user]);

  const mantras = globalStats?.mantras || { gayathri: 0, saiGayathri: 0, likitha: 0 };
  const hasStats = globalStats && globalStats.totalChants > 0;

  return (
    <section className="bg-white p-10 rounded-[2rem] shadow-xl border border-navy-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 text-center md:text-left">
        <div>
          <h2 className="text-4xl font-serif font-bold text-navy-900 mb-2">Our Collective Prayer</h2>
          <p className="text-navy-500 font-medium">Join fellow Malaysians in offering to Swami our Sadhana</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Month Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-navy-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-navy-600 hover:bg-navy-100 transition-all border border-navy-100"
            >
              {timeFilter === 'month' ? 'This Month' : 'All Time'}
              <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-navy-50 overflow-hidden z-20">
                <button
                  onClick={() => { setTimeFilter('month'); setIsFilterOpen(false); }}
                  className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === 'month' ? 'bg-navy-900 text-gold-500' : 'text-navy-600 hover:bg-navy-50'}`}
                >
                  This Month
                </button>
                <button
                  onClick={() => { setTimeFilter('all'); setIsFilterOpen(false); }}
                  className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === 'all' ? 'bg-navy-900 text-gold-500' : 'text-navy-600 hover:bg-navy-50'}`}
                >
                  All Time
                </button>
              </div>
            )}
          </div>
          <div className="bg-gold-gradient p-[1px] rounded-3xl overflow-hidden shadow-xl shadow-gold-500/10 hover:scale-105 transition-transform cursor-pointer">
            <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-[calc(1.5rem-1px)] flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-navy-900">System Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── National Total Counter ───────────────────────────────── */}
      <div className="bg-navy-900 rounded-[2rem] p-10 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5" />
        <div className="relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500 mb-4">
            National Namasmarana Counter 2026
          </p>
          <div className="mb-6">
            <AnimatedNumber
              value={hasStats ? globalStats.totalChants : 0}
              className="text-6xl md:text-8xl font-serif font-black text-white"
            />
            <p className="text-navy-300 text-xs font-bold uppercase tracking-widest mt-3">
              Total Sacred Chants Offered
            </p>
          </div>

          {/* Mantra Type Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            {(Object.keys(MANTRA_LABELS) as (keyof MantraBreakdown)[]).map(key => (
              <div key={key} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/5">
                <div className={`w-3 h-3 ${MANTRA_LABELS[key].color} rounded-full mx-auto mb-3`} />
                <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-1">
                  {MANTRA_LABELS[key].label}
                </p>
                <p className="text-2xl font-black text-white">
                  {(mantras[key] || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stats Row */}
          {hasStats && (
            <div className="flex flex-wrap justify-center gap-8 mt-8 pt-8 border-t border-white/10">
              <div className="text-center">
                <Users size={20} className="text-gold-500 mx-auto mb-1" />
                <p className="text-2xl font-black text-white">{globalStats.totalParticipants.toLocaleString()}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Participants</p>
              </div>
              <div className="text-center">
                <Target size={20} className="text-gold-500 mx-auto mb-1" />
                <p className="text-2xl font-black text-white">{globalStats.goalPercent}%</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-white/50">Goal Progress</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Sai Centre Leaderboard ───────────────────────────────── */}
      <div className="bg-neutral-50 rounded-[2rem] p-8 border border-navy-50 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Trophy size={24} className="text-gold-500" />
              <h3 className="text-2xl font-serif font-bold text-navy-900">Sai Centre Leaderboard</h3>
            </div>
            <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest">
              Centres ranked by spiritual engagement
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-navy-50 shadow-inner">
          {(Object.keys(TAB_CONFIG) as LeaderboardTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-navy-900 text-gold-500 shadow-lg'
                  : 'text-navy-300 hover:text-navy-600 hover:bg-navy-50'
              }`}
            >
              {TAB_CONFIG[tab].label}
            </button>
          ))}
        </div>

        {/* Podium — Top 3 */}
        {top3.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {top3.map((entry, i) => (
              <div
                key={entry.centre}
                className={`relative p-6 rounded-2xl border-2 ${MEDAL_BG[i]} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {i === 0 ? (
                    <Crown size={28} className={MEDAL_COLORS[i]} />
                  ) : (
                    <Medal size={24} className={MEDAL_COLORS[i]} />
                  )}
                  <span className={`text-[9px] font-black uppercase tracking-widest ${MEDAL_COLORS[i]}`}>
                    {MEDAL_LABELS[i]}
                  </span>
                </div>
                <h4 className="text-lg font-serif font-bold text-navy-900 mb-3 leading-tight">
                  {entry.centre}
                </h4>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black text-navy-900">
                      {(entry[TAB_CONFIG[activeTab].sortKey] as number).toLocaleString()}
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-navy-400">
                      {TAB_CONFIG[activeTab].suffix}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-navy-600">{entry.memberCount}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-navy-300">members</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-navy-300">
            <Trophy size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-bold">No centre data yet</p>
            <p className="text-[10px] text-navy-400 mt-1">Start chanting to put your centre on the board!</p>
          </div>
        )}

        {/* Remaining Ranked Rows */}
        {rest.length > 0 && (
          <div className="space-y-2">
            {rest.map((entry, i) => (
              <div
                key={entry.centre}
                className="flex items-center justify-between bg-white p-4 rounded-xl border border-navy-50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-navy-50 rounded-full flex items-center justify-center text-xs font-black text-navy-400">
                    {i + 4}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{entry.centre}</p>
                    <p className="text-[9px] text-navy-400 font-bold uppercase tracking-widest">
                      {entry.memberCount} members
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-navy-900">
                    {(entry[TAB_CONFIG[activeTab].sortKey] as number).toLocaleString()}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-navy-300">
                    {TAB_CONFIG[activeTab].suffix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Personal Rank Card ───────────────────────────────────── */}
      {user && !user.isGuest ? (
        <div className="bg-gradient-to-r from-navy-900 to-[#1a3a5c] rounded-[2rem] p-8 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gold-gradient opacity-5" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center border-2 border-gold-500/30">
                  <User size={28} className="text-gold-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gold-500 mb-1">Your Rank</p>
                  <p className="text-lg font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-white/60 font-bold">{user.centre || 'No centre assigned'}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                {userCentreRank && (
                  <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/5">
                    <Trophy size={16} className="text-gold-500 mx-auto mb-1" />
                    <p className="text-2xl font-black text-white">#{userCentreRank.rank}</p>
                    <p className="text-[7px] font-black uppercase tracking-widest text-white/50">Centre Rank</p>
                  </div>
                )}
                {personalStats && (
                  <>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/5">
                      <Mic size={16} className="text-gold-500 mx-auto mb-1" />
                      <p className="text-2xl font-black text-white">{personalStats.total.toLocaleString()}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest text-white/50">My Total</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/5">
                      <p className="text-lg font-black text-white">{personalStats.gayathri.toLocaleString()}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest text-white/50">Gayathri</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/5">
                      <p className="text-lg font-black text-white">{personalStats.saiGayathri.toLocaleString()}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest text-white/50">Sai Gayathri</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Guest CTA */
        <div className="bg-navy-50 rounded-[2rem] p-8 mb-10 text-center border border-navy-100">
          <User size={32} className="text-navy-300 mx-auto mb-3" />
          <h4 className="text-lg font-serif font-bold text-navy-900 mb-2">See Your Personal Rank</h4>
          <p className="text-sm text-navy-500 mb-6 max-w-md mx-auto">
            Sign in to see your personal chant count and your centre's ranking on the leaderboard.
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-8 py-3 bg-navy-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-navy-800 transition-all shadow-lg"
          >
            Sign In <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ─── Start Chanting Button ────────────────────────────────── */}
      <button
        onClick={() => navigate('/namasmarana')}
        className="w-full bg-gold-gradient text-navy-900 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:scale-[1.01] transition-all shadow-xl shadow-gold-500/20"
      >
        <Mic size={20} />
        Start Chanting
        <ArrowRight size={18} />
      </button>
    </section>
  );
};

export default CollectivePrayerSection;
