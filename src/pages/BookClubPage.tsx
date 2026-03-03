
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen, CheckCircle2, ChevronRight, ChevronLeft, Lock, FileText,
  Sparkles, Trophy, Medal, ScrollText, Check, Clock, ArrowDownCircle,
  Grid, X, RotateCcw, HelpCircle, ArrowRight, Share2, Download, BookMarked,
  Type, Moon, Sun, Sidebar as SidebarIcon, Search, ZoomIn, ZoomOut, Heart, ExternalLink,
  Briefcase, MoreVertical, PlayCircle, Info, RefreshCw
} from 'lucide-react';
import { BookClubWeek, UserProfile, QuizSubmission, UserBriefcaseItem, Reflection } from '../types';
import { ToastContainer, useToast } from '../components/Toast';
import BriefcaseDrawer from '../components/BriefcaseDrawer';
import { ANNUAL_STUDY_PLAN } from '../constants';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';


// --- SUB-COMPONENTS ---

const JourneyMap = ({ weeks, onSelectWeek, userBadges, userCompletions, onLockedClick, loading }: { weeks: BookClubWeek[], onSelectWeek: (id: string) => void, userBadges: any[], userCompletions: string[], onLockedClick: (date: string) => void, loading?: boolean }) => {
  const now = new Date();
  const currentWeekIndex = weeks.findIndex(w => new Date(w.publishAt) > now);
  const currentWeekText = currentWeekIndex === -1 ? 52 : (currentWeekIndex === 0 ? 1 : currentWeekIndex);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1 bg-gold-100 text-gold-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-gold-200 mb-4">
          National Curriculum 2026 • Week {currentWeekText} of 52
          {loading && <RefreshCw size={10} className="animate-spin opacity-60" />}
        </span>
        <h1 className="font-serif text-5xl font-bold text-navy-900 mb-4">Sai Lit Club Journey</h1>
        <p className="text-navy-500 max-w-2xl mx-auto font-medium">
          52 Weeks of *Ramakatha Rasavahini*. Read, Reflect, and Evolve.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weeks.map((week, index) => {
          const isLocked = new Date(week.publishAt) > now && week.status !== 'published';
          const isCompleted = userCompletions.includes(week.weekId);
          const isAced = userBadges.some(b => b.week === week.weekId && b.type === 'elite');

          return (
            <button
              key={week.weekId}
              onClick={() => isLocked ? onLockedClick(new Date(week.publishAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })) : onSelectWeek(week.weekId)}
              className={`relative flex flex-col text-left p-6 rounded-[2rem] border-2 transition-all group overflow-hidden h-72 ${isLocked
                ? 'bg-neutral-100 border-neutral-200 opacity-70 cursor-pointer'
                : 'bg-white border-navy-50 hover:border-gold-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {isLocked ? (
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-400">
                    <Lock size={14} />
                  </div>
                ) : isAced ? (
                  <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center text-navy-900 shadow-md animate-in zoom-in">
                    <Trophy size={14} />
                  </div>
                ) : isCompleted ? (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-md animate-in zoom-in">
                    <Check size={16} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-neutral-50 rounded-full flex items-center justify-center text-navy-200 group-hover:bg-navy-900 group-hover:text-gold-500 transition-colors">
                    <PlayCircle size={16} />
                  </div>
                )}
              </div>

              {/* Week Number */}
              <span className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isLocked ? 'text-neutral-400' : 'text-gold-600'}`}>
                Week {index + 1}
              </span>

              {/* Title */}
              <h3 className={`font-serif text-xl font-bold leading-tight ${isLocked ? 'text-neutral-400' : 'text-navy-900 group-hover:text-purple-700 transition-colors'}`}>
                {week.chapterTitle}
              </h3>

              <p className={`mt-2 text-xs font-medium leading-relaxed line-clamp-3 mb-auto ${isLocked ? 'text-neutral-400' : 'text-navy-500'}`}>
                {week.topic || (week.learningOutcomes && week.learningOutcomes[0])}
              </p>

              {/* Footer Meta */}
              <div className="mt-4 pt-4 border-t border-dashed border-neutral-200 w-full shrink-0">
                {isLocked ? (
                  <span className="flex items-center gap-2 text-[11px] font-black text-orange-500 uppercase tracking-wider">
                    <Clock size={14} /> Available {new Date(week.publishAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-navy-400 uppercase tracking-wider">
                      {week.durationMinutes} Min Read
                    </span>
                    {isCompleted && <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Done</span>}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuizComponent = ({ week, onComplete }: { week: BookClubWeek, onComplete: (correct: number, total: number) => void }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(week.questions.length).fill(-1));
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Score calculation
  const calculateScore = () => {
    let correct = 0;
    week.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    return Math.round((correct / week.questions.length) * 100);
  };

  const handleSelect = (optionIdx: number) => {
    if (showExplanation) return; // Prevent changing after revealing
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIdx;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQ < week.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      const correctCount = week.questions.filter((q, idx) => answers[idx] === q.correctAnswer).length;
      onComplete(correctCount, week.questions.length);
    }
  };

  if (isFinished) return null; // Parent handles the completion view

  const q = week.questions[currentQ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-navy-50 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8">
      <div className="flex justify-between items-center mb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-300">
          Question {currentQ + 1} / {week.questions.length}
        </span>
        <span className="bg-navy-50 text-navy-900 px-3 py-1 rounded-full text-[10px] font-bold">
          Pass 50% ({Math.ceil(week.questions.length * 0.5)}/{week.questions.length} correct)
        </span>
      </div>

      <h3 className="font-serif text-xl md:text-2xl font-bold text-navy-900 mb-8 leading-relaxed">
        {q.question}
      </h3>

      <div className="space-y-3 mb-8">
        {q.options.map((opt, idx) => {
          let btnClass = "w-full p-5 text-left rounded-xl border-2 font-medium transition-all text-sm ";

          if (showExplanation) {
            if (idx === q.correctAnswer) btnClass += "bg-green-50 border-green-500 text-green-800";
            else if (idx === answers[currentQ]) btnClass += "bg-red-50 border-red-500 text-red-800 opacity-60";
            else btnClass += "border-neutral-100 opacity-40";
          } else {
            btnClass += answers[currentQ] === idx
              ? "border-navy-900 bg-navy-50 text-navy-900"
              : "border-neutral-100 hover:border-gold-400 hover:bg-neutral-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showExplanation}
              className={btnClass}
            >
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${showExplanation && idx === q.correctAnswer ? 'bg-green-500 border-green-500 text-white' : 'border-current'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6">
            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2">
              <Info size={14} /> Explanation
            </h4>
            <p className="text-sm text-blue-900 leading-relaxed italic">
              {q.explanation}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-4 bg-navy-900 text-gold-500 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {currentQ < week.questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

const BookClubPage: React.FC = () => {
  const { showToast, toasts, closeToast } = useToast();
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [viewMode, setViewMode] = useState<'map' | 'classroom'>('map');
  const [activeWeekId, setActiveWeekId] = useState<string | null>(null);

  // User Progress Data
  const [completions, setCompletions] = useState<string[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [briefcase, setBriefcase] = useState<UserBriefcaseItem[]>([]);
  const [isBriefcaseOpen, setIsBriefcaseOpen] = useState(false);

  // Reader / Assessment State
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  // Assessment: independent flags (decoupled Mark as Read vs Take Quiz)
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [lastScore, setLastScore] = useState<null | { correct: number; total: number; passed: boolean }>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [hasEarnedExcellence, setHasEarnedExcellence] = useState(false);
  const [reflection, setReflection] = useState("");
  const [isReflectionPublic, setIsReflectionPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readingContainerRef = useRef<HTMLDivElement>(null);

  // --- Firestore-backed study plan ---
  // We render the ANNUAL_STUDY_PLAN baseline instantly, then merge Firestore overrides.

  // Ensure all array fields are defined after Firestore merge to prevent .map() crashes
  const sanitizeWeek = (w: any): BookClubWeek => ({
    ...w,
    questions: Array.isArray(w.questions) ? w.questions : [],
    learningOutcomes: Array.isArray(w.learningOutcomes) ? w.learningOutcomes : [],
    reflectionPrompts: Array.isArray(w.reflectionPrompts) ? w.reflectionPrompts : [],
  });

  const buildBaseline = (): BookClubWeek[] => {
    const saved = localStorage.getItem('sms_bookclub_weeks');
    const dynamicWeeks: any[] = saved ? JSON.parse(saved) : [];
    const merged = ANNUAL_STUDY_PLAN.map(w => {
      const dyn = dynamicWeeks.find((dw: any) => dw.weekId === w.weekId);
      return sanitizeWeek(dyn ? { ...w, ...dyn } : w);
    });
    dynamicWeeks.forEach((dw: any) => {
      if (!merged.find(w => w.weekId === dw.weekId)) merged.push(sanitizeWeek(dw));
    });
    return merged.sort((a, b) => a.weekId.localeCompare(b.weekId));
  };

  const [studyPlan, setStudyPlan] = useState<BookClubWeek[]>(buildBaseline);
  const [isPlanLoading, setIsPlanLoading] = useState(true);

  // Fetch from Firestore once; merge over the baseline.
  // Uses a localStorage cache (4-hour TTL) to avoid repeated getDocs reads.
  useEffect(() => {
    const CACHE_KEY = 'sms_bookclub_fs_cache';
    const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours

    const applyFsMap = (fsMap: Record<string, any>) => {
      setStudyPlan(prev => {
        const merged = prev.map(w => {
          const fs = fsMap[w.weekId];
          return sanitizeWeek(fs ? { ...w, ...fs } : w);
        });
        Object.values(fsMap).forEach((fw: any) => {
          if (!merged.find(w => w.weekId === fw.weekId)) merged.push(sanitizeWeek(fw));
        });
        return merged.sort((a, b) => a.weekId.localeCompare(b.weekId));
      });
    };

    const fetchPlan = async () => {
      // Check cache first
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const { data, ts } = JSON.parse(raw);
          if (Date.now() - ts < CACHE_TTL && data && Object.keys(data).length > 0) {
            applyFsMap(data);
            setIsPlanLoading(false);
            return;
          }
        }
      } catch { /* cache miss or corrupt — proceed to Firestore */ }

      // Cache miss — fetch from Firestore
      try {
        const snap = await getDocs(collection(db, 'bookclubWeeks'));
        if (!snap.empty) {
          const fsMap: Record<string, any> = {};
          snap.docs.forEach(d => { fsMap[d.id] = d.data(); });
          applyFsMap(fsMap);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fsMap, ts: Date.now() }));
          } catch { /* storage quota — ignore */ }
        }
      } catch (err) {
        console.warn('BookClubPage: Could not fetch from Firestore, using local baseline.', err);
      } finally {
        setIsPlanLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const activeWeek = useMemo(() => studyPlan.find(w => w.weekId === activeWeekId), [activeWeekId, studyPlan]);

  useEffect(() => {
    if (user) {
      const comp = JSON.parse(localStorage.getItem('sms_completions') || '[]');
      const bdg = JSON.parse(localStorage.getItem('sms_badges') || '[]');
      const bri = JSON.parse(localStorage.getItem(`sms_briefcase_${user.uid}`) || '[]');

      setCompletions(comp);
      setBadges(bdg);
      setBriefcase(bri);
    }
  }, [user?.uid]);

  // Handle URL Deep Linking
  useEffect(() => {
    if (weekId && studyPlan) {
      const weekExists = studyPlan.some((w: any) => w.weekId === weekId);
      if (weekExists) {
        setActiveWeekId(weekId);
        setViewMode('classroom');
      }
    } else {
      setViewMode('map');
      setActiveWeekId(null);
    }
  }, [weekId, studyPlan]);

  // Initialize Classroom state when entering a new week
  useEffect(() => {
    if (viewMode === 'classroom' && activeWeek) {
      setScrollPercentage(0);
      setReflection("");
      if (user) {
        const savedRef = localStorage.getItem(`sms_reflection_${user.uid}_${activeWeek.weekId}`);
        if (savedRef) setReflection(savedRef);
      }
      const alreadyRead = completions.includes(activeWeek.weekId);
      const alreadyExcelled = badges.some(b => b.week === activeWeek.weekId && b.type === 'elite');
      setHasMarkedRead(alreadyRead);
      setHasEarnedExcellence(alreadyExcelled);
      setShowQuiz(false);
      setShowCompletionModal(false);
      setShowResultModal(false);
      setLastScore(null);
      setQuizAttempts(0);
    }
  }, [viewMode, activeWeek?.weekId]);

  const handleScroll = () => {
    if (!readingContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = readingContainerRef.current;
    const progress = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    setScrollPercentage(progress);
  };

  // --- ACTIONS ---

  const handleMarkRead = async () => {
    if (!user || !activeWeek || hasMarkedRead || isSubmitting) return;

    setIsSubmitting(true);

    // Save completion to localStorage
    const newCompletions = [...new Set([...completions, activeWeek.weekId])];
    setCompletions(newCompletions);
    localStorage.setItem('sms_completions', JSON.stringify(newCompletions));

    // Award Completion Badge locally
    const badgeEntry = { type: 'completion', week: activeWeek.weekId, timestamp: new Date().toISOString() };
    const newBadges = [...badges.filter(b => !(b.week === activeWeek.weekId && b.type === 'completion')), badgeEntry];
    setBadges(newBadges);
    localStorage.setItem('sms_badges', JSON.stringify(newBadges));
    setHasMarkedRead(true);

    // Write to Firestore badge_events
    try {
      await addDoc(collection(db, 'badge_events'), {
        userId: user.uid,
        userName: user.name,
        userCentre: (user as any).centre || (user as any).centreName || '',
        weekId: activeWeek.weekId,
        chapterTitle: activeWeek.chapterTitle,
        badgeType: 'completion',
        score: null,
        totalQuestions: activeWeek.questions.length,
        passThreshold: 0.50,
        passed: true,
        attemptNumber: 1,
        completedAt: serverTimestamp(),
        platform: 'web'
      });
    } catch (e) { console.warn('badge_events write failed', e); } finally {
      setIsSubmitting(false);
    }

    // Show Om Sai Ram modal
    setShowCompletionModal(true);
  };

  const handleTakeQuiz = () => {
    setShowCompletionModal(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = async (correct: number, total: number) => {
    if (!user || !activeWeek || isSubmitting) return;
    setIsSubmitting(true);
    const passed = correct / total >= 0.50;
    const attempt = quizAttempts + 1;
    setQuizAttempts(attempt);

    // Save quiz result to briefcase
    const newItem: UserBriefcaseItem = {
      id: `quiz-${Date.now()}`,
      type: 'quiz_result',
      weekId: activeWeek.weekId,
      title: `Quiz: ${activeWeek.chapterTitle}`,
      content: { correct, total, passed, attempt } as any,
      timestamp: new Date().toISOString()
    };
    const newBriefcase = [...briefcase, newItem];
    setBriefcase(newBriefcase);
    localStorage.setItem(`sms_briefcase_${user.uid}`, JSON.stringify(newBriefcase));

    if (passed) {
      const eliteBadge = { type: 'elite', week: activeWeek.weekId, timestamp: new Date().toISOString() };
      const newBadges = [...badges.filter(b => !(b.week === activeWeek.weekId && b.type === 'elite')), eliteBadge];
      setBadges(newBadges);
      localStorage.setItem('sms_badges', JSON.stringify(newBadges));
      setHasEarnedExcellence(true);

      // Also mark completion if not done yet
      if (!hasMarkedRead) {
        const newComp = [...new Set([...completions, activeWeek.weekId])];
        setCompletions(newComp);
        localStorage.setItem('sms_completions', JSON.stringify(newComp));
        setHasMarkedRead(true);
      }

      // Write excellence badge_event to Firestore
      try {
        await addDoc(collection(db, 'badge_events'), {
          userId: user.uid,
          userName: user.name,
          userCentre: (user as any).centre || (user as any).centreName || '',
          weekId: activeWeek.weekId,
          chapterTitle: activeWeek.chapterTitle,
          badgeType: 'excellence',
          score: correct,
          totalQuestions: total,
          passThreshold: 0.50,
          passed: true,
          attemptNumber: attempt,
          completedAt: serverTimestamp(),
          platform: 'web'
        });
      } catch (e) { console.warn('badge_events write failed', e); }
    }

    setIsSubmitting(false);
    setLastScore({ correct, total, passed });
    setShowResultModal(true);
    setShowQuiz(false);
  };

  const handleRetryQuiz = () => {
    setLastScore(null);
    setShowResultModal(false);
    setShowQuiz(true);
  };

  const handleSaveReflection = () => {
    if (!user || !activeWeek) return;
    localStorage.setItem(`sms_reflection_${user.uid}_${activeWeek.weekId}`, reflection);

    const newItem: UserBriefcaseItem = {
      id: `ref-${Date.now()}`,
      type: 'reflection',
      weekId: activeWeek.weekId,
      title: `Reflection: ${activeWeek.chapterTitle}`,
      content: reflection,
      timestamp: new Date().toISOString()
    };
    const newBriefcase = [...briefcase, newItem];
    setBriefcase(newBriefcase);
    localStorage.setItem(`sms_briefcase_${user.uid}`, JSON.stringify(newBriefcase));

    // Cross-sync to Journal Page
    const journalKey = `sms_journal_${user.uid}`;
    const journalEntries = JSON.parse(localStorage.getItem(journalKey) || '[]');
    journalEntries.unshift({
      id: newItem.id,
      title: `${activeWeek.chapterTitle} (Sai Lit Club)`,
      content: reflection,
      category: 'Lesson',
      entryDate: new Date().toISOString().split('T')[0],
      timestamp: newItem.timestamp
    });
    localStorage.setItem(journalKey, JSON.stringify(journalEntries));

    if (isReflectionPublic) {
      const publicRef: Reflection = {
        id: `pub-${Date.now()}`,
        uid: user.uid,
        userName: user.name,
        weekId: activeWeek.weekId,
        chapterTitle: activeWeek.chapterTitle,
        content: reflection,
        timestamp: new Date().toISOString(),
        isPublic: true,
        status: 'pending'
      };
      const publicQueue = JSON.parse(localStorage.getItem('sms_public_reflections') || '[]');
      publicQueue.push(publicRef);
      localStorage.setItem('sms_public_reflections', JSON.stringify(publicQueue));
    }

    showToast(`${activeWeek.weekId} · ${activeWeek.chapterTitle} saved to your Briefcase!`, "success");
    setShowSidePanel(false);
  };

  if (!user) return <div className="p-20 text-center">Please log in to access the Book Club.</div>;

  // --- VIEW: JOURNEY MAP ---
  if (viewMode === 'map') {
    return (
      <>
        <ToastContainer toasts={toasts} onClose={closeToast} />
        <JourneyMap
          weeks={studyPlan}
          onSelectWeek={(id) => { navigate(`/book-club/${id}`); }}
          userBadges={badges}
          userCompletions={completions}
          loading={isPlanLoading}
          onLockedClick={(date: string) => showToast(`This chapter unlocks on ${date}. Complete previous weeks to stay on track!`, 'warning')}
        />
        <BriefcaseDrawer isOpen={isBriefcaseOpen} onClose={() => setIsBriefcaseOpen(false)} items={briefcase} />
      </>
    );
  }

  // --- VIEW: CLASSROOM ---
  if (!activeWeek) return <div>Loading...</div>;

  const isAced = badges.some(b => b.week === activeWeek.weekId && b.type === 'elite');

  // --- Computed helpers ---
  const weekIndex = studyPlan.findIndex(w => w.weekId === activeWeek.weekId);
  const prevWeek = weekIndex > 0 ? studyPlan[weekIndex - 1] : null;
  const nextWeek = weekIndex < studyPlan.length - 1 ? studyPlan[weekIndex + 1] : null;
  const totalWeeks = studyPlan.length;
  const releaseDate = new Date(activeWeek.publishAt);
  const releaseDateStr = releaseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const nextWeekReleaseStr = nextWeek
    ? new Date(nextWeek.publishAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : null;
  const isScheduledAndFuture = activeWeek.status === 'scheduled' && releaseDate > new Date();
  const DEFAULT_COVER = '/assets/ramakatha-cover.png';

  // 1. SCHEDULED ACCESS GATE
  if (isScheduledAndFuture) {
    return (
      <div className="fixed inset-0 bg-neutral-50 z-[200] flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-navy-50 flex items-center px-4 md:px-8 shrink-0 shadow-sm">
          <button onClick={() => navigate('/book-club')} className="flex items-center gap-2 text-navy-400 hover:text-navy-900 transition-colors">
            <ChevronLeft size={20} /> <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Back to Map</span>
          </button>
        </header>
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-md text-center bg-white rounded-[3rem] p-12 shadow-2xl border border-navy-50">
            <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={36} className="text-gold-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-3 block">{activeWeek.weekId} · Coming Soon</span>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">{activeWeek.chapterTitle}</h2>
            <p className="text-navy-400 font-medium italic mb-6">{activeWeek.book}</p>
            <div className="bg-gold-50 rounded-2xl p-4 border border-gold-200 mb-6">
              <p className="text-sm font-bold text-gold-800">This chapter opens on <span className="text-gold-600">{releaseDateStr}</span></p>
              <p className="text-[11px] text-gold-600 mt-1">Complete earlier weeks to stay on track with the curriculum.</p>
            </div>
            <button onClick={() => navigate('/book-club')} className="w-full py-4 bg-navy-900 text-gold-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-navy-800 transition-all">
              ← Return to Journey Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-neutral-50 z-[200] flex flex-col overflow-hidden">
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <BriefcaseDrawer isOpen={isBriefcaseOpen} onClose={() => setIsBriefcaseOpen(false)} items={briefcase} />

      {/* Om Sai Ram — Completion Modal */}
      {showCompletionModal && activeWeek && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] max-w-md w-full p-10 shadow-2xl text-center space-y-6 animate-in zoom-in">
            <div className="text-5xl">🪔</div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-navy-900">Om Sai Ram!</h3>
              <p className="text-navy-500 mt-2">Well done for completing this week's reading,<br /><span className="font-bold text-navy-900">{user?.name?.split(' ')[0] || 'dear devotee'}!</span></p>
            </div>
            <div className="bg-navy-50 rounded-2xl p-5 border border-navy-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-navy-400 mb-2">{activeWeek.weekId} · {activeWeek.chapterTitle}</p>
              <p className="text-sm font-bold text-green-700 flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Reading Completion Badge — EARNED ✅</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-left">
              <p className="text-sm font-bold text-amber-800 mb-1">Want to go further?</p>
              <p className="text-xs text-amber-700 leading-relaxed">Answer 2 of {activeWeek.questions.length} questions correctly (50% pass mark) to earn your ✨ Weekly Excellence Badge.</p>
              {activeWeek.interestingBit && (
                <p className="text-[11px] italic text-amber-600 mt-3 border-t border-amber-200 pt-3 leading-relaxed">"{activeWeek.interestingBit}"</p>
              )}
            </div>
            <div className="space-y-3">
              <button onClick={handleTakeQuiz} className="w-full py-4 bg-navy-900 text-gold-500 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-navy-800 transition-all flex items-center justify-center gap-2">
                <Medal size={16} /> YES — TAKE THE QUIZ NOW
              </button>
              <button onClick={() => setShowCompletionModal(false)} className="w-full py-3 text-navy-400 hover:text-navy-700 text-xs font-medium transition-colors">
                Maybe later — I'll come back to this
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excellence / Fail Result Modal */}
      {showResultModal && lastScore && activeWeek && (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] max-w-md w-full p-10 shadow-2xl text-center space-y-6 animate-in zoom-in">
            {lastScore.passed ? (
              <>
                <div className="text-5xl">🌟</div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-navy-900">Om Sai Ram, {user?.name?.split(' ')[0]}!</h3>
                  <p className="text-navy-500 mt-1">You scored <strong>{lastScore.correct}/{lastScore.total}</strong> — Excellence Achieved!</p>
                </div>
                <div className="bg-gold-50 rounded-2xl p-5 border border-gold-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-2">✨ Weekly Excellence Badge — EARNED</p>
                  <p className="text-sm text-navy-700 font-medium">{activeWeek.weekId} · {activeWeek.chapterTitle}</p>
                  {activeWeek.questions[0]?.explanation && (
                    <p className="text-[11px] italic text-gold-700 mt-3 leading-relaxed border-t border-gold-200 pt-3">"{activeWeek.questions[0].explanation.substring(0, 120)}..."</p>
                  )}
                </div>
                <div className="flex gap-3">
                  {nextWeek && new Date(nextWeek.publishAt) <= new Date() ? (
                    <button onClick={() => { setShowResultModal(false); navigate(`/book-club/${nextWeek.weekId}`); }} className="flex-1 py-4 bg-navy-900 text-gold-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-navy-800 flex items-center justify-center gap-1">
                      CONTINUE TO {nextWeek.weekId} <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button onClick={() => setShowResultModal(false)} className="flex-1 py-4 bg-navy-900 text-gold-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-navy-800">
                      DONE
                    </button>
                  )}
                  <button onClick={() => setShowResultModal(false)} className="flex-1 py-4 bg-neutral-100 text-navy-600 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-neutral-200">
                    SHARE BADGE
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl">🙏</div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-navy-900">Om Sai Ram, {user?.name?.split(' ')[0]}.</h3>
                  <p className="text-navy-500 mt-1">You scored <strong>{lastScore.correct}/{lastScore.total}</strong>.</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <p className="text-sm font-bold text-red-700">The pass mark is 2/{lastScore.total} — keep reflecting and try again.</p>
                  <p className="text-xs text-red-500 mt-2">The badge awaits your next attempt. 🌸</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleRetryQuiz} className="flex-1 py-4 bg-navy-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-navy-800">
                    TRY AGAIN
                  </button>
                  <button onClick={() => setShowResultModal(false)} className="flex-1 py-4 bg-neutral-100 text-navy-600 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-neutral-200">
                    REVIEW ANSWERS
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 bg-white border-b border-navy-50 flex justify-between items-center px-4 md:px-8 shrink-0 shadow-sm z-20">
        <button onClick={() => navigate('/book-club')} className="flex items-center gap-2 text-navy-400 hover:text-navy-900 transition-colors">
          <ChevronLeft size={20} /> <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Back to Map</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase text-gold-600 tracking-widest">{activeWeek.weekId} of {totalWeeks}</span>
          <h2 className="text-sm font-bold text-navy-900 truncate max-w-[200px] md:max-w-md">{activeWeek.chapterTitle}</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSidePanel(true)} className="p-2 text-navy-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all" title="Reflection">
            <Sparkles size={20} />
          </button>
          <button onClick={() => setIsBriefcaseOpen(true)} className="p-2 text-navy-400 hover:text-navy-900 hover:bg-neutral-100 rounded-full transition-all flex items-center gap-1" title="Briefcase">
            <Briefcase size={20} />
            {briefcase.length > 0 && <span className="text-[10px] font-bold bg-gold-100 text-gold-700 px-1.5 rounded-full">{briefcase.length}</span>}
          </button>
        </div>
      </header>

      <div className="flex-grow flex relative min-h-0 overflow-hidden">
        <main ref={readingContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth bg-neutral-50">
          <div className="max-w-4xl mx-auto p-8 md:p-12">

            {/* Cover Image + Title + Progress Strip */}
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              {/* 2. Always-shown cover image with fallback */}
              <div className="w-full md:w-52 shrink-0 rounded-2xl overflow-hidden shadow-xl bg-white p-2 border border-navy-50 rotate-[-1.5deg]">
                <img
                  src={activeWeek.imageUrl || DEFAULT_COVER}
                  className="w-full h-56 object-cover rounded-xl"
                  alt="Chapter Art"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = DEFAULT_COVER; }}
                />
              </div>
              <div className="flex-grow space-y-4 w-full">
                {/* 5. Progress strip */}
                <div className="bg-navy-50 rounded-xl px-4 py-2 text-[10px] font-bold text-navy-400 flex flex-wrap gap-x-3 gap-y-1 uppercase tracking-wider">
                  <span className="text-navy-600 font-black">W{String(weekIndex + 1).padStart(2, '0')} of {totalWeeks}</span>
                  <span>·</span>
                  <span>Released {releaseDateStr}</span>
                  {nextWeek && (
                    <>
                      <span>·</span>
                      <span>Next: {nextWeek.weekId} on {nextWeekReleaseStr} — <em>{nextWeek.chapterTitle}</em></span>
                    </>
                  )}
                </div>

                <div>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-2">{activeWeek.chapterTitle}</h1>
                  <p className="text-navy-400 font-medium italic">{activeWeek.book}</p>
                  {activeWeek.pages && <p className="text-[11px] text-navy-300 mt-1 uppercase tracking-widest font-bold">{activeWeek.pages}</p>}
                </div>

                {/* 7. MCQ badge with grammar fix */}
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-navy-300">
                  <span className="flex items-center gap-1"><Clock size={12} /> {activeWeek.durationMinutes} Min Read</span>
                  <span className="w-1 h-1 bg-navy-200 rounded-full" />
                  <button
                    onClick={() => readingContainerRef.current?.scrollTo({ top: readingContainerRef.current.scrollHeight, behavior: 'smooth' })}
                    className="flex items-center gap-1 hover:text-navy-900 cursor-pointer bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Assessment: {activeWeek.questions.length} {activeWeek.questions.length === 1 ? 'MCQ' : 'MCQs'}
                  </button>
                </div>

                {/* Key Learnings */}
                <div className="bg-white p-5 rounded-2xl border border-navy-50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gold-600 mb-3">Key Learnings</h4>
                  <ul className="space-y-2">
                    {(activeWeek.learningOutcomes || ['Understand the inner meaning']).map((lo, i) => (
                      <li key={i} className="flex gap-3 text-sm text-navy-700">
                        <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                        {lo}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Chapter Summary */}
            {activeWeek.summaryRaw && activeWeek.summaryRaw.length > 50 && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-4 flex items-center gap-2">
                  <BookOpen size={14} /> Chapter Overview
                </h4>
                <div
                  className="prose prose-sm prose-amber max-w-none font-serif text-amber-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: activeWeek.summaryRaw }}
                />
              </div>
            )}

            {/* Reading iframe */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-navy-50 min-h-[80vh] relative">
              {activeWeek.sourceUrl ? (
                <iframe
                  src={activeWeek.sourceUrl}
                  className="w-full h-full min-h-[80vh] border-none"
                  title="Reading Material"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              ) : (
                <div className="p-12 prose prose-lg font-serif text-navy-800 mx-auto" dangerouslySetInnerHTML={{ __html: activeWeek.summaryRaw || activeWeek.contentRaw }} />
              )}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-xl border border-navy-50 shadow-lg">
                <a href={activeWeek.sourceUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-gold-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-navy-800">
                  <ExternalLink size={12} /> Open on Source Site
                </a>
              </div>
            </div>

            {/* 6. Prev / Next Week Navigation */}
            <div className="flex justify-between items-center mt-10 gap-4">
              {prevWeek ? (
                <button
                  onClick={() => navigate(`/book-club/${prevWeek.weekId}`)}
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-navy-100 text-navy-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-navy-50 transition-colors shadow-sm"
                >
                  <ChevronLeft size={16} /> {prevWeek.weekId} · {prevWeek.chapterTitle}
                </button>
              ) : <div />}

              {nextWeek ? (
                new Date(nextWeek.publishAt) > new Date() ? (
                  <button disabled className="flex items-center gap-2 px-5 py-3 bg-neutral-100 text-neutral-400 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-not-allowed shadow-sm">
                    {nextWeek.weekId} opens {nextWeekReleaseStr} <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/book-club/${nextWeek.weekId}`)}
                    className="flex items-center gap-2 px-5 py-3 bg-navy-900 text-gold-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-navy-800 transition-colors shadow-lg"
                  >
                    Continue to {nextWeek.weekId} · {nextWeek.chapterTitle} <ArrowRight size={16} />
                  </button>
                )
              ) : null}
            </div>

            {/* 8. Reflection Teaser Card */}
            {activeWeek.reflectionPrompts && activeWeek.reflectionPrompts.length > 0 && (
              <div className="mt-8 bg-purple-50 border border-purple-200 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-purple-700">
                    <Sparkles size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Reflection Corner</span>
                  </div>
                  <button
                    onClick={() => setShowSidePanel(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-full transition-colors"
                  >
                    Share Your Reflection <ArrowRight size={12} />
                  </button>
                </div>
                <p className="text-sm font-medium italic text-purple-900 leading-relaxed">
                  "{activeWeek.reflectionPrompts[0]}"
                </p>
                {activeWeek.reflectionPrompts.length > 1 && (
                  <p className="text-[11px] text-purple-500 mt-3">+{activeWeek.reflectionPrompts.length - 1} more prompt{activeWeek.reflectionPrompts.length > 2 ? 's' : ''} in the Reflection panel →</p>
                )}
              </div>
            )}

            {/* Knowledge Checkpoint — permanently visible, both buttons independent */}
            <div className="mt-12 pb-20">
              {!showQuiz ? (
                <div className="bg-navy-900 text-white p-10 rounded-[3rem] shadow-2xl text-center space-y-8 border-4 border-gold-500">
                  <div>
                    <Trophy size={48} className="mx-auto mb-4 text-gold-500" />
                    <h3 className="text-3xl font-serif font-bold">Knowledge Checkpoint</h3>
                    <p className="text-navy-200 mt-2 font-medium">Verify your understanding to earn badges.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {/* Mark as Read — awards Completion Badge */}
                    <button
                      onClick={handleMarkRead}
                      disabled={hasMarkedRead || isSubmitting || user?.isGuest}
                      className={`p-6 rounded-[2rem] border transition-all ${hasMarkedRead || user?.isGuest
                        ? 'bg-white/5 border-white/10 opacity-70 cursor-not-allowed'
                        : isSubmitting
                          ? 'opacity-50 cursor-not-allowed border-white/10 bg-white/5'
                          : 'bg-white/10 hover:bg-white/20 border-white/10 hover:scale-[1.02]'
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {user?.isGuest ? <Lock size={20} className="text-navy-300" /> : <CheckCircle2 size={20} className={hasMarkedRead ? 'text-green-400' : 'text-blue-300'} />}
                        <span className="block text-xl font-bold">{hasMarkedRead ? 'Reading Done ✓' : 'Mark as Read'}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">
                        {user?.isGuest ? 'Sign in to save progress' : hasMarkedRead ? 'Completion badge earned' : 'Earn Completion Badge'}
                      </span>
                    </button>

                    {/* Take Quiz — awards Excellence Badge, always active */}
                    <button
                      onClick={handleTakeQuiz}
                      disabled={user?.isGuest}
                      style={{ background: user?.isGuest ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #F5C842 0%, #D4A017 100%)' }}
                      className={`p-6 text-navy-900 rounded-[2rem] shadow-lg transition-all ${user?.isGuest ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {user?.isGuest ? <Lock size={20} className="text-navy-300" /> : <Sparkles size={20} />}
                        <span className={`block text-xl font-bold ${user?.isGuest ? 'text-white' : ''}`}>{hasEarnedExcellence ? 'Retake Quiz' : 'Take the Quiz'}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest opacity-80 ${user?.isGuest ? 'text-navy-300' : ''}`}>
                        {user?.isGuest ? 'Sign in to take quiz' : hasEarnedExcellence
                          ? 'Excellence badge earned ✨'
                          : `${activeWeek.questions.length} Qs · ~${Math.ceil(activeWeek.questions.length * 0.75)} mins — Earn Excellence Badge`}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => setShowQuiz(false)} className="mb-6 flex items-center gap-2 text-navy-400 hover:text-navy-700 text-xs font-black uppercase tracking-widest transition-colors">
                    <ChevronLeft size={16} /> Back to Chapter
                  </button>
                  <QuizComponent week={activeWeek} onComplete={handleQuizComplete} />
                </>
              )}
            </div>
          </div>
        </main>

        {/* 4. Reflection Drawer */}
        <aside className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white border-l border-navy-50 shadow-2xl transform transition-transform duration-300 z-30 flex flex-col ${showSidePanel ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-navy-50 flex justify-between items-center bg-neutral-50">
            <h3 className="font-serif font-bold text-xl text-navy-900">Reflection</h3>
            <button onClick={() => setShowSidePanel(false)} className="p-2 hover:bg-navy-100 rounded-full text-navy-400"><X size={20} /></button>
          </div>

          <div className="flex-grow p-8 overflow-y-auto space-y-8">
            <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
              <div className="flex items-center gap-2 text-purple-700 mb-4">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Contemplate</span>
              </div>
              <div className="space-y-4">
                {(activeWeek.reflectionPrompts || ["What spiritual lesson did you derive today?"]).map((p, i) => (
                  <p key={i} className="text-sm font-medium italic text-purple-900 leading-relaxed">"{p}"</p>
                ))}
              </div>
            </div>

            <textarea
              className="w-full h-64 p-6 rounded-3xl border-2 border-neutral-100 bg-neutral-50 focus:bg-white focus:border-gold-500 outline-none resize-none font-serif text-lg leading-relaxed text-navy-800 transition-all placeholder:text-navy-200"
              placeholder="Pour your heart out here..."
              value={reflection}
              onChange={e => setReflection(e.target.value)}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl cursor-pointer" onClick={() => setIsReflectionPublic(!isReflectionPublic)}>
                <span className="text-xs font-bold text-navy-700">Make Public?</span>
                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isReflectionPublic ? 'bg-teal-500' : 'bg-neutral-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isReflectionPublic ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
              <p className="text-[9px] text-navy-300 text-center px-4">Public reflections are moderated before appearing in the community feed.</p>

              <button
                onClick={handleSaveReflection}
                disabled={user?.isGuest}
                className={`w-full py-5 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl transition-all ${user?.isGuest ? 'bg-navy-900/10 text-navy-400 cursor-not-allowed' : 'bg-navy-900 text-white hover:bg-navy-800'}`}
              >
                {user?.isGuest ? <><Lock size={12} className="inline mr-1" /> Sign in to save reflection</> : 'Save to Briefcase'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookClubPage;
