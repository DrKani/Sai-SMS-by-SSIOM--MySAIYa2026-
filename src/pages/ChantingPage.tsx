import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Minus, Plus, Send, CheckCircle2, Sparkles, Lock, Check, UserPlus, X, AlertTriangle, RotateCcw, AlertCircle } from 'lucide-react';
import { DEFAULT_SITE_CONTENT } from '../constants';
import { SiteContent } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, increment as firebaseIncrement, query, where, getDocs, limit } from 'firebase/firestore';
import { recordSadhanaOffering, toMantraType } from '../lib/nationalStats';

const AvatarOption = ({ gender, selected, onClick }: { gender: 'male' | 'female', selected: boolean, onClick: () => void }) => (
  <button type="button" onClick={onClick} className={`group relative flex flex-col items-center gap-2 transition-all ${selected ? 'scale-110' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}>
    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all ${selected ? 'border-gold-500 bg-gold-50' : 'border-neutral-100 bg-neutral-100'}`}>
      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${gender === 'male' ? 'Felix' : 'Anita'}`} alt={gender} className="w-full h-full object-cover" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-navy-900">{gender}</span>
    {selected && (
      <div className="absolute -top-1 -right-1 bg-gold-500 text-navy-900 rounded-full p-0.5 border-2 border-white shadow-sm">
        <Check size={10} strokeWidth={4} />
      </div>
    )}
  </button>
);

const ChantingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [chantingType, setChantingType] = useState<'Gayathri' | 'SaiGayathri'>(() => {
    const type = searchParams.get('type');
    return (type === 'saiGayathri' || type === 'SaiGayathri') ? 'SaiGayathri' : 'Gayathri';
  });
  const [formData, setFormData] = useState({ count: 108 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  // Likitha Japam State
  const [likithaText, setLikithaText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sms_user');
    if (saved) setUser(JSON.parse(saved));

    const content = localStorage.getItem('sms_site_content');
    if (content) setSiteContent(JSON.parse(content));
  }, []);

  const increment = () => setFormData({ count: formData.count + 1 });
  const decrement = () => setFormData({ count: Math.max(0, formData.count - 1) });

  const updateStats = async (type: 'gayathri' | 'saiGayathri' | 'likitha', value: number) => {
    if (!user || user.isGuest) return;

    const realChantCount = type === 'likitha' ? (value * 11) : value;

    if (!navigator.onLine) {
      const { saveOfflineSubmission } = await import('../lib/offlineQueue');
      await saveOfflineSubmission({
        userId: user.uid,
        state: user.state || 'Other',
        type,
        value,
        realChantCount
      });

      // Update Personal Stats in LocalStorage
      const userStatsKey = `sms_stats_${user.uid}`;
      const userStats = JSON.parse(localStorage.getItem(userStatsKey) || '{"gayathri":0, "saiGayathri":0, "likitha":0}');
      userStats[type] += value;
      localStorage.setItem(userStatsKey, JSON.stringify(userStats));
      window.dispatchEvent(new Event('storage'));

      // Notify the Offline Indicator UI
      window.dispatchEvent(new Event('offline_submission_added'));
      return;
    }

    // 1. Update National Stats in Firestore (with mantra type and centre)
    try {
      const realChantCount = type === 'likitha' ? (value * 11) : value;
      const mantraType = toMantraType(type);
      const centre = user.centre || 'Unknown';
      await recordSadhanaOffering(user.uid, user.state || 'Other', realChantCount, mantraType, centre);
    } catch (e) {
      console.warn("National stats sync failed:", e);
    }

    // 2. Update Personal Stats in LocalStorage
    const userStatsKey = `sms_stats_${user.uid}`;
    const userStats = JSON.parse(localStorage.getItem(userStatsKey) || '{"gayathri":0, "saiGayathri":0, "likitha":0}');
    userStats[type] += value;
    localStorage.setItem(userStatsKey, JSON.stringify(userStats));

    // 3. Sync to Personal Firestore Doc & Record for Badge/Leaderboard
    try {
      const userRef = doc(db, 'users', user.uid);
      // Streak Logic
      const now = new Date();
      // Ensure we use local dates for accuracy (e.g. Asia/Kuala_Lumpur if that's the timezone, but here we just safely strip time)
      const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const lastActivityStr = user.lastActivity
        ? new Date(new Date(user.lastActivity).getTime() - (new Date(user.lastActivity).getTimezoneOffset() * 60000)).toISOString().split('T')[0]
        : '';

      let streakUpdate = {};
      if (lastActivityStr !== todayStr) {
        if (lastActivityStr) {
          const todayDate = new Date(todayStr);
          const lastDate = new Date(lastActivityStr);
          const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            streakUpdate = { streak: (user.streak || 0) + 1 };
          } else if (diffDays > 1) {
            streakUpdate = { streak: 1 };
          }
        } else {
          // First time
          streakUpdate = { streak: 1 };
        }
      }

      // Check for milestone badges
      const currentStreak = (streakUpdate as any).streak || user.streak || 0;
      const badges = JSON.parse(localStorage.getItem('sms_badges') || '[]');
      const badgeThresholds = [
        { days: 3, id: 'streak_3', title: '3-Day Streak', icon: '🔥', earnedAt: now.toISOString() },
        { days: 7, id: 'streak_7', title: '7-Day Streak', icon: '🌟', earnedAt: now.toISOString() },
        { days: 21, id: 'streak_21', title: '21-Day Habit', icon: '🏆', earnedAt: now.toISOString() },
        { days: 30, id: 'streak_30', title: '30-Day Devotee', icon: '👑', earnedAt: now.toISOString() }
      ];

      let newBadgeWon = false;
      badgeThresholds.forEach(b => {
        if (currentStreak >= b.days && !badges.find((existing: any) => existing.id === b.id)) {
          badges.push(b);
          newBadgeWon = true;
        }
      });
      if (newBadgeWon) {
        localStorage.setItem('sms_badges', JSON.stringify(badges));
        window.dispatchEvent(new Event('storage'));
      }

      await setDoc(userRef, {
        stats: {
          [type]: firebaseIncrement(value)
        },
        lastActivity: now.toISOString(),
        ...streakUpdate
      }, { merge: true });

      // SEC-02, NAMA-02: Record day-level aggregated submission for leaderboard rollups
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const dailyRef = doc(db, 'sadhanaDaily', `${user.uid}-${dateStr}`);

      await setDoc(dailyRef, {
        uid: user.uid,
        userName: user.name,
        state: user.state || 'Other',
        centre: user.centre || 'SSIOM',
        type: type, // Keeps track of last activity type
        count: firebaseIncrement(realChantCount),
        timestamp: new Date().toISOString(),
        date: dateStr,
        publicLeaderboard: user.publicLeaderboard ?? true
      }, { merge: true });
    } catch (e) {
      console.error("Personal Firestore sync failed:", e);
    }

    window.dispatchEvent(new Event('storage'));
  };

  const handleMantraSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (user?.isGuest) {
      setShowRegisterPrompt(true);
      return;
    }

    if (formData.count <= 0) {
      alert("Please enter a valid count greater than 0.");
      return;
    }

    if (formData.count > 100000) {
      alert("Count seems unusually high. Please verify and submit in smaller batches.");
      return;
    }

    const type = chantingType === 'Gayathri' ? 'gayathri' : 'saiGayathri';
    const lastSubmitTime = localStorage.getItem(`last_${type}_submit`);
    if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime) < 10000) {
      if (!window.confirm("You just submitted this offering securely. Are you sure you want to duplicate it so soon?")) {
        return;
      }
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Duplicate Check Query
    if (user && navigator.onLine) {
      try {
        const todayISO = new Date().toISOString().split('T')[0];
        const q = query(
          collection(db, 'sadhanaDaily'),
          where('uid', '==', user.uid),
          where('type', '==', type),
          where('count', '==', formData.count),
          where('dateStr', '==', todayISO),
          limit(1)
        );
        const dupSnap = await getDocs(q);
        if (!dupSnap.empty) {
          const confirmSubmit = window.confirm(`You already submitted an offering of ${formData.count} ${chantingType} chants today. Are you sure you want to submit this again?`);
          if (!confirmSubmit) {
            setIsSubmitting(false);
            setFormData({ count: 108 });
            return;
          }
        }
      } catch (error) {
        console.warn("Could not check for duplicates:", error);
      }
    }

    try {
      await updateStats(type, formData.count);
      localStorage.setItem(`last_${type}_submit`, Date.now().toString());
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData({ count: 108 });
    } catch (err: any) {
      setSubmissionError(err.message === "NETWORK_OFFLINE" ? "You are offline. Please check your connection." : "Failed to record offering. Internal server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLikithaCount = (text: string) => {
    const matches = text.match(/(om|aum)\s*sai\s*ram/gi);
    return matches ? matches.length : 0;
  };

  const completedLinesCount = getLikithaCount(likithaText);
  const isJapamComplete = completedLinesCount >= 11;
  const likithaUnitsToSubmit = Math.floor(completedLinesCount / 11);

  const handleLikithaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLikithaText(e.target.value);
    if (user?.isGuest && getLikithaCount(e.target.value) >= 11) {
      setShowRegisterPrompt(true);
    }
  };

  const handleLikithaSubmit = async () => {
    if (user?.isGuest) {
      setShowRegisterPrompt(true);
      return;
    }
    if (!isJapamComplete) return;

    const lastSubmitTime = localStorage.getItem(`last_likitha_submit`);
    if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime) < 10000) {
      if (!window.confirm("You just submitted this offering securely. Are you sure you want to duplicate it so soon?")) {
        return;
      }
    }

    if (likithaUnitsToSubmit <= 0) {
      alert("Please chant Om Sai Ram at least 11 times before offering.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Duplicate Check Query
    if (user && navigator.onLine) {
      try {
        const todayISO = new Date().toISOString().split('T')[0];
        const q = query(
          collection(db, 'sadhanaDaily'),
          where('uid', '==', user.uid),
          where('type', '==', 'likitha'),
          where('count', '==', likithaUnitsToSubmit * 11),
          where('dateStr', '==', todayISO),
          limit(1)
        );
        const dupSnap = await getDocs(q);
        if (!dupSnap.empty) {
          const confirmSubmit = window.confirm(`You already submitted an offering of ${likithaUnitsToSubmit * 11} Likitha Japam chants today. Are you sure you want to submit this again?`);
          if (!confirmSubmit) {
            setIsSubmitting(false);
            setLikithaText('');
            return;
          }
        }
      } catch (error) {
        console.warn("Could not check for duplicates:", error);
      }
    }

    try {
      await updateStats('likitha', likithaUnitsToSubmit);
      localStorage.setItem(`last_likitha_submit`, Date.now().toString());
      setShowSuccess(true);

      // Attempt Confetti Animation
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D2AC47', '#ffdf00', '#ffffff', '#002E5B']
        });
      }).catch(() => { });

      setTimeout(() => setShowSuccess(false), 3000);
      setLikithaText('');
    } catch (err: any) {
      setSubmissionError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerRegistration = () => {
    localStorage.setItem('sms_register_mode', 'true');
    localStorage.removeItem('sms_user');
    sessionStorage.removeItem('sms_session_mode');
    window.location.reload();
  };

  const handleClearForm = () => {
    setLikithaText('');
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl font-bold mb-4 text-navy-900">Spiritual Practice Progress</h1>
        <p className="text-navy-500 max-w-xl mx-auto italic font-medium leading-relaxed">
          "{siteContent.chantingIntroText}"
        </p>
      </div>

      {submissionError && (
        <div className="mb-8 bg-red-50 border border-red-200 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4 text-red-700">
            <AlertTriangle size={24} />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest">Submission Failed</p>
              <p className="text-xs opacity-80">{submissionError}</p>
            </div>
          </div>
          <button
            onClick={() => handleMantraSubmit()}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
          >
            <RotateCcw size={14} /> Retry Submission
          </button>
        </div>
      )}

      <div id="tutorial-submission-form" className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Mantra Tile */}
        <div className="bg-white p-10 rounded-bento shadow-xl border border-navy-50 relative overflow-hidden flex flex-col justify-between">
          {showSuccess && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
              <CheckCircle2 size={80} className="text-teal-500 mb-6 animate-bounce" />
              <p className="text-3xl font-serif font-bold text-navy-900">Jai Sai Ram!</p>
              <p className="text-navy-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Offering Accepted</p>
              <button onClick={() => setShowSuccess(false)} className="mt-8 px-8 py-3 bg-navy-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest">Submit More</button>
            </div>
          )}

          <div>
            <div className="flex gap-4 mb-10 bg-neutral-100 p-2 rounded-2xl border border-neutral-200 shadow-inner">
              <button onClick={() => setChantingType('Gayathri')} className={`flex-1 py-4 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${chantingType === 'Gayathri' ? 'bg-navy-900 text-gold-500 border-gold-500 shadow-lg' : 'text-navy-300 border-transparent'}`}>Gayathri Mantra</button>
              <button onClick={() => setChantingType('SaiGayathri')} className={`flex-1 py-4 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${chantingType === 'SaiGayathri' ? 'bg-navy-900 text-gold-500 border-gold-500 shadow-lg' : 'text-navy-300 border-transparent'}`}>Sai Gayathri</button>
            </div>

            <div className="text-center space-y-8 py-10">
              <span className="text-[10px] font-black text-navy-200 uppercase tracking-[0.4em]">Sacred Repetitions</span>
              <div className="flex items-center justify-center gap-10">
                <button onClick={decrement} className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center hover:bg-navy-900 hover:text-white transition-all text-navy-300 border border-neutral-200">
                  <Minus size={32} />
                </button>
                <div className="flex flex-col items-center">
                  <input type="number" className="w-48 text-center text-7xl font-serif font-black text-navy-900 bg-transparent border-none focus:ring-0 outline-none" value={formData.count || ''} onChange={e => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 0;
                    if (val < 0) val = 0;
                    if (val > 1000000) val = 1000000;
                    setFormData({ count: val });
                  }} />
                  <div className="h-1.5 w-24 bg-gold-gradient rounded-full mt-2"></div>
                </div>
                <button onClick={increment} className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center hover:bg-navy-900 hover:text-white transition-all text-navy-300 border border-neutral-200">
                  <Plus size={32} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex justify-center gap-3">
              {[10, 108, 1008].map(v => (
                <button key={v} onClick={() => setFormData({ count: v })} className="px-5 py-2 bg-neutral-50 rounded-full text-[10px] font-black uppercase tracking-widest text-navy-400 border border-navy-50 hover:bg-gold-500 hover:text-white transition-all">{v} Chants</button>
              ))}
            </div>
            <button
              disabled={isSubmitting}
              onClick={handleMantraSubmit}
              className={`w-full py-5 font-black uppercase tracking-widest rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all text-xs ${user?.isGuest ? 'bg-navy-900/5 text-navy-300' : 'bg-gold-gradient text-navy-900 hover:scale-[1.01] shadow-gold-500/10'} ${isSubmitting ? 'opacity-50 animate-pulse' : ''}`}
            >
              {user?.isGuest ? <Lock size={18} /> : <Send size={18} />} {isSubmitting ? 'Recording...' : 'Offer Chants to Swami'}
            </button>
          </div>
        </div>

        {/* Likitha Japam Tile */}
        <div id="tutorial-likitha-japam" className="bg-white p-10 rounded-bento text-navy-900 relative shadow-2xl flex flex-col border border-navy-50 overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 text-gold-500"><Sparkles size={300} /></div>

          <div className="relative z-10 mb-8 text-center flex flex-col items-center">
            <h3 className="text-3xl font-serif font-bold text-gold-500 mb-2 leading-tight">Likitha Japam</h3>
            <p className="text-navy-400 text-xs leading-relaxed font-bold uppercase tracking-widest">Type "Om Sai Ram" 11 times = 1 Unit</p>
            {user && !user.isGuest && (
              <div className="mt-4 bg-navy-50 px-4 py-2 rounded-full inline-block border border-navy-100 shadow-sm">
                <span className="text-xs font-bold text-navy-600">Total Units Offered: {JSON.parse(localStorage.getItem(`sms_stats_${user?.uid}`) || '{"likitha":0}').likitha}</span>
              </div>
            )}
          </div>

          <div className="flex-grow space-y-3 pr-2 h-64 text-center">
            <textarea
              value={likithaText}
              onChange={handleLikithaChange}
              placeholder="Type 'Om Sai Ram' repeatedly here..."
              className={`w-full h-full py-6 px-8 rounded-3xl border-2 transition-all outline-none font-serif italic text-2xl resize-none custom-scrollbar shadow-inner leading-loose
              ${isJapamComplete ? 'border-teal-500 bg-teal-50 text-navy-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10' : 'bg-neutral-50 border-navy-50 focus:border-gold-500 focus:bg-white'}`}
            />
          </div>

          <div className="relative z-10 pt-8 mt-4 border-t border-navy-50">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-navy-200 mb-1 font-black">Valid Mantras Detected</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black ${isJapamComplete ? 'text-teal-500' : 'text-gold-500'}`}>{completedLinesCount}</span>
                  <span className="text-xl text-navy-100">/ {Math.max(11, Math.ceil((completedLinesCount + 1) / 11) * 11)}</span>
                </div>
              </div>
              <button onClick={() => setShowClearConfirm(true)} className="text-[9px] font-black uppercase tracking-widest text-navy-200 hover:text-navy-900 underline">Clear Form</button>
            </div>

            <button
              onClick={handleLikithaSubmit}
              disabled={(!isJapamComplete && !user?.isGuest) || isSubmitting}
              className={`w-full py-5 font-black uppercase tracking-widest text-xs rounded-3xl shadow-xl transition-all ${user?.isGuest ? 'bg-navy-900/5 text-navy-300' : 'bg-gold-gradient text-navy-900 hover:scale-[1.01] shadow-gold-500/10 disabled:opacity-20'} ${isSubmitting ? 'animate-pulse' : ''}`}
            >
              {user?.isGuest ? <Lock size={18} className="inline mr-2" /> : <Send size={18} className="inline mr-2" />}
              {isSubmitting ? 'Recording...' : `Submit ${likithaUnitsToSubmit > 0 ? likithaUnitsToSubmit : 1} Sacred Unit${likithaUnitsToSubmit > 1 ? 's' : ''}`}
            </button>
          </div>

          {/* Confirmation Overlay for Clearing Form */}
          {showClearConfirm && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex items-center justify-center p-8 animate-in fade-in duration-200">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-navy-900">Clear all progress?</h4>
                  <p className="text-xs text-navy-400 font-medium">This will remove all text entered in the current unit.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-3 bg-neutral-100 text-navy-900 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  <button onClick={handleClearForm} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">Clear All</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guest Prompt Modal */}
      {showRegisterPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-md" onClick={() => setShowRegisterPrompt(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300 border border-gold-200">
            <button onClick={() => setShowRegisterPrompt(false)} className="absolute top-6 right-6 p-2 text-navy-200 hover:text-navy-900"><X size={20} /></button>
            <div className="w-16 h-16 bg-gold-gradient rounded-2xl mx-auto flex items-center justify-center text-navy-900 mb-8 shadow-xl shadow-gold-500/20"><UserPlus size={32} /></div>
            <h3 className="text-2xl font-serif font-bold text-navy-900 mb-4 leading-tight">Join the Collective Sadhana</h3>
            <p className="text-sm text-navy-500 mb-10 font-medium italic leading-relaxed">"Register now to be part of the collective sadhana and see your progress in the national offering."</p>
            <div className="space-y-4">
              <button
                onClick={handleTriggerRegistration}
                className="w-full py-5 bg-gold-gradient text-navy-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                Register Now
              </button>
              <button onClick={() => setShowRegisterPrompt(false)} className="w-full py-4 text-navy-300 font-black uppercase tracking-widest text-[9px] hover:text-navy-900">Continue as Guest</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F0F4F8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D2AC47; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ChantingPage;
