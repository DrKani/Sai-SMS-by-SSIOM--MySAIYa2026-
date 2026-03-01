import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ArrowLeft, Trophy, Clock, Search, CheckCircle2, Lock, Sparkles, Gamepad2, Info, ArrowRight, HelpCircle, X, Play, Pause, XCircle } from 'lucide-react';
import { crosswordPuzzles } from '../../data/crosswordPuzzles';
import { useGameSound } from '../../hooks/useGameSound';
import { loadCrosswordProgressFromFirestore, saveCrosswordProgressToFirestore, appendSaiInsight } from '../../lib/crosswordFirestore';

// --- TYPES ---
export type Difficulty = 'seeker' | 'scholar' | 'master';

interface CrosswordProgress {
    id: string;
    bestScore: number;
    completed: boolean;
}

// --- MAIN COMPONENT ---
const SacredCrossword: React.FC = () => {
    const { playSound, isMuted, toggleMute } = useGameSound();
    const [view, setView] = useState<'gallery' | 'pregame' | 'game' | 'result'>('gallery');
    const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>('scholar');
    const [progress, setProgress] = useState<Record<string, CrosswordProgress>>({});

    // Tutorial State
    const [showTutorial, setShowTutorial] = useState(false);
    const [tourStep, setTourStep] = useState(1);

    useEffect(() => {
        // Load local progress
        const stored = localStorage.getItem('sms_crossword_progress');
        let initialProgress = stored ? JSON.parse(stored) : { '1': { id: '1', bestScore: 0, completed: false } };

        // Load firestore progress
        const userStr = localStorage.getItem('sms_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.uid && !user.isGuest) {
                    loadCrosswordProgressFromFirestore(user.uid).then(fbProgress => {
                        if (fbProgress && Object.keys(fbProgress).length > 0) {
                            initialProgress = { ...initialProgress, ...fbProgress };
                            setProgress(initialProgress);
                            localStorage.setItem('sms_crossword_progress', JSON.stringify(initialProgress));
                        }
                    });
                }
            } catch { /* ignore */ }
        }

        setProgress(initialProgress);

        // Tutorial Check
        const tutorialDone = localStorage.getItem('sacredcrossword_tutorial_done');
        if (!tutorialDone) {
            setShowTutorial(true);
        }
    }, []);

    const saveProgress = async (id: string, score: number, completed: boolean, diff: string, hints: number) => {
        const next = { ...progress };
        const current = next[id] || { id, bestScore: 0, completed: false };

        next[id] = {
            id,
            bestScore: Math.max(current.bestScore, score),
            completed: current.completed || completed
        };

        // Progression Logic
        if (score >= 400) {
            const nextId = String(parseInt(id) + 1);
            if (parseInt(nextId) <= 10 && !next[nextId]) {
                next[nextId] = { id: nextId, bestScore: 0, completed: false };
            }
        }

        setProgress(next);
        localStorage.setItem('sms_crossword_progress', JSON.stringify(next));

        // Save to Firestore
        const userStr = localStorage.getItem('sms_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.uid && !user.isGuest) {
                    if (navigator.onLine) {
                        await saveCrosswordProgressToFirestore(user.uid, id, score, diff, hints);
                    } else {
                        // Offline queue pattern
                        const pending = JSON.parse(localStorage.getItem('sms_crossword_pending') || '[]');
                        pending.push({ id, score, diff, hints });
                        localStorage.setItem('sms_crossword_pending', JSON.stringify(pending));
                    }
                }
            } catch { /* ignore */ }
        }
    };

    const handleSelectPuzzle = (id: string) => {
        if (!progress[id]) return; // Locked
        setActivePuzzleId(id);
        setView('pregame');
        playSound('click');
    };

    const puzzle = crosswordPuzzles.find(p => p.id === activePuzzleId);

    // 11-colour palette in non-sequential shuffled order for card headers
    const PALETTE = [
        "linear-gradient(135deg, #22c55e, #15803d)",
        "linear-gradient(135deg, #a855f7, #7e22ce)",
        "linear-gradient(135deg, #06b6d4, #0891b2)",
        "linear-gradient(135deg, #f97316, #dc2626)",
        "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        "linear-gradient(135deg, #d946ef, #a21caf)",
        "linear-gradient(135deg, #16a34a, #ca8a04)",
        "linear-gradient(135deg, #facc15, #f59e0b)",
        "linear-gradient(135deg, #ec4899, #e11d48)",
        "linear-gradient(135deg, #2563eb, #1e40af)",
        "linear-gradient(135deg, #f59e0b, #d97706)",
    ];
    const SHUFFLE = [0, 4, 2, 7, 1, 9, 5, 3, 10, 6, 8];
    const puzzleGradient = (id: string) => PALETTE[SHUFFLE[(parseInt(id) - 1) % PALETTE.length]];

    // Render logic separated for readability
    return (
        <div className="w-full relative min-h-screen bg-[#FDFBF7] font-poppins">
            {/* Header */}
            <header className="bg-white shadow-lg border-b-4 border-green-500 sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {view !== 'gallery' && (
                            <button onClick={() => setView('gallery')} className="bg-gray-100 hover:bg-gray-200 text-[#002E5B] p-2 rounded-full transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h1 className="font-serif text-2xl font-extrabold text-[#002E5B] tracking-tight">Sai SMS Sacred Crossword</h1>
                            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">CHOOSE YOUR JOURNEY</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-gray-100 text-[#002E5B] flex items-center justify-center font-bold hover:bg-gray-200 transition-colors">
                            {isMuted ? "♪x" : "♪"}
                        </button>
                        <button onClick={() => setShowTutorial(true)} className="w-10 h-10 rounded-full bg-[#D2AC47] text-[#002E5B] flex items-center justify-center font-bold shadow-md hover:scale-105 transition-transform">
                            <Info size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {view === 'gallery' && (
                <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in text-center">
                    {/* Uniform Gallery Header */}
                    <div className="mb-10">
                        <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-[#002E5B] mb-2">Sai SMS Sacred Crossword</h1>
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-green-600 mb-3">CHOOSE YOUR JOURNEY</p>
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-50 border border-green-200 rounded-full">
                            <Sparkles size={14} className="text-green-600" />
                            <span className="text-sm font-semibold text-green-800 italic">Where Every Clue Leads to the Divine</span>
                        </div>
                    </div>

                    {/* 11-colour palette defined above — see puzzleGradient */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {crosswordPuzzles.map((p) => {
                            const isUnlocked = !!progress[p.id] || parseInt(p.id) <= 3;
                            const isCompleted = progress[p.id]?.completed;
                            return (
                                <div key={p.id} onClick={() => isUnlocked && handleSelectPuzzle(p.id)} className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border-2 ${isUnlocked ? 'cursor-pointer hover:scale-[1.03] hover:shadow-2xl border-transparent hover:border-green-400' : 'opacity-60 cursor-not-allowed border-gray-200 grayscale'}`}>
                                    {!isUnlocked && (
                                        <div className="absolute inset-0 z-30 bg-gray-100/50 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white/80 p-3 rounded-full shadow-lg"><Lock className="text-gray-400" /></div>
                                        </div>
                                    )}
                                    {isCompleted && (
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1.5 rounded-full z-20 shadow-md">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    )}
                                    <div className="h-24 w-full relative overflow-hidden flex items-center justify-center" style={{ background: puzzleGradient(p.id) }}>
                                        <div className="z-10 bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform">
                                            <Gamepad2 className="text-white drop-shadow-md" size={32} />
                                        </div>
                                    </div>
                                    <div className="p-6 text-left">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-green-50 text-green-700">LEVEL {p.id}</span>
                                            <span className="text-xs font-semibold text-gray-400">{p.gridData.result.length} Words</span>
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-[#002E5B] mb-2 leading-tight group-hover:text-green-700 transition-colors">{p.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{p.focus}</p>
                                    </div>
                                    <div className="px-6 pb-6 pt-2">
                                        <div className={`w-full py-2 text-center rounded-lg font-bold text-sm transition-colors ${!isUnlocked ? 'bg-gray-200 text-gray-400' : 'bg-green-50 text-green-700 group-hover:bg-green-500 group-hover:text-white'}`}>
                                            {!isUnlocked ? 'Locked' : 'Play Now'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {view === 'pregame' && puzzle && (
                <div className="w-full max-w-2xl mx-auto p-4 md:p-8 animate-fade-in flex flex-col items-center">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full border overflow-hidden relative text-center">
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${puzzle.gradient}`}></div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D2AC47] mb-4">Puzzle {puzzle.id}</h2>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#002E5B] mb-6">{puzzle.title}</h1>
                        <p className="text-lg text-gray-600 mb-10">{puzzle.focus}</p>

                        <div className="mb-10 text-left">
                            <h3 className="text-sm font-bold text-[#002E5B] uppercase tracking-widest mb-4">Choose Your Difficulty</h3>
                            <div className="grid gap-3">
                                {[
                                    { id: 'seeker', title: 'Sai Seeker (Easy)', desc: 'Direct clues, no timer, 1st letter pre-filled, unlimited hints.', mult: '1.0x' },
                                    { id: 'scholar', title: 'Sai Scholar (Medium)', desc: 'Standard clues, 15 min timer, 3 letter hints, 1 word hint.', mult: '1.5x' },
                                    { id: 'master', title: 'Sai Master (Hard)', desc: 'Cryptic clues, 8 min timer, 1 letter hint, no word hints.', mult: '2.0x' }
                                ].map((d) => (
                                    <div key={d.id} onClick={() => setDifficulty(d.id as Difficulty)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${difficulty === d.id ? 'border-[#D2AC47] bg-[#D2AC47]/10' : 'border-gray-100'}`}>
                                        <div>
                                            <h4 className="font-bold text-[#002E5B]">{d.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{d.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => { playSound('click'); setView('game'); }} className="w-full py-5 bg-gradient-to-r from-[#D2AC47] to-yellow-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl flex justify-center items-center gap-2">
                            Begin <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {view === 'game' && puzzle && (
                <CrosswordGame engine={{
                    puzzle, difficulty,
                    onComplete: (score, hints) => {
                        saveProgress(puzzle.id, score, true, difficulty, hints);
                        setView('result');
                    },
                    onQuit: () => setView('gallery')
                }} />
            )}

            {view === 'result' && puzzle && (
                <div className="w-full max-w-2xl mx-auto p-4 md:p-8 animate-fade-in text-center flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#D2AC47] to-yellow-600 rounded-full flex items-center justify-center shadow-2xl mb-8 animate-bounce mx-auto text-white">
                        <Trophy size={48} />
                    </div>
                    <h2 className="text-5xl font-serif font-bold text-[#002E5B] mb-2">Level Complete!</h2>
                    <p className="text-gray-500 mb-8">+108 units credited to National Namasmarana Counter for your dedication.</p>
                    <div className="bg-white rounded-3xl p-8 shadow-xl border w-full max-w-md mb-8">
                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Final Score</div>
                        <div className="text-6xl font-black text-[#D2AC47]">{progress[puzzle.id]?.bestScore}</div>
                    </div>
                    <div className="flex gap-4 w-full max-w-md">
                        <button onClick={() => setView('gallery')} className="flex-1 py-4 bg-gray-100 text-[#002E5B] rounded-2xl font-bold">Back</button>
                        {parseInt(puzzle.id) < 10 && (
                            <button onClick={() => { setActivePuzzleId(String(parseInt(puzzle.id) + 1)); setView('pregame'); }} className="flex-1 py-4 bg-[#002E5B] text-white rounded-2xl font-bold">Next Puzzle</button>
                        )}
                    </div>
                </div>
            )}

            {/* Tutorial Modal */}
            {showTutorial && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center relative">
                        <h2 className="text-2xl font-bold text-[#002E5B] mb-4">
                            {tourStep === 1 ? 'Welcome to Sacred Crossword' :
                                tourStep === 2 ? 'The Sacred Grid' :
                                    tourStep === 3 ? 'Choose Your Path' :
                                        tourStep === 4 ? 'Sai Tools' : 'Complete & Discover'}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {tourStep === 1 ? 'Om Sai Ram! Welcome to the SAI SMS Sacred Crossword. Uncover the divine journey word by word.' :
                                tourStep === 2 ? 'Tap a clue to highlight the cells. Type your answer to claim the word!' :
                                    tourStep === 3 ? 'Select from Seeker, Scholar, or Master difficulty before beginning each puzzle.' :
                                        tourStep === 4 ? 'Use Sai Letter and Sai Reveal if you get stuck, but beware of point penalties.' : 'Every word unlocks a Sai Insight. Complete all 10 puzzles to earn the Avatar of the Age badge.'}
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => { setShowTutorial(false); localStorage.setItem('sacredcrossword_tutorial_done', 'true'); }} className="flex-1 bg-gray-200 py-3 rounded-xl font-bold">Skip</button>
                            {tourStep < 5 ? (
                                <button onClick={() => setTourStep(t => t + 1)} className="flex-1 bg-[#002E5B] text-white py-3 rounded-xl font-bold">Next</button>
                            ) : (
                                <button onClick={() => { setShowTutorial(false); localStorage.setItem('sacredcrossword_tutorial_done', 'true'); }} className="flex-1 bg-[#D2AC47] text-white py-3 rounded-xl font-bold">Start Playing</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- GAME ENGINE ---
const CrosswordGame: React.FC<{ engine: any }> = ({ engine }) => {
    const { puzzle, difficulty, onComplete, onQuit } = engine;
    const { playSound } = useGameSound();

    const cols = puzzle.gridData.cols;
    const rows = puzzle.gridData.rows;

    const [gridState, setGridState] = useState<Record<string, { expected: string, current: string, isStart: boolean, number: number | null }>>({});
    const [clues, setClues] = useState<any[]>([]);
    const [selectedClue, setSelectedClue] = useState<string | null>(null);
    const [activeCell, setActiveCell] = useState<{ x: number, y: number } | null>(null);
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());

    // Scoring & Timers
    const [score, setScore] = useState(1000);
    const [timer, setTimer] = useState(difficulty === 'seeker' ? 0 : difficulty === 'scholar' ? 15 * 60 : 8 * 60);
    const [isPaused, setIsPaused] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);

    // Insight Toast & Modal
    const [toastMessage, setToastMessage] = useState<{ word: string, clue: string } | null>(null);

    const timerRef = useRef<any>(null);

    useEffect(() => {
        const newGrid: Record<string, any> = {};
        const clueList: any[] = [];
        const words = puzzle.gridData.result;
        let count = 1;

        words.forEach((w: any) => {
            if (w.orientation === 'none') return;
            clueList.push({ ...w, num: count });

            for (let i = 0; i < w.answer.length; i++) {
                const x = w.orientation === 'across' ? w.startx + i : w.startx;
                const y = w.orientation === 'down' ? w.starty + i : w.starty;
                const key = `${x},${y}`;
                if (!newGrid[key]) {
                    newGrid[key] = {
                        expected: w.answer[i],
                        current: (difficulty === 'seeker' && i === 0) ? w.answer[i] : '',
                        isStart: i === 0,
                        number: i === 0 ? count : null
                    };
                } else if (i === 0) {
                    newGrid[key].isStart = true;
                    if (!newGrid[key].number) newGrid[key].number = count;
                    else clueList[clueList.length - 1].num = newGrid[key].number;
                }
            }
            if (!selectedClue && clueList.length === 1) {
                setSelectedClue(w.answer);
                setActiveCell({ x: w.startx, y: w.starty });
            }
            count++;
        });

        setGridState(newGrid);
        setClues(clueList.sort((a, b) => a.num - b.num));

        const keyHandler = (e: KeyboardEvent) => handleKeyDown(e, newGrid, clueList, selectedClue, activeCell);
        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    }, [puzzle]);

    // Update listeners when state changes
    useEffect(() => {
        const keyHandler = (e: KeyboardEvent) => handleKeyDown(e, gridState, clues, selectedClue, activeCell);
        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    }, [gridState, clues, selectedClue, activeCell, foundWords, isPaused]);

    useEffect(() => {
        if (!isPaused && difficulty !== 'seeker') {
            timerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 0) {
                        endGame();
                        return 0;
                    }
                    if (prev % 5 === 0) setScore(s => Math.max(100, s - 1));
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [difficulty, isPaused]);

    const handleKeyDown = (e: KeyboardEvent, grid: any, allClues: any[], curClueStr: string | null, curCell: { x: number, y: number } | null) => {
        if (!curCell || !curClueStr || isPaused) return;
        const { x, y } = curCell;
        const clue = allClues.find(c => c.answer === curClueStr);
        if (!clue || foundWords.has(clue.answer)) return;

        if (e.key === 'Backspace') {
            setGridState(prev => {
                const s = { ...prev };
                s[`${x},${y}`].current = '';
                return s;
            });
            if (clue.orientation === 'across' && x > clue.startx) setActiveCell({ x: x - 1, y });
            else if (clue.orientation === 'down' && y > clue.starty) setActiveCell({ x, y: y - 1 });
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            const char = e.key.toUpperCase();
            setGridState(prev => {
                const s = { ...prev };
                s[`${x},${y}`].current = char;
                setTimeout(() => checkWordCompletion(clue, s), 10);
                return s;
            });

            if (clue.orientation === 'across' && x < clue.startx + clue.answer.length - 1) setActiveCell({ x: x + 1, y });
            else if (clue.orientation === 'down' && y < clue.starty + clue.answer.length - 1) setActiveCell({ x, y: y + 1 });
        } else if (e.key === 'ArrowRight' && clue.orientation === 'across' && x < clue.startx + clue.answer.length - 1) {
            setActiveCell({ x: x + 1, y });
        } else if (e.key === 'ArrowLeft' && clue.orientation === 'across' && x > clue.startx) {
            setActiveCell({ x: x - 1, y });
        } else if (e.key === 'ArrowDown' && clue.orientation === 'down' && y < clue.starty + clue.answer.length - 1) {
            setActiveCell({ x, y: y + 1 });
        } else if (e.key === 'ArrowUp' && clue.orientation === 'down' && y > clue.starty) {
            setActiveCell({ x, y: y - 1 });
        }
    };

    const checkWordCompletion = (clue: any, curGrid: any) => {
        if (foundWords.has(clue.answer)) return;
        let fullWord = '';
        let isFull = true;
        for (let i = 0; i < clue.answer.length; i++) {
            const cx = clue.orientation === 'across' ? clue.startx + i : clue.startx;
            const cy = clue.orientation === 'down' ? clue.starty + i : clue.starty;
            const cell = curGrid[`${cx},${cy}`];
            if (!cell || !cell.current) { isFull = false; break; }
            fullWord += cell.current;
        }
        if (isFull) {
            if (fullWord === clue.answer) {
                markWordFound(clue);
            } else {
                setScore(s => Math.max(100, s - 10)); // Incorrect Penalty
                playSound('fail');
            }
        }
    };

    const markWordFound = (clue: any) => {
        playSound('found');

        // Setup Insight Toast & Save Insight
        const insightPayload = { word: clue.answer, clue: clue.clue };
        setToastMessage(insightPayload);
        setTimeout(() => setToastMessage(null), 3000);

        const userStr = localStorage.getItem('sms_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.uid && !user.isGuest && navigator.onLine) {
                    appendSaiInsight(user.uid, insightPayload);
                }
            } catch { /* ignore */ }
        }

        setFoundWords(prev => {
            const next = new Set(prev);
            next.add(clue.answer);
            if (next.size === clues.length) {
                setTimeout(() => endGame(), 1000);
            }
            return next;
        });
        setScore(s => s + 50); // Correct word bonus
    };

    const useLetterHint = () => {
        if (difficulty === 'master' && hintsUsed >= 1) return;
        if (difficulty === 'scholar' && hintsUsed >= 3) return;
        if (!selectedClue) return;

        const clue = clues.find(c => c.answer === selectedClue);
        if (!clue || foundWords.has(clue.answer)) return;

        // Reveal one empty letter
        for (let i = 0; i < clue.answer.length; i++) {
            const cx = clue.orientation === 'across' ? clue.startx + i : clue.startx;
            const cy = clue.orientation === 'down' ? clue.starty + i : clue.starty;
            const key = `${cx},${cy}`;
            if (!gridState[key].current) {
                setGridState(prev => ({ ...prev, [key]: { ...prev[key], current: prev[key].expected } }));
                break;
            }
        }
        setScore(s => Math.max(100, s - 25));
        setHintsUsed(h => h + 1);
        playSound('hint');
    };

    const useWordHint = () => {
        if (difficulty === 'master') return; // Master: no word hints
        if (difficulty === 'scholar' && hintsUsed >= 1) return; // Share hint count tracking temporarily
        if (!selectedClue) return;

        const clue = clues.find(c => c.answer === selectedClue);
        if (!clue || foundWords.has(clue.answer)) return;

        setGridState(prev => {
            const next = { ...prev };
            for (let i = 0; i < clue.answer.length; i++) {
                const cx = clue.orientation === 'across' ? clue.startx + i : clue.startx;
                const cy = clue.orientation === 'down' ? clue.starty + i : clue.starty;
                next[`${cx},${cy}`].current = next[`${cx},${cy}`].expected;
            }
            return next;
        });

        setScore(s => Math.max(100, s - 50));
        setHintsUsed(h => h + 1);
        markWordFound(clue);
    };

    const endGame = () => {
        clearInterval(timerRef.current);
        playSound('levelComplete');
        const mult = difficulty === 'seeker' ? 1.0 : difficulty === 'scholar' ? 1.5 : 2.0;
        const finalScore = Math.floor(score * mult);
        onComplete(finalScore, hintsUsed);
    };

    const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;

    return (
        <div className="w-full flex justify-center py-6 px-4">
            <div className="w-full max-w-[1400px] bg-white rounded-3xl shadow-xl border overflow-hidden flex flex-col lg:flex-row relative">

                {/* Main Grid Area */}
                <div className="flex-1 bg-gray-50 flex flex-col p-4 md:p-6 border-r relative">
                    {/* Header Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={onQuit} className="text-gray-500 hover:text-[#D2AC47]"><ArrowLeft /></button>
                        <h2 className="font-serif font-bold text-[#002E5B] text-xl">Puzzle {puzzle.id}</h2>
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-bold bg-white px-3 py-1 rounded shadow-sm text-[#002E5B]">
                                Score: <span className="text-[#D2AC47]">{score}</span>
                            </div>
                            {difficulty !== 'seeker' && (
                                <div className={`text-sm font-bold bg-white px-3 py-1 rounded shadow-sm flex items-center gap-1 ${timer < 60 ? 'text-red-500 animate-pulse' : 'text-[#002E5B]'}`}>
                                    <Clock size={14} /> {formatTime(timer)}
                                </div>
                            )}
                            <button onClick={() => setIsPaused(!isPaused)} className="w-8 h-8 rounded-full bg-[#002E5B] text-white flex items-center justify-center">
                                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Sai Tools Toolbar */}
                    <div className="flex justify-center gap-4 mb-6">
                        <button onClick={useLetterHint} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#002E5B]">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#002E5B]"><Search size={16} /></div>
                            <span className="text-[10px] font-bold">Sai Letter (-25)</span>
                        </button>
                        {difficulty !== 'master' && (
                            <button onClick={useWordHint} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#002E5B]">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-[#D2AC47]"><Sparkles size={16} /></div>
                                <span className="text-[10px] font-bold">Sai Reveal (-50)</span>
                            </button>
                        )}
                    </div>

                    {/* Pause Overlay */}
                    {isPaused && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
                            <h3 className="font-serif text-3xl font-bold text-[#002E5B] mb-2">Take a breath.</h3>
                            <p className="text-[#D2AC47] font-bold mb-6 tracking-widest uppercase">Om Sai Ram</p>
                            <button onClick={() => setIsPaused(false)} className="bg-[#002E5B] text-white px-8 py-3 rounded-full font-bold shadow-lg">Resume</button>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="flex-1 flex justify-center items-center overflow-auto custom-scrollbar p-2">
                        <div className="grid gap-[1px] bg-gray-300 border-2 border-gray-600 shadow-md p-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(28px, 40px))`, gridTemplateRows: `repeat(${rows}, minmax(28px, 40px))` }}>
                            {Array.from({ length: rows }).map((_, r) => (
                                Array.from({ length: cols }).map((_, c) => {
                                    const x = c + 1; const y = r + 1; const key = `${x},${y}`;
                                    const cell = gridState[key];
                                    if (!cell) return <div key={key} className="bg-transparent" />;

                                    const activeClueObj = clues.find(cl => cl.answer === selectedClue);
                                    const isPartOfSelected = activeClueObj && (
                                        (activeClueObj.orientation === 'across' && y === activeClueObj.starty && x >= activeClueObj.startx && x < activeClueObj.startx + activeClueObj.answer.length) ||
                                        (activeClueObj.orientation === 'down' && x === activeClueObj.startx && y >= activeClueObj.starty && y < activeClueObj.starty + activeClueObj.answer.length)
                                    );
                                    const isSelectedCell = activeCell?.x === x && activeCell?.y === y;
                                    const isFoundCell = clues.some(cl => foundWords.has(cl.answer) && (
                                        (cl.orientation === 'across' && y === cl.starty && x >= cl.startx && x < cl.startx + cl.answer.length) ||
                                        (cl.orientation === 'down' && x === cl.startx && y >= cl.starty && y < cl.starty + cl.answer.length)
                                    ));

                                    return (
                                        <div key={key} onClick={() => { setActiveCell({ x, y }); }}
                                            className={`relative flex items-center justify-center text-lg font-bold font-mono cursor-text ${isFoundCell ? 'bg-[#D2AC47]/20 text-yellow-600' : isPartOfSelected ? 'bg-blue-100' : 'bg-white'} ${isSelectedCell && !isFoundCell ? 'ring-2 ring-[#002E5B] z-10' : ''}`}>
                                            {cell.number && <span className="absolute top-0 left-0.5 text-[8px] font-normal text-gray-500 leading-none">{cell.number}</span>}
                                            <span className={isFoundCell ? 'text-green-700 font-extrabold' : 'text-[#002E5B]'}>
                                                {isFoundCell || cell.current ? (isFoundCell ? cell.expected : cell.current) : ''}
                                            </span>
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                    </div>
                </div>

                {/* Clue Panel */}
                <div className="w-full lg:w-96 bg-white flex flex-col border-l max-h-[800px]">
                    <div className="p-6 bg-[#002E5B] text-white">
                        <h3 className="font-serif text-lg font-bold flex items-center gap-2"><Search size={18} /> Puzzle Clues</h3>
                        <p className="text-sm text-blue-200 mt-1">{foundWords.size} of {clues.length} words found</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-gray-50/50">
                        {['across', 'down'].map((dir) => (
                            <div key={dir}>
                                <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-3 border-b pb-1">{dir}</h4>
                                <div className="space-y-2">
                                    {clues.filter(c => c.orientation === dir).map(c => (
                                        <div key={c.answer} onClick={() => { setSelectedClue(c.answer); setActiveCell({ x: c.startx, y: c.starty }); }} className={`p-3 rounded-xl border text-sm cursor-pointer flex gap-3 ${foundWords.has(c.answer) ? 'bg-green-50 border-green-200 opacity-60 line-through text-green-700' : selectedClue === c.answer ? 'bg-[#D2AC47]/10 border-[#D2AC47]' : 'bg-white text-gray-700 hover:border-gray-300'}`}>
                                            <span className="font-bold text-[#002E5B] w-4 mt-0.5">{c.num}</span>
                                            <span className="flex-1">{c.clue}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insight Toast */}
                {toastMessage && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#002E5B] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up z-50 max-w-sm w-full">
                        <Sparkles size={24} className="text-[#D2AC47]" />
                        <div>
                            <p className="font-bold text-[#D2AC47]">{toastMessage.word}</p>
                            <p className="text-xs text-blue-100">Sai Insight Discovered!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SacredCrossword;
