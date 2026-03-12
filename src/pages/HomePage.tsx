import React, { useState, useEffect, useMemo } from 'react';
import {
  Library, Calendar, Target,
  Gamepad2, ChevronRight,
  Mic, ScrollText, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookClubWeek, SiteContent, Reflection, UserProfile } from '../types';
import { ANNUAL_STUDY_PLAN, DEFAULT_SITE_CONTENT } from '../constants';
import QuoteSlider from '../components/QuoteSlider';
import SaiAvatar from '../components/SaiAvatar';
import UnifiedOfferingTile from '../components/UnifiedOfferingTile';
import { subscribeToNationalStats, NationalStats } from '../lib/nationalStats';
import { subscribeToApprovedReflections } from '../services/reflectionService';
import { DEFAULT_SITE_CONFIG, subscribeToSiteConfig } from '../services/siteConfigService';
import { STUDY_PLAN_CACHE_KEY, getCachedStudyPlanOverrides } from '../lib/bookClub';

const FeatureCard: React.FC<{
  id?: string;
  to: string; icon: React.ReactNode; label: string; title: string; description: string; cardClass: string; btnText: string;
}> = ({ id, to, icon, label, title, description, cardClass, btnText }) => (
  <Link id={id} to={to} className={`feature-card ${cardClass}`}>
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
  const getCachedUser = () => {
    try {
      const saved = localStorage.getItem('sms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  // All state initialised synchronously from localStorage — zero loading gates
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONFIG.siteContent);

  const [approvedReflections, setApprovedReflections] = useState<Reflection[]>([]);

  const [user, setUser] = useState<UserProfile | null>(() => getCachedUser());
  const [bookClubWeeks, setBookClubWeeks] = useState<BookClubWeek[]>(() => getCachedStudyPlanOverrides());

  // Firebase-dependent state — loaded after render, never blocks UI
  const [globalStats, setGlobalStats] = useState<NationalStats | null>(null);

  // Determine current book club release — pure computation, no loading
  const activeBookWeek = useMemo<BookClubWeek | null>(() => {
    try {
      const now = new Date();
      const all = [...ANNUAL_STUDY_PLAN];
      bookClubWeeks.forEach(dw => {
        const idx = all.findIndex(a => a.weekId === dw.weekId);
        if (idx >= 0) all[idx] = dw; else all.push(dw);
      });
      const past = all
        .filter(w => new Date(w.publishAt) <= now || w.status === 'published')
        .sort((a, b) => b.weekId.localeCompare(a.weekId));
      return past.length > 0 ? past[0] : null;
    } catch { return null; }
  }, [bookClubWeeks]);

  // Non-blocking effects — Firebase data loaded progressively after first paint
  useEffect(() => {
    // Subscribe to live stats — errors are handled inside subscribeToNationalStats
    let cancelled = false;
    const unsubscribeConfig = subscribeToSiteConfig((config) => {
      if (!cancelled) setSiteContent(config.siteContent);
    });
    const unsubscribeStats = subscribeToNationalStats(stats => {
      if (!cancelled) setGlobalStats(stats);
    });
    const unsubscribeReflections = subscribeToApprovedReflections((reflections) => {
      if (!cancelled) setApprovedReflections(reflections);
    });
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'sms_user') {
        setUser(getCachedUser());
      }

      if (!event.key || event.key === STUDY_PLAN_CACHE_KEY) {
        setBookClubWeeks(getCachedStudyPlanOverrides());
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      cancelled = true;
      unsubscribeConfig();
      unsubscribeStats();
      unsubscribeReflections();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

      {/* Welcome Callout */}
      <section className="w-full">
        <div className="welcome-card relative overflow-hidden p-10 md:p-14 text-center rounded-[2.5rem] bg-navy-900 border border-navy-500 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-gold-500 to-orange-500 w-full"></div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 tracking-tight">
            Om Sai Ram{user && !user.isGuest ? `, ${user.name.includes(' ') ? user.name.split(' ')[0] : user.name}` : ''}
          </h2>

          <p className="text-white/90 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-5xl mx-auto">
            {siteContent.homeWelcomeText}
          </p>

          {(!user || user.isGuest) && (
            <div className="mt-8">
              <Link to="/signup" className="inline-block px-8 py-3 bg-gold-gradient text-navy-900 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-gold-500/20">
                Start Here
              </Link>
            </div>
          )}

          {/* Replay Walkthrough button — visible only to signed-in non-guest users */}
          {user && !user.isGuest && (
            <div className="mt-6">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('sms:replayTour'))}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold-500/50 text-gold-400 text-xs font-bold uppercase tracking-widest hover:bg-gold-500/10 transition-all"
                title="Replay the app walkthrough tour"
              >
                <span>🗺️</span> Replay Walkthrough
              </button>
            </div>
          )}
        </div>
      </section>

      {/* This Week's Wisdom */}
      {activeBookWeek && (
        <section id="tour-weekly-wisdom" className="w-full">
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
          id="tour-namasmarana"
          to="/namasmarana"
          icon={<Mic size={24} color="white" />}
          label="Mantra Count"
          title="Namasmarana"
          description="Log your daily chanting and contribute to the national 2026 offering."
          cardClass="card-namasmarana"
          btnText="Log Sadhana"
        />
        <FeatureCard
          id="tour-book-club"
          to="/book-club"
          icon={<Library size={24} color="white" />}
          label="Weekly Reading"
          title="Sai Lit Club"
          description="Join the national reading journey. Read weekly chapters and share reflections."
          cardClass="card-book-club"
          btnText="Read Now"
        />
        <FeatureCard
          id="tour-dashboard-card"
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

      {/* Unified Offering Tile */}
      <div id="tour-collective-prayer">
        <UnifiedOfferingTile globalStats={globalStats} user={user} />
      </div>

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
