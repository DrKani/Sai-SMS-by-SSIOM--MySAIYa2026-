import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight, Library,
  Calendar, Users, Target,
  Gamepad2, ChevronRight,
  Mic, ScrollText, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Announcement, BookClubWeek, SiteContent, Reflection } from '../types';
import { ANNUAL_STUDY_PLAN, DEFAULT_SITE_CONTENT } from '../constants';
import QuoteSlider from '../components/QuoteSlider';
import SaiAvatar from '../components/SaiAvatar';
import { subscribeToNationalStats, NationalStats, MALAYSIA_STATES } from '../lib/nationalStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// ── Sub-components ──────────────────────────────────────────────────────────

const TileCard: React.FC<{
  to: string; icon: React.ReactNode; label: string; sub: string;
  color: string; textColor?: string;
}> = ({ to, icon, label, sub, color, textColor = 'text-white' }) => (
  <Link
    to={to}
    className={`${color} ${textColor} p-10 rounded-[2.5rem] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all flex flex-col items-center text-center gap-6 group relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 p-12 bg-white/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-700" />
    <div className="p-6 bg-white/10 rounded-[2rem] group-hover:scale-110 transition-transform shadow-inner relative z-10 border border-white/10">
      {icon}
    </div>
    <div className="relative z-10">
      <h3 className="text-2xl font-serif font-bold mb-2 leading-tight">{label}</h3>
      <p className="text-[10px] opacity-80 uppercase tracking-widest font-black leading-tight">{sub}</p>
    </div>
  </Link>
);

const HomeStatCard: React.FC<{
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; to: string;
}> = ({ icon, label, value, sub, color, to }) => (
  <Link to={to} className={`${color} text-white p-10 rounded-[2.5rem] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all flex flex-col items-center text-center gap-6 group relative overflow-hidden`}>
    <div className="absolute top-0 right-0 p-12 bg-white/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-700" />
    <div className="p-6 bg-white/10 rounded-[2rem] group-hover:scale-110 transition-transform shadow-inner relative z-10 border border-white/10">
      {icon}
    </div>
    <div className="relative z-10">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">{label}</span>
      <h4 className="text-4xl font-black text-white mb-2">{value}</h4>
      <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">{sub}</p>
    </div>
  </Link>
);

// ── Main Component ───────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  // All state initialised synchronously from localStorage — zero loading gates
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem('sms_site_content');
      return stored ? JSON.parse(stored) : DEFAULT_SITE_CONTENT;
    } catch { return DEFAULT_SITE_CONTENT; }
  });

  const [approvedReflections, setApprovedReflections] = useState<Reflection[]>(() => {
    try {
      const all: Reflection[] = JSON.parse(localStorage.getItem('sms_reflections_queue') || '[]');
      return all.filter(r => r.status === 'approved').slice(0, 3);
    } catch { return []; }
  });

  const [selectedState, setSelectedState] = useState<string>('Selangor');

  // Firebase-dependent state — loaded after render, never blocks UI
  const [globalStats, setGlobalStats] = useState<NationalStats | null>(null);
  const [recentParticipants, setRecentParticipants] = useState<any[]>([]);

  // Determine current book club release — pure computation, no loading
  const activeBookWeek = useMemo<BookClubWeek | null>(() => {
    try {
      const now = new Date();
      const dynamic: BookClubWeek[] = JSON.parse(localStorage.getItem('sms_bookclub_weeks') || '[]');
      const all = [...ANNUAL_STUDY_PLAN];
      dynamic.forEach(dw => {
        const idx = all.findIndex(a => a.weekId === dw.weekId);
        if (idx >= 0) all[idx] = dw; else all.push(dw);
      });
      const past = all
        .filter(w => new Date(w.publishAt) <= now || w.status === 'published')
        .sort((a, b) => b.weekId.localeCompare(a.weekId));
      return past.length > 0 ? past[0] : null;
    } catch { return null; }
  }, []);

  const chartData = useMemo(() => {
    if (!globalStats) return [];
    return MALAYSIA_STATES
      .map(state => ({
        name: state,
        chants: globalStats.states?.[state]?.chants || 0,
        participants: globalStats.states?.[state]?.participants || 0,
      }))
      .sort((a, b) => b.chants - a.chants)
      .slice(0, 8);
  }, [globalStats]);

  // Non-blocking effects — Firebase data loaded progressively after first paint
  useEffect(() => {
    // Refresh site content
    const stored = localStorage.getItem('sms_site_content');
    if (stored) {
      try { setSiteContent(JSON.parse(stored)); } catch { }
    }

    // Subscribe to live stats — errors are handled inside subscribeToNationalStats
    let cancelled = false;
    const unsubscribe = subscribeToNationalStats(stats => {
      if (!cancelled) setGlobalStats(stats);
    });

    // Fetch participants — fire-and-forget, failures are silent
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'users'), where('publicLeaderboard', '==', true), limit(12))
        );
        if (!cancelled) {
          setRecentParticipants(snap.docs.map(d => ({
            name: d.data().name,
            centre: d.data().centre,
            photoURL: d.data().photoURL,
            gender: d.data().gender || 'male',
          })));
        }
      } catch { /* silent — Firebase permission denied handled gracefully */ }
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

      {/* Welcome Callout */}
      <section className="w-full">
        <div className="bg-navy-900 rounded-[2.5rem] shadow-2xl border-4 border-gold-500 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient" />
          <div className="p-10 md:p-14 text-center">
            <p className="text-white text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-5xl mx-auto">
              {siteContent.homeWelcomeText}
            </p>
          </div>
        </div>
      </section>

      {/* This Week's Wisdom */}
      {activeBookWeek && (
        <section className="w-full">
          <Link
            to={`/book-club/${activeBookWeek.weekId}`}
            className="block bg-navy-900 rounded-[2.5rem] shadow-2xl border-4 border-gold-500 overflow-hidden group hover:scale-[1.01] transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-10 bg-gold-gradient text-navy-900">
                <div className="flex items-center gap-2 mb-4">
                  <Library size={24} className="animate-bounce" />
                  <h3 className="text-xs font-black uppercase tracking-widest">This Week's Wisdom</h3>
                </div>
                <h4 className="text-3xl font-serif font-bold mb-2 leading-tight">{activeBookWeek.chapterTitle}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  Week {activeBookWeek.weekId} • Dive into the national reading journey
                </p>
              </div>
              <div className="flex-[1.5] p-10 bg-navy-900 text-white flex flex-col justify-center">
                <p className="text-navy-100 text-sm font-medium leading-relaxed italic mb-6">
                  "The attraction that one exerts over another is what makes the Universe exist and function. That is the Rama principle."
                </p>
                <div className="flex items-center gap-2 text-gold-500 font-black uppercase tracking-widest text-[10px]">
                  Read Now <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Primary Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TileCard to="/namasmarana" icon={<Mic size={40} />} label="Namasmarana" sub="Submit Mantra Count" color="bg-[#ea7600]" />
        <TileCard to="/book-club" icon={<Library size={40} />} label="Book Club" sub="Weekly Readings & Reflections" color="bg-[#bf0449]" />
        <TileCard to="/dashboard" icon={<Target size={40} />} label="Personal Dashboard" sub="My Progress 2026" color="bg-[#5726bf]" />
      </div>

      {/* Our Collective Prayer — always renders, stats are progressive */}
      <section className="bg-white p-10 rounded-[2rem] shadow-xl border border-navy-50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 text-center md:text-left">
          <div>
            <h2 className="text-4xl font-serif font-bold text-navy-900 mb-2">Our Collective Prayer</h2>
            <p className="text-navy-500 font-medium">Join fellow Malaysians in offering to Swami our Sadhana</p>
          </div>
          <div className="bg-gold-gradient p-[1px] rounded-3xl overflow-hidden shadow-xl shadow-gold-500/10 hover:scale-105 transition-transform cursor-pointer">
            <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-[calc(1.5rem-1px)] flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-navy-900">System Live</span>
            </div>
          </div>
        </div>

        {/* Stats — shown progressively once Firebase responds */}
        {globalStats && globalStats.totalChants > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HomeStatCard icon={<Users size={32} />} label="Participants" value={globalStats.totalParticipants.toLocaleString()} sub="Malaysia Wide Devotees" color="bg-navy-900" to="/dashboard" />
              <HomeStatCard icon={<Mic size={32} />} label="Total Chants" value={globalStats.totalChants.toLocaleString()} sub="Cumulative National Count" color="bg-[#bf0449]" to="/namasmarana" />
              <HomeStatCard icon={<Target size={32} />} label="Offering Goal" value={`${globalStats.goalPercent}%`} sub="National Target 2026" color="bg-[#009688]" to="/dashboard" />
            </div>

            {/* State breakdown chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-neutral-50 p-8 rounded-[2rem] border border-navy-50">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-serif font-bold text-navy-900">State Breakdown</h4>
                  <p className="text-xs text-navy-400 font-bold uppercase tracking-widest">Interactive Region Analysis</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MALAYSIA_STATES.map(state => (
                    <button
                      key={state}
                      onClick={() => setSelectedState(state)}
                      className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedState === state ? 'bg-navy-900 text-gold-500 shadow-lg' : 'bg-white text-navy-400 hover:bg-navy-50 border border-navy-50'}`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-navy-50 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-navy-300 mb-1">{selectedState} Stats</span>
                    <span className="text-2xl font-black text-navy-900">{(globalStats.states?.[selectedState]?.chants || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-navy-400 ml-2">chants</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-navy-900">{(globalStats.states?.[selectedState]?.participants || 0).toLocaleString()}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-navy-300">Devotees</span>
                  </div>
                </div>
              </div>
              <div className="h-64 lg:h-auto min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#eee" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#1e293b' }} width={80} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="chants" radius={[0, 10, 10, 0]} barSize={20}>
                      {chartData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={i === 0 ? '#F5C842' : '#002E5B'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {recentParticipants.length > 0 && (
              <div className="pt-12 border-t border-navy-50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="text-xl font-serif font-bold text-navy-900">National Participants</h4>
                    <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest">Devotees joining the collective offering</p>
                  </div>
                  <Users className="text-navy-100" size={32} />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {recentParticipants.map((p, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 group">
                      <div className="w-16 h-16 rounded-full border-2 border-white shadow-md group-hover:scale-110 group-hover:border-gold-500 transition-all overflow-hidden bg-neutral-100">
                        <SaiAvatar gender={p.gender} photoURL={p.photoURL} size={64} />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-navy-900 truncate w-20">{p.name}</p>
                        <p className="text-[8px] text-navy-400 uppercase tracking-widest truncate w-20">{p.centre || 'SSIOM'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty state — always shown immediately if no stats yet */
          <div className="bg-navy-900 rounded-[2rem] p-12 text-center text-white shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gold-gradient opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="p-6 bg-white/10 rounded-full backdrop-blur">
                <Mic size={48} className="text-gold-500" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white">Be the first to offer!</h3>
              <p className="text-navy-200 max-w-lg mb-4 text-sm font-medium leading-relaxed">
                The 2026 national journey has just begun. Start your Sadhana today and dedicate your first counts to Swami.
              </p>
              <Link to="/namasmarana" className="bg-gold-gradient text-navy-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-gold-500/20">
                Start Chanting <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Devotee Reflections */}
      {approvedReflections.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-navy-900">Devotee Reflections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approvedReflections.map(ref => (
              <div key={ref.id} className="bg-white p-8 rounded-[2rem] border border-navy-50 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <SaiAvatar gender="male" size={48} />
                  <div>
                    <p className="text-sm font-bold text-navy-900">{ref.userName}</p>
                    <p className="text-[10px] text-navy-400 font-black uppercase tracking-widest">
                      {new Date(ref.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[9px] font-black uppercase tracking-widest rounded-full">
                    {ref.chapterTitle}
                  </span>
                </div>
                <p className="text-navy-600 italic leading-relaxed text-sm">"{ref.content}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Secondary Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TileCard to="/journal" icon={<ScrollText size={40} />} label="My Reflections" sub="Capture your insights, deepen your practice" color="bg-navy-900" />
        <TileCard to="/games" icon={<Gamepad2 size={40} />} label="Play it" sub="Life is a Game, Play it. Celebrate Life with interesting quizzes and games." color="bg-[#D2AC47]" textColor="text-navy-900" />
        <TileCard to="/calendar" icon={<Calendar size={40} />} label="SMS Events" sub="National Spiritual Calendar" color="bg-[#0367a6]" />
      </div>

      <section className="w-full">
        <QuoteSlider />
      </section>
    </div>
  );
};

export default HomePage;
