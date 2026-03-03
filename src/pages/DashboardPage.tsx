
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Heart, BookOpen, Activity, Award, Trophy, Medal, Lock, ArrowRight, Check, Shield, Briefcase, FileText, CheckCircle2, Sparkles, PartyPopper, Users, Target, Mic, Flame } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SaiAvatar from '../components/SaiAvatar';
import { UserBriefcaseItem, UserProfile } from '../types';
import { ToastContainer, useToast } from '../components/Toast';
import confetti from 'canvas-confetti';
import Skeleton from '../components/Skeleton';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { subscribeToNationalStats, NationalStats } from '../lib/nationalStats';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({
    gayathri: 0,
    saiGayathri: 0,
    likitha: 0,
    mantras: 0,
    booksRead: 0,
    streak: 0
  });

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'all-time'>('all-time');
  const [timeframeStats, setTimeframeStats] = useState({
    gayathri: 0,
    saiGayathri: 0,
    likitha: 0,
    mantras: 0
  });
  const [nationalStats, setNationalStats] = useState<NationalStats | null>(null);
  const [completedWeeks, setCompletedWeeks] = useState<string[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [briefcase, setBriefcase] = useState<UserBriefcaseItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { toasts, showToast, closeToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const savedProfile = localStorage.getItem('sms_user');
    if (!savedProfile) return;

    const initialUser = JSON.parse(savedProfile) as UserProfile;
    setUser(initialUser);

    if (initialUser.isGuest) {
      navigate('/?guest_redirect=true');
      return;
    }

    // 1. Real-time User Profile & Stats Subscription
    const userRef = doc(db, 'users', initialUser.uid);
    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data() as UserProfile;
        setUser(userData);

        const localStats = JSON.parse(localStorage.getItem(`sms_stats_${initialUser.uid}`) || '{"gayathri":0, "saiGayathri":0, "likitha":0, "mantras":0}');
        const fbStats = userData.stats || { gayathri: 0, saiGayathri: 0, likitha: 0, mantras: 0 };

        const currentCompletions = JSON.parse(localStorage.getItem(`sms_completions`) || '[]');

        setStats({
          gayathri: Math.max(localStats.gayathri || 0, fbStats.gayathri || 0),
          saiGayathri: Math.max(localStats.saiGayathri || 0, fbStats.saiGayathri || 0),
          likitha: Math.max(localStats.likitha || 0, fbStats.likitha || 0),
          mantras: Math.max(localStats.mantras || 0, fbStats.mantras || 0),
          streak: (userData as any).streak || 0,
          booksRead: currentCompletions.length
        });

        setIsLoading(false);
      }
    }, (err) => {
      console.error("Dashboard User Snapshot Error:", err);
      setIsLoading(false);
    });

    // 2. National Stats Subscription
    const unsubNational = subscribeToNationalStats((newStats) => {
      setNationalStats(newStats);
    });

    // 3. Load other local data
    const compWeeks = JSON.parse(localStorage.getItem(`sms_completions`) || '[]');
    const userBadges = JSON.parse(localStorage.getItem(`sms_badges`) || '[]');
    const userBriefcase = JSON.parse(localStorage.getItem(`sms_briefcase_${initialUser.uid}`) || '[]');

    setCompletedWeeks(compWeeks);
    setBadges(userBadges);
    setBriefcase(userBriefcase.reverse());

    // Check for welcome toasts
    const showNewWelcome = sessionStorage.getItem('sms_show_welcome') === 'new_user' || location.state?.isNew;
    const showReturningWelcome = sessionStorage.getItem('sms_show_welcome') === 'returning_user' || location.state?.isReturning;

    if (showNewWelcome) {
      const name = initialUser.name?.split(' ')[0] || 'Devotee';
      const title = initialUser.gender === 'female' ? 'Sis' : 'Bro';
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#D4AF37', '#FFD700'] });
      setTimeout(() => showToast(`Welcome to Sai SMS, ${title} ${name}! Om Sai Ram!`, 'success', 5000), 500);
      sessionStorage.removeItem('sms_show_welcome');
    } else if (showReturningWelcome) {
      const name = initialUser.name?.split(' ')[0] || 'Devotee';
      const title = initialUser.gender === 'female' ? 'Sis' : 'Bro';
      setTimeout(() => showToast(`Om Sai Ram, ${title} ${name}! Welcome back.`, 'info', 4000), 500);
      sessionStorage.removeItem('sms_show_welcome');
    }

    return () => {
      unsubUser();
      unsubNational();
    };
  }, [location.state]);

  // Fetch Timeframe Stats Whenever Timeframe changes
  useEffect(() => {
    if (!user || timeframe === 'all-time') {
      setTimeframeStats({
        gayathri: stats.gayathri,
        saiGayathri: stats.saiGayathri,
        likitha: stats.likitha,
        mantras: stats.mantras
      });
      return;
    }

    const fetchTimeframeData = async () => {
      try {
        const q = query(collection(db, 'sadhanaDaily'), where('userId', '==', user.uid));
        const snap = await getDocs(q);

        const now = new Date();
        const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
        const weekStartStr = currentWeekStart.toISOString().split('T')[0];

        const currentMonthPrefix = todayStr.substring(0, 7); // YYYY-MM

        let tg = 0, tsg = 0, tl = 0, tm = 0;

        snap.docs.forEach(d => {
          const data = d.data();
          const targetDate = data.date; // string YYYY-MM-DD
          let include = false;

          if (timeframe === 'today' && targetDate === todayStr) {
            include = true;
          } else if (timeframe === 'week' && targetDate >= weekStartStr && targetDate <= todayStr) {
            include = true;
          } else if (timeframe === 'month' && targetDate.startsWith(currentMonthPrefix)) {
            include = true;
          }

          if (include) {
            tg += data.gayathri || 0;
            tsg += data.saiGayathri || 0;
            tl += data.likitha || 0;
            tm += data.mantras || 0;
          }
        });

        setTimeframeStats({
          gayathri: tg,
          saiGayathri: tsg,
          likitha: tl,
          mantras: tm
        });
      } catch (err) {
        console.error("Error fetching timeframe stats:", err);
      }
    };

    fetchTimeframeData();
  }, [timeframe, user, stats]); // re-run if all-time stats update

  const chartData = [
    { name: 'Gayathri', value: timeframeStats.gayathri, color: '#ea7600' },
    { name: 'S.S. Gayathri', value: timeframeStats.saiGayathri, color: '#bf0449' },
    { name: 'Mantras', value: timeframeStats.mantras, color: '#5726bf' },
    { name: 'Likitha', value: timeframeStats.likitha * 11, color: '#1d4ed8' },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-16 w-32 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-80 w-full rounded-bento" />
            <Skeleton className="h-96 w-full rounded-bento" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-bento" />
            <Skeleton className="h-64 w-full rounded-bento" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12 relative animate-in fade-in duration-500">
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {user?.isGuest && (
        <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 text-center animate-in slide-in-from-top flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3 text-orange-800">
            <Lock size={20} />
            <span className="font-bold text-sm tracking-wide">Guest View: Your progress is not being saved</span>
          </div>
          <Link to="/signup" className="px-6 py-2 bg-navy-900 text-gold-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
            Sign Up Now
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-center md:text-left">
        <div className="flex items-center gap-6">
          <div className="hidden md:block p-1 bg-gold-gradient rounded-full shadow-lg">
            <SaiAvatar gender={user?.gender || 'male'} photoURL={user?.photoURL} size={80} />
          </div>
          <div>
            <h1 className="font-serif text-5xl font-bold text-navy-900 mb-2">Personal Dashboard</h1>
            <p className="text-navy-500 font-medium">Om Sai Ram, {user?.gender === 'female' ? 'Sis.' : 'Bro.'} {user?.name?.replace(/^(Sis|Bro|Brother|Sister)\.?\s+/i, '').split(' ')[0] || user?.name}. Your sacred growth in 2026.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-orange-500 text-white px-6 py-3 rounded-3xl flex items-center gap-3 shadow-lg shadow-orange-500/20 animate-bounce-subtle">
            <Flame size={20} className="fill-current" />
            <div className="text-left">
              <span className="block text-[8px] font-black uppercase tracking-widest opacity-70">Daily Streak</span>
              <span className="text-lg font-black">{stats.streak} Days</span>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur border border-navy-50 p-4 rounded-3xl flex items-center gap-3">
            <Award size={20} className="text-gold-500" />
            <div className="text-left">
              <span className="block text-[8px] font-black uppercase tracking-widest text-navy-300">Spiritual Rank</span>
              <span className="text-xs font-bold text-navy-900">{stats.booksRead >= 4 ? 'Devoted Student' : 'New Sadhaka'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* National Quick View */}
      {nationalStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-navy-900 p-6 rounded-3xl text-white flex items-center gap-6 group hover:translate-y-[-2px] transition-all">
            <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform"><Users size={24} className="text-gold-500" /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-navy-300">National Participants</p>
              <p className="text-2xl font-black">{nationalStats.totalParticipants.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[#bf0449] p-6 rounded-3xl text-white flex items-center gap-6 group hover:translate-y-[-2px] transition-all">
            <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform"><Mic size={24} className="text-white" /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Total National Chants</p>
              <p className="text-2xl font-black">{nationalStats.totalChants.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[#009688] p-6 rounded-3xl text-white flex items-center gap-6 group hover:translate-y-[-2px] transition-all">
            <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform"><Target size={24} className="text-white" /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/70">National Goal Progress</p>
              <p className="text-2xl font-black">{nationalStats.goalPercent}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Namasmarana Chart */}
          <div className="bg-white p-10 rounded-bento shadow-xl border border-navy-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h3 className="text-2xl font-serif font-bold text-navy-900">Namasmarana Distribution</h3>
              <div className="flex bg-neutral-100 p-1 rounded-xl">
                {(['today', 'week', 'month', 'all-time'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-white text-navy-900 shadow border border-navy-50' : 'text-navy-400 hover:text-navy-900'}`}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f9f9f9' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MY BRIEFCASE SECTION */}
          <div className="bg-white p-10 rounded-bento shadow-xl border border-navy-50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-navy-900 text-gold-500 rounded-2xl"><Briefcase size={24} /></div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-navy-900">My Briefcase</h3>
                <p className="text-xs text-navy-400 font-bold uppercase tracking-widest">Saved Quizzes & Reflections</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {briefcase.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <FileText size={40} className="mx-auto mb-4 text-navy-300" />
                  <p className="text-sm font-medium text-navy-600 mb-6">Your briefcase is empty. Complete Book Club chapters to save results here.</p>
                  <Link to="/book-club" className="inline-block px-6 py-2.5 bg-navy-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 transition-colors">Go to Book Club</Link>
                </div>
              ) : (
                briefcase.filter(item => item != null).map(item => (
                  <div key={item.id} className="p-6 rounded-3xl border border-navy-50 hover:shadow-md transition-shadow bg-neutral-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${item.type === 'quiz_result' ? 'bg-gold-100 text-gold-700' : item.type === 'word_card' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {item.type === 'quiz_result' ? 'Quiz Result' : item.type === 'word_card' ? 'Word Card' : 'Reflection'}
                      </span>
                      <span className="text-[10px] font-bold text-navy-300">{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}</span>
                    </div>
                    <h4 className="font-bold text-navy-900 mb-2">{item.title || ''}</h4>
                    {item.type === 'quiz_result' ? (
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-navy-900">{item.content?.score ?? '—'}%</span>
                        <div className="h-2 flex-grow bg-white rounded-full overflow-hidden border border-navy-50">
                          <div className="h-full bg-gold-500" style={{ width: `${item.content?.score ?? 0}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-navy-600 italic line-clamp-2">"{typeof item.content === 'string' ? item.content : ''}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Badges & Summary */}
        <div className="space-y-8">
          <div id="tutorial-dashboard" className="bg-navy-900 p-10 rounded-bento text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Activity size={120} /></div>
            <h3 className="text-xl font-bold mb-6 text-gold-500">Sacred Summary {timeframe !== 'all-time' ? `(${timeframe})` : ''}</h3>
            <div className="space-y-6">
              <Link to="/namasmarana" className="flex justify-between items-center pb-4 border-b border-white/10 group cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors">
                <span className="text-xs text-navy-300 font-bold uppercase group-hover:text-gold-500 transition-colors">Total Chants</span>
                <span className="text-2xl font-black text-gold-500">{(timeframeStats.gayathri + timeframeStats.saiGayathri + (timeframeStats.likitha * 11)).toLocaleString()}</span>
              </Link>
              <Link to="/namasmarana" className="flex justify-between items-center pb-4 border-b border-white/10 group cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors">
                <span className="text-xs text-navy-300 font-bold uppercase group-hover:text-gold-500 transition-colors">Japam Units</span>
                <span className="text-2xl font-black text-white">{timeframeStats.likitha}</span>
              </Link>
              <Link to="/book-club" className="flex justify-between items-center group cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors">
                <span className="text-xs text-navy-300 font-bold uppercase group-hover:text-gold-500 transition-colors">Chapters Read</span>
                <span className="text-2xl font-black text-white">{stats.booksRead} / 52</span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-10 rounded-bento shadow-xl border border-navy-50">
            <Link to="/profile" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
              <h3 className="text-xl font-serif font-bold text-navy-900 flex items-center gap-2">
                <Medal size={20} className="text-gold-500" /> Earned Badges
              </h3>
            </Link>
            <div className="flex flex-wrap gap-4">
              {badges.length > 0 ? badges.filter((b: any) => b != null).map((b: any, i: number) => (
                <div key={i} title={b.title || ''} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md border-2 animate-in zoom-in duration-300 ${b.type === 'elite' || b.title?.includes('Golden') || b.title?.includes('Scholar') ? 'bg-gold-100 text-gold-600 border-gold-300' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                  <Trophy size={28} />
                </div>
              )) : (
                <div className="text-center py-8 w-full bg-neutral-50 rounded-2xl border border-navy-50">
                  <Medal size={40} className="mx-auto mb-4 text-navy-200" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy-400 mb-6">No badges yet</p>
                  <Link to="/games" className="inline-block px-6 py-2 bg-navy-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gold-500 transition-colors">Play Games to Earn</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
            animation: bounce-subtle 2s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f0f4f8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d2ac47; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default DashboardPage;
