import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WORD_SEARCH_LEVELS, LevelConfig, WordData } from './WordSearchData';
import { loadProgressFromFirestore, saveProgressToFirestore } from '../../lib/wordSearchFirestore';
import { useGameSound } from '../../hooks/useGameSound';

// ==========================================
// 1. TYPES & STATE
// ==========================================

export interface GridCell {
    r: number;
    c: number;
    char: string;
    id: string;
}

export interface WordPath {
    word: string;
    clean: string;
    path: { r: number; c: number }[];
}

export interface GameState {
    grid: string[][];
    solution: WordPath[];
    found: Set<string>;
    score: number;
    elapsedTime: number; // In seconds
    isPlaying: boolean;
    isPaused: boolean;
    isGameOver: boolean;
    hasWon: boolean;
    mode: 'standard' | 'bonus'; // Derived from level type
    inputMethod: 'drag' | 'tap';
    // Hints
    hintsUsedLetter: number;
    hintsUsedWord: number;
}

export type Coordinate = { r: number; c: number };

// ==========================================
// 2. CONSTANTS
// ==========================================

const DEFAULT_GRID_SIZE = 16;
const MAX_PLACEMENT_ATTEMPTS = 300;
const INITIAL_SCORE_STANDARD = 1000;
const TIME_LIMIT_BONUS = 600; // 10 minutes

// HINT PENALTIES
const COST_HINT_LETTER = 10; // +10s
const COST_HINT_WORD = 30; // +30s
const LIMIT_HINT_LETTER = 10;
const LIMIT_HINT_WORD = 5;

// ==========================================
// 3. SOUND HELPERS
// ==========================================
// Sound logic moved to useGameSound hook

const generateGrid = (wordsData: WordData[], isBonus: boolean, size: number = DEFAULT_GRID_SIZE) => {
    // Bonus levels might have denser grids or different rules, but using standard for now
    // However, if it's "Fill in the blank" for Bonus Level 4, we still hide the WORDS in the grid.
    // The "Clue" is shown in the list. The "Word" is in the grid.

    const grid = Array(size).fill('').map(() => Array(size).fill(''));
    const solution: WordPath[] = [];

    const words = [...wordsData]
        .map(w => w.word)
        .sort((a, b) => b.length - a.length);

    // Standard/Quick mode: Horizontal & Vertical only
    // Bonus/Challenge mode: All 8 directions including diagonal & reverse
    const dirs = isBonus
        ? [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]]
        : [[0, 1], [1, 0]];

    let successCount = 0;

    for (const word of words) {
        const clean = word.replace(/[^A-Z]/g, ''); // Ensure only letters
        if (!clean) continue;

        let placed = false;
        let attempts = 0;

        while (!placed && attempts < MAX_PLACEMENT_ATTEMPTS) {
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            const r = Math.floor(Math.random() * size);
            const c = Math.floor(Math.random() * size);

            if (canFit(grid, clean, r, c, dir, size)) {
                const path = putWord(grid, clean, r, c, dir);
                solution.push({
                    word: word,
                    clean: clean,
                    path: path
                });
                placed = true;
                successCount++;
            }
            attempts++;
        }
        if (!placed) console.warn(`Could not place word: ${word}`);
    }

    // Fill empty spaces
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!grid[r][c]) {
                grid[r][c] = abc[Math.floor(Math.random() * abc.length)];
            }
        }
    }

    return { grid, solution };
};

const canFit = (grid: string[][], word: string, r: number, c: number, [dr, dc]: number[], size: number) => {
    if (r + dr * (word.length - 1) < 0 || r + dr * (word.length - 1) >= size) return false;
    if (c + dc * (word.length - 1) < 0 || c + dc * (word.length - 1) >= size) return false;

    for (let i = 0; i < word.length; i++) {
        const char = grid[r + i * dr][c + i * dc];
        if (char && char !== word[i]) return false;
    }
    return true;
};

const putWord = (grid: string[][], word: string, r: number, c: number, [dr, dc]: number[]) => {
    const path = [];
    for (let i = 0; i < word.length; i++) {
        grid[r + i * dr][c + i * dc] = word[i];
        path.push({ r: r + i * dr, c: c + i * dc });
    }
    return path;
};

