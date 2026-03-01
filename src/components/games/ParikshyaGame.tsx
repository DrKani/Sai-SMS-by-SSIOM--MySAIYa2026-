import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    CheckCircle2, XCircle, ArrowRight, RotateCcw,
    Trophy, Check, Lock, PlayCircle, Crown, Medal, Award, Shield,
    Clock, Zap, Eye, BarChart2, Lightbulb, Star, ChevronLeft, AlertCircle
} from 'lucide-react';
import { PARIKSHYA_LEVELS, ParikshyaLevel, ParikshyaQuestion } from '../../data/parikshyaData';

// --- Types ---
interface QuestionState {
    attemptsUsed: number;
    selectedOption: number | null;
    answeredCorrectly: boolean;
    locked: boolean;
    pointsEarned: number;
    eliminated: number[];
}

interface LevelProgress {
    bestScore: number;
    attempts: number;
    completed: boolean;
}

type GameScreen = 'hub' | 'playing' | 'summary';

// --- Helpers ---
const USER_KEY = () => {
    try { const u = JSON.parse(localStorage.getItem('sms_user') || '{}'); return u.uid || 'guest'; }
    catch { return 'guest'; }
};

const loadProgress = (levelId: string): LevelProgress | null => {
    try {
        const raw = localStorage.getItem(`sms_parikshya2_${USER_KEY()}_${levelId}`);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

const saveProgress = (levelId: string, scorePercent: number) => {
    const key = `sms_parikshya2_${USER_KEY()}_${levelId}`;
    const current = loadProgress(levelId);
    const next: LevelProgress = {
        bestScore: current ? Math.max(current.bestScore, scorePercent) : scorePercent,
        attempts: (current?.attempts || 0) + 1,
        completed: (current?.bestScore || 0) >= 60 || scorePercent >= 60,
    };
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event('storage'));
};

const isLevelUnlocked = (levelIdx: number): boolean => {
    if (levelIdx === 0) return true;
    const prev = PARIKSHYA_LEVELS[levelIdx - 1];
    const prog = loadProgress(prev.id);
    return prog !== null && prog.completed;
};

const getBadgeIcon = (bestScore: number | null) => {
    if (bestScore === null) return null;
    if (bestScore >= 90) return <Crown size={16} className="text-yellow-400" />;
    if (bestScore >= 70) return <Medal size={16} className="text-slate-300" />;
    return <Award size={16} className="text-amber-600" />;
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', badge: 'bg-amber-500' },
    blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', badge: 'bg-blue-500' },
    purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', badge: 'bg-purple-500' },
    yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', badge: 'bg-yellow-500' },
    cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', badge: 'bg-cyan-500' },
    pink: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400', badge: 'bg-pink-500' },
    green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', badge: 'bg-green-500' },
    indigo: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/50', text: 'text-indigo-400', badge: 'bg-indigo-500' },
    orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', badge: 'bg-orange-500' },
    rose: { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-400', badge: 'bg-rose-500' },
};

const VALUE_COLORS: Record<string, string> = {
    'Truth': 'bg-blue-500', 'Right Conduct': 'bg-green-500', 'Peace': 'bg-purple-500',
    'Love': 'bg-pink-500', 'Non-violence': 'bg-amber-500',
};

// --- Circular Timer ---
const CircularTimer = ({ pct, time, warn }: { pct: number; time: number; warn: boolean }) => {
    const r = 20, circ = 2 * Math.PI * r;
    return (
        <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
            <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r={r} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/10" />
                <circle cx="24" cy="24" r={r} stroke="currentColor" strokeWidth="3" fill="transparent"
                    strokeDasharray={circ} style={{ strokeDashoffset: circ - (pct / 100) * circ, transition: 'stroke-dashoffset 0.9s linear' }}
                    className={warn ? 'text-red-500' : 'text-gold-500'} />
            </svg>
            <span className={`absolute text-[10px] font-black ${warn ? 'text-red-400' : 'text-white'}`}>{time}s</span>
        </div>
    );
};

// ====== MAIN COMPONENT ======
export default function ParikshyaGame() {
    const [screen, setScreen] = useState<GameScreen>('hub');
    const [level, setLevel] = useState<ParikshyaLevel | null>(null);
    const [qIdx, setQIdx] = useState(0);
    const [states, setStates] = useState<QuestionState[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [lifelines, setLifelines] = useState({ fiftyFifty: 1, insight: 1, timeExt: 1 });
    const [bonusVibhuti, setBonusVibhuti] = useState(false);
    const timerRef = useRef<any>(null);

    const startLevel = useCallback((lev: ParikshyaLevel) => {
        setLevel(lev);
        setQIdx(0);
        setTimeLeft(lev.timerSeconds);
        setStates(lev.questions.map(() => ({ attemptsUsed: 0, selectedOption: null, answeredCorrectly: false, locked: false, pointsEarned: 0, eliminated: [] })));
        setLifelines({ fiftyFifty: 1, insight: 1, timeExt: 1 });
        setBonusVibhuti(true);
        setScreen('playing');
    }, []);

    // Timer
    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (screen !== 'playing' || !level) return;
        const cur = states[qIdx];
        if (!cur || cur.answeredCorrectly || cur.locked) return;
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setStates(s => { const n = [...s]; n[qIdx] = { ...n[qIdx], locked: true }; return n; });
                    setBonusVibhuti(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [screen, qIdx, states[qIdx]?.locked, states[qIdx]?.answeredCorrectly]);

    const handleAnswer = (optIdx: number) => {
        if (!level) return;
        const cur = states[qIdx];
        if (cur.answeredCorrectly || cur.locked) return;
        if (cur.eliminated.includes(optIdx)) return;
        const isCorrect = optIdx === level.questions[qIdx].correctIndex;
        const newAttempts = cur.attemptsUsed + 1;
        const pts = isCorrect ? level.pointsPerAttempt[Math.min(newAttempts - 1, 2)] : 0;
        if (!isCorrect) setBonusVibhuti(false);
        if (isCorrect || newAttempts >= 3) clearInterval(timerRef.current);
        setStates(prev => {
            const n = [...prev];
            n[qIdx] = { ...n[qIdx], selectedOption: optIdx, attemptsUsed: newAttempts, answeredCorrectly: isCorrect, pointsEarned: pts, locked: isCorrect || newAttempts >= 3 };
            return n;
        });
    };

    const handleNext = () => {
        if (!level) return;
        if (qIdx < level.questions.length - 1) {
            setQIdx(q => q + 1);
            setTimeLeft(level.timerSeconds);
        } else {
            // Finish
            clearInterval(timerRef.current);
            const maxPts = level.questions.length * level.pointsPerAttempt[0];
            const earned = states.reduce((a, s) => a + s.pointsEarned, 0) + (bonusVibhuti ? 10 : 0);
            const pct = Math.round((earned / maxPts) * 100);
            saveProgress(level.id, pct);
            // Save to briefcase
            try {
                const u = JSON.parse(localStorage.getItem('sms_user') || '{}');
                if (u.uid && !u.isGuest) {
                    const bKey = `sms_briefcase_${u.uid}`;
                    const b = JSON.parse(localStorage.getItem(bKey) || '[]');
                    b.push({ id: Date.now().toString(), type: 'quiz_result', title: `Parikshya: ${level.title}`, content: { score: pct }, timestamp: new Date().toISOString() });
                    localStorage.setItem(bKey, JSON.stringify(b));
                }
            } catch { }
            setScreen('summary');
        }
    };

    // --- Lifeline handlers ---
    const useFiftyFifty = () => {
        if (!level || lifelines.fiftyFifty <= 0) return;
        const q = level.questions[qIdx];
        const wrong = [0, 1, 2, 3].filter(i => i !== q.correctIndex && !states[qIdx].eliminated.includes(i));
        const toElim = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
        setStates(prev => { const n = [...prev]; n[qIdx] = { ...n[qIdx], eliminated: [...n[qIdx].eliminated, ...toElim] }; return n; });
        setLifelines(l => ({ ...l, fiftyFifty: 0 }));
        setBonusVibhuti(false);
    };
    const useTimeExt = () => {
        if (lifelines.timeExt <= 0) return;
        setTimeLeft(t => t + 10);
        setLifelines(l => ({ ...l, timeExt: 0 }));
    };
    const useInsight = () => {
        if (!level || lifelines.insight <= 0) return;
        const q = level.questions[qIdx];
        alert(`Sai Insight: ${q.explanation}`);
        setLifelines(l => ({ ...l, insight: 0 }));
        setBonusVibhuti(false);
    };

    // ====== HUB ======
    if (screen === 'hub') {
        return (
            <section className="bg-navy-900 p-6 md:p-10 rounded-bento shadow-2xl border-4 border-gold-500/20 text-white">
                <header className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold-500/20 rounded-full mb-4">
                        <Star size={12} className="text-gold-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold-400">Test of Truth — The Sacred Quiz</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3">Sai SMS Parikshya</h2>
                    <p className="text-navy-200 text-sm max-w-lg mx-auto">Values-based quizzes on Swami's life, teachings, and sadhana. Complete each level to unlock the next.</p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PARIKSHYA_LEVELS.map((lev, idx) => {
                        const prog = loadProgress(lev.id);
                        const unlocked = isLevelUnlocked(idx);
                        const colors = COLOR_MAP[lev.colorClass] || COLOR_MAP.amber;
                        return (
                            <div key={lev.id} className={`rounded-2xl p-5 border transition-all flex flex-col ${unlocked ? `${colors.bg} ${colors.border} hover:scale-[1.02]` : 'bg-white/5 border-white/10 opacity-50'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${colors.badge} text-white`}>Level {lev.levelNum}</span>
                                    <div className="flex items-center gap-1">
                                        {prog ? getBadgeIcon(prog.bestScore) : unlocked ? null : <Lock size={14} className="text-white/30" />}
                                        {prog && <span className="text-[10px] text-white/50 font-bold">{prog.bestScore}%</span>}
                                    </div>
                                </div>
                                <h3 className={`font-bold text-sm mb-1 ${colors.text}`}>{lev.title}</h3>
                                <p className="text-white/50 text-[11px] mb-3 flex-grow">{lev.subtitle}</p>
                                <div className="flex justify-between text-[10px] text-white/40 font-black uppercase mb-4">
                                    <span><Clock size={10} className="inline mr-1" />{lev.timerSeconds}s/Q</span>
                                    <span>{lev.questions.length} Questions</span>
                                    <span>{lev.badge}</span>
                                </div>
                                {unlocked ? (
                                    <button onClick={() => startLevel(lev)} className="w-full py-3 bg-gold-gradient text-navy-900 font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all flex justify-center items-center gap-2">
                                        <PlayCircle size={14} /> {prog ? 'Replay' : 'Begin Parikshya'}
                                    </button>
                                ) : (
                                    <div className="w-full py-3 bg-white/5 text-white/30 font-black uppercase tracking-widest text-[10px] rounded-xl text-center flex justify-center items-center gap-2">
                                        <Lock size={12} /> Score 60%+ on Level {idx} to unlock
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }

    // ====== SUMMARY ======
    if (screen === 'summary' && level) {
        const maxPts = level.questions.length * level.pointsPerAttempt[0];
        const earned = states.reduce((a, s) => a + s.pointsEarned, 0) + (bonusVibhuti ? 10 : 0);
        const pct = Math.round((earned / maxPts) * 100);
        const correct = states.filter(s => s.answeredCorrectly).length;
        const valueCounts: Record<string, number> = {};
        states.forEach((s, i) => { if (s.answeredCorrectly) { const v = level.questions[i].valueTag; valueCounts[v] = (valueCounts[v] || 0) + 1; } });
        const passed = pct >= 60;
        const nextLevelIdx = PARIKSHYA_LEVELS.findIndex(l => l.id === level.id) + 1;
        const nextLevel = nextLevelIdx < PARIKSHYA_LEVELS.length ? PARIKSHYA_LEVELS[nextLevelIdx] : null;
        return (
            <section className="bg-navy-900 p-8 md:p-12 rounded-bento shadow-2xl border-4 border-gold-500/20 text-white">
                <div className="text-center mb-10">
                    <div className={`w-24 h-24 ${passed ? 'bg-gold-gradient' : 'bg-white/10'} rounded-[2rem] flex items-center justify-center mx-auto mb-6 ${passed ? 'animate-bounce' : ''}`}>
                        <Trophy size={44} className={passed ? 'text-navy-900' : 'text-white/40'} />
                    </div>
                    <h2 className="text-4xl font-serif font-bold">{passed ? 'Level Complete!' : 'Keep Practising'}</h2>
                    <p className="text-gold-500/60 text-[11px] uppercase tracking-widest font-black mt-2">{level.title}</p>
                    {bonusVibhuti && <p className="text-amber-400 text-xs font-bold mt-2">+10 Vibhuti Bonus — No lifelines used!</p>}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-navy-800 rounded-2xl p-6 text-center border border-white/5">
                        <span className="text-[10px] font-black text-gold-500 uppercase block mb-1">Score</span>
                        <span className="text-4xl font-black">{pct}%</span>
                    </div>
                    <div className="bg-navy-800 rounded-2xl p-6 text-center border border-white/5">
                        <span className="text-[10px] font-black text-gold-500 uppercase block mb-1">Correct</span>
                        <span className="text-4xl font-black text-teal-400">{correct}<span className="text-sm text-white/30">/{level.questions.length}</span></span>
                    </div>
                    <div className="bg-navy-800 rounded-2xl p-6 text-center border border-white/5">
                        <span className="text-[10px] font-black text-gold-500 uppercase block mb-1">Points</span>
                        <span className="text-4xl font-black text-amber-400">{earned}</span>
                    </div>
                </div>
                {Object.keys(valueCounts).length > 0 && (
                    <div className="bg-navy-800 rounded-2xl p-5 mb-6 border border-white/5">
                        <span className="text-[10px] font-black text-gold-500 uppercase block mb-3">Values Demonstrated</span>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(valueCounts).map(([val, cnt]) => (
                                <span key={val} className={`px-3 py-1 rounded-full text-white text-xs font-bold ${VALUE_COLORS[val] || 'bg-gray-500'}`}>{val} ×{cnt}</span>
                            ))}
                        </div>
                    </div>
                )}
                <p className="text-center italic text-navy-200 text-sm mb-8">"The true Parikshya is how we live these answers in our daily life." — Bhagawan</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={() => setScreen('hub')} className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white/20 transition-all">
                        <ChevronLeft size={14} className="inline mr-1" /> All Levels
                    </button>
                    <button onClick={() => startLevel(level)} className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white/20 transition-all flex items-center gap-2">
                        <RotateCcw size={14} /> Replay
                    </button>
                    {passed && nextLevel && (
                        <button onClick={() => startLevel(nextLevel)} className="px-8 py-4 bg-gold-gradient text-navy-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                            Next Level <ArrowRight size={14} />
                        </button>
                    )}
                </div>
            </section>
        );
    }

    // ====== PLAYING ======
    if (screen !== 'playing' || !level) return null;
    const q = level.questions[qIdx];
    const cur = states[qIdx];
    const colors = COLOR_MAP[level.colorClass] || COLOR_MAP.amber;
    const isAnswered = cur.answeredCorrectly || cur.locked;
    const canNext = isAnswered;

    return (
        <section className="bg-navy-900 p-6 md:p-10 rounded-bento shadow-2xl border-4 border-gold-500/20 flex flex-col min-h-[700px] text-white">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold-500/60">{level.title}</p>
                    <p className="text-[11px] text-white/40 font-bold">Question {qIdx + 1} / {level.questions.length}</p>
                </div>
                <CircularTimer pct={(timeLeft / level.timerSeconds) * 100} time={timeLeft} warn={timeLeft <= 5} />
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-white/30">Points</p>
                    <p className="text-xl font-black text-gold-500">{states.reduce((a, s) => a + s.pointsEarned, 0)}</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-1 mb-6">
                <div className="bg-gold-gradient h-1 rounded-full transition-all" style={{ width: `${((qIdx + (isAnswered ? 1 : 0)) / level.questions.length) * 100}%` }} />
            </div>

            {/* Value + Difficulty tags */}
            <div className="flex gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${VALUE_COLORS[q.valueTag] || 'bg-gray-500'}`}>{q.valueTag}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white bg-white/10">{q.difficulty}</span>
            </div>

            {/* Question */}
            <h2 className="text-xl md:text-2xl font-serif leading-relaxed mb-6 flex-grow">{q.questionText}</h2>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {q.options.map((opt, i) => {
                    const isElim = cur.eliminated.includes(i);
                    const isSelected = cur.selectedOption === i;
                    const isCorrect = i === q.correctIndex;
                    let cls = "p-4 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center text-sm ";
                    if (isElim) cls += "opacity-20 cursor-not-allowed bg-white/5 border-white/5";
                    else if (isAnswered) {
                        if (isCorrect) cls += "bg-teal-500/30 border-teal-400 text-white";
                        else if (isSelected) cls += "bg-red-500/20 border-red-500 text-red-300";
                        else cls += "bg-white/5 border-white/5 opacity-40";
                    } else {
                        cls += isSelected ? "border-gold-500 bg-gold-500/10 text-gold-300" : "border-white/10 hover:border-white/30 bg-white/5 cursor-pointer";
                    }
                    return (
                        <button key={i} disabled={isElim || isAnswered} onClick={() => handleAnswer(i)} className={cls}>
                            <span>{opt}</span>
                            {isAnswered && isCorrect && <CheckCircle2 size={18} className="text-teal-400 flex-shrink-0 ml-2" />}
                            {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-red-400 flex-shrink-0 ml-2" />}
                        </button>
                    );
                })}
            </div>

            {/* Attempt feedback */}
            {cur.attemptsUsed === 1 && !cur.answeredCorrectly && !cur.locked && (
                <div className="p-4 bg-amber-500/20 border border-amber-500/50 rounded-2xl mb-4 flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
                    <p className="text-sm font-bold text-amber-200">Incorrect — you have 2 more attempts.</p>
                </div>
            )}
            {cur.attemptsUsed === 2 && !cur.answeredCorrectly && !cur.locked && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl mb-4 flex items-center gap-3">
                    <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                    <p className="text-sm font-bold text-red-200">Last attempt! Choose carefully.</p>
                </div>
            )}
            {isAnswered && (
                <div className={`p-5 rounded-2xl mb-4 border ${cur.answeredCorrectly ? 'bg-teal-500/20 border-teal-500/50' : 'bg-red-500/20 border-red-500/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {cur.answeredCorrectly ? <Check size={16} className="text-teal-400" /> : <Lock size={16} className="text-red-400" />}
                        <span className="text-[11px] font-black uppercase tracking-widest">{cur.answeredCorrectly ? 'Sai Insight' : 'Explanation'}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/80 italic">{q.explanation}</p>
                </div>
            )}

            {/* Lifelines + Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {/* Lifelines */}
                <div className="flex gap-2">
                    <button onClick={useFiftyFifty} disabled={lifelines.fiftyFifty <= 0 || isAnswered} title="50:50 — Remove 2 wrong options"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all ${lifelines.fiftyFifty > 0 && !isAnswered ? 'bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-400' : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'}`}>
                        <Eye size={14} />
                    </button>
                    <button onClick={useTimeExt} disabled={lifelines.timeExt <= 0 || isAnswered} title="Time Extension +10s"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${lifelines.timeExt > 0 && !isAnswered ? 'bg-blue-500/20 border border-blue-500/50 hover:bg-blue-500/30 text-blue-400' : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'}`}>
                        <Clock size={14} />
                    </button>
                    <button onClick={useInsight} disabled={lifelines.insight <= 0 || isAnswered} title="Sai Insight — Reveal explanation"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${lifelines.insight > 0 && !isAnswered ? 'bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/30 text-purple-400' : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'}`}>
                        <Lightbulb size={14} />
                    </button>
                    <button onClick={() => { if (window.confirm('Exit quiz? Progress will not be saved for this attempt.')) setScreen('hub'); }}
                        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-500/50 transition-all">
                        <XCircle size={14} />
                    </button>
                </div>

                {/* Next */}
                <button disabled={!canNext} onClick={handleNext}
                    className={`px-8 py-3 font-black uppercase tracking-widest text-[11px] rounded-xl transition-all flex items-center gap-2 ${canNext ? 'bg-gold-gradient text-navy-900 hover:scale-105 active:scale-95 shadow-lg' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>
                    {qIdx < level.questions.length - 1 ? 'Next' : 'Finish'} <ArrowRight size={14} />
                </button>
            </div>
        </section>
    );
}
