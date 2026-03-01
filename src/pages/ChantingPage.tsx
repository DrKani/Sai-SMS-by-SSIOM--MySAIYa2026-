import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Minus, Plus, Send, CheckCircle2, Sparkles, Lock, Check, UserPlus, X, AlertTriangle, RotateCcw, AlertCircle } from 'lucide-react';
import { DEFAULT_SITE_CONTENT } from '../constants';
import { SiteContent } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, increment as firebaseIncrement } from 'firebase/firestore';
import { recordSadhanaOffering } from '../lib/nationalStats';

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
  const [japamLines, setJapamLines] = useState<string[]>(Array(11).fill(''));
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

    if (!navigator.onLine) {
      throw new Error("NETWORK_OFFLINE");
    }

    // 1. Update National Stats in Firestore
    try {
      const realChantCount = type === 'likitha' ? (value * 11) : value;
      await recordSadhanaOffering(user.uid, user.state || 'Other', realChantCount);
    } catch (e) {
      console.warn("National stats sync failed:", e);
    }

    // 2. Update Personal Stats in LocalStorage
    const userStatsKey = `sms_stats_${user.uid}`;
    const userStats = JSON.parse(localStorage.getItem(userStatsKey) || '{"gayathri":0, "saiGayathri":0, "likitha":0}');
    userStats[type] += value;
    localStorage.setItem(userStatsKey, JSON.stringify(userStats));

    // 3. Sync to Personal Firestore Doc
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        stats: {
          [type]: firebaseIncrement(value)
        }
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

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const type = chantingType === 'Gayathri' ? 'gayathri' : 'saiGayathri';
      await updateStats(type, formData.count);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData({ count: 108 });
    } catch (err: any) {
      setSubmissionError(err.message === "NETWORK_OFFLINE" ? "You are offline. Please check your connection." : "Failed to record offering. Internal server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJapamLineChange = (index: number, value: string) => {
    const newLines = [...japamLines];
    newLines[index] = value;
    setJapamLines(newLines);

    if (user?.isGuest && index === 10 && newLines.every(l => l.trim().toLowerCase() === "om sai ram")) {
      setShowRegisterPrompt(true);
    }
  };

  const isLineValid = (line: string) => line.trim().toLowerCase() === "om sai ram";
  const completedLinesCount = japamLines.filter(isLineValid).length;
  const isJapamComplete = completedLinesCount === 11;

  const handleLikithaSubmit = async () => {
    if (user?.isGuest) {
      setShowRegisterPrompt(true);
      return;
    }
    if (!isJapamComplete) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await updateStats('likitha', 1);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setJapamLines(Array(11).fill(''));
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
    setJapamLines(Array(11).fill(''));
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
                  <input type="number" className="w-48 text-center text-7xl font-serif font-black text-navy-900 bg-transparent border-none focus:ring-0" value={formData.count} onChange={e => setFormData({ count: parseInt(e.target.value) || 0 })} />
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

          <div className="relative z-10 mb-8 text-center">
            <h3 className="text-3xl font-serif font-bold text-gold-500 mb-2 leading-tight">Likitha Japam</h3>
            <p className="text-navy-400 text-xs leading-relaxed font-bold uppercase tracking-widest">Type "Om Sai Ram" 11 times</p>
          </div>

          <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[480px]">
            {japamLines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-8 text-[10px] font-black text-navy-200 text-right">{idx + 1}.</span>
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => handleJapamLineChange(idx, e.target.value)}
                    placeholder="Om Sai Ram"
                    className={`w-full py-3 px-5 rounded-xl border transition-all outline-none font-serif italic text-lg ${isLineValid(line) ? 'border-teal-500 bg-teal-50 text-navy-900' : 'bg-neutral-50 border-navy-50 focus:border-gold-500'}`}
                  />
                  {isLineValid(line) && <Check size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600" />}
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 pt-8 mt-4 border-t border-navy-50">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-navy-200 mb-1 font-black">Submission Progress</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gold-500">{completedLinesCount}</span>
                  <span className="text-xl text-navy-100">/ 11</span>
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
              {isSubmitting ? 'Recording...' : 'Submit 1 Sacred Unit'}
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
