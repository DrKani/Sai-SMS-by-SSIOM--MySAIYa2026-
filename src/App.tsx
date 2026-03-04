import React, { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, sendEmailVerification, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, onSnapshot, collection, query, where, orderBy, writeBatch } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import TutorialOverlay, { TutorialStep } from './components/TutorialOverlay';
import {
  Menu, X, Bell, LogOut, ChevronRight, Search,
  MapPin, ShieldCheck, UserCircle,
  Home, ArrowUp, Phone, LogIn,
  Megaphone, Calendar, Sparkles, CheckCheck,
  Library, Gamepad2, Heart, MessageSquare, Activity, Loader2, Trophy,
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
  Music
} from 'lucide-react';

import { UserProfile, Announcement, BrandingConfig, SiteContent, AppNotification } from './types';
import { ANNUAL_STUDY_PLAN, APP_CONFIG, ADMIN_CONFIG, DEFAULT_SITE_CONTENT } from './constants';

import NotificationDrawer from './components/NotificationDrawer';
import CookieConsent from './components/CookieConsent';
import MenuLink from './components/MenuLink';
import EmailVerification from './components/EmailVerification';
import ProfileDropdown from './components/ProfileDropdown';
import EnhancedSearchBar from './components/EnhancedSearchBar';
import NotificationBell from './components/NotificationBell';
import MultiFunctionFAB from './components/MultiFunctionFAB';
import EnhancedTickerBar from './components/EnhancedTickerBar';
import Footer from './components/Footer';
import OfflineBanner from './components/OfflineBanner';
import { usePushNotifications } from './hooks/usePushNotifications';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ChantingPage = lazy(() => import('./pages/ChantingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BookClubPage = lazy(() => import('./pages/BookClubPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
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

const APP_TUTORIAL_STEPS: TutorialStep[] = [
  { target: 'tutorial-welcome', title: 'Welcome to Sai SMS', text: 'Your digital companion for the 2026 National Sadhana Journey.' },
  { target: 'tutorial-ticker', title: 'Live Updates', text: 'Urgent announcements and divine thoughts will appear here.' },
  { target: 'tutorial-namasmarana', title: 'Namasmarana Count', text: 'Submit your daily mantra counts here. Every chant matters.' },
  { target: 'tutorial-bookclub', title: 'Sai Lit Club', text: 'Access weekly readings from Swami\'s books and take quizzes.' },
  { target: 'tutorial-dashboard', title: 'My Progress', text: 'Track your personal growth and spiritual milestones here.' }
];

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
  const [showAppTutorial, setShowAppTutorial] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tickerMessage, setTickerMessage] = useState(`Welcome to ${APP_CONFIG.NAME} ${APP_CONFIG.TAGLINE} • Supporting Malaysian Sai devotees in their spiritual journey.`);

  const navigate = useNavigate();
  const location = useLocation();

  const [branding, setBranding] = useState<BrandingConfig>({
    logoHeader: APP_CONFIG.LOGO,
    logoFooter: APP_CONFIG.LOGO_FOOTER || APP_CONFIG.LOGO,
    logoAuth: APP_CONFIG.LOGO,
    favicon: APP_CONFIG.LOGO,
    pwaIcon: APP_CONFIG.LOGO
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthChecking, setIsAuthChecking] = useState(() => !localStorage.getItem('sms_user'));
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { permissionStatus, requestPermission } = usePushNotifications(user);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);

          // SEC-04: Admin routes protected by Firebase custom claims AND client-side guard
          let claims: any = {};
          try {
            const tokenResult = await firebaseUser.getIdTokenResult();
            claims = tokenResult.claims;
          } catch (e) {
            console.error("Custom claims fetch error", e);
          }

          // Use onSnapshot for real-time profile updates (streaks, badges, etc.)
          profileUnsubscribe = onSnapshot(docRef, (docSnap) => {
            let profileData: Partial<UserProfile> = docSnap.exists() ? docSnap.data() as UserProfile : {};
            const adminEmail = firebaseUser.email?.toLowerCase();
            const isAdminUser = claims.admin || profileData.isAdmin || (adminEmail && ADMIN_CONFIG.AUTHORIZED_EMAILS.includes(adminEmail));
            const profile: UserProfile = {
              uid: firebaseUser.uid,
              name: profileData.name || firebaseUser.displayName || 'Devotee',
              email: firebaseUser.email || '',
              photoURL: profileData.photoURL || firebaseUser.photoURL || APP_CONFIG.AVATAR_MALE,
              joinedAt: profileData.joinedAt || new Date().toISOString(),
              isGuest: firebaseUser.isAnonymous,
              isAdmin: !!isAdminUser,
              onboardingDone: !!profileData.onboardingDone,
              onboardedApp: !!profileData.onboardedApp,
              state: profileData.state || '',
              centre: profileData.centre || '',
              ...profileData
            };
            setUser(profile);
            localStorage.setItem('sms_user', JSON.stringify(profile));

            // Show tutorial if not done
            if (!profile.onboardedApp && !profile.isGuest && !showAppTutorial) {
              setTimeout(() => setShowAppTutorial(true), 1500);
            }
          }, (error) => {
            console.error("Profile snapshot error:", error);
          });
        } catch (error) {
          console.error("Error setting up profile snapshot:", error);
          setUser({ uid: firebaseUser.uid, name: firebaseUser.displayName || 'Devotee', email: firebaseUser.email || '', photoURL: firebaseUser.photoURL || APP_CONFIG.AVATAR_MALE, joinedAt: new Date().toISOString(), isGuest: firebaseUser.isAnonymous, isAdmin: false, state: '', onboardingDone: false, centre: '' });
        }
      } else {
        setUser(null);
        localStorage.removeItem('sms_user');
      }
      setIsAuthChecking(false);
    });

    // CRITICAL: If Firebase onAuthStateChanged never fires (SDK crash / network down),
    // unblock the UI after 3 seconds so users can browse as guest.
    const authTimeout = setTimeout(() => setIsAuthChecking(false), 3000);

    const refreshData = () => {
      const brand = localStorage.getItem('sms_branding_config');
      if (brand) setBranding(JSON.parse(brand));
      const msg = localStorage.getItem('sms_ticker_message');
      if (msg) setTickerMessage(msg);
      const content = localStorage.getItem('sms_site_content');
      if (content) setSiteContent(JSON.parse(content));
    };

    refreshData();
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', refreshData);

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
      });
    } else {
      setNotifications([]);
    }

    return () => {
      unsubscribe();
      unsubNotifications();
      unsubAnnouncements();
      clearTimeout(authTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', refreshData);
    };
  }, [user?.uid, user?.isGuest]);

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
      <NavigationListener onNavigate={() => { setSearchQuery(""); setIsSearchOpen(false); setIsMenuOpen(false); }} />
      <OfflineBanner />
      <CookieConsent />
      <MultiFunctionFAB showScrollTop={showScrollTop} onScrollTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <EnhancedTickerBar message={tickerMessage} onClickMessage={() => navigate('/announcements')} />

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
          <EnhancedSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} searchResults={searchResults} onSelect={(link) => { navigate(link); setIsSearchOpen(false); setSearchQuery(""); }} placeholder="Search resources..." />
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <NotificationBell unreadCount={unreadCount} onClick={() => setIsNotifOpen(true)} />
            {isAdmin && <Link to="/admin" className="btn-admin hidden lg:flex items-center gap-2"><ShieldCheck size={14} /> Admin</Link>}
            <ProfileDropdown user={user} isAdmin={isAdmin} onLogout={() => setShowLogoutConfirm(true)} />
            <button onClick={() => setIsMenuOpen(true)} className="hamburger-btn p-2 min-h-[44px] min-w-[44px] text-navy-900 hover:text-purple-600 transition-colors flex items-center justify-center rounded-xl hover:bg-navy-50">
              <Menu size={28} /><span className="sr-only">Menu</span>
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
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/setup" element={<ProtectedRoute user={user}><SetupPage /></ProtectedRoute>} />
            <Route path="/admin" element={isAdmin ? <AdminPage user={user} /> : <Navigate to="/" />} />
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

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="mobile-nav-overlay absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="mobile-nav-drawer relative w-80 h-full bg-white shadow-2xl p-8 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 min-h-[44px] min-w-[44px] text-navy-200 hover:text-navy-900 hover:bg-neutral-100 rounded-full transition-all flex items-center justify-center"><X size={32} /></button>
            <div className="mt-16 space-y-12 flex-grow">
              {user?.isGuest && (
                <div className="px-4 py-3 bg-neutral-100 rounded-2xl flex items-center gap-3 border-2 border-neutral-200">
                  <UserCircle size={20} className="text-navy-400" />
                  <div><p className="text-xs font-bold text-navy-900">Browsing as Guest</p><p className="text-[10px] text-navy-500"><Link to="/signup" className="text-gold-600 font-bold hover:underline" onClick={() => setIsMenuOpen(false)}>Sign up</Link> to access all</p></div>
                </div>
              )}
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-navy-300 mb-6 px-4">Navigation</h3>
              <nav className="space-y-1">
                <MenuLink to="/" label="Home" icon={<Home size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/'} />
                <MenuLink to="/calendar" label="National Calendar" icon={<Calendar size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/calendar'} />
                <MenuLink to="/events" label="National Events" icon={<Sparkles size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/events')} />
                <MenuLink to="/contact" label="Contact Us" icon={<Phone size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/contact'} />

                {user ? (
                  <>
                    <MenuLink to="/dashboard" label="My Dashboard" icon={<Activity size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/dashboard'} />
                    <MenuLink to="/namasmarana" label="Mantra Tracking" icon={<Mic size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/namasmarana'} />
                    <MenuLink to="/leaderboard" label="Leaderboard" icon={<Trophy size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/leaderboard'} />
                    <MenuLink to="/book-club" label="Sai Lit Club" icon={<Library size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/book-club')} />
                    <MenuLink to="/games" label="Play it" icon={<Gamepad2 size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/games'} />
                    <MenuLink to="/journal" label="Reflections" icon={<ScrollText size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/journal'} />
                    <MenuLink to="/articles" label="Articles" icon={<PenTool size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/articles')} />
                    <MenuLink to="/profile" label="Profile" icon={<UserCircle size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/profile'} />
                  </>
                ) : (
                  <>
                    <MenuLink to="/signin" label="Sign In" icon={<LogIn size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/signin'} />
                    <MenuLink to="/signup" label="Sign Up" icon={<UserPlus size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/signup'} />
                    <MenuLink to="/namasmarana" label="Mantra Tracking" icon={<Mic size={18} />} onClick={() => setIsMenuOpen(false)} isProtected isLocked />
                    <MenuLink to="/book-club" label="Sai Lit Club" icon={<Library size={18} />} onClick={() => setIsMenuOpen(false)} isProtected isLocked />
                    <MenuLink to="/articles" label="Articles" icon={<PenTool size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname.startsWith('/articles')} />
                  </>
                )}
                {isAdmin && <MenuLink to="/admin" label="Admin Hub" icon={<Shield size={18} />} onClick={() => setIsMenuOpen(false)} isActive={location.pathname === '/admin'} />}
              </nav>
            </div>
            {user && (
              <div className="mt-12 pt-6 border-t border-navy-50 shrink-0">
                <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center justify-between min-h-[44px] py-3.5 px-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all font-black uppercase tracking-widest text-[10px]">
                  <div className="flex items-center gap-4"><LogOut size={18} /><span>Sign Out</span></div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
        <TutorialOverlay
          steps={APP_TUTORIAL_STEPS}
          isVisible={showAppTutorial}
          onComplete={() => { setShowAppTutorial(false); markAppTutorialDone(); }}
          onSkip={() => { setShowAppTutorial(false); markAppTutorialDone(); }}
          storageKey="sms_app_onboarding"
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
