import React, { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, sendEmailVerification, User as FirebaseUser } from 'firebase/auth';
import { doc, updateDoc, onSnapshot, collection, query, where, orderBy, writeBatch } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import OnboardingTour from './components/OnboardingTour';
import {
  Menu, X, Bell, LogOut, ChevronRight, Search,
  MapPin, ShieldCheck, UserCircle,
  Home, Activity, Phone, LogIn,
  Megaphone, Calendar, Sparkles, CheckCheck,
  Library, Gamepad2, Heart, MessageSquare, Loader2, Trophy,
  ExternalLink,
  MessageCircle,
  Globe,
  UserPlus,
  Shield,
  PenTool,
  Info,
  Mic,
  ScrollText,
  HeartPulse,
  Mail,
  Youtube,
  Instagram,
  Facebook,
  Music,
  BookOpen
} from 'lucide-react';

import { UserProfile, Announcement, BrandingConfig, SiteContent, AppNotification } from './types';
import { ANNUAL_STUDY_PLAN, APP_CONFIG, ADMIN_CONFIG, DEFAULT_SITE_CONTENT } from './constants';

import NotificationDrawer from './components/NotificationDrawer';
import CookieConsent from './components/CookieConsent';
import MenuLink from './components/MenuLink';
import EmailVerification from './components/EmailVerification';
import ProfileDropdown from './components/ProfileDropdown';
import Tooltip from './components/Tooltip';
import EnhancedSearchBar from './components/EnhancedSearchBar';
import NotificationBell from './components/NotificationBell';
import MultiFunctionFAB from './components/MultiFunctionFAB';
import EnhancedTickerBar from './components/EnhancedTickerBar';
import Footer from './components/Footer';
import OfflineBanner from './components/OfflineBanner';
import MegaMenu from './components/MegaMenu';
import { usePushNotifications } from './hooks/usePushNotifications';
import { buildUserProfile, subscribeToMemberProfile } from './services/memberService';
import { useOnboardingState } from './hooks/useOnboardingState';
import { DEFAULT_SITE_CONFIG, subscribeToSiteConfig } from './services/siteConfigService';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ChantingPage = lazy(() => import('./pages/ChantingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BookClubPage = lazy(() => import('./pages/BookClubPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const CreateAnnouncementPage = lazy(() => import('./pages/CreateAnnouncementPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const SetupPage = lazy(() => import('./pages/SetupPage'));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Copyright = lazy(() => import('./pages/Copyright'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CommunityGuidelines = lazy(() => import('./pages/CommunityGuidelines'));
const ContentSubmissionGuidelines = lazy(() => import('./pages/ContentSubmissionGuidelines'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

const PageLoader = () => (
  <div className="flex-grow flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={48} className="text-gold-500 animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-navy-300">Syncing with Swami...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, user, allowGuest = false }: { children: React.ReactNode, user: UserProfile | null, allowGuest?: boolean }) => {
  const location = useLocation();
  if (!user) return <Navigate to="/signin" state={{ from: location }} replace />;

  // Block guests from non-guest pages
  if (user.isGuest && !allowGuest) {
    return <Navigate to="/signup" state={{ from: location, message: "Sign up to unlock this feature!" }} replace />;
  }

  const isEffectivelyOnboarded = user.onboardingDone || (!!user.name && user.name !== 'Devotee' && !!user.state);
  if (!isEffectivelyOnboarded && location.pathname !== '/setup' && !user.isGuest) return <Navigate to="/setup" replace />;
  if (isEffectivelyOnboarded && location.pathname === '/setup' && !user.isGuest) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const NavigationListener = ({ onNavigate }: { onNavigate: () => void }) => {
  const location = useLocation();
  const onNavigateRef = useRef(onNavigate);
  useEffect(() => { onNavigateRef.current = onNavigate; }, [onNavigate]);
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 50);
    onNavigateRef.current();
  }, [location.pathname]);
  return null;
};


const BottomNav: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const location = useLocation();
  const navItems = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/namasmarana', label: 'Offer', icon: <Mic size={20} /> },
    { to: '/book-club', label: 'Lit Club', icon: <Library size={20} /> },
    { to: user ? '/dashboard' : '/signin', label: user ? 'Stats' : 'Sign In', icon: <Activity size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-navy-50 flex justify-around items-center px-2 py-3 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-gold-600' : 'text-navy-300'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-gold-50 shadow-sm' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tickerMessage, setTickerMessage] = useState(DEFAULT_SITE_CONFIG.tickerMessage);

  const navigate = useNavigate();
  const location = useLocation();

  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_SITE_CONFIG.branding);

  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONFIG.siteContent);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { permissionStatus, requestPermission } = usePushNotifications(user);
  const { showAppTutorial, openAppTutorial, closeAppTutorial } = useOnboardingState(user);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (firebaseUser) {
        try {
          let claims: any = {};
          try {
            const tokenResult = await firebaseUser.getIdTokenResult();
            claims = tokenResult.claims;
          } catch (e) {
            console.error("Custom claims fetch error", e);
          }

          profileUnsubscribe = subscribeToMemberProfile(firebaseUser.uid, (profileData) => {
            const adminEmail = firebaseUser.email?.toLowerCase();
            const allowedAdminEmails = ADMIN_CONFIG.AUTHORIZED_EMAILS.map((email: string) => email.toLowerCase());
            const isAdminUser = !!claims.admin || !!profileData?.isAdmin || !!(adminEmail && allowedAdminEmails.includes(adminEmail));
            const profile = buildUserProfile(firebaseUser, profileData, { isAdmin: isAdminUser });
            setUser(profile);
            localStorage.setItem('sms_user', JSON.stringify(profile));
            setIsAuthChecking(false);
          }, (error) => {
            console.error("Profile snapshot error:", error);
            setIsAuthChecking(false);
          });
        } catch (error) {
          console.error("Error setting up profile snapshot:", error);
          setUser(buildUserProfile(firebaseUser, null, { isAdmin: false }));
          setIsAuthChecking(false);
        }
      } else {
        setUser(null);
        localStorage.removeItem('sms_user');
        setIsAuthChecking(false);
      }
    });

    // CRITICAL: If Firebase onAuthStateChanged never fires (SDK crash / network down),
    // unblock the UI after 3 seconds so users can browse as guest.
    const authTimeout = setTimeout(() => setIsAuthChecking(false), 1200);

    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    // Replay tour when dispatched from the Home page Replay button
    const handleReplayTour = () => openAppTutorial();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('sms:replayTour', handleReplayTour);

    const unsubSiteConfig = subscribeToSiteConfig((config) => {
      setBranding(config.branding);
      setTickerMessage(config.tickerMessage);
      setSiteContent(config.siteContent);
    }, (error) => {
      console.warn('Site config subscription error:', error);
    });

    const unsubAnnouncements = onSnapshot(
      query(collection(db, 'announcements'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const anns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
        setAnnouncements(anns);
      },
      (error) => console.error("Announcements fetch error:", error)
    );

    let unsubNotifications: () => void = () => { };
    if (user && !user.isGuest) {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      unsubNotifications = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AppNotification[];
        setNotifications(notifs);
      }, (error) => {
        // Gracefully handle missing Firestore composite index — notifications simply won't load.
        // Create the index via: Firebase Console > Firestore > Indexes > Add composite index on 'notifications' (uid ASC, createdAt DESC)
        console.warn('Notifications query error (may require Firestore composite index):', error.message);
        setNotifications([]);
      });
    } else {
      setNotifications([]);
    }

    return () => {
      unsubscribe();
      unsubNotifications();
      unsubAnnouncements();
      unsubSiteConfig();
      clearTimeout(authTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('sms:replayTour', handleReplayTour);
    };
  }, [user?.uid, user?.isGuest, openAppTutorial]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      setShowLogoutConfirm(false);
      navigate('/signin');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const markAppTutorialDone = async () => {
    if (!user || user.isGuest) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { onboardedApp: true });
      const updated = { ...user, onboardedApp: true };
      localStorage.setItem('sms_user', JSON.stringify(updated));
      setUser(updated);
    } catch (e) {
      console.warn('Could not mark tutorial done in Firestore:', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.isRead && n.id).forEach(n => {
        batch.update(doc(db, 'notifications', n.id as string), { isRead: true });
      });
      await batch.commit();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };
  const isAdmin = user && !user.isGuest && (user.isAdmin || (user.email && ADMIN_CONFIG.AUTHORIZED_EMAILS.map((e: string) => e.toLowerCase()).includes(user.email.toLowerCase())));

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const lowerQ = searchQuery.toLowerCase();
    const matches: any[] = [];
    const pages = [
      { title: 'Namasmarana Tracker', link: '/namasmarana', category: 'Offering', icon: <Mic size={18} />, color: 'bg-orange-50 text-orange-600' },
      { title: 'Sai Lit Club (Book Club)', link: '/book-club', category: 'Study', icon: <Library size={18} />, color: 'bg-magenta-50 text-magenta-600' },
      { title: 'Personal Dashboard', link: '/dashboard', category: 'Progress', icon: <Activity size={18} />, color: 'bg-indigo-50 text-indigo-600' },
      { title: 'Games & Puzzles', link: '/games', category: 'Edutainment', icon: <Gamepad2 size={18} />, color: 'bg-gold-50 text-gold-700' },
      { title: 'Spiritual Journal', link: '/journal', category: 'Sadhana', icon: <ScrollText size={18} />, color: 'bg-teal-50 text-teal-600' },
      { title: 'Events Calendar', link: '/calendar', category: 'National', icon: <Calendar size={18} />, color: 'bg-blue-50 text-blue-600' },
      { title: 'Articles & Reflections', link: '/articles', category: 'Knowledge', icon: <PenTool size={18} />, color: 'bg-purple-50 text-purple-600' }
    ];
    pages.forEach(p => { if (p.title.toLowerCase().includes(lowerQ)) matches.push(p); });
    ANNUAL_STUDY_PLAN.forEach(w => {
      if (w.chapterTitle.toLowerCase().includes(lowerQ) || w.topic.toLowerCase().includes(lowerQ) || w.weekId.toLowerCase().includes(lowerQ)) {
        matches.push({ title: w.chapterTitle, link: `/book-club/${w.weekId}`, category: 'Book Club', subLabel: w.weekId, snippet: w.topic, icon: <Library size={18} />, color: 'bg-magenta-50 text-magenta-600' });
      }
    });
    return matches.slice(0, 10);
  }, [searchQuery]);

  if (isAuthChecking) return <PageLoader />;

  return (
    <div className="flex flex-col min-h-screen">
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#D2AC47" offset="0%" />
            <stop stopColor="#F7EF8A" offset="100%" />
          </linearGradient>
        </defs>
      </svg>
      <NavigationListener onNavigate={() => { setSearchQuery(""); setIsSearchOpen(false); setIsMenuOpen(false); }} />
      <OfflineBanner />
      <CookieConsent />
      <MultiFunctionFAB showScrollTop={showScrollTop} onScrollTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <EnhancedTickerBar
        message={announcements.filter(a => a.status === 'active' && a.displaySettings?.showInTicker && a.ticker?.enabled).length > 0
          ? announcements.filter(a => a.status === 'active' && a.displaySettings?.showInTicker && a.ticker?.enabled).map(a => a.ticker?.text || a.title).join(' ⟡ ')
          : tickerMessage}
        onClickMessage={() => navigate('/announcements')}
      />

      {user && !user.isGuest && !auth.currentUser?.emailVerified && (
        <div className="bg-gold-500 text-navy-900 py-3 px-4 text-center text-[10px] font-bold uppercase tracking-widest relative z-[40] animate-in slide-in-from-top">
          Your email is not verified. <button onClick={() => { auth.currentUser && sendEmailVerification(auth.currentUser).then(() => alert("Verification email sent!")); }} className="underline decoration-2 ml-1">Resend verification link</button>
        </div>
      )}

      <header className="navbar site-header sticky top-10 z-[50] bg-white shadow-md h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border border-navy-50">
              <img src={branding.logoHeader} className="w-full h-full object-contain" alt="Logo" />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="brand-text font-serif font-bold text-navy-900 text-lg leading-tight uppercase">{APP_CONFIG.NAME}</span>
              <span className="brand-subtitle text-[10px] text-navy-500 font-medium tracking-wide">{APP_CONFIG.TAGLINE}</span>
            </div>
          </Link>
          <div id="tour-search" className="flex-grow max-w-xl relative">
            <EnhancedSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchResults={searchResults} onSelect={(link) => { navigate(link); setIsSearchOpen(false); setSearchQuery(""); }} placeholder="Search resources..." />
          </div>
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <NotificationBell unreadCount={unreadCount} onClick={() => setIsNotifOpen(true)} />
            {isAdmin && <Link to="/admin" className="btn-admin hidden lg:flex items-center gap-2"><ShieldCheck size={14} /> Admin</Link>}
            <div id="tour-avatar">
              <ProfileDropdown user={user} isAdmin={isAdmin} onLogout={() => setShowLogoutConfirm(true)} />
            </div>
            <button
              id="tour-hamburger"
              onClick={() => setIsMenuOpen(true)}
              title="Menu"
              className={`hamburger-btn group p-2 min-h-[44px] min-w-[44px] transition-all flex items-center justify-center rounded-xl hover:bg-white/10 hover:ring-2 hover:ring-[#D2AC47]/70 hover:ring-offset-1 hover:ring-offset-transparent ${isMenuOpen ? 'open ring-2 ring-[#D2AC47] bg-white/10' : ''}`}
            >
              <Menu size={28} className="text-white group-hover:[stroke:url(#goldGradient)] group-[.open]:[stroke:url(#goldGradient)] transition-all duration-300" />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onClearAll={handleClearAll}
        onEnablePush={requestPermission}
        pushPermissionStatus={permissionStatus}
      />

      <main className="flex-grow flex flex-col pb-20 lg:pb-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={user && !user.isGuest ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/signup" element={user && !user.isGuest ? <Navigate to="/dashboard" /> : <SignupPage />} />
            <Route path="/namasmarana" element={<ProtectedRoute user={user}><ChantingPage /></ProtectedRoute>} />
            <Route path="/book-club" element={<ProtectedRoute user={user}><BookClubPage /></ProtectedRoute>} />
            <Route path="/book-club/:weekId" element={<ProtectedRoute user={user}><BookClubPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute user={user}><DashboardPage /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute user={user}><GamesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user}><ProfilePage /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute user={user}><JournalPage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute user={user}><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/articles" element={<ArticlesPage user={user} />} />
            <Route path="/articles/:articleId" element={<ArticlesPage user={user} />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/setup" element={<ProtectedRoute user={user}><SetupPage /></ProtectedRoute>} />
            <Route path="/admin" element={isAdmin ? <AdminPage user={user} /> : <Navigate to="/" />} />
            <Route path="/admin/announcements/create" element={isAdmin ? <CreateAnnouncementPage /> : <Navigate to="/" />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/copyright" element={<Copyright />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/submission-guidelines" element={<ContentSubmissionGuidelines />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer user={user} branding={branding} siteContent={siteContent} />

      <MegaMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        isAdmin={!!isAdmin}
        userStreak={user?.streak ?? 0}
        bookClubProgress={user?.stats ? 'Week 2 · In progress' : ''}
        lastActiveModule={user ? '/dashboard' : '/signin'}
        announcements={announcements}
      />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-md" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><LogOut size={32} /></div>
            <h3 className="text-2xl font-serif font-bold mb-2">Sign Out</h3>
            <p className="text-navy-500 text-sm mb-8 font-medium">Are you sure you want to sign out?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-4 bg-neutral-100 text-navy-900 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-neutral-200">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/30">Confirm</button>
            </div>
          </div>
        </div>
      )}
      {showAppTutorial && (
        <OnboardingTour
          userName={user?.name}
          onComplete={() => { closeAppTutorial(); markAppTutorialDone(); }}
          onSkip={() => { closeAppTutorial(); markAppTutorialDone(); }}
        />
      )}
      <BottomNav user={user} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