const useGameLogic = (level: LevelConfig | null) => {
    const { playSound } = useGameSound();
    const [state, setState] = useState<GameState>({
        grid: [],
        solution: [],
        found: new Set(),
        score: 0,
        elapsedTime: 0,
        isPlaying: false,
        isPaused: false,
        isGameOver: false,
        hasWon: false,
        mode: 'standard',
        inputMethod: 'drag',
        hintsUsedLetter: 0,
        hintsUsedWord: 0
    });

    const [selection, setSelection] = useState<string[]>([]);
    const [selectionPath, setSelectionPath] = useState<Coordinate[]>([]);
    const [hintCells, setHintCells] = useState<Set<string>>(new Set());
    const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
    const [lastFoundWord, setLastFoundWord] = useState<WordData | null>(null);

    const timerRef = useRef<any>(null);

    const startGame = useCallback((lvl: LevelConfig) => {
        const size = lvl.gridSize || DEFAULT_GRID_SIZE;
        const { grid, solution } = generateGrid(lvl.words, lvl.type === 'bonus', size);
        setState({
            grid,
            solution,
            found: new Set(),
            score: lvl.type === 'standard' ? INITIAL_SCORE_STANDARD : 0,
            elapsedTime: 0,
            isPlaying: true,
            isPaused: false,
            isGameOver: false,
            hasWon: false,
            mode: lvl.type,
            inputMethod: 'drag',
            hintsUsedLetter: 0,
            hintsUsedWord: 0
        });
        setSelection([]);
        setSelectionPath([]);
        setHintCells(new Set());
        setRevealedCells(new Set());
        setLastFoundWord(null);
    }, []);

    useEffect(() => {
        if (level) startGame(level);
        else setState(prev => ({ ...prev, isPlaying: false }));
    }, [level, startGame]);

    useEffect(() => {
        if (!state.isPlaying || state.isPaused || state.isGameOver || state.hasWon) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (state.isGameOver) playSound('gameover');
            if (state.hasWon) playSound('levelComplete');
            return;
        }

        timerRef.current = setInterval(() => {
            setState(prev => {
                const newTime = prev.elapsedTime + 1;
                let newScore = prev.score;

                if (prev.mode === 'standard') {
                    if (newTime % 5 === 0) newScore -= 1;
                    if (newScore < 100) {
                        return { ...prev, elapsedTime: newTime, score: 100, isGameOver: true, isPlaying: false };
                    }
                } else {
                    if (newTime >= TIME_LIMIT_BONUS) {
                        const threshold = level?.passingScoreThreshold || 300;
                        if (newScore >= threshold) {
                            return { ...prev, elapsedTime: newTime, score: newScore, hasWon: true, isPlaying: false };
                        }
                        return { ...prev, elapsedTime: newTime, score: newScore, isGameOver: true, isPlaying: false };
                    }
                }

                return { ...prev, elapsedTime: newTime, score: newScore };
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [state.isPlaying, state.isPaused, state.isGameOver, state.hasWon, state.mode, level]);

    const handleInputStart = (r: number, c: number) => {
        if (!state.isPlaying || state.isPaused) return;
        setSelection([state.grid[r][c]]);
        setSelectionPath([{ r, c }]);
    };

    const handleInputMove = (r: number, c: number) => {
        if (!state.isPlaying || state.isPaused || selectionPath.length === 0) return;
        const start = selectionPath[0];
        const path = getStraightLinePath(start, { r, c });
        if (path) {
            setSelectionPath(path);
            setSelection(path.map(p => state.grid[p.r][p.c]));
        }
    };

    const handleInputEnd = () => {
        if (selectionPath.length === 0) return;
        checkWord(selection.join(''), selectionPath);
        setSelection([]);
        setSelectionPath([]);
    };

    const getStraightLinePath = (start: Coordinate, end: Coordinate): Coordinate[] | null => {
        const dr = end.r - start.r;
        const dc = end.c - start.c;
        const steps = Math.max(Math.abs(dr), Math.abs(dc));
        if (steps === 0) return [start];
        if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
        const rStep = dr / steps;
        const cStep = dc / steps;
        const path: Coordinate[] = [];
        for (let i = 0; i <= steps; i++) {
            path.push({ r: start.r + i * rStep, c: start.c + i * cStep });
        }
        return path;
    };

    const checkWord = (word: string, path: Coordinate[]) => {
        const reversed = word.split('').reverse().join('');
        // AC-WS-G5: Use indices or unique keys. We check against all solution paths.
        const foundIndex = state.solution.findIndex((s, idx) =>
            !state.found.has(s.word) && (s.clean === word || s.clean === reversed)
        );

        if (foundIndex !== -1) {
            const foundWord = state.solution[foundIndex].word;
            playSound('found');

            const scoreAdd = state.mode === 'bonus' ? 100 : 0;
            const newFound = new Set(state.found);
            newFound.add(foundWord);

            const isWin = newFound.size === state.solution.length;
            if (isWin) {
                // Check threshold for win
                const threshold = level?.passingScoreThreshold || 100;
                const finalScore = state.score + scoreAdd;
                if (finalScore >= threshold) {
                    playSound('levelComplete');
                    setState(prev => ({
                        ...prev,
                        found: newFound,
                        score: finalScore,
                        hasWon: true,
                        isPlaying: false
                    }));
                } else {
                    setState(prev => ({
                        ...prev,
                        found: newFound,
                        score: finalScore
                    }));
                }
            } else {
                setState(prev => ({
                    ...prev,
                    found: newFound,
                    score: prev.score + scoreAdd
                }));
            }

            if (level) {
                const wordData = level.words.find(w => w.word === foundWord);
                if (wordData) setLastFoundWord(wordData);
            }
        }
    };

    const useHint = (type: 'letter' | 'word') => {
        if (state.mode === 'bonus') return;
        const unrevealed = state.solution.filter(s => !state.found.has(s.word));
        if (unrevealed.length === 0) return;
        const target = unrevealed[Math.floor(Math.random() * unrevealed.length)];

        if (type === 'word') {
            if (state.hintsUsedWord >= LIMIT_HINT_WORD) return;
            playSound('hint');
            const newHints = new Set(hintCells);
            target.path.forEach(p => newHints.add(`${p.r},${p.c}`));
            setHintCells(newHints);
            setState(prev => ({
                ...prev,
                elapsedTime: prev.elapsedTime + COST_HINT_WORD,
                hintsUsedWord: prev.hintsUsedWord + 1
            }));
            setTimeout(() => {
                setHintCells(prev => {
                    const next = new Set(prev);
                    target.path.forEach(p => next.delete(`${p.r},${p.c}`));
                    return next;
                });
            }, 3000);
        } else {
            if (state.hintsUsedLetter >= LIMIT_HINT_LETTER) return;
            playSound('hint');
            const start = target.path[0];
            const key = `${start.r},${start.c}`;
            setHintCells(prev => new Set(prev).add(key));
            setState(prev => ({
                ...prev,
                elapsedTime: prev.elapsedTime + COST_HINT_LETTER,
                hintsUsedLetter: prev.hintsUsedLetter + 1
            }));
            setTimeout(() => {
                setHintCells(prev => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            }, 3000);
        }
    };

    return {
        state, setState, selection, selectionPath, hintCells, revealedCells, lastFoundWord, setLastFoundWord,
        startGame, handleInputStart, handleInputMove, handleInputEnd, useHint
    };
};

// ==========================================
// 4. ACCESSIBILITY HELPERS
// ==========================================

const useFocusTrap = (isOpen: boolean, ref: React.RefObject<HTMLElement>) => {
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

// ==========================================
// 5. UI COMPONENTS
// ==========================================

const Header: React.FC<{
    level: LevelConfig | null;
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
                            className="bg-gray-100 hover:bg-gray-200 text-[#002E5B] p-2 rounded-full transition-colors"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    )}
                    <div>
                        <h1 className="font-heading text-2xl font-extrabold text-[#002E5B] tracking-tight">
                            {level ? `Level ${level.id}: ${level.title}` : 'Sai SMS Word Quest'}
                        </h1>
                        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                            {level ? level.type.toUpperCase() + " LEVEL" : "CHOOSE YOUR JOURNEY"}
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

const LevelGallery: React.FC<{
    unlockedLevels: number[];
    onSelectLevel: (levelId: number) => void;
}> = ({ unlockedLevels, onSelectLevel }) => {
    const { playSound } = useGameSound();
    // 11-colour palette in non-sequential shuffled order
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
    const levelGradient = (id: number) => PALETTE[SHUFFLE[(id - 1) % PALETTE.length]];
    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
            {/* Uniform Gallery Header */}
            <div className="text-center mb-10">
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#002E5B] mb-2">Sai SMS Word Quest</h1>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-green-600 mb-3">CHOOSE YOUR JOURNEY</p>
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-50 border border-green-200 rounded-full">
                    <i className="fas fa-leaf text-green-600 text-xs"></i>
                    <span className="text-sm font-semibold text-green-800 italic">Find the Sacred Words hidden in every Grid</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {WORD_SEARCH_LEVELS.map((level) => {
                    const isUnlocked = unlockedLevels.includes(level.id);
                    const isBonus = level.type === 'bonus';
                    return (
                        <div
                            key={level.id}
                            onClick={() => { if (isUnlocked) { playSound('click'); onSelectLevel(level.id); } }}
                            className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 border-2
                                ${!isUnlocked
                                    ? 'opacity-60 cursor-not-allowed border-gray-200 grayscale'
                                    : `cursor-pointer hover:scale-[1.03] hover:shadow-2xl border-transparent hover:border-green-400`
                                }`}
                        >
                            {!isUnlocked && (
                                <div className="absolute inset-0 z-30 bg-gray-100/50 flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="bg-white/80 p-3 rounded-full shadow-lg"><i className="fas fa-lock text-2xl text-gray-400"></i></div>
                                </div>
                            )}
                            {isBonus && isUnlocked && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#D2AC47] to-yellow-600 text-[#002E5B] font-bold text-xs px-3 py-1 rounded-bl-xl z-20 shadow-md">
                                    <i className="fas fa-star mr-1"></i> Bonus
                                </div>
                            )}
                            {/* Shuffled palette gradient header */}
                            <div className="h-24 w-full relative overflow-hidden flex items-center justify-center" style={{ background: levelGradient(level.id) }}>
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent"></div>
                                <div className="z-10 bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    <i className={`fas ${level.icon} text-3xl text-white drop-shadow-md`}></i>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-green-50 text-green-700">
                                        Level {level.id}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-400">{level.words.length} Words</span>
                                </div>
                                <h3 className="font-heading text-xl font-bold text-[#002E5B] mb-2 leading-tight group-hover:text-green-700 transition-colors">
                                    {level.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{level.description}</p>
                            </div>
                            <div className="px-6 pb-6 pt-2">
                                <div className={`w-full py-2 text-center rounded-lg font-bold text-sm transition-colors
                                    ${!isUnlocked ? 'bg-gray-200 text-gray-400' : 'bg-green-50 text-green-700 group-hover:bg-green-500 group-hover:text-white'}`}>
                                    {!isUnlocked ? 'Locked' : (isBonus ? 'Start Bonus Round' : 'Play Now')}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const WordList: React.FC<{
    mode: 'standard' | 'bonus';
    words: WordData[];
    foundWords: Set<string>;
    position?: 'left' | 'right' | 'mobile';
    locked?: boolean;
}> = ({ mode, words, foundWords, position = 'left', locked }) => {
    const { playSound } = useGameSound();
    const [expandedWord, setExpandedWord] = useState<string | null>(null);

    const containerClass = position === 'mobile'
        ? "lg:hidden bg-white p-5 rounded-2xl mt-6 shadow-sm border border-gray-100"
        : `hidden lg:flex flex-col bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,46,91,0.05)] border border-gray-100 overflow-hidden h-full max-h-[700px] sticky top-24`;

    if (locked) {
        return (
            <div className={`${containerClass} relative min-h-[400px]`}>
                <div className="font-heading text-[#002E5B] text-lg font-bold border-b-2 border-[#D2AC47] p-4 pb-2 mb-1">Words to Find</div>
                <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-400 font-bold text-sm bg-white/50 backdrop-blur-[2px] rounded-2xl">Waiting for Start...</div>
                <div className="flex flex-col gap-2 p-3 opacity-10 blur-[1px]">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="py-2 px-3 bg-gray-100 rounded-lg text-transparent">Locked Word</div>)}
                </div>
            </div>
        );
    }

    return (
        <div className={containerClass}>
            <div className="font-heading text-[#002E5B] text-lg font-bold border-b-2 border-[#D2AC47] p-4 pb-2 mb-1">
                {mode === 'bonus' ? 'Golden Clues' : 'Words to Find'}
                <p className="text-xs font-medium text-gray-400 mt-1">{foundWords.size} / {words.length} Found</p>
            </div>
            <div className={`${position !== 'mobile' ? 'flex-1 overflow-y-auto custom-scrollbar p-3' : 'grid grid-cols-2 gap-2 mt-2 p-3'} flex flex-col gap-2`}>
                {words.map((w) => {
                    const isFound = foundWords.has(w.word);
                    const isExpanded = expandedWord === w.word;
                    const isBonusLevel = !!w.clue;

                    return (
                        <div key={w.word} className={`${position === 'mobile' && isExpanded ? 'col-span-2' : ''} transition-all duration-200`}>
                            <div
                                onClick={() => {
                                    if (isFound || isBonusLevel) {
                                        playSound('click');
                                        setExpandedWord(prev => prev === w.word ? null : w.word);
                                    }
                                }}
                                className={`py-2 px-3.5 rounded-lg text-sm font-bold border-l-4 transition-all duration-300 flex flex-col justify-center min-h-[40px]
                                    ${isFound
                                        ? 'bg-gray-100 text-[#002E5B] border-[#D2AC47] cursor-pointer hover:bg-gray-50'
                                        : isBonusLevel
                                            ? 'bg-[#7B2482]/10 text-[#7B2482] border-[#7B2482] cursor-pointer hover:bg-[#7B2482]/20'
                                            : 'bg-[#F5F3E8] text-[#002E5B] border-[#002E5B] shadow-sm'
                                    }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className={isFound ? 'line-through decoration-[#D2AC47] decoration-2 opacity-70' : ''}>
                                        {isBonusLevel ? (isFound ? w.word : "???") : w.word}
                                    </span>
                                    {(isFound || isBonusLevel) && <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[10px] ml-2 text-gray-400`}></i>}
                                </div>
                                {isBonusLevel && !isFound && !isExpanded && (
                                    <span className="text-[10px] text-gray-500 font-normal italic truncate mt-1">{w.clue}</span>
                                )}
                            </div>
                            {isExpanded && (
                                <div className="mt-1 p-3 text-xs text-gray-700 bg-[#F5F3E8] rounded-lg border border-gray-100 leading-relaxed animate-pop-in">
                                    {isBonusLevel && !isFound ? <div className="font-semibold text-[#7B2482] italic">CLUE: {w.clue}</div> : w.desc}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const GameControls: React.FC<{
    score: number;
    time: number;
    onHint: (type: 'letter' | 'word') => void;
    onPause: () => void;
    isPaused: boolean;
    mode: 'standard' | 'bonus';
    hintsUsedLetter: number;
    hintsUsedWord: number;
}> = ({ score, time, onHint, onPause, isPaused, mode, hintsUsedLetter, hintsUsedWord }) => {
    const { playSound } = useGameSound();


    // Format timer
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div id="game-controls" className="bg-[#FAF9F6] px-6 py-4 flex flex-wrap gap-4 items-center justify-between shadow-sm relative z-10 border-b border-gray-100">
            {/* Score & Timer Pills */}
            <div className="flex items-center gap-4">
                <div className="bg-[#002E5B] text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                    <i className="fas fa-star text-[#D2AC47] text-sm mb-0.5"></i>
                    <span className="font-heading text-lg font-bold tracking-wide">{score}</span>
                </div>
                <div className="bg-white text-[#002E5B] px-5 py-2 rounded-full flex items-center gap-2 shadow-sm border border-gray-200 hover:border-[#D2AC47] transition-colors">
                    <i className="fas fa-clock text-[#D2AC47] text-sm mb-0.5"></i>
                    <span className="font-heading text-lg font-bold tracking-wide tabular-nums">{formatTime(time)}</span>
                </div>
            </div>

            {/* Hint Controls */}
            <div className="flex items-center gap-3">
                {mode === 'standard' && (
                    <>
                        <button
                            onClick={() => onHint('letter')}
                            disabled={hintsUsedLetter >= LIMIT_HINT_LETTER || isPaused}
                            className={`
                                relative w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300
                                ${hintsUsedLetter >= LIMIT_HINT_LETTER
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-white text-[#002E5B] border border-gray-200 hover:border-[#D2AC47] hover:text-[#D2AC47] hover:shadow-md hover:scale-105 shadow-sm'
                                }
                            `}
                            title={`Letter Hint (+${COST_HINT_LETTER}s)`}
                        >
                            <span className="font-bold text-xs uppercase">A</span>
                            <span className="absolute -top-1 -right-1 text-[9px] bg-[#D2AC47] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                                {LIMIT_HINT_LETTER - hintsUsedLetter}
                            </span>
                        </button>
                        <button
                            onClick={() => onHint('word')}
                            disabled={hintsUsedWord >= LIMIT_HINT_WORD || isPaused}
                            className={`
                                relative w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300
                                ${hintsUsedWord >= LIMIT_HINT_WORD
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-white text-[#002E5B] border border-gray-200 hover:border-[#D2AC47] hover:text-[#D2AC47] hover:shadow-md hover:scale-105 shadow-sm'
                                }
                            `}
                            title={`Word Hint (+${COST_HINT_WORD}s)`}
                        >
                            <i className="fas fa-eye text-xs"></i>
                            <span className="absolute -top-1 -right-1 text-[9px] bg-[#D2AC47] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                                {LIMIT_HINT_WORD - hintsUsedWord}
                            </span>
                        </button>
                    </>
                )}

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                <button
                    onClick={() => { playSound('click'); onPause(); }}
                    className="w-10 h-10 rounded-full bg-[#002E5B] text-white flex items-center justify-center hover:bg-[#003d7a] hover:scale-110 transition-all shadow-lg active:scale-95"
                >
                    <i className={`fas ${isPaused ? 'fa-play pl-0.5' : 'fa-pause'}`}></i>
                </button>
            </div>
        </div>
    );
};

const WordGrid: React.FC<{
    grid: string[][];
    selection: string[];
    selectionPath: Coordinate[];
    foundCells: Set<string>;
    hintCells: Set<string>;
    revealedCells: Set<string>;
    onInputStart: (r: number, c: number) => void;
    onInputMove: (r: number, c: number) => void;
    onInputEnd: () => void;
    isPlaying: boolean;
    isPaused: boolean;
    blurred: boolean;
}> = ({ grid, selection, selectionPath, foundCells, hintCells, onInputStart, onInputMove, onInputEnd, isPlaying, isPaused, blurred }) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const isSelected = (r: number, c: number) => selectionPath.some(p => p.r === r && p.c === c);
    const gridSize = grid.length;

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isPlaying || isPaused || !gridRef.current) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = gridRef.current.getBoundingClientRect();

        // Calculate cell indices from coordinates
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

        const c = Math.floor((x / rect.width) * gridSize);
        const r = Math.floor((y / rect.height) * gridSize);

        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
            onInputMove(r, c);
        }
    };

    return (
        <div
            ref={gridRef}
            className={`
                relative bg-[#0f2044] p-3 rounded-2xl shadow-2xl select-none touch-none transition-opacity duration-500 w-full mx-auto aspect-square flex flex-col justify-center
                ${blurred ? 'blur-sm opacity-50 pointer-events-none' : 'opacity-100'}
            `}
            style={{
                maxWidth: 'min(500px, calc(100vh - 180px))',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none'
            }}
            role="grid"
            aria-label="Word Search Grid"
            onMouseLeave={onInputEnd}
            onMouseUp={onInputEnd}
            onTouchEnd={onInputEnd}
            onTouchCancel={onInputEnd}
        >
            <div
                className="grid gap-[1px] w-full h-full cursor-pointer"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                    aspectRatio: '1 / 1'
                }}
                onMouseUp={onInputEnd}
            >
                {grid.map((row, r) =>
                    row.map((char, c) => {
                        const key = `${r},${c}`;
                        const isFound = foundCells.has(key);
                        const isHint = hintCells.has(key);
                        const isSel = isSelected(r, c);

                        return (
                            <div
                                key={`${r}-${c}`}
                                role="gridcell"
                                aria-label={`Row ${r + 1} Column ${c + 1} letter ${char}`}
                                onMouseDown={(e) => { e.preventDefault(); onInputStart(r, c); }}
                                onMouseEnter={() => onInputMove(r, c)}
                                onTouchStart={(e) => { e.preventDefault(); onInputStart(r, c); }}
                                onTouchMove={handleTouchMove}
                                className={`
                                    flex items-center justify-center font-bold rounded-[2px]
                                    select-none pointer-events-auto
                                    ${isFound
                                        ? 'bg-green-500/40 text-white'
                                        : isSel
                                            ? 'bg-yellow-400 text-[#002E5B] shadow-md z-10'
                                            : isHint
                                                ? 'bg-yellow-300/30 text-white animate-pulse'
                                                : 'text-white/90 hover:bg-white/10'
                                    }
                                `}
                                style={{
                                    fontSize: 'clamp(9px, 2vw, 16px)',
                                    lineHeight: 1,
                                    transition: isSel ? 'none' : 'background-color 0.2s'
                                }}
                            >
                                <span className="pointer-events-none">{char}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};


// ==========================================
// 5. MODALS & GLOBAL STYLES
// ==========================================

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
                            <h2 className="font-heading text-3xl font-extrabold text-[#002E5B]">How to Play</h2>
                            <p className="text-gray-500 font-medium">Sai SMS Word Quest</p>
                        </div>
                    </div>

                    <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 max-h-[50vh]">
                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-[#7B2482] text-white flex items-center justify-center font-bold shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-[#002E5B] mb-1">Find Sacred Words</h4>
                                <p className="text-sm text-gray-600">Search for words hidden in the grid. They can be horizontal, vertical, or diagonal. Connect the letters to claim them!</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-[#002E5B] mb-1">Unlock Levels</h4>
                                <p className="text-sm text-gray-600">Complete a level to unlock the next. Challenge your mind with Bonus Levels where you complete Golden Quotes!</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shrink-0">3</div>
                            <div>
                                <h4 className="font-bold text-[#002E5B] mb-1">Collect & Learn</h4>
                                <p className="text-sm text-gray-600">Every word has a story. Mark discovered words with a STAR to save them to your Personal Briefcase.</p>
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
    const { playSound } = useGameSound();
    const [targetRect, setTargetRect] = useState<{ top: number, left: number, width: number, height: number } | null>(null);
    const tourRef = useRef<HTMLDivElement>(null);
    useFocusTrap(step !== null, tourRef);

    // Identify target element ID logic
    useEffect(() => {
        let elId = '';
        if (step === 2 || step === 3) elId = 'game-area'; // Grid / Formation
        if (step === 4) elId = 'game-controls'; // Score

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

        // Initial update and retry for a short duration to handle layout shifts
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

    // Mask path construction
    const maskPath = targetRect
        ? `M 0 0 L 0 100% L 100% 100% L 100% 0 Z M ${targetRect.left - 5} ${targetRect.top - 5} L ${targetRect.left + targetRect.width + 5} ${targetRect.top - 5} L ${targetRect.left + targetRect.width + 5} ${targetRect.top + targetRect.height + 5} L ${targetRect.left - 5} ${targetRect.top + targetRect.height + 5} Z`
        : `M 0 0 L 0 100% L 100% 100% L 100% 0 Z`; // Full cover if no target

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
            {/* SVG Mask Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ fillRule: 'evenodd' }}>
                <path d={maskPath} fill="rgba(0,0,0,0.75)" />
            </svg>

            {/* Content Card */}
            <div
                ref={tourRef}
                className={`
                relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-[90%] md:w-full animate-slide-up border-l-8 border-[#D2AC47]
                ${targetRect ? 'absolute' : ''}
            `}
                style={targetRect ? {

                    // Smart positioning: if target is low, show above, else below
                    top: targetRect.top > window.innerHeight / 2 ? 'auto' : targetRect.top + targetRect.height + 20,
                    bottom: targetRect.top > window.innerHeight / 2 ? window.innerHeight - targetRect.top + 20 : 'auto',
                    // Center horizontally relative to target, clamped to screen
                    left: Math.max(20, Math.min(window.innerWidth - 340, targetRect.left + targetRect.width / 2 - 250))
                } : {}}
            >
                {step === 1 && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-[#D2AC47] rounded-full flex items-center justify-center text-[#002E5B] text-3xl mb-4 shadow-lg animate-bounce-slow">
                            <i className="fas fa-om"></i>
                        </div>
                        <h2 className="font-heading text-2xl font-extrabold text-[#002E5B] mb-2">Om Sai Ram! Welcome.</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Welcome to the **Sai SMS Word Quest**. Each word you find reveals a glimpse into the inspiring life of our Beloved Swami.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => { playSound('click'); onSkip(); }} className="px-6 py-2.5 rounded-full text-gray-500 font-bold hover:bg-gray-100 transition-colors">Skip</button>
                            <button onClick={() => { playSound('click'); onNext(); }} className="px-6 py-2.5 rounded-full bg-[#002E5B] text-white font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                                Begin Guided Tour <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 className="font-heading text-xl font-bold text-[#002E5B] mb-2">The Sai Grid</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Hidden within these letters are names, places, and sacred moments from Swami's story. Your mission is to find them all.
                        </p>
                        <div className="flex justify-between items-center">
                            <button onClick={() => { playSound('click'); onSkip(); }} className="text-gray-400 text-sm font-bold hover:text-gray-600">Skip Tour</button>
                            <button onClick={() => { playSound('click'); onNext(); }} className="bg-[#002E5B] text-white px-5 py-2 rounded-lg font-bold text-sm shadow hover:bg-opacity-90">
                                Continue <i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3 className="font-heading text-xl font-bold text-[#002E5B] mb-2">How to Form a Word</h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Simply drag across letters explicitly to connect them. Words can be formed horizontally, vertically, or diagonally.
                        </p>

                        {/* Mini Demo Grid */}
                        <div className="bg-[#001A33] p-3 rounded-xl mb-6 flex justify-center">
                            <div className="grid grid-cols-4 gap-1">
                                {['S', 'A', 'I', 'R', 'B', 'A', 'B', 'A', 'L', 'O', 'V', 'E'].map((c, i) => (
                                    <div key={i} className={`
                                        w-8 h-8 rounded flex items-center justify-center text-xs font-bold
                                        ${i < 3 ? 'bg-[#D2AC47] text-[#002E5B] animate-pulse' : 'bg-white/10 text-white'}
                                    `}>
                                        {c}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <button onClick={() => { playSound('click'); onSkip(); }} className="text-gray-400 text-sm font-bold hover:text-gray-600">Skip Tour</button>
                            <button onClick={() => { playSound('click'); onNext(); }} className="bg-[#002E5B] text-white px-5 py-2 rounded-lg font-bold text-sm shadow hover:bg-opacity-90">
                                Continue <i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h3 className="font-heading text-xl font-bold text-[#002E5B] mb-2">The Sai Score</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            You start with <b>1000 points</b>. Time is precious—every few seconds costs a point. Using Hints (Letter or Word) adds time penalties, so use them wisely!
                        </p>
                        <div className="flex justify-between items-center">
                            <button onClick={() => { playSound('click'); onSkip(); }} className="text-gray-400 text-sm font-bold hover:text-gray-600">Skip Tour</button>
                            <button onClick={() => { playSound('click'); onNext(); }} className="bg-[#002E5B] text-white px-5 py-2 rounded-lg font-bold text-sm shadow hover:bg-opacity-90">
                                Continue <i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-[#7B2482] rounded-full flex items-center justify-center text-white text-xl mb-3 shadow-lg">
                            <i className="fas fa-road"></i>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-[#002E5B] mb-2">The Sai Path</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Choose your journey mode. "Challenge" tests your speed with no help, while "Quick" allows hints.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => { playSound('click'); onSkip(); }} className="px-6 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 flex-1">
                                Quick Mode
                            </button>
                            <button onClick={() => { playSound('click'); onSkip(); }} className="px-6 py-2.5 rounded-xl bg-[#002E5B] text-white font-bold hover:shadow-lg flex-1">
                                Challenge Mode
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Enjoy the journey!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const FactModal: React.FC<{
    wordData: WordData | null;
    onClose: () => void;
    onSave?: (data: WordData) => void;
}> = ({ wordData, onClose, onSave }) => {
    const { playSound } = useGameSound();
    const [saved, setSaved] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    useFocusTrap(!!wordData, modalRef);

    useEffect(() => {

        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    if (!wordData) return null;

    const handleSave = () => {
        if (onSave) {
            onSave(wordData);
            setSaved(true);
            playSound('click');
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pointer-events-none p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-auto" onClick={onClose}></div>
            <div ref={modalRef} className="bg-white pointer-events-auto rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg mb-4 sm:mb-0 animate-slide-up border-l-8 border-[#D2AC47]">

                <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#D2AC47]/20 text-[#002E5B] w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2">
                        <i className="fas fa-lightbulb"></i>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <h3 className="font-heading text-3xl font-extrabold text-[#002E5B] mb-2">{wordData.word}</h3>
                <div className="h-1 w-20 bg-[#D2AC47] mb-4 rounded-full"></div>

                <p className="text-gray-700 leading-relaxed font-medium mb-6 text-lg">
                    {wordData.desc}
                </p>

                {wordData.source && (
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100 overflow-hidden text-ellipsis">
                        <i className="fas fa-book mr-2"></i>
                        source: <a href={wordData.source} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{wordData.source}</a>
                    </div>
                )}

                <div className="flex gap-4">
                    {onSave && (
                        <button
                            onClick={handleSave}
                            disabled={saved}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 flex items-center justify-center gap-2
                                ${saved
                                    ? 'bg-green-50 border-green-200 text-green-600'
                                    : 'bg-white border-[#7B2482] text-[#7B2482] hover:bg-[#7B2482] hover:text-white shadow-md'
                                }
                            `}
                        >
                            <i className={`fas ${saved ? 'fa-check' : 'fa-star'}`}></i>
                            {saved ? 'Saved to Briefcase' : 'Save to Briefcase'}
                        </button>
                    )}
                    <button
                        onClick={() => { playSound('click'); onClose(); }}
                        className="flex-1 bg-[#002E5B] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

const ResultModal: React.FC<{
    won: boolean;
    score: number;
    time: number;
    level: LevelConfig | null;
    isBonus: boolean;
    onRestart: () => void;
    onNextLevel: () => void;
    hasNextLevel: boolean;
    onBackToGallery: () => void;
}> = ({ won, score, time, level, isBonus, onRestart, onNextLevel, hasNextLevel, onBackToGallery }) => {
    const { playSound } = useGameSound();
    const modalRef = useRef<HTMLDivElement>(null);
    useFocusTrap(won || !won, modalRef); // Always when visible

    useEffect(() => {

        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onBackToGallery(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onBackToGallery]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-500" onClick={onBackToGallery} role="dialog" aria-modal="true">
            <div ref={modalRef} className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D2AC47] via-yellow-500 to-[#D2AC47]"></div>

                <div className="mb-6 relative">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl shadow-xl mb-4 ${won ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <i className={`fas ${won ? 'fa-trophy' : 'fa-times'}`}></i>
                    </div>
                    {won && (
                        <div className="absolute -top-2 -right-2 text-[#D2AC47] animate-bounce text-4xl">
                            <i className="fas fa-star"></i>
                        </div>
                    )}
                </div>

                <h2 className="font-heading text-3xl font-extrabold text-[#002E5B] mb-2">
                    {won ? (isBonus ? 'Golden Victory!' : 'Level Complete!') : 'Game Over'}
                </h2>

                <p className="text-gray-500 font-medium mb-8">
                    {won
                        ? `You have mastered ${level?.title || 'this level'}`
                        : isBonus ? "Time's up!" : "Keep practicing your focus."}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Score</div>
                        <div className="text-3xl font-black text-[#002E5B]">{score}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Time</div>
                        <div className="text-3xl font-black text-[#002E5B]">{Math.floor(time / 60)}:{Math.floor(time % 60).toString().padStart(2, '0')}</div>
                    </div>
                </div>

                <div className="space-y-3">
                    {won && hasNextLevel && (
                        <button
                            onClick={() => { playSound('click'); onNextLevel(); }}
                            className="w-full bg-[#7B2482] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            Next Level <i className="fas fa-arrow-right"></i>
                        </button>
                    )}

                    <button
                        onClick={() => { playSound('click'); onRestart(); }}
                        className={`w-full py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${won ? 'bg-white border-[#002E5B] text-[#002E5B] hover:bg-gray-50' : 'bg-[#002E5B] text-white shadow-lg'}`}
                    >
                        <i className="fas fa-redo"></i> Try Again
                    </button>

                    <button
                        onClick={() => { playSound('click'); onBackToGallery(); }}
                        className="w-full text-gray-400 font-bold hover:text-[#002E5B] py-2"
                    >
                        Back to Quest Map
                    </button>
                </div>
            </div>
        </div>
    );
};

const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        .font-heading { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Poppins', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D2AC47; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #7B2482; }
        
        @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            40% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }

        @keyframes pulseHint {
            0% { box-shadow: 0 0 0 0 rgba(0, 150, 136, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(0, 150, 136, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 150, 136, 0); }
        }
        .animate-pulse-hint { animation: pulseHint 2s infinite; }

        @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
        `
    }} />
);

// ==========================================
// 6. MAIN APP COMPONENT
// ==========================================

interface WordSearchGameProps {
    onComplete?: (score: number, timeSaved: number) => void;
    onSaveCard?: (card: WordData) => void;
}

const WordSearchGame: React.FC<WordSearchGameProps> = ({ onComplete, onSaveCard }) => {
    // --- State ---
    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
    const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]); // Default unlock level 1
    const [showHelp, setShowHelp] = useState(false);
    const [tourStep, setTourStep] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'gallery' | 'game'>('gallery');
    const [showGuestPrompt, setShowGuestPrompt] = useState(false);

    // Use the shared sound hook
    const { playSound, isMuted, toggleMute } = useGameSound();

    // Persistence for Unlocked Levels + Firestore sync
    useEffect(() => {
        const saved = localStorage.getItem('sms_wordsearch_unlocked');
        if (saved) {
            setUnlockedLevels(JSON.parse(saved));
        }



        const userStr = localStorage.getItem('sms_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.uid && !user.isGuest) {
                    loadProgressFromFirestore(user.uid).then(progress => {
                        if (progress) {
                            const localUnlocked = JSON.parse(localStorage.getItem('sms_wordsearch_unlocked') || '[1]');
                            const merged = Array.from(new Set([...localUnlocked, ...progress.unlockedLevels]));
                            setUnlockedLevels(merged);
                            localStorage.setItem('sms_wordsearch_unlocked', JSON.stringify(merged));
                        }
                    });
                }
            } catch { /* ignore */ }
        }
    }, []);

    // AC-WS-D2: Offline Sync (pendingOps)
    useEffect(() => {
        const syncPending = async () => {
            const pendingStr = localStorage.getItem('sms_wordsearch_pending_sync');
            const userStr = localStorage.getItem('sms_user');
            if (!pendingStr || !userStr || !navigator.onLine) return;

            try {
                const user = JSON.parse(userStr);
                if (user.isGuest || !user.uid) return;

                const pending = JSON.parse(pendingStr);
                for (const op of pending) {
                    await saveProgressToFirestore(
                        user.uid,
                        unlockedLevels,
                        op.levelId,
                        op.score,
                        op.time
                    );
                }
                localStorage.removeItem('sms_wordsearch_pending_sync');
            } catch (error) {
                console.error('[WordSearch] Sync failed:', error);
            }
        };

        window.addEventListener('online', syncPending);
        syncPending();
        return () => window.removeEventListener('online', syncPending);
    }, [unlockedLevels]);

    const currentLevel = currentLevelId ? WORD_SEARCH_LEVELS.find(l => l.id === currentLevelId) || null : null;

    // Game Logic Hook
    const {
        state, setState, selection, selectionPath, hintCells, revealedCells, lastFoundWord, setLastFoundWord,
        startGame, handleInputStart, handleInputMove, handleInputEnd, useHint
    } = useGameLogic(currentLevel);

    // Helpers
    const handleLevelSelect = (id: number) => {
        if (id > 1) {
            const userStr = localStorage.getItem('sms_user');
            if (!userStr) {
                setShowGuestPrompt(true);
                return;
            }
            try {
                const user = JSON.parse(userStr);
                if (user.isGuest) {
                    setShowGuestPrompt(true);
                    return;
                }
            } catch { setShowGuestPrompt(true); return; }
        }
        setCurrentLevelId(id);
        setViewMode('game');
        if (id === 1) {
            const tutorialSeen = localStorage.getItem('sai-sms-tour-seen');
            if (!tutorialSeen) setTourStep(1);
        }
    };

    // toggleMute is now handled by the hook


    const handleBackToGallery = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
        setViewMode('gallery');
        setCurrentLevelId(null);
    };

    const handleNextLevel = () => {
        if (currentLevelId) {
            const nextId = currentLevelId + 1;
            const nextLevel = WORD_SEARCH_LEVELS.find(l => l.id === nextId);
            if (nextLevel) {
                // AC-WS-G2: Only unlock if passed previous level correctly
                // In our flow, handleLevelComplete is called when state.hasWon is true.
                handleLevelSelect(nextId);
            } else {
                handleBackToGallery();
            }
        }
    };

    const handleLevelComplete = () => {
        let newUnlocked = unlockedLevels;
        if (currentLevelId) {
            const nextId = currentLevelId + 1;
            if (WORD_SEARCH_LEVELS.some(l => l.id === nextId) && !unlockedLevels.includes(nextId)) {
                newUnlocked = [...unlockedLevels, nextId];
                setUnlockedLevels(newUnlocked);
                localStorage.setItem('sms_wordsearch_unlocked', JSON.stringify(newUnlocked));
            }
        }

        if (onComplete) {
            onComplete(state.score, state.elapsedTime);
        }

        const userStr = localStorage.getItem('sms_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.uid && !user.isGuest) {
                    if (navigator.onLine) {
                        saveProgressToFirestore(
                            user.uid,
                            newUnlocked,
                            currentLevelId || undefined,
                            state.score,
                            state.elapsedTime
                        );
                    } else {
                        // Offline queue (AC-WS-D2)
                        const pending = JSON.parse(localStorage.getItem('sms_wordsearch_pending_sync') || '[]');
                        pending.push({
                            levelId: currentLevelId,
                            score: state.score,
                            time: state.elapsedTime,
                            timestamp: Date.now()
                        });
                        localStorage.setItem('sms_wordsearch_pending_sync', JSON.stringify(pending));
                    }
                }
            } catch { /* ignore */ }
        }
    };

    useEffect(() => {
        if (state.hasWon) {
            handleLevelComplete();
        }
    }, [state.hasWon]);


    const activeLevel = currentLevel;

    // Split words for desktop
    const midPoint = activeLevel ? Math.ceil(activeLevel.words.length / 2) : 0;
    const leftWords = activeLevel ? activeLevel.words.slice(0, midPoint) : [];
    const rightWords = activeLevel ? activeLevel.words.slice(midPoint) : [];

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] font-body text-[#1a1a1a]">
            <GlobalStyles />

            <Header
                level={activeLevel}
                onBack={handleBackToGallery}
                onTutorial={() => setShowHelp(true)}
                onToggleMute={toggleMute}
                isMuted={isMuted}
            />

            {viewMode === 'gallery' ? (
                <LevelGallery
                    unlockedLevels={unlockedLevels}
                    onSelectLevel={handleLevelSelect}
                />
            ) : (
                <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 flex flex-col lg:grid lg:grid-cols-[260px_1fr_260px] gap-6 items-start animate-in fade-in duration-300">
                    {/* Left Sidebar */}
                    <WordList
                        mode={state.mode}
                        words={leftWords}
                        foundWords={state.found}
                        position="left"
                    />

                    {/* Game Card */}
                    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col w-full border-2 ${state.mode === 'bonus' ? 'border-[#D2AC47]' : 'border-gray-100'}`}>
                        {/* Level Info Banner */}
                        <div className={`p-8 pb-4 text-center bg-white`}>
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <i className="fas fa-leaf text-lg"></i>
                            </div>
                            <h2 className="font-heading text-3xl font-extrabold mb-1 text-[#002E5B]">
                                {activeLevel?.title}
                            </h2>
                            <p className="text-sm max-w-xl mx-auto font-medium text-gray-400">
                                {activeLevel?.description}
                            </p>
                        </div>

                        <GameControls
                            score={state.score}
                            time={state.elapsedTime}
                            onHint={useHint}
                            onPause={() => setState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                            isPaused={state.isPaused}
                            mode={state.mode}
                            hintsUsedLetter={state.hintsUsedLetter}
                            hintsUsedWord={state.hintsUsedWord}
                        />

                        <div id="game-area" className="bg-white p-5 flex flex-col items-center justify-center min-h-[400px] relative">
                            {/* Paused Overlay */}
                            {state.isPaused && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                                    <h3 className="font-heading text-3xl font-bold text-[#002E5B] mb-4">Game Paused</h3>
                                    <button
                                        onClick={() => setState(prev => ({ ...prev, isPaused: false }))}
                                        className="bg-[#002E5B] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                                    >
                                        Resume
                                    </button>
                                </div>
                            )}

                            {/* Grid */}
                            <WordGrid
                                grid={state.grid}
                                selection={selection}
                                selectionPath={selectionPath}
                                foundCells={new Set([...Array.from(state.found).flatMap(w => {
                                    const path = state.solution.find(s => s.word === w)?.path || [];
                                    return path.map(p => `${p.r},${p.c}`);
                                })])}
                                hintCells={hintCells}
                                revealedCells={revealedCells}
                                onInputStart={handleInputStart}
                                onInputMove={handleInputMove}
                                onInputEnd={handleInputEnd}
                                isPlaying={state.isPlaying}
                                isPaused={state.isPaused}
                                blurred={state.isPaused || !state.isPlaying}
                            />
                        </div>

                        {/* Mobile Word List */}
                        <WordList
                            mode={state.mode}
                            words={activeLevel?.words || []}
                            foundWords={state.found}
                            position="mobile"
                        />
                    </div>

                    {/* Right Sidebar */}
                    <WordList
                        mode={state.mode}
                        words={rightWords}
                        foundWords={state.found}
                        position="right"
                    />
                </main>
            )}

            <footer className="text-center p-6 text-xs text-gray-400 font-semibold">
                Sai SMS by SSIOM 2026
            </footer>

            {showHelp && (
                <HelpInfoPanel onClose={() => setShowHelp(false)} />
            )}

            {tourStep !== null && (
                <SpotlightTour
                    step={tourStep}
                    onNext={() => {
                        if (tourStep === 1) {
                            // Enter Level 1
                            if (!currentLevelId) handleLevelSelect(1);
                            setTourStep(2);
                        } else if (tourStep < 5) {
                            setTourStep(tourStep + 1);
                        } else {
                            // Finish
                            setTourStep(null);
                            localStorage.setItem('sai-sms-tour-seen', 'true');
                        }
                    }}
                    onSkip={() => {
                        setTourStep(null);
                        localStorage.setItem('sai-sms-tour-seen', 'true');
                    }}
                />
            )}

            {lastFoundWord && (
                <FactModal
                    wordData={lastFoundWord}
                    onClose={() => setLastFoundWord(null)}
                    onSave={onSaveCard}
                />
            )}

            {(state.isGameOver || state.hasWon) && (
                <ResultModal
                    won={state.hasWon}
                    score={state.score}
                    time={state.elapsedTime}
                    level={activeLevel}
                    isBonus={state.mode === 'bonus'}
                    onRestart={() => activeLevel && startGame(activeLevel)}
                    onNextLevel={handleNextLevel}
                    hasNextLevel={!!(currentLevelId && WORD_SEARCH_LEVELS.some(l => l.id === currentLevelId + 1))}
                    onBackToGallery={handleBackToGallery}
                />
            )}

            {/* Guest Prompt Modal (C2) */}
            {showGuestPrompt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setShowGuestPrompt(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 mx-auto bg-[#D2AC47] rounded-2xl flex items-center justify-center text-3xl text-[#002E5B] shadow-lg mb-4">
                            <i className="fas fa-lock"></i>
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-[#002E5B] mb-2">Register to Continue</h3>
                        <p className="text-gray-500 mb-6 text-sm">Create a free account to unlock Level 2 and beyond, save your progress, and collect word cards to your Briefcase.</p>
                        <div className="space-y-3">
                            <a
                                href="/#/signup"
                                onClick={() => playSound('click')}
                                className="block bg-[#002E5B] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                Sign Up Free
                            </a>
                            <button
                                onClick={() => { playSound('click'); setShowGuestPrompt(false); }}
                                className="block w-full text-gray-400 font-bold hover:text-[#002E5B] py-2"
                            >
                                Maybe Later
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordSearchGame;
