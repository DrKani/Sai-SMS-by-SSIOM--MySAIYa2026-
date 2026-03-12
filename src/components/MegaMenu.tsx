import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X, Home, UserCircle, Mic, Library, Gamepad2, Globe, Shield,
  PenTool, ScrollText, Calendar, Trophy, BookOpen, Info, Mail,
  ChevronDown, ChevronRight, Zap, Star, Flame,
  Heart, Sparkles, Lightbulb
} from 'lucide-react';
import { UserProfile, Announcement } from '../types';
import { APP_CONFIG } from '../constants';

// ── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  to: string;
  requiresAuth?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  links: NavLink[];
  requiresAdmin?: boolean;
}

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  isAdmin: boolean | null | undefined;
  userStreak?: number;
  bookClubProgress?: string;
  lastActiveModule?: string;
  announcements?: Announcement[];
  newArticlesCount?: number;
}

// ── Navigation Data ───────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'home',
    label: 'SAI SMS HOME',
    icon: <Home size={18} aria-hidden />,
    links: [
      { label: 'SAI SMS Home', to: '/' },
    ],
  },
  {
    id: 'my',
    label: 'MY SAI SMS',
    icon: <UserCircle size={18} aria-hidden />,
    links: [
      { label: 'My Sai SMS Dashboard', to: '/dashboard', requiresAuth: true },
      { label: 'My Sai SMS Profile', to: '/profile', requiresAuth: true },
      { label: 'My Sai SMS Reflections', to: '/journal', requiresAuth: true },
      { label: 'My Sai SMS Briefcase', to: '/dashboard#briefcase', requiresAuth: true },
    ],
  },
  {
    id: 'practice',
    label: 'SAI SMS PRACTICE',
    icon: <Mic size={18} aria-hidden />,
    links: [
      { label: 'Sai SMS Gayathri Mantra', to: '/namasmarana', requiresAuth: true },
      { label: 'Sai SMS Sathya Sai Gayathri', to: '/namasmarana#sai-gayathri', requiresAuth: true },
      { label: 'Sai SMS Likitha Japa', to: '/namasmarana#likitha', requiresAuth: true },
    ],
  },
  {
    id: 'learn',
    label: 'SAI SMS LEARN & SHARE',
    icon: <Library size={18} aria-hidden />,
    links: [
      { label: 'Sai SMS Book Club', to: '/book-club', requiresAuth: true },
      { label: 'Ramakatha Rasavahini (2026)', to: '/book-club/ramakatha-2026', requiresAuth: true },
      { label: 'Sai SMS Blog', to: '/articles' },
    ],
  },
  {
    id: 'play',
    label: 'SAI SMS PLAY IT',
    icon: <Gamepad2 size={18} aria-hidden />,
    links: [
      { label: 'Sai SMS Quotescapes', to: '/games?game=quotescapes', requiresAuth: true },
      { label: 'Sai SMS Parikshya', to: '/games?game=quiz', requiresAuth: true },
      { label: 'Sai SMS Word Quest', to: '/games?game=wordsearch', requiresAuth: true },
      { label: 'Sai SMS Crossword', to: '/games?game=crossword', requiresAuth: true },
    ],
  },
  {
    id: 'community',
    label: 'SAI SMS COMMUNITY & INFO',
    icon: <Globe size={18} aria-hidden />,
    links: [
      { label: 'About Sai SMS', to: '/about' },
      { label: 'Sai SMS Leaderboard', to: '/leaderboard', requiresAuth: true },
      { label: 'Sai SMS Calendar', to: '/calendar' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    id: 'admin',
    label: 'SAI SMS ADMIN',
    icon: <Shield size={18} aria-hidden />,
    links: [
      { label: 'Sai SMS Admin Hub', to: '/admin' },
      { label: 'Create Announcement', to: '/admin/announcements/create' },
    ],
    requiresAdmin: true,
  },
];

// ── Rotating content cards ────────────────────────────────────────────────────

const ROTATING_CARDS = [
  {
    id: 'wisdom',
    icon: <Lightbulb size={16} className="text-gold-500" aria-hidden />,
    tag: "This Week's Wisdom",
    body: '"The best way to love God is to love all, serve all."',
    cta: 'Read in Book Club',
    ctaTo: '/book-club',
  },
  {
    id: 'prayer',
    icon: <Heart size={16} className="text-pink-400" aria-hidden />,
    tag: 'Our Collective Prayer',
    body: 'Together we chant, together we grow. See our national offering.',
    cta: 'View Leaderboard',
    ctaTo: '/leaderboard',
  },
  {
    id: 'new',
    icon: <Sparkles size={16} className="text-purple-400" aria-hidden />,
    tag: 'New This Month',
    body: 'Fresh games & content have arrived. Explore what\'s new!',
    cta: 'Explore Now',
    ctaTo: '/games',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(now: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];
  return `${days[now.getDay()]}, ${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

// ── Main Component ────────────────────────────────────────────────────────────

const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  user,
  isAdmin,
  userStreak = 0,
  bookClubProgress = '',
  lastActiveModule = '/dashboard',
  announcements = [],
  newArticlesCount = 0,
}) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [rotatingCardIdx, setRotatingCardIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstInteractiveRef = useRef<HTMLButtonElement>(null);
  const today = new Date();

  // Notification badges computation
  const profileIncomplete = !!(user && !user.isGuest && (!user.centre || !user.state));
  const adminHasPending = !!isAdmin; // show badge for admins as reminder
  const hasBlogBadge = newArticlesCount > 0 || announcements.length > 0;

  // Which section IDs have a badge
  const sectionBadges: Record<string, { label: string; color: string }> = {
    my: profileIncomplete ? { label: '!', color: '#EF4444' } : {} as any,
    admin: adminHasPending ? { label: '!', color: '#F59E0B' } : {} as any,
    learn: hasBlogBadge ? { label: 'NEW', color: '#8B5CF6' } : {} as any,
  };

  // Detect viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Rotate content card every 8 s when menu is open
  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => setRotatingCardIdx(i => (i + 1) % ROTATING_CARDS.length), 8000);
    return () => clearInterval(t);
  }, [isOpen]);

  // Focus trap + Esc
  useEffect(() => {
    if (!isOpen) return;
    firstInteractiveRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Click outside
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const visibleSections = NAV_SECTIONS.filter(s => !s.requiresAdmin || isAdmin);
  const currentSection = visibleSections.find(s => s.id === activeSection) ?? visibleSections[0];

  // Gender-aware greeting
  const isFemale = user?.gender === 'female';
  const honorific = isFemale ? 'Sis' : 'Bro';
  const firstName = user?.name?.split(' ')[0] ?? 'Devotee';
  const centreName = user?.centre ?? '';
  const chantTotal = (user?.stats?.gayathri ?? 0) + (user?.stats?.saiGayathri ?? 0);
  const card = ROTATING_CARDS[rotatingCardIdx];

  // ── RIGHT PANEL ────────────────────────────────────────────────────────────
  const RightPanel = () => (
    <aside className="mega-right-panel" aria-label="Your personalised snapshot">
      {/* Avatar + greeting */}
      <div className="mega-greeting-chip">
        {user && !user.isGuest ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-400 shrink-0">
                <img
                  src={user.photoURL || APP_CONFIG.AVATAR_MALE}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="mega-greeting-name">Om Sai Ram, {honorific} {firstName}</p>
                <p className="mega-greeting-date">Today is {formatDate(today)}</p>
              </div>
            </div>
            {centreName && (
              <p className="mega-greeting-centre">
                You are journeying with <strong>{centreName}</strong>
              </p>
            )}
          </>
        ) : (
          <div>
            <p className="mega-greeting-name">Om Sai Ram 🙏</p>
            <p className="mega-greeting-date">Today is {formatDate(today)}</p>
            <p className="mega-greeting-centre mt-1">
              <Link to="/signin" onClick={onClose} className="text-gold-500 font-bold hover:underline">Sign in</Link> to personalise your experience
            </p>
          </div>
        )}
      </div>

      {/* Progress snapshot */}
      {user && !user.isGuest && (
        <div className="mega-progress-section">
          {chantTotal > 0 && (
            <div className="mega-progress-row">
              <Flame size={13} className="text-orange-400 shrink-0" aria-hidden />
              <span>This week: <strong>{chantTotal.toLocaleString()} chants logged</strong></span>
              {userStreak > 0 && <span className="mega-streak-badge">🔥 Day {userStreak}</span>}
            </div>
          )}
          {bookClubProgress && (
            <div className="mega-progress-row">
              <BookOpen size={13} className="text-purple-400 shrink-0" aria-hidden />
              <span>Book Club: <strong>{bookClubProgress}</strong></span>
            </div>
          )}
          {!chantTotal && !bookClubProgress && (
            <div className="mega-progress-row">
              <Star size={13} className="text-gold-400 shrink-0" aria-hidden />
              <span>Start your journey today!</span>
            </div>
          )}
        </div>
      )}

      {/* Primary CTA */}
      {user && !user.isGuest && (
        <Link
          to={lastActiveModule}
          onClick={onClose}
          className="mega-cta-btn"
        >
          <Zap size={15} aria-hidden />
          Continue where I left off
        </Link>
      )}

      {/* Rotating content card */}
      <div className="mega-rotating-card" key={card.id}>
        <div className="mega-rotating-card-tag">
          {card.icon}
          <span>{card.tag}</span>
        </div>
        <p className="mega-rotating-card-body">{card.body}</p>
        <Link to={card.ctaTo} onClick={onClose} className="mega-rotating-card-cta">
          {card.cta} <ChevronRight size={12} aria-hidden />
        </Link>
      </div>
    </aside>
  );

  // ── DESKTOP MEGA MENU ──────────────────────────────────────────────────────
  const DesktopMenu = () => (
    <div
      className={`mega-menu-panel ${isOpen ? 'mega-menu-panel--open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
      aria-hidden={!isOpen}
      ref={menuRef}
    >
      {/* Menu header bar */}
      <div className="mega-menu-header">
        <span className="mega-menu-header-label">
          <Sparkles size={14} className="text-gold-400" aria-hidden /> Navigation
        </span>
        <button
          ref={firstInteractiveRef}
          onClick={onClose}
          className="mega-close-btn"
          aria-label="Close navigation menu"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      {/* Three-column body */}
      <div className="mega-menu-body">
        {/* LEFT — section toggles */}
        <nav className="mega-menu-left-col" aria-label="Menu sections">
          <ul role="list" className="mega-section-list">
            {visibleSections.map((section, idx) => (
              <li key={section.id}>
                <button
                  className={`mega-section-btn ${activeSection === section.id ? 'mega-section-btn--active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                  aria-current={activeSection === section.id ? 'true' : undefined}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      const next = visibleSections[Math.min(idx + 1, visibleSections.length - 1)];
                      setActiveSection(next.id);
                    }
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      const prev = visibleSections[Math.max(idx - 1, 0)];
                      setActiveSection(prev.id);
                    }
                  }}
                >
                  <span className="mega-section-icon" aria-hidden>{section.icon}</span>
                  <span className="mega-section-label">{section.label}</span>
                  {sectionBadges[section.id]?.label && (
                    <span
                      className="ml-auto shrink-0 text-[9px] font-black text-white rounded-full px-1.5 py-0.5 leading-none"
                      style={{ background: sectionBadges[section.id].color }}
                    >
                      {sectionBadges[section.id].label}
                    </span>
                  )}
                  <ChevronRight size={14} className="mega-section-chevron" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* MIDDLE — links for active section */}
        <div className="mega-menu-mid-col" role="region" aria-label={`${currentSection.label} links`}>
          <p className="mega-mid-heading">{currentSection.label}</p>
          <ul role="list" className="mega-link-list">
            {currentSection.links.map(link => {
              const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to.split('?')[0].split('#')[0]));
              const needsAuth = link.requiresAuth && !user;
              return (
                <li key={link.to}>
                  {needsAuth ? (
                    <Link
                      to="/signin"
                      onClick={onClose}
                      className="mega-link mega-link--locked"
                    >
                      {link.label}
                      <span className="mega-lock-badge">Sign in</span>
                    </Link>
                  ) : (
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className={`mega-link ${isActive ? 'mega-link--active' : ''}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT — personalised panel */}
        <RightPanel />
      </div>
    </div>
  );

  // ── MOBILE DRAWER ──────────────────────────────────────────────────────────
  const MobileDrawer = () => (
    <div
      className={`mega-drawer ${isOpen ? 'mega-drawer--open' : ''}`}
      role="navigation"
      aria-label="Main navigation"
      aria-hidden={!isOpen}
      ref={menuRef}
    >
      {/* Drawer header */}
      <div className="mega-drawer-header">
        <span className="mega-menu-header-label">
          <Sparkles size={14} className="text-gold-400" aria-hidden /> Navigation
        </span>
        <button
          ref={firstInteractiveRef}
          onClick={onClose}
          className="mega-close-btn"
          aria-label="Close navigation menu"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      {/* Personal welcome */}
      <div className="mega-drawer-welcome">
        {user && !user.isGuest ? (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gold-400 shrink-0">
              <img src={user.photoURL || APP_CONFIG.AVATAR_MALE} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-black text-navy-900 leading-tight">
                Om Sai Ram, {honorific} {firstName}
              </p>
              <p className="text-[10px] text-navy-400 mt-0.5">{formatDate(today)}</p>
              {chantTotal > 0 && (
                <p className="text-[10px] text-gold-600 font-bold mt-0.5">
                  🔥 {chantTotal.toLocaleString()} chants · Day {userStreak} streak
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm font-bold text-navy-800">
            Om Sai Ram 🙏 &nbsp;
            <Link to="/signin" onClick={onClose} className="text-gold-600 underline">Sign in</Link>
          </p>
        )}
      </div>

      {/* Accordion sections */}
      <div className="mega-drawer-body">
        {visibleSections.map(section => {
          const isExpanded = expandedMobile === section.id;
          return (
            <div key={section.id} className="mega-accordion-item">
              <button
                className={`mega-accordion-header ${isExpanded ? 'mega-accordion-header--open' : ''}`}
                onClick={() => setExpandedMobile(isExpanded ? null : section.id)}
                aria-expanded={isExpanded}
              >
                <span className="flex items-center gap-3">
                  <span className="mega-section-icon" aria-hidden>{section.icon}</span>
                  <span className="mega-accordion-label">{section.label}</span>
                  {sectionBadges[section.id]?.label && (
                    <span
                      className="text-[9px] font-black text-white rounded-full px-1.5 py-0.5 leading-none"
                      style={{ background: sectionBadges[section.id].color }}
                    >
                      {sectionBadges[section.id].label}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {isExpanded && (
                <ul className="mega-accordion-body" role="list">
                  {section.links.map(link => {
                    const needsAuth = link.requiresAuth && !user;
                    const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to.split('?')[0].split('#')[0]));
                    return (
                      <li key={link.to}>
                        <Link
                          to={needsAuth ? '/signin' : link.to}
                          onClick={onClose}
                          className={`mega-drawer-link ${isActive ? 'mega-drawer-link--active' : ''}`}
                        >
                          {link.label}
                          {needsAuth && <span className="mega-lock-badge">Sign in</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom rotating card */}
      <div className="mega-drawer-card-wrap">
        <div className="mega-rotating-card" key={card.id}>
          <div className="mega-rotating-card-tag">
            {card.icon}
            <span>{card.tag}</span>
          </div>
          <p className="mega-rotating-card-body">{card.body}</p>
          <Link to={card.ctaTo} onClick={onClose} className="mega-rotating-card-cta">
            {card.cta} <ChevronRight size={12} aria-hidden />
          </Link>
        </div>
        {user && !user.isGuest && (
          <Link to={lastActiveModule} onClick={onClose} className="mega-cta-btn mt-3">
            <Zap size={15} aria-hidden />
            Continue where I left off
          </Link>
        )}
      </div>
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        className={`mega-backdrop ${isOpen ? 'mega-backdrop--open' : ''}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      {isMobile ? <MobileDrawer /> : <DesktopMenu />}
    </>
  );
};

export default MegaMenu;
