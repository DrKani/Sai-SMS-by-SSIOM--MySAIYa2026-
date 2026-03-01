import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { QuoteLevelConfig, QUOTE_LEVELS, Quote, GameMechanic, QUOTES_POOL } from './QuoteGameData';
import { useGameSound } from '../../hooks/useGameSound';
import {
    LevelState,
    loadLevelState,
    saveLevelState,
    clearLevelState,
    saveToBriefcase,
    syncDashboardScore
} from './QuoteGamePersistence';

// ==========================================
// 1. TYPES & STATE
// ==========================================

interface GameState {
    currentQuoteIndex: number;
    score: number;
    timeLeft: number; // For current quote or level
    isPaused: boolean;
    isGameOver: boolean;
    levelComplete: boolean;
    history: { quoteId: string, correct: boolean, score: number }[];
    attempts: number; // For current quote
    hintsUsed: number; // For current quote/level
    specialUsed: number; // For current quote/level
    feedback: 'neutral' | 'correct' | 'wrong';
    sessionQuotes?: Quote[]; // Dynamic quotes for the current session (e.g. Sprint)
    misses: number; // For L2
}

// ==========================================
// 2. COMPONENTS
// ==========================================

// --- HOOKS ---
const useFocusTrap = (isOpen: boolean, ref: React.RefObject<HTMLDivElement>) => {
    useEffect(() => {
        if (!isOpen || !ref.current) return;
        const focusableElements = ref.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };
        firstElement?.focus();
        window.addEventListener('keydown', handleTab);
        return () => window.removeEventListener('keydown', handleTab);
    }, [isOpen, ref]);
};

// --- Help Components ---

const HelpInfoPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    useFocusTrap(true, modalRef);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div ref={modalRef} className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="h-2 bg-gradient-to-r from-[#7B2482] via-[#D2AC47] to-[#002E5B]"></div>
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-[#D2AC47] rounded-2xl flex items-center justify-center text-3xl text-[#002E5B] shadow-lg">
                            <i className="fas fa-book-open"></i>
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl font-extrabold text-[#002E5B]">How to Play</h2>
                            <p className="text-gray-500 font-medium">Sai SMS Quotescapes</p>
                        </div>
                    </div>

                    <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 max-h-[50vh]">
                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-[#7B2482] text-white flex items-center justify-center font-bold shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-[#002E5B] mb-1">Complete the Quotes</h4>
                                <p className="text-sm text-gray-600">Fill in the missing words or unscramble the text to reveal Sathya Sai Baba's wisdom.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-[#002E5B] mb-1">Use Hints Wisely</h4>
                                <p className="text-sm text-gray-600">Stuck? Use a hint to reveal a letter or word. Be careful, hints may reduce your score!</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shrink-0">3</div>
                            <div>
                                <h4 className="font-bold text-[#002E5B] mb-1">Unlock Levels</h4>
                                <p className="text-sm text-gray-600">Progress through 10 levels of increasing difficulty. Master them all to earn badges!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-[#002E5B] text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg hover:translate-y-[-2px]"
                    >
                        Close Help
                    </button>
                </div>
            </div>
        </div>
    );
};

const SpotlightTour: React.FC<{
    step: number;
    onNext: () => void;
    onSkip: () => void;
}> = ({ step, onNext, onSkip }) => {
    const [targetRect, setTargetRect] = useState<{ top: number, left: number, width: number, height: number } | null>(null);
    const tourRef = useRef<HTMLDivElement>(null);
    useFocusTrap(step !== null, tourRef);

    useEffect(() => {
        let elId = '';
        if (step === 2 || step === 3) elId = 'game-area'; // Main Game Area
        if (step === 4) elId = 'game-header'; // Score/Timer

        if (!elId) {
            setTargetRect(null);
            return;
        }

        const updateRect = () => {
            const el = document.getElementById(elId);
            if (el) {
                const rect = el.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                });
            }
        };

        updateRect();
        const interval = setInterval(updateRect, 100);
        const timeout = setTimeout(() => clearInterval(interval), 1000);
        window.addEventListener('resize', updateRect);
        return () => {
            window.removeEventListener('resize', updateRect);
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [step]);

    const maskPath = targetRect
        ? `M 0 0 L 0 100% L 100% 100% L 100% 0 Z M ${targetRect.left - 5} ${targetRect.top - 5} L ${targetRect.left + targetRect.width + 5} ${targetRect.top - 5} L ${targetRect.left + targetRect.width + 5} ${targetRect.top + targetRect.height + 5} L ${targetRect.left - 5} ${targetRect.top + targetRect.height + 5} Z`
        : `M 0 0 L 0 100% L 100% 100% L 100% 0 Z`;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ fillRule: 'evenodd' }}>
                <path d={maskPath} fill="rgba(0,0,0,0.75)" />
            </svg>

            <div ref={tourRef} className="relative z-[201] w-full max-w-md px-6 pointer-events-auto flex flex-col items-center">
                {step === 1 && (
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center animate-slide-up border-b-8 border-[#D2AC47]">
                        <div className="w-20 h-20 bg-[#D2AC47] rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg text-[#002E5B]">
                            <i className="fas fa-quote-left"></i>
                        </div>
                        <h2 className="text-3xl font-heading font-extrabold text-[#002E5B] mb-4">Welcome to Quotescapes!</h2>
                        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                            Immerse yourself in the divine wisdom of Sathya Sai Baba through interactive puzzles.
                        </p>
                        <button onClick={onNext} className="w-full bg-[#002E5B] text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.02] transition-transform">
                            Start Tour <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                        <button onClick={onSkip} className="mt-4 text-gray-400 font-bold hover:text-gray-600 text-sm">Skip Tutorial</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white rounded-2xl p-6 shadow-xl relative mt-[120px] ml-auto mr-auto w-full animate-bounce-in border-l-4 border-[#7B2482]">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 transform"></div>
                        <h3 className="font-bold text-lg text-[#7B2482] mb-2 flex items-center gap-2">
                            <span className="bg-[#7B2482] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                            The Challenge Area
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            This is where the magic happens! Complete the quote using the available tiles or inputs.
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-medium">Step 1 of 3</span>
                            <button onClick={onNext} className="bg-[#7B2482] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-opacity-90">
                                Next <i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white rounded-2xl p-6 shadow-xl relative mt-[20px] ml-auto mr-auto w-full animate-bounce-in border-l-4 border-blue-500">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 transform"></div>
                        <h3 className="font-bold text-lg text-blue-600 mb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                            Using Hints
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Stuck? Tap the Hint button if available. Remember, using hints might cost you some points!
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-medium">Step 2 of 3</span>
                            <button onClick={onNext} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-opacity-90">
                                Next <i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="bg-white rounded-2xl p-6 shadow-xl relative mt-[160px] animate-bounce-in border-l-4 border-[#e11d48]">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 transform"></div>
                        <h3 className="font-bold text-lg text-[#e11d48] mb-2 flex items-center gap-2">
                            <span className="bg-[#e11d48] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                            Track Progress
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Keep an eye on your Score and Time here. Try to beat your best!
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-medium">Step 3 of 3</span>
                            <button onClick={onNext} className="bg-[#e11d48] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-opacity-90">
                                Finish <i className="fas fa-check ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Header ---
const Header: React.FC<{
    level: QuoteLevelConfig | null;
    onBack?: () => void;
    onTutorial: () => void;
    onToggleMute?: () => void;
    isMuted?: boolean;
}> = ({ level, onBack, onTutorial, onToggleMute, isMuted }) => {
    const { playSound } = useGameSound();
    return (
        <header className="bg-white shadow-lg border-b-4 border-[#7B2482] sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {level && (
                        <button
                            onClick={() => { playSound('click'); onBack && onBack(); }}
                            className="bg-gray-100 hover:bg-gray-200 text-[#002E5B] w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    )}
                    <div>
                        <h1 className="font-serif text-2xl font-extrabold text-[#002E5B] tracking-tight">
                            {level ? `Level ${level.id}: ${level.title}` : 'Sai SMS Quotescapes'}
                        </h1>
                        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                            {level ? "Quote Challenge" : "Sathya Sai Quotes every devotee should know"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {onToggleMute && (
                        <button
                            onClick={() => { playSound('click'); onToggleMute(); }}
                            className="w-10 h-10 rounded-full bg-gray-100 text-[#002E5B] flex items-center justify-center font-bold hover:bg-gray-200 transition-colors"
                            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                        >
                            <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                        </button>
                    )}
                    <button
                        onClick={() => { playSound('click'); onTutorial(); }}
                        className="w-10 h-10 rounded-full bg-[#D2AC47] text-[#002E5B] flex items-center justify-center font-bold shadow-md hover:scale-105 transition-transform"
                    >
                        <i className="fas fa-info"></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

// --- Level Card ---
const LevelCard: React.FC<{
    level: QuoteLevelConfig;
    unlocked: boolean;
    onSelect: (id: number) => void;
}> = ({ level, unlocked, onSelect }) => {
    const { playSound } = useGameSound();
    const isSprint = level.mechanic.includes('sprint');

    // 11-colour palette in a non-sequential shuffled order so adjacent cards look distinct
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
    // Shuffled index so card 0, 1, 2, 3... map to non-sequential palette slots
    const SHUFFLE = [0, 4, 2, 7, 1, 9, 5, 3, 10, 6, 8];
    const getTheme = (id: number) => PALETTE[SHUFFLE[(id - 1) % PALETTE.length]];

    const getIcon = (mechanic: GameMechanic) => {
        if (mechanic.includes('unscramble')) return 'fa-puzzle-piece';
        if (mechanic.includes('missing')) return 'fa-pen-to-square';
        if (mechanic.includes('emoji')) return 'fa-icons';
        if (mechanic === 'rapid_fire') return 'fa-bolt';
        return 'fa-star';
    };

    return (
        <div
            onClick={() => { if (unlocked) { playSound('click'); onSelect(level.id); } }}
            className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 border-2
                ${!unlocked
                    ? 'opacity-60 cursor-not-allowed border-gray-200 grayscale'
                    : `cursor-pointer hover:scale-[1.03] hover:shadow-2xl border-transparent hover:border-green-400`
                }`}
        >
            {!unlocked && (
                <div className="absolute inset-0 z-30 bg-gray-100/50 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/80 p-3 rounded-full shadow-lg"><i className="fas fa-lock text-2xl text-gray-400"></i></div>
                </div>
            )}

            <div className="h-24 w-full relative overflow-hidden flex items-center justify-center" style={{ background: getTheme(level.id) }}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent"></div>
                <div className="z-10 bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <i className={`fas ${level.levelIcon || getIcon(level.mechanic)} text-3xl text-white drop-shadow-md`}></i>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-green-50 text-green-700">
                        Level {level.id}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                        {level.quotes.length > 0 ? `${level.quotes.length} Quotes` : isSprint ? <><i className="fas fa-bolt mr-1 text-green-600"></i>Sprint</> : null}
                    </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#002E5B] mb-2 leading-tight group-hover:text-green-700 transition-colors">
                    {level.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{level.description}</p>
            </div>

            <div className="px-6 pb-6 pt-2">
                <div className={`w-full py-2 text-center rounded-lg font-bold text-sm transition-colors
                    ${!unlocked ? 'bg-gray-200 text-gray-400' : 'bg-green-50 text-green-700 group-hover:bg-green-500 group-hover:text-white'}`}>
                    {!unlocked ? 'Locked' : 'Play Now'}
                </div>
            </div>
        </div>
    );
};

// --- Game Controls ---
const GameHeader: React.FC<{
    score: number;
    time: number;
    title: string;
    isPaused: boolean;
    onPause: () => void;
}> = ({ score, time, title, isPaused, onPause }) => {

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
            {/* Timer - Left */}
            <div className="bg-[#002E5B] text-white px-6 py-2 rounded-full flex items-center gap-3 shadow-md min-w-[140px]">
                <i className="fas fa-clock text-[#D2AC47]"></i>
                <span className="font-heading font-black text-xl tracking-wider">{formatTime(time)}</span>
            </div>

            {/* Score - Center/Right */}
            <div className="bg-white border-2 border-[#e11d48] text-[#e11d48] px-6 py-2 rounded-full flex items-center gap-3 shadow-md min-w-[140px] justify-center">
                <i className="fas fa-star"></i>
                <span className="font-heading font-black text-xl">{score}</span>
            </div>

            {/* Pause - Far Right */}
            <button
                onClick={onPause}
                className="w-10 h-10 rounded-full bg-white text-[#002E5B] flex items-center justify-center font-bold hover:bg-gray-100 shadow-md ml-4"
            >
                <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
            </button>
        </div>
    );
};

// --- Unscramble view ---
const UnscrambleView: React.FC<{
    quote: Quote;
    onSolve: (score: number) => void;
    onFail: () => void;
    config: QuoteLevelConfig;
    state: GameState;
    updateState: (updates: Partial<GameState>) => void;
}> = ({ quote, onSolve, onFail, config, state, updateState }) => {
    const { playSound } = useGameSound();
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [userOrder, setUserOrder] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');

    // Init Scramble
    useEffect(() => {
        const words = quote.text.split(/\s+/).filter(w => w.length > 0);
        let shuffled = [...words];
        // Shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setScrambled(shuffled);
        setUserOrder([]);
        setMessage('');
        updateState({ feedback: 'neutral', attempts: 0 }); // Reset attempts for new quote
    }, [quote]);

    const handleWordClick = (word: string, from: 'pool' | 'user', index: number) => {
        playSound('tap');
        if (state.feedback === 'correct') return; // Lock if correct

        if (from === 'pool') {
            const newPool = [...scrambled];
            newPool.splice(index, 1);
            setScrambled(newPool);
            setUserOrder([...userOrder, word]);
        } else {
            const newUser = [...userOrder];
            newUser.splice(index, 1);
            setUserOrder(newUser);
            setScrambled([...scrambled, word]);
        }
    };

    const handleCheck = () => {
        const attempt = userOrder.join(' ');
        if (attempt.trim() === quote.text.trim()) {
            playSound('success');
            updateState({ feedback: 'correct' });

            // Score calc
            let points = 100;
            if (state.attempts > 0) points = 50;
            if (config.mechanic === 'unscramble_timed') {
                // L2 Misses logic handled in updateState call from onFail/Miss path?
                // Actually, here we just check correctness.
                // For L2, specific scoring: Max(0, 100 - Misses - PausePenalties)
                // We'll calculate basic here, parent handles aggregate?
                // Let's keep localized scoring here for simplicity
                points = Math.max(0, 100 - (state.misses * 10) - (state.specialUsed * 10)); // Simplified
            } else if (config.mechanic === 'unscramble_sprint') {
                points = 100; // Fixed 100 per quote in sprint
            } else {
                // L1
                if (state.attempts > 0) points = 50;
            }

            // Apply hint penalties
            points -= (state.hintsUsed * (config.specialButton?.cost || 10));
            if (points < 0) points = 0;

            setTimeout(() => onSolve(points), 1000);
        } else {
            playSound('fail');
            // For L2 Timed Unscramble: Incorrect attempt = +1 Miss
            const isL2 = config.id === 2;
            const newMisses = isL2 ? state.misses + 1 : state.misses;

            updateState({ feedback: 'wrong', attempts: state.attempts + 1, misses: newMisses });

            // Reset tiles for L1/L3 (User Request) and L2 (Existing Rule)
            const shouldReset = config.id === 1 || config.id === 2 || config.id === 3;

            if (shouldReset) {
                // Reset to pool on miss
                const words = quote.text.split(/\s+/).filter(w => w.length > 0);
                let shuffled = [...words];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                setScrambled(shuffled);
                setUserOrder([]);
            }

            setMessage('Keep trying!');
            setTimeout(() => {
                updateState({ feedback: 'neutral' });
                setMessage('');
            }, 1000);
        }
    };

    const handleHint = () => {
        if (!config.specialButton) return;
        playSound('hint');
        updateState({ hintsUsed: state.hintsUsed + 1 });

        const firstWord = quote.text.split(' ')[0];
        if (userOrder[0] === firstWord) return;

        let newPool = [...scrambled];
        let newUser = [...userOrder];

        const poolIdx = newPool.indexOf(firstWord);
        if (poolIdx !== -1) {
            newPool.splice(poolIdx, 1);
        } else {
            const userIdx = newUser.indexOf(firstWord);
            if (userIdx !== -1) newUser.splice(userIdx, 1);
        }
        newUser.unshift(firstWord);
        setScrambled(newPool);
        setUserOrder(newUser);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            {quote.emoji && (
                <div className="text-4xl mb-4 bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex gap-2 justify-center flex-wrap">
                    {quote.emoji.map((e, i) => <span key={i} className="animate-bounce delay-[${i*100}ms]">{e}</span>)}
                </div>
            )}

            <h2 className="text-xl md:text-2xl font-heading font-bold text-[#002E5B] mb-8 text-center px-4">
                {quote.emoji ? "Decipher the Emoji Message:" : "Arrange the words:"}
            </h2>

            {/* Answer Area - Dashed box */}
            <div className={`
                w-full min-h-[160px] p-8 rounded-3xl border-4 border-dashed mb-10 flex flex-wrap gap-3 justify-center items-center transition-all duration-300 bg-white
                ${state.feedback === 'correct' ? 'border-green-400 bg-green-50' : state.feedback === 'wrong' ? 'border-red-300 bg-red-50' : 'border-[#002E5B]/20'}
            `}>
                {userOrder.length === 0 && (
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest select-none italic">Tap words below to build the quote</span>
                )}
                {userOrder.map((w, i) => (
                    <button
                        key={`u-${i}`}
                        onClick={() => handleWordClick(w, 'user', i)}
                        className="px-5 py-3 bg-[#002E5B] text-white rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all animate-pop-in"
                    >
                        {w}
                    </button>
                ))}
            </div>

            {/* Word Pool */}
            <div className="flex flex-wrap gap-3 justify-center mb-12 max-w-3xl px-4">
                {scrambled.map((w, i) => (
                    <button
                        key={`s-${i}`}
                        onClick={() => handleWordClick(w, 'pool', i)}
                        className="px-5 py-3 bg-white text-[#002E5B] border-2 border-[#002E5B]/10 rounded-full font-bold hover:border-[#002E5B] hover:shadow-md active:scale-95 transition-all text-base"
                    >
                        {w}
                    </button>
                ))}
            </div>

            {message && <div className="text-red-500 font-bold mb-4 animate-pulse">{message}</div>}

            {/* Controls */}
            <div className="flex gap-4">
                {config.specialButton && config.specialButton.action === 'hint_first' && (
                    <button
                        onClick={handleHint}
                        className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 text-gray-500 flex flex-col items-center justify-center font-bold text-[10px] hover:bg-gray-50 transition-colors"
                        title="Hint"
                    >
                        <i className="fas fa-lightbulb text-lg mb-1"></i>
                    </button>
                )}

                <button
                    onClick={handleCheck}
                    disabled={userOrder.length === 0}
                    className="px-10 py-3 rounded-full font-bold text-white bg-[#7B2482] hover:bg-[#6a1d71] transition-transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                    Check Quote
                </button>
            </div>
        </div>
    );
};

// --- MCQ / Missing Word View ---
const MCQView: React.FC<{
    quote: Quote;
    onSolve: (score: number) => void;
    config: QuoteLevelConfig;
    state: GameState;
    updateState: (updates: Partial<GameState>) => void;
}> = ({ quote, onSolve, config, state, updateState }) => {
    const { playSound } = useGameSound();

    // Parse quote to find where missing word goes
    const parts = quote.text.split(quote.missing || '________');

    // Fallback if split fails (should not if data is good)
    const displayParts = parts.length > 1 ? parts : [quote.text];

    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

    useEffect(() => {
        const opts = [...(quote.options || [])];
        if (opts.length > 0) {
            for (let i = opts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [opts[i], opts[j]] = [opts[j], opts[i]];
            }
            setShuffledOptions(opts);
        }
    }, [quote]);



    const handleOption = (opt: string) => {
        if (state.feedback !== 'neutral') return;

        if (opt === quote.missing) {
            playSound('success');
            updateState({ feedback: 'correct' });
            // L4 Scoring: 1st=100, 2nd=80, 3rd=40, 4th=0
            let points = 0;
            if (state.attempts === 0) points = 100;
            else if (state.attempts === 1) points = 80;
            else if (state.attempts === 2) points = 40;

            points -= (state.hintsUsed * 10); // 50:50 cost
            if (points < 0) points = 0;

            setTimeout(() => onSolve(points), 1000);
        } else {
            playSound('fail');
            updateState({ feedback: 'wrong', attempts: state.attempts + 1 });
            setTimeout(() => updateState({ feedback: 'neutral' }), 1000);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
            {quote.emoji && (
                <div className="text-4xl mb-4 bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex gap-2 justify-center flex-wrap">
                    {quote.emoji.map((e, i) => <span key={i} className="animate-bounce delay-[${i*100}ms]">{e}</span>)}
                </div>
            )}

            <h2 className="text-xl font-heading font-bold text-[#002E5B] mb-8 text-center">
                {quote.emoji ? "Identify the Quote:" : "Select the missing word:"}
            </h2>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-10 w-full text-center">
                <p className="text-2xl md:text-3xl font-serif text-[#002E5B] leading-relaxed">
                    {!quote.emoji ? parts.map((part, i) => (
                        <React.Fragment key={i}>
                            {part}
                            {i < parts.length - 1 && (
                                <span className="inline-block border-b-4 border-[#D2AC47] min-w-[100px] mx-2 text-center text-[#7B2482] font-bold">
                                    {state.feedback === 'correct' ? quote.missing : '?'}
                                </span>
                            )}
                        </React.Fragment>
                    )) : (
                        <span className="text-gray-400 italic">Which quote matches the emojis above?</span>
                    )}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {(shuffledOptions.length > 0 ? shuffledOptions : (quote.options || [])).map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleOption(opt)}
                        className={`
                            py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-md border-2
                            ${state.feedback === 'correct' && (opt === quote.text || opt === quote.missing)
                                ? 'bg-green-500 text-white border-green-600'
                                : state.feedback === 'wrong'
                                    ? 'bg-red-50 text-red-500 border-red-200 opacity-50'
                                    : 'bg-white text-[#002E5B] border-[#002E5B]/10 hover:border-[#002E5B]'
                            }
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Shared Word Bank View ---
const SharedBankView: React.FC<{
    quotes: Quote[];
    config: QuoteLevelConfig;
    state: GameState;
    updateState: (updates: Partial<GameState>) => void;
    onSolve: (score: number) => void;
}> = ({ quotes, config, state, updateState, onSolve }) => {
    // This view handles one quote at a time from the list, but shows the shared bank.
    // For simplicity, we just render the current quote and the FULL bank.
    // We need to track used words? We can derive them from history or local state?
    // Actually, L5 is 10 quotes. 'Shared Word Bank' means the bank remains same? 
    // Or bank shrinks? Usually "Shared Word Bank" implies bank shrinks as you use words.
    // But persistence logic means we might resume mid-level.
    // We'll trust 'history' to know what's solved.
    // BUT we need to know WHICH words are used.
    // We can filter `config.meta.bankWords` against `gameState.history` (solved quotes).

    const { playSound } = useGameSound();
    const currentQuote = quotes[state.currentQuoteIndex];
    if (!currentQuote) return null; // Should not happen

    const solvedQuoteIds = state.history.map(h => h.quoteId);
    // Find used missing words from solved quotes
    const usedWords = quotes
        .filter(q => solvedQuoteIds.includes(q.id))
        .map(q => q.missing);

    // Bank words: Original Bank + Decoys (if not eliminated)
    // Note: 'decoys' are in config.meta.decoys.
    // We should allow elimination of decoys via Special Button.
    // We can track 'removedDecoys' in state.specialUsed? Or just assume it removes 1 decoy per use.

    // Let's mix bankWords + decoys.
    const allBank = [...(config.meta?.bankWords || []), ...(config.meta?.decoys || [])];

    const handleWordSelect = (word: string) => {
        if (state.feedback !== 'neutral') return;

        // Specific L5 check
        if (word === currentQuote.missing) {
            playSound('success');
            updateState({ feedback: 'correct' });
            onSolve(100);
        } else {
            playSound('fail');
            updateState({ feedback: 'wrong' });
            setTimeout(() => updateState({ feedback: 'neutral' }), 1000);
        }
    };

    const parts = currentQuote.text.split(currentQuote.missing || '________');

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-heading font-bold text-[#002E5B] mb-8 text-center">
                Tap a word to fill the blank:
            </h2>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-10 w-full text-center">
                <p className="text-2xl md:text-3xl font-serif text-[#002E5B] leading-relaxed">
                    {parts[0]}
                    <span className="inline-block border-b-4 border-[#D2AC47] min-w-[120px] mx-2 text-center text-[#7B2482] font-bold bg-gray-50 px-2 rounded-t">
                        {state.feedback === 'correct' ? currentQuote.missing : '?'}
                    </span>
                    {parts[1]}
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {allBank.map((word, i) => {
                    const isUsed = usedWords.includes(word);
                    // Check if removed by decoy eliminator? 
                    // Simplified: if speciaUsed > 0 and word is decoy, hide it?
                    // Let's keep it simple: just show all unless used.

                    if (isUsed) return null;

                    return (
                        <button
                            key={i}
                            onClick={() => handleWordSelect(word)}
                            className="px-6 py-3 bg-white border-2 border-[#002E5B] text-[#002E5B] rounded-full font-bold shadow-md hover:bg-[#002E5B] hover:text-white transition-all transform hover:scale-105"
                        >
                            {word}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

// --- Sequencing View ---
const SequencingView: React.FC<{
    quote: Quote;
    onSolve: (score: number) => void;
    state: GameState;
    updateState: (updates: Partial<GameState>) => void;
}> = ({ quote, onSolve, state, updateState }) => {
    const { playSound } = useGameSound();
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
        if (quote.sequence) {
            // Shuffle for initial state
            const shuffled = [...quote.sequence].sort(() => Math.random() - 0.5);
            setItems(shuffled);
        }
    }, [quote]);

    const moveItem = (fromIdx: number, toIdx: number) => {
        if (state.feedback === 'correct') return;
        const newItems = [...items];
        const [moved] = newItems.splice(fromIdx, 1);
        newItems.splice(toIdx, 0, moved);
        setItems(newItems);
        playSound('tap');
    };

    const handleCheck = () => {
        const isCorrect = JSON.stringify(items) === JSON.stringify(quote.sequenceCorrect);
        if (isCorrect) {
            playSound('success');
            updateState({ feedback: 'correct' });
            onSolve(200); // L10 worth 200
        } else {
            playSound('fail');
            updateState({ feedback: 'wrong' });
            setTimeout(() => updateState({ feedback: 'neutral' }), 1000);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4">
            <h2 className="text-xl font-heading font-bold text-[#002E5B] mb-8 text-center">
                Arrange in correct order:
            </h2>

            <ul className="w-full space-y-3 mb-8">
                {items.map((item, i) => (
                    <li key={item} className="bg-white p-4 rounded-xl border-2 border-gray-200 flex items-center gap-4 shadow-sm group hover:border-[#D2AC47] cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-[#002E5B] group-hover:text-white transition-colors">
                            {i + 1}
                        </div>
                        <span className="font-bold text-[#002E5B] flex-grow">{item}</span>
                        <div className="flex flex-col">
                            {i > 0 && <button onClick={() => moveItem(i, i - 1)}><i className="fas fa-chevron-up text-gray-400 hover:text-blue-500"></i></button>}
                            {i < items.length - 1 && <button onClick={() => moveItem(i, i + 1)}><i className="fas fa-chevron-down text-gray-400 hover:text-blue-500"></i></button>}
                        </div>
                    </li>
                ))}
            </ul>

            <button
                onClick={handleCheck}
                className="px-10 py-3 rounded-full font-bold text-white bg-[#7B2482] hover:bg-[#6a1d71] transition-transform hover:scale-105 shadow-xl"
            >
                Verify Order
            </button>
        </div>
    );
};


// --- Typed View ---
const TypedView: React.FC<{
    quote: Quote;
    onSolve: (score: number) => void;
    config: QuoteLevelConfig;
    state: GameState;
    updateState: (updates: Partial<GameState>) => void;
}> = ({ quote, onSolve, config, state, updateState }) => {
    const { playSound } = useGameSound();
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<'neutral' | 'correct' | 'wrong'>('neutral');

    // Reset input on quote change
    useEffect(() => {
        setInput('');
        setFeedback('neutral');
    }, [quote]);

    const checkAnswer = () => {
        if (input.trim().toLowerCase() === (quote.missing || '').trim().toLowerCase()) {
            playSound('success');
            setFeedback('correct');
            onSolve(100);
        } else {
            playSound('fail');
            setFeedback('wrong');
            setTimeout(() => setFeedback('neutral'), 1000);
        }
    };

    const parts = quote.text.split(quote.missing || '___');

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-serif text-[#002E5B] mb-8 text-center italic">
                "Type the missing word"
            </h2>
            <div className="bg-neutral-50 p-8 rounded-3xl border-2 border-navy-50 mb-10 w-full text-center">
                <p className="text-2xl font-medium text-navy-800 leading-relaxed">
                    {parts[0]}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`inline-block min-w-[150px] border-b-4 text-[#002E5B] font-bold mx-2 px-2 bg-white rounded-t-lg outline-none text-center transition-colors
                           ${feedback === 'correct' ? 'border-green-500 bg-green-50' : feedback === 'wrong' ? 'border-red-500 bg-red-50' : 'border-[#002E5B] focus:bg-blue-50'}
                        `}
                        placeholder="?"
                        autoFocus
                    />
                    {parts[1]}
                </p>
            </div>
            <button
                onClick={checkAnswer}
                disabled={input.length === 0}
                className="py-4 px-12 rounded-xl font-bold uppercase tracking-widest text-white bg-[#002E5B] shadow-xl hover:bg-[#003d7a] transition-all disabled:opacity-50"
            >
                Verify
            </button>
        </div>
    );
};

// --- Multi Blank View ---
const MultiBlankView: React.FC<{
    quote: Quote;
    onSolve: (score: number) => void;
    config: QuoteLevelConfig;
    state: GameState;
    updateState: (updates: Partial<GameState>) => void;
}> = ({ quote, onSolve, config, state, updateState }) => {
    const { playSound } = useGameSound();
    const [inputs, setInputs] = useState<string[]>([]);

    // Parse missing words: "thought,action,feeling"
    const missingWords = (quote.missing || '').split(',').map(s => s.trim());

    useEffect(() => {
        setInputs(new Array(missingWords.length).fill(''));
        updateState({ feedback: 'neutral', attempts: 0 });
    }, [quote]);

    const renderText = () => {
        const parts = quote.text.split('________');
        return (
            <div className="leading-loose">
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        {part}
                        {i < parts.length - 1 && (
                            <input
                                type="text"
                                value={inputs[i] || ''}
                                onChange={(e) => {
                                    const newInputs = [...inputs];
                                    newInputs[i] = e.target.value;
                                    setInputs(newInputs);
                                }}
                                className={`
                                    inline-block min-w-[100px] w-auto border-b-2 mx-1 px-1 text-center outline-none font-bold bg-transparent transition-colors
                                    ${state.feedback === 'correct'
                                        ? 'border-green-500 text-green-600'
                                        : state.feedback === 'wrong' && inputs[i]?.toLowerCase() !== missingWords[i]?.toLowerCase()
                                            ? 'border-red-500 text-red-500 bg-red-50'
                                            : 'border-[#002E5B] text-[#002E5B] focus:border-[#D2AC47]'
                                    }
                                `}
                                placeholder={state.feedback === 'correct' ? missingWords[i] : `(${i + 1})`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const checkAnswers = () => {
        const isAllCorrect = inputs.every((val, idx) => val?.trim().toLowerCase() === missingWords[idx]?.toLowerCase());

        if (isAllCorrect) {
            playSound('success');
            updateState({ feedback: 'correct' });

            let points = 100;
            points -= (state.hintsUsed * 10);
            points -= (state.attempts * 5);
            if (points < 0) points = 0;

            setTimeout(() => onSolve(points), 1000);
        } else {
            playSound('fail');
            updateState({ feedback: 'wrong', attempts: state.attempts + 1 });
            setTimeout(() => updateState({ feedback: 'neutral' }), 1500);
        }
    };

    const handleAutoFill = () => {
        if (!config.specialButton || state.hintsUsed >= (config.specialButton.limitPerQuote || 3)) return;

        const idx = inputs.findIndex((val, i) => val?.trim().toLowerCase() !== missingWords[i]?.toLowerCase());
        if (idx !== -1) {
            const newInputs = [...inputs];
            newInputs[idx] = missingWords[idx];
            setInputs(newInputs);
            updateState({ hintsUsed: state.hintsUsed + 1 });
            playSound('hint');
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-heading font-bold text-[#002E5B] mb-8 text-center">
                Fill in all the blanks:
            </h2>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-10 w-full text-xl md:text-2xl font-serif text-[#002E5B]">
                {renderText()}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {config.specialButton && config.specialButton.action === 'auto_fill' && (
                    <button
                        onClick={handleAutoFill}
                        disabled={state.hintsUsed >= (config.specialButton.limitPerQuote || 3)}
                        className="px-6 py-3 rounded-full border-2 border-[#D2AC47] text-[#D2AC47] font-bold hover:bg-[#D2AC47] hover:text-white transition-colors disabled:opacity-50"
                    >
                        Auto-Fill (-10)
                    </button>
                )}

                <button
                    onClick={checkAnswers}
                    className="px-10 py-3 rounded-full font-bold text-white bg-[#002E5B] hover:bg-[#003d7a] transition-transform hover:scale-105 shadow-xl"
                >
                    Verify Answers
                </button>
            </div>
        </div>
    );
};

// --- Modals ---

const ResultModal: React.FC<{
    isOpen: boolean;
    isLevelComplete: boolean;
    score: number;
    history: { quoteId: string, correct: boolean, score: number }[];
    currentQuote?: Quote; // Current quote for insight
    levelId: number;
    onNextLevel: () => void;
    onReplay: () => void;
    onHome: () => void;
    onNextQuote: () => void; // Distinguish between next quote and next level
}> = ({ isOpen, isLevelComplete, score, history, currentQuote, levelId, onNextLevel, onReplay, onHome, onNextQuote }) => {
    const { playSound } = useGameSound();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            playSound(isLevelComplete ? 'levelComplete' : 'success');
            setSaved(false);

            if (navigator.vibrate) {
                navigator.vibrate(isLevelComplete ? [100, 50, 100] : 50);
            }

            if (isLevelComplete) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#D2AC47', '#002E5B', '#ffffff']
                });
            }
        }
    }, [isOpen, isLevelComplete]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (currentQuote && saveToBriefcase(currentQuote, levelId)) {
            setSaved(true);
            playSound('success');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl transform transition-all scale-100 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#002E5B] to-transparent opacity-10"></div>

                <div className="relative text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-gold-400 relative z-10">
                        {isLevelComplete ? (
                            <i className="fas fa-trophy text-4xl text-gold-500 animate-bounce"></i>
                        ) : (
                            <i className="fas fa-star text-4xl text-gold-500"></i>
                        )}
                    </div>

                    <h2 className="text-3xl font-heading font-bold text-[#002E5B] mb-2">
                        {isLevelComplete ? 'Level Complete!' : 'Quote Solved!'}
                    </h2>

                    {currentQuote && currentQuote.insight && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-left">
                            <p className="text-sm text-[#002E5B] italic font-serif leading-relaxed">
                                <i className="fas fa-quote-left text-blue-200 mr-2 text-xl float-left"></i>
                                {currentQuote.insight}
                            </p>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-[#002E5B]">
                                {isLevelComplete ? 'Final Score' : 'Total Score'}
                            </span>
                            <span className="text-3xl font-black text-[#002E5B]">{score}</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-gold-500 h-full rounded-full" style={{ width: `${Math.min(100, (score / 1000) * 100)}%` }}></div>
                        </div>
                        {isLevelComplete && (
                            <div className="mt-4 flex justify-between text-xs text-gray-400 font-bold uppercase">
                                <span>Accuracy: {history.filter(h => h.correct).length}/{history.length}</span>
                            </div>
                        )}
                    </div>

                    {/* Briefcase Toggle */}
                    {currentQuote && (
                        <button
                            onClick={handleSave}
                            disabled={saved}
                            className={`w-full flex items-center justify-between p-4 rounded-xl mb-6 transition-all border-2
                                ${saved
                                    ? 'bg-green-50 border-green-200 text-green-700 cursor-default'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#D2AC47] hover:text-[#D2AC47]'
                                }
                            `}
                        >
                            <span className="text-sm font-bold flex items-center gap-3">
                                <i className={`fas ${saved ? 'fa-check-circle' : 'fa-briefcase text-[#D2AC47]'}`}></i>
                                {saved ? 'Saved to Briefcase' : 'Save Quote to Briefcase'}
                            </span>
                            {!saved && <i className="fas fa-plus text-xs"></i>}
                        </button>
                    )}

                    <div className="space-y-3">
                        {isLevelComplete ? (
                            <>
                                <button
                                    onClick={onNextLevel}
                                    className="w-full py-4 bg-[#002E5B] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-[#003d7a] transition-all hover:scale-[1.02]"
                                >
                                    Next Level <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                                <button
                                    onClick={onReplay}
                                    className="w-full py-4 bg-white border-2 border-[#002E5B] text-[#002E5B] rounded-xl font-bold uppercase tracking-widest hover:bg-blue-50 transition-all"
                                >
                                    <i className="fas fa-redo mr-2"></i> Replay Level
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onNextQuote}
                                className="w-full py-4 bg-[#002E5B] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-[#003d7a] transition-all hover:scale-[1.02]"
                            >
                                Next Quote <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        )}

                        <button
                            onClick={onHome}
                            className="w-full py-3 text-gray-400 font-bold text-sm hover:text-[#002E5B] transition-colors"
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuoteGame: React.FC = () => {
    const { playSound, isMuted, toggleMute } = useGameSound();

    // Levels State
    const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
    const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
    const [viewMode, setViewMode] = useState<'gallery' | 'game'>('gallery');

    // Game Session State
    const [gameState, setGameState] = useState<GameState>({
        currentQuoteIndex: 0,
        score: 0,
        timeLeft: 0,
        isPaused: false,
        isGameOver: false,
        levelComplete: false,
        history: [],
        attempts: 0,
        hintsUsed: 0,
        specialUsed: 0,
        feedback: 'neutral',
        misses: 0
    });

    const [showResultModal, setShowResultModal] = useState(false);
    const [showIntroModal, setShowIntroModal] = useState(false); // New intro state
    const [lastEarnedPoints, setLastEarnedPoints] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [tourStep, setTourStep] = useState<number | null>(null);

    const activeLevelConfig = activeLevelId ? QUOTE_LEVELS.find(l => l.id === activeLevelId) : null;
    const timerRef = useRef<any>(null);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('sms_quotes_unlocked');
        if (saved) setUnlockedLevels(JSON.parse(saved));
        syncDashboardScore();
    }, []);

    // Auto-Save Effect (Double Spend Test)
    useEffect(() => {
        if (!activeLevelConfig || viewMode !== 'game') return;

        const currentSave = loadLevelState(activeLevelConfig.id) || {
            currentIndex: 0,
            score: 0,
            specials: {},
            timer: { type: 'standard', endsAt: null, pausedAt: null, remainingWhenPaused: 0 },
            history: [],
            isComplete: false
        };

        // Update the current save state with transient values
        const newSave = {
            ...currentSave,
            score: gameState.score, // Updates immediately on hint use
            specials: { ...currentSave.specials, hints: gameState.hintsUsed }, // Simplified tracking
            timer: {
                ...currentSave.timer,
                remainingWhenPaused: gameState.timeLeft // Save time left for resume
            },
            // Ensure sessionQuotes is preserved if it exists
            sessionQuotes: gameState.sessionQuotes || currentSave.sessionQuotes
        };

        saveLevelState(activeLevelConfig.id, newSave as any);

    }, [gameState.score, gameState.hintsUsed, gameState.timeLeft, activeLevelConfig, viewMode, gameState.sessionQuotes]);


    // Start Level
    const startLevel = (levelId: number) => {
        const level = QUOTE_LEVELS.find(l => l.id === levelId);
        if (!level) return;

        const savedState = loadLevelState(levelId);
        let sessionQuotes: Quote[] = [];
        let initialTimeLeft = level.timeLimit || 0;

        // Restore Session Quotes if Sprint/Random
        if (savedState?.sessionQuotes && savedState.sessionQuotes.length > 0) {
            sessionQuotes = savedState.sessionQuotes;
        }
        // Generate NEW Session Quotes if none exist and it's a Sprint
        else if (level.mechanic.includes('sprint')) {
            const pool = [...QUOTES_POOL];
            for (let i = 0; i < 20; i++) {
                if (pool.length === 0) break;
                const r = Math.floor(Math.random() * pool.length);
                const qText = pool[r];
                const qMechanic = level.mechanic.includes('typed') ? 'missing_word_typed_sprint' : 'unscramble_sprint';

                const qObj: any = {
                    id: `sprint-${i}`,
                    text: qText,
                    mechanic: qMechanic,
                    insight: "Generated for Sprint"
                };

                if (qMechanic === 'missing_word_typed_sprint') {
                    const words = qText.split(' ');
                    const candidates = words.filter(w => w.length > 3).map(w => w.replace(/[^a-zA-Z]/g, ''));
                    qObj.missing = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : words[words.length - 1].replace(/[^a-zA-Z]/g, '');
                }
                sessionQuotes.push(qObj);
                pool.splice(r, 1);
            }
        }

        setActiveLevelId(levelId);

        // Resume Logic
        if (savedState && !savedState.isComplete) {
            // Kill Test: Restore timer
            if (savedState.timer && savedState.timer.remainingWhenPaused > 0) {
                initialTimeLeft = savedState.timer.remainingWhenPaused;
            }

            setGameState({
                currentQuoteIndex: savedState.currentIndex,
                score: savedState.score,
                timeLeft: initialTimeLeft,
                isPaused: false,
                isGameOver: false,
                levelComplete: false,
                history: [],
                attempts: 0,
                hintsUsed: 0,
                specialUsed: 0,
                feedback: 'neutral',
                misses: 0,
                sessionQuotes: sessionQuotes.length > 0 ? sessionQuotes : undefined
            });
            setShowIntroModal(false); // No intro on resume
        } else {
            // New Game
            setGameState({
                currentQuoteIndex: 0,
                score: 0,
                timeLeft: initialTimeLeft,
                isPaused: false,
                isGameOver: false,
                levelComplete: false,
                history: [],
                attempts: 0,
                hintsUsed: 0,
                specialUsed: 0,
                feedback: 'neutral',
                misses: 0,
                sessionQuotes: sessionQuotes.length > 0 ? sessionQuotes : undefined
            });

            // Initialize Save State immediately
            saveLevelState(levelId, {
                currentIndex: 0,
                score: 0,
                specials: {},
                timer: { type: 'standard', endsAt: null, pausedAt: null, remainingWhenPaused: initialTimeLeft },
                history: [],
                sessionQuotes: sessionQuotes.length > 0 ? sessionQuotes : undefined,
                isComplete: false
            });
            setShowIntroModal(true); // Show intro on new game
        }

        setViewMode('game');
        setShowResultModal(false);
    };

    // Timer Logic 
    useEffect(() => {
        if (!activeLevelConfig || !activeLevelConfig.timeLimit || gameState.isPaused || gameState.isGameOver || gameState.levelComplete || showResultModal || showIntroModal) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        const isSprint = activeLevelConfig.mechanic.includes('sprint');

        timerRef.current = setInterval(() => {
            setGameState(prev => {
                if (prev.timeLeft <= 0) {
                    clearInterval(timerRef.current);
                    if (isSprint) {
                        return { ...prev, isGameOver: true, levelComplete: true, timeLeft: 0 };
                    } else {
                        return { ...prev, timeLeft: 0 };
                    }
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [activeLevelConfig, gameState.isPaused, gameState.isGameOver, gameState.levelComplete, showResultModal]);

    // Timeout Logic
    useEffect(() => {
        // Only trigger timeout if the level HAS a time limit (and isn't a sprint which handles its own timeout elsewhere)
        if (!gameState.levelComplete && !gameState.isGameOver && gameState.timeLeft === 0 && activeLevelConfig && activeLevelConfig.timeLimit && !activeLevelConfig.mechanic.includes('sprint') && !showResultModal) {
            handleQuoteSolve(0);
        }

        // Sprint timeout logic (already correct, but keeping strictly separate)
        if (activeLevelConfig?.mechanic.includes('sprint') && gameState.timeLeft === 0 && !gameState.levelComplete) {
            setGameState(prev => ({ ...prev, levelComplete: true, isGameOver: true }));
            setShowResultModal(true);
        }
    }, [gameState.timeLeft, activeLevelConfig, gameState.levelComplete, gameState.isGameOver, showResultModal]);

    // Badge Logic
    const awardChampionBadge = () => {
        const badges = JSON.parse(localStorage.getItem('sms_badges') || '[]');
        if (!badges.some((b: any) => b.title === "Sai Quote Champion")) {
            badges.push({
                title: "Sai Quote Champion",
                earnedAt: new Date().toISOString(),
                type: 'elite',
                description: 'Completed all 10 levels of Quotescapes'
            });
            localStorage.setItem('sms_badges', JSON.stringify(badges));
            window.dispatchEvent(new Event('storage'));
        }
    };

    // Handlers
    const handleQuoteSolve = (points: number) => {
        if (!activeLevelConfig) return;

        let finalPoints = points;

        // Level 10 Scoring Rule: Fixed 200 points for correct answer
        if (activeLevelConfig.id === 10) {
            finalPoints = 200;
        }

        setLastEarnedPoints(finalPoints);

        const currentQuotes = gameState.sessionQuotes || activeLevelConfig.quotes;
        const currentQuote = currentQuotes[gameState.currentQuoteIndex];
        const newHistory = [...gameState.history, { quoteId: currentQuote.id, correct: finalPoints > 0, score: finalPoints }];
        const newTotalScore = gameState.score + finalPoints;

        setGameState(prev => ({
            ...prev,
            score: newTotalScore,
            history: newHistory,
        }));

        setShowResultModal(true);
    };

    const handleNextQuote = () => {
        setShowResultModal(false);
        const currentQuotes = gameState.sessionQuotes || activeLevelConfig?.quotes || [];

        if (gameState.currentQuoteIndex >= currentQuotes.length - 1) {
            // End of level
            setGameState(prev => ({ ...prev, levelComplete: true }));
            setShowResultModal(true);
        } else {
            // Move to next
            const nextIndex = gameState.currentQuoteIndex + 1;
            const newTime = activeLevelConfig?.mechanic.includes('sprint') ? gameState.timeLeft : (activeLevelConfig?.timeLimit || 0);

            setGameState(prev => ({
                ...prev,
                currentQuoteIndex: nextIndex,
                timeLeft: newTime,
                attempts: 0,
                hintsUsed: 0,
                specialUsed: 0,
                feedback: 'neutral'
            }));

            // Auto-Save ensures index defaults to new one
            saveLevelState(activeLevelConfig!.id, {
                ...loadLevelState(activeLevelConfig!.id)!,
                currentIndex: nextIndex,
                timer: { type: 'standard', endsAt: null, pausedAt: null, remainingWhenPaused: newTime }
            } as any);
        }
    };

    const handleNextLevel = () => {
        setShowResultModal(false);
        if (activeLevelId) {
            saveLevelState(activeLevelId, { ...loadLevelState(activeLevelId)!, isComplete: true } as any);

            // Champion Check
            if (activeLevelId === 10) {
                awardChampionBadge();
                setViewMode('gallery');
                // Optional: Trigger a global confetti/celebration here or rely on the gallery showing the completed state
                return;
            }

            const nextId = activeLevelId + 1;
            if (!unlockedLevels.includes(nextId) && QUOTE_LEVELS.find(l => l.id === nextId)) {
                const newUnlocked = [...unlockedLevels, nextId];
                setUnlockedLevels(newUnlocked);
                localStorage.setItem('sms_quotes_unlocked', JSON.stringify(newUnlocked));
            }
            startLevel(nextId);
        }
    };

    if (viewMode === 'gallery') {
        return (
            <div className="min-h-screen bg-[#FDFBF7]">
                <Header level={null} onTutorial={() => setShowHelp(true)} onBack={() => { }} onToggleMute={toggleMute} isMuted={isMuted} />
                <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
                    {/* Uniform Gallery Header */}
                    <div className="text-center mb-10">
                        <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-[#002E5B] mb-2">Sai SMS Quotescapes</h1>
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-green-600 mb-3">CHOOSE YOUR JOURNEY</p>
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-50 border border-green-200 rounded-full">
                            <i className="fas fa-leaf text-green-600 text-xs"></i>
                            <span className="text-sm font-semibold text-green-800 italic">Sathya Sai Quotes every Devotee should know</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {QUOTE_LEVELS.map(level => (
                            <LevelCard
                                key={level.id}
                                level={level}
                                unlocked={unlockedLevels.includes(level.id)}
                                onSelect={startLevel}
                            />
                        ))}
                    </div>
                </div>
                {showHelp && <HelpInfoPanel onClose={() => setShowHelp(false)} />}
            </div>
        );
    }

    const currentQuotes = gameState.sessionQuotes || activeLevelConfig?.quotes || [];
    const currentQuote = currentQuotes[gameState.currentQuoteIndex];
    if (!currentQuote) return null;

    const mechanic = currentQuote.mechanic || activeLevelConfig?.mechanic;

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header
                level={activeLevelConfig}
                onBack={() => setViewMode('gallery')}
                onTutorial={() => setShowHelp(true)}
                onToggleMute={toggleMute}
                isMuted={isMuted}
            />

            <div className="flex-grow py-8 px-4">
                <GameHeader
                    score={gameState.score}
                    time={gameState.timeLeft}
                    title={activeLevelConfig?.title || ''}
                    isPaused={gameState.isPaused}
                    onPause={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                />

                <main className="flex items-center justify-center min-h-[400px]">
                    {(() => {
                        if (mechanic?.includes('unscramble')) {
                            return <UnscrambleView
                                quote={currentQuote}
                                onSolve={handleQuoteSolve}
                                onFail={() => { }}
                                config={activeLevelConfig!}
                                state={gameState}
                                updateState={(u) => setGameState(prev => ({ ...prev, ...u }))}
                            />;
                        }
                        if (mechanic === 'missing_word_mcq' || mechanic === 'emoji_decipher') {
                            return <MCQView
                                quote={currentQuote}
                                onSolve={handleQuoteSolve}
                                config={activeLevelConfig!}
                                state={gameState}
                                updateState={(u) => setGameState(prev => ({ ...prev, ...u }))}
                            />;
                        }
                        if (mechanic === 'missing_word_bank') {
                            return <SharedBankView
                                quotes={currentQuotes}
                                config={activeLevelConfig!}
                                state={gameState}
                                updateState={(u) => setGameState(prev => ({ ...prev, ...u }))}
                                onSolve={handleQuoteSolve}
                            />;
                        }
                        if (mechanic === 'missing_word_multi') {
                            return <MultiBlankView
                                quote={currentQuote}
                                onSolve={handleQuoteSolve}
                                config={activeLevelConfig!}
                                state={gameState}
                                updateState={(u) => setGameState(prev => ({ ...prev, ...u }))}
                            />;
                        }
                        if (mechanic === 'sequencing') {
                            return <SequencingView
                                quote={currentQuote}
                                onSolve={handleQuoteSolve}
                                state={gameState}
                                updateState={(u) => setGameState(prev => ({ ...prev, ...u }))}
                            />;
                        }
                        if (mechanic?.includes('typed')) {
                            return <TypedView
                                quote={currentQuote}
                                onSolve={handleQuoteSolve}
                                config={activeLevelConfig!}
                                state={gameState}
                                updateState={(u) => setGameState(prev => ({ ...prev, ...u }))}
                            />;
                        }
                        return <div>Mechanic implementation pending for: {mechanic}</div>
                    })()}
                </main>
            </div>

            <ResultModal
                isOpen={showResultModal}
                isLevelComplete={gameState.levelComplete}
                score={gameState.score}
                history={gameState.history}
                currentQuote={currentQuote}
                levelId={activeLevelConfig?.id || 0}
                onNextLevel={handleNextLevel}
                onReplay={() => activeLevelId && startLevel(activeLevelId)}
                onHome={() => setViewMode('gallery')}
                onNextQuote={handleNextQuote}
            />
            {/* Intro Modal */}
            {showIntroModal && activeLevelConfig && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/90 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#D2AC47]"></div>
                        <h2 className="text-3xl font-heading font-bold text-[#002E5B] mb-4 mt-4">
                            {activeLevelConfig.title}
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {activeLevelConfig.description}
                        </p>

                        <div className="bg-blue-50 p-4 rounded-xl text-left text-sm text-[#002E5B] space-y-2 mb-8">
                            <p className="font-bold"><i className="fas fa-star text-gold-500 mr-2"></i>Scoring:</p>
                            <ul className="list-disc list-inside pl-4 space-y-1">
                                <li>Correct Answer: +100pts</li>
                                {activeLevelConfig.id === 1 && <li>Unlimited attempts (Practice)</li>}
                                {activeLevelConfig.id > 1 && <li>Attempts reduce score (100 &rarr; 50 &rarr; 0)</li>}
                                {activeLevelConfig.specialButton && (
                                    <li>Using "{activeLevelConfig.specialButton.label}": -{activeLevelConfig.specialButton.cost}pts</li>
                                )}
                            </ul>
                        </div>

                        <button
                            onClick={() => {
                                setShowIntroModal(false);
                                if (activeLevelConfig.id === 1) {
                                    const seen = localStorage.getItem('sai-sms-quote-tour-seen');
                                    if (!seen) setTourStep(1);
                                }
                            }}
                            className="w-full py-4 bg-[#002E5B] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-[#003d7a] transition-all hover:scale-[1.02]"
                        >
                            Start Level
                        </button>
                    </div>
                </div>
            )}
            {showHelp && <HelpInfoPanel onClose={() => setShowHelp(false)} />}
            {tourStep !== null && (
                <SpotlightTour
                    step={tourStep}
                    onNext={() => {
                        const next = tourStep + 1;
                        if (next > 4) {
                            setTourStep(null);
                            localStorage.setItem('sai-sms-quote-tour-seen', 'true');
                        } else {
                            setTourStep(next);
                        }
                    }}
                    onSkip={() => {
                        setTourStep(null);
                        localStorage.setItem('sai-sms-quote-tour-seen', 'true');
                    }}
                />
            )}
        </div>
    );
};

export default QuoteGame;
