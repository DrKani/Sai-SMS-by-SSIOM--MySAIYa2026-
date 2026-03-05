import React, { useState, useEffect, useMemo } from 'react';
import {
  Library, Target,
  Calendar,
  Gamepad2, ChevronRight,
  Mic, ScrollText, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookClubWeek, SiteContent, Reflection } from '../types';
import { ANNUAL_STUDY_PLAN, DEFAULT_SITE_CONTENT } from '../constants';
import QuoteSlider from '../components/QuoteSlider';
import SaiAvatar from '../components/SaiAvatar';
import { subscribeToNationalStats, NationalStats } from '../lib/nationalStats';
import HomeLeaderboard from '../components/HomeLeaderboard';

const FeatureCard: React.FC<{
  to: string; icon: React.ReactNode; label: string; title: string; description: string; cardClass: string; btnText: string;
}> = ({ to, icon, label, title, description, cardClass, btnText }) => (
  <Link to={to} className={`feature-card ${cardClass}`}>
    <div className="feature-card__banner">
      <div className="feature-card__banner-icon">
        {icon}
      </div>
      <span className="feature-card__banner-label">{label}</span>
      <h3 className="feature-card__banner-title">{title}</h3>
    </div>
    <div className="feature-card__body">
      <p className="feature-card__description">{description}</p>
      <div style={{ marginTop: 'auto' }}>
        <span className="feature-card__btn">{btnText}</span>
      </div>
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

  // Firebase-dependent state — loaded after render, never blocks UI
  const [globalStats, setGlobalStats] = useState<NationalStats | null>(null);

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
        <div className="welcome-card p-10 md:p-14 text-center">
          <p className="text-white text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-5xl mx-auto">
            {siteContent.homeWelcomeText}
          </p>
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

      {/* Feature Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          to="/namasmarana"
          icon={<Mic size={24} color="white" />}
          label="Mantra Count"
          title="Namasmarana"
          description="Log your daily chanting and contribute to the national 2026 offering."
          cardClass="card-namasmarana"
          btnText="Log Sadhana"
        />
        <FeatureCard
          to="/book-club"
          icon={<Library size={24} color="white" />}
          label="Weekly Reading"
          title="Sai Lit Club"
          description="Join the national reading journey. Read weekly chapters and share reflections."
          cardClass="card-book-club"
          btnText="Read Now"
        />
        <FeatureCard
          to="/dashboard"
          icon={<Target size={24} color="white" />}
          label="Progress Tracker"
          title="Personal Dashboard"
          description="View your streak, annual goals, milestones and personal achievements."
          cardClass="card-dashboard"
          btnText="View Stats"
        />
        <FeatureCard
          to="/journal"
          icon={<ScrollText size={24} color="white" />}
          label="My Journal"
          title="Reflections"
          description="Capture your spiritual insights privately and deepen your daily practice."
          cardClass="card-reflections"
          btnText="Open Journal"
        />
        <FeatureCard
          to="/games"
          icon={<Gamepad2 size={24} color="white" />}
          label="Interactive Games"
          title="Play Zone"
          description="Life is a game, play it! Test your knowledge with crosswords and quizzes."
          cardClass="card-play"
          btnText="Play Games"
        />
        <FeatureCard
          to="/calendar"
          icon={<Calendar size={24} color="white" />}
          label="Upcoming"
          title="SMS Events"
          description="Stay updated with the national spiritual calendar and collective sessions."
          cardClass="card-events"
          btnText="View Calendar"
        />
      </div>

      {/* Our Collective Offering — Leaderboard section: always public, no auth gate */}
      <HomeLeaderboard
        globalTotalChants={globalStats?.totalChants || 0}
        globalTotalParticipants={globalStats?.totalParticipants || 0}
      />

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



      <section className="w-full">
        <QuoteSlider />
      </section>
    </div>
  );
};

export default HomePage;
