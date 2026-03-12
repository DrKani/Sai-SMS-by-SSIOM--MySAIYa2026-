import React, {
    useState, useEffect, useRef, useCallback, useMemo
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import '../styles/onboarding.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type SpotlightShape = 'rect' | 'pill' | 'circle' | 'wide-rect' | 'none';
type CardSide = 'top' | 'bottom' | 'left' | 'right' | 'center';

interface TourStep {
    id: number;
    target?: string;          // DOM element id (no #)
    spotlightShape: SpotlightShape;
    title: string;
    body: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    preferredSide?: CardSide;
    isModal?: boolean;        // full-screen center modal (no spotlight)
    customContent?: React.ReactNode;
}

interface SpotlightGeometry {
    x: number;
    y: number;
    width: number;
    height: number;
    rx: number; // border-radius x
}

interface CardPosition {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    transform?: string;
    maxWidth: number;
}

// ─── Audio chime (tiny base64 encoded soft chime — 0.5s WAV) ─────────────────
// This is a minimal 440Hz tone envelope generated as base64.
const CHIME_SRC =
    'data:audio/wav;base64,' +
    'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

// ─── Confetti colours ─────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
    '#D2AC47', '#F7EF8A', '#7B2482', '#A56AAA',
    '#00BCD4', '#003366', '#E8C87B', '#C9A961',
];

// ─── Tour Steps Config ────────────────────────────────────────────────────────
const TOUR_STEPS: TourStep[] = [
    {
        id: 1,
        spotlightShape: 'none',
        isModal: true,
        primaryLabel: 'Begin Guided Tour',
        secondaryLabel: 'Skip Tour',
        title: 'Welcome to Sai SMS by SSIOM',
        body: 'Om Sai Ram! Welcome to Sai SMS — your personal Sadhana companion. Let us take 30 seconds to show you around.',
    },
    {
        id: 2,
        target: 'tour-ticker',
        spotlightShape: 'wide-rect',
        preferredSide: 'bottom',
        title: 'The Ticker',
        body: 'Important national updates from the Spiritual wing of SSIOM appear here. Click "View Announcements" to read them. The pause button freezes the scroll.',
    },
    {
        id: 3,
        target: 'tour-search',
        spotlightShape: 'pill',
        preferredSide: 'bottom',
        title: 'The Search Bar',
        body: 'Tap here — or press ⌘K — anytime to quickly jump to any feature in the app.',
    },
    {
        id: 4,
        target: 'tour-avatar',
        spotlightShape: 'circle',
        preferredSide: 'bottom',
        title: 'Profile Avatar',
        body: 'This is your Sai SMS profile. Click here to view your rank, badges earned, and personal Sadhana goals.',
    },
    {
        id: 5,
        target: 'tour-hamburger',
        spotlightShape: 'circle',
        preferredSide: 'bottom',
        title: 'Hamburger Menu',
        body: 'The navigation menu holds all your tools: Dashboard, Leaderboard, Namasmarana, Likitha Japa, Book Club, Play it, Calendar and more.',
    },
    {
        id: 6,
        target: 'tour-weekly-wisdom',
        spotlightShape: 'rect',
        preferredSide: 'top',
        title: "This Week's Wisdom",
        body: "Every week, a new chapter from Ramakatha Rasavahini is featured here. Click 'Read Now' to begin your reading journey.",
    },
    {
        id: 7,
        target: 'tour-collective-prayer',
        spotlightShape: 'rect',
        preferredSide: 'top',
        title: 'Collective Prayer',
        body: 'This is the live national offering tally. Every chant you submit adds to our collective offering to Swami.',
    },
    {
        id: 8,
        target: 'tour-fab',
        spotlightShape: 'circle',
        preferredSide: 'top',
        title: 'Quick Actions (+ Button)',
        body: "Wherever you are in the app, tap this '+' button for a quick shortcut back to any key feature.",
    },
    {
        id: 9,
        spotlightShape: 'none',
        isModal: true,
        primaryLabel: 'OFFER MY MANTRA COUNT',
        secondaryLabel: 'EXPLORE ON MY OWN',
        title: "You're All Set! 🎉",
        body: 'Your first suggested action: Chant and offer your chants to Swami right away! Om Sai Ram.',
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CARD_WIDTH = 340;
const CARD_WIDTH_MOBILE = 300;
const SPOTLIGHT_PAD = 8;
const MIN_SPOTLIGHT_PAD = 4;
const CARD_GAP = 14;

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function getSpotlightGeom(
    el: HTMLElement,
    shape: SpotlightShape,
    isMobile: boolean
): SpotlightGeometry {
    const rect = el.getBoundingClientRect();
    const pad = isMobile
        ? Math.max(MIN_SPOTLIGHT_PAD, SPOTLIGHT_PAD - 2)
        : SPOTLIGHT_PAD;

    const x = rect.left - pad;
    const y = rect.top - pad;
    const width = rect.width + pad * 2;
    const height = rect.height + pad * 2;

    let rx = 8;
    if (shape === 'pill') rx = height / 2;
    if (shape === 'circle') rx = Math.max(width, height) / 2;
    if (shape === 'wide-rect') rx = 4;

    // For circle: centre and make square
    if (shape === 'circle') {
        const size = Math.max(width, height);
        const cx = x + width / 2 - size / 2;
        const cy = y + height / 2 - size / 2;
        return { x: cx, y: cy, width: size, height: size, rx: size / 2 };
    }

    return { x, y, width, height, rx };
}

function calcCardPosition(
    geom: SpotlightGeometry,
    vw: number,
    vh: number,
    preferred: CardSide,
    isMobile: boolean
): CardPosition {
    const cw = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH;
    const spaceBelow = vh - geom.y - geom.height;
    const spaceAbove = geom.y;
    const spaceRight = vw - geom.x - geom.width;
    const spaceLeft = geom.x;

    let side: CardSide = preferred;
    if (preferred === 'bottom' && spaceBelow < 200) side = 'top';
    if (preferred === 'top' && spaceAbove < 200) side = 'bottom';
    if (preferred === 'right' && spaceRight < cw + 20) side = 'left';
    if (preferred === 'left' && spaceLeft < cw + 20) side = 'right';

    const centerX = geom.x + geom.width / 2;
    const PADDING = 12;

    if (side === 'bottom') {
        const left = clamp(centerX - cw / 2, PADDING, vw - cw - PADDING);
        return { top: geom.y + geom.height + CARD_GAP, left, maxWidth: cw };
    }
    if (side === 'top') {
        const left = clamp(centerX - cw / 2, PADDING, vw - cw - PADDING);
        return { bottom: vh - geom.y + CARD_GAP, left, maxWidth: cw };
    }
    if (side === 'right') {
        const top = clamp(geom.y, PADDING, vh - 300);
        return { top, left: geom.x + geom.width + CARD_GAP, maxWidth: cw };
    }
    // left
    const top = clamp(geom.y, PADDING, vh - 300);
    return { top, right: vw - geom.x + CARD_GAP, maxWidth: cw };
}

// ─── Confetti Particle ────────────────────────────────────────────────────────

interface ConfettiParticle {
    id: number;
    x: number;
    color: string;
    delay: number;
    size: number;
    duration: number;
    rotation: number;
}

function generateConfetti(count: number): ConfettiParticle[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.8,
        size: 6 + Math.random() * 8,
        duration: 1.5 + Math.random() * 1,
        rotation: Math.random() * 720,
    }));
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface OnboardingTourProps {
    userName?: string;
    onComplete: () => void;
    onSkip: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ userName, onComplete, onSkip }) => {
    const navigate = useNavigate();

    // State
    const [stepIndex, setStepIndex] = useState(0);
    const [geom, setGeom] = useState<SpotlightGeometry | null>(null);
    const [cardPos, setCardPos] = useState<CardPosition | null>(null);
    const [cardVisible, setCardVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showConfetti, setShowConfetti] = useState(false);
    const [skipConfirm, setSkipConfirm] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [numberRolling, setNumberRolling] = useState(false);
    const [rolledNumber, setRolledNumber] = useState(9990);

    // Refs
    const cardRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const confettiRef = useRef<ConfettiParticle[]>([]);

    const step = TOUR_STEPS[stepIndex];
    const totalSteps = TOUR_STEPS.length;
    const isFirst = stepIndex === 0;
    const isLast = stepIndex === totalSteps - 1;

    // prefers-reduced-motion
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduceMotion(mq.matches);
        const handler = () => setReduceMotion(mq.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Audio setup
    useEffect(() => {
        try {
            const audio = new Audio(CHIME_SRC);
            audio.volume = 0.4;
            audio.preload = 'auto';
            audioRef.current = audio;
        } catch (_) { /* silent fail */ }
    }, []);

    const playChime = useCallback(() => {
        if (reduceMotion) return;
        try {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => { /* autoplay blocked */ });
            }
        } catch (_) { /* silent */ }
    }, [reduceMotion]);

    // Position computation
    const computePosition = useCallback(() => {
        if (!step || step.isModal || !step.target) {
            setGeom(null);
            setCardPos(null);
            return;
        }
        const el = document.getElementById(step.target);
        if (!el) {
            setGeom(null);
            setCardPos(null);
            return;
        }
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        const g = getSpotlightGeom(el, step.spotlightShape, mobile);
        const cp = calcCardPosition(g, window.innerWidth, window.innerHeight, step.preferredSide || 'bottom', mobile);
        setGeom(g);
        setCardPos(cp);
    }, [step]);

    // Scroll + settle + show
    const scrollAndShow = useCallback(() => {
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
        setCardVisible(false);

        if (!step) return;

        if (step.isModal || !step.target) {
            computePosition();
            settleTimerRef.current = setTimeout(() => setCardVisible(true), 80);
            return;
        }

        const el = document.getElementById(step.target);
        if (!el) {
            computePosition();
            settleTimerRef.current = setTimeout(() => setCardVisible(true), 80);
            return;
        }

        el.scrollIntoView({
            behavior: reduceMotion ? 'instant' : 'smooth',
            block: 'center',
        });

        const settle = reduceMotion ? 50 : 380;
        settleTimerRef.current = setTimeout(() => {
            computePosition();
            setTimeout(() => setCardVisible(true), 60);
        }, settle);
    }, [step, reduceMotion, computePosition]);

    // Initialize on step change
    useEffect(() => {
        scrollAndShow();
    }, [stepIndex, scrollAndShow]);

    // Step-specific side effects
    useEffect(() => {
        // Step 9: confetti
        if (step?.id === 9 && cardVisible && !reduceMotion) {
            confettiRef.current = generateConfetti(60);
            setShowConfetti(true);
            const t = setTimeout(() => setShowConfetti(false), 4000);
            return () => clearTimeout(t);
        }
    }, [step?.id, cardVisible, reduceMotion]);

    useEffect(() => {
        // Step 7: number roll-up
        if (step?.id === 7 && cardVisible && !reduceMotion) {
            setNumberRolling(true);
            setRolledNumber(9990);
            let cur = 9990;
            const target = 10000;
            const dur = 2000;
            const start = Date.now();
            const tick = () => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / dur, 1);
                const val = Math.round(9990 + (target - 9990) * progress);
                setRolledNumber(val);
                if (progress < 1) rafRef.current = requestAnimationFrame(tick);
                else setNumberRolling(false);
            };
            rafRef.current = requestAnimationFrame(tick);
            return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
        }
    }, [step?.id, cardVisible, reduceMotion]);

    useEffect(() => {
        // Step 8: FAB rotation
        if (step?.id === 8 && cardVisible && !reduceMotion) {
            const el = document.getElementById('tour-fab');
            if (el) {
                el.classList.add('tour-fab-rotate');
                const t = setTimeout(() => el.classList.remove('tour-fab-rotate'), 800);
                return () => clearTimeout(t);
            }
        }
    }, [step?.id, cardVisible, reduceMotion]);

    useEffect(() => {
        // Step 4: avatar ring
        const el = step?.id === 4 ? document.getElementById('tour-avatar') : null;
        if (el) {
            el.classList.add('tour-avatar-ring-active');
            return () => el.classList.remove('tour-avatar-ring-active');
        }
    }, [step?.id]);

    // Throttled resize/scroll re-compute
    useEffect(() => {
        let pending = false;
        const handler = () => {
            if (pending) return;
            pending = true;
            rafRef.current = requestAnimationFrame(() => {
                computePosition();
                pending = false;
            });
        };
        window.addEventListener('resize', handler);
        window.addEventListener('scroll', handler, true);
        return () => {
            window.removeEventListener('resize', handler);
            window.removeEventListener('scroll', handler, true);
        };
    }, [computePosition]);

    // ESC key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (skipConfirm) setSkipConfirm(false);
                else setSkipConfirm(true);
            }
            if (e.key === 'Enter' && !skipConfirm) handleNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skipConfirm, stepIndex, transitioning]);

    // Focus trap
    useEffect(() => {
        if (!cardRef.current || !cardVisible) return;
        const focusable = cardRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        first?.focus();

        const trap = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
            }
        };
        document.addEventListener('keydown', trap);
        return () => document.removeEventListener('keydown', trap);
    }, [cardVisible, stepIndex]);

    // Navigation handlers
    const goToStep = useCallback((index: number) => {
        if (transitioning) return;
        setTransitioning(true);
        setCardVisible(false);
        setTimeout(() => {
            setStepIndex(index);
            setTransitioning(false);
        }, 260);
    }, [transitioning]);

    const handleNext = useCallback(() => {
        if (transitioning) return;
        playChime();
        if (isLast) {
            onComplete();
        } else {
            goToStep(stepIndex + 1);
        }
    }, [transitioning, playChime, isLast, onComplete, goToStep, stepIndex]);

    const handleBack = useCallback(() => {
        if (!isFirst && !transitioning) goToStep(stepIndex - 1);
    }, [isFirst, transitioning, goToStep, stepIndex]);

    const handleSkip = useCallback(() => {
        setSkipConfirm(false);
        onSkip();
    }, [onSkip]);

    const handleSecondaryAction = useCallback(() => {
        if (isLast) {
            // "Explore on my own"
            onComplete();
        } else {
            setSkipConfirm(true);
        }
    }, [isLast, onComplete]);

    const handlePrimaryAction = useCallback(() => {
        playChime();
        if (step?.id === 9) {
            // Navigate to namasmarana
            onComplete();
            navigate('/namasmarana');
        } else if (step?.id === 1) {
            goToStep(1); // Begin tour
        } else {
            handleNext();
        }
    }, [playChime, step?.id, onComplete, navigate, goToStep, handleNext]);

    // SVG viewport dimensions (full screen fixed)
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Build SVG cutout path
    const svgMask = useMemo(() => {
        if (!geom || !step || step.isModal) return null;
        const { x, y, width, height, rx } = geom;
        // The "outer" rect fills the whole screen; the inner rounded rect is the cutout
        // Using fillRule evenodd creates the punch-out effect
        return (
            <svg
                className="tour-overlay-svg"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 9001, pointerEvents: 'auto' }}
                aria-hidden="true"
                onClick={() => setSkipConfirm(true)}
            >
                <defs>
                    <mask id="tour-punch-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <rect
                            x={x} y={y}
                            width={width} height={height}
                            rx={rx} ry={rx}
                            fill="black"
                        />
                    </mask>
                </defs>
                {/* Dimmed backdrop with hole */}
                <rect
                    width="100%" height="100%"
                    fill="rgba(0, 18, 36, 0.92)"
                    mask="url(#tour-punch-mask)"
                    style={{ backdropFilter: 'blur(3px)' }}
                />
                {/* Gold pulsing border around spotlight */}
                <rect
                    className={reduceMotion ? '' : 'tour-spotlight-pulse'}
                    x={x} y={y}
                    width={width} height={height}
                    rx={rx} ry={rx}
                    fill="none"
                    stroke="var(--brand-gold)"
                    strokeWidth="3"
                />
                {/* Transparent clickable area on spotlight — clicking through to the app element */}
                <rect
                    x={x} y={y}
                    width={width} height={height}
                    rx={rx} ry={rx}
                    fill="transparent"
                    style={{ pointerEvents: 'none' }}
                />
            </svg>
        );
    }, [geom, step, reduceMotion]);

    // Render card positioning style
    const cardStyle = useMemo((): React.CSSProperties => {
        if (!cardPos || step?.isModal) {
            // Center modal
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH + 60,
                width: '92vw',
                zIndex: 9010,
            };
        }
        const style: React.CSSProperties = {
            position: 'fixed',
            zIndex: 9010,
            maxWidth: cardPos.maxWidth,
            width: isMobile ? '90vw' : cardPos.maxWidth,
        };
        if (cardPos.top !== undefined) style.top = cardPos.top;
        if (cardPos.bottom !== undefined) style.bottom = cardPos.bottom;
        if (cardPos.left !== undefined) style.left = cardPos.left;
        if (cardPos.right !== undefined) style.right = cardPos.right;
        return style;
    }, [cardPos, step?.isModal, isMobile]);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            {/* ── Skip confirm ── */}
            {skipConfirm && (
                <div className="tour-skip-backdrop" role="dialog" aria-modal="true" aria-label="Skip tour confirmation">
                    <div className="tour-skip-box" onClick={e => e.stopPropagation()}>
                        <div className="text-4xl mb-3 text-center">🙏</div>
                        <h3 className="font-serif font-bold text-xl text-center mb-2" style={{ color: 'var(--navy-dark)' }}>Skip the Tour?</h3>
                        <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>
                            You can always replay it from the Home page.
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="tour-btn-ghost flex-1"
                                onClick={() => setSkipConfirm(false)}
                            >
                                Resume
                            </button>
                            <button
                                className="tour-btn-danger flex-1"
                                onClick={handleSkip}
                            >
                                Skip Tour
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Step 9: confetti ── */}
            {showConfetti && !reduceMotion && (
                <div className="tour-confetti-container" aria-hidden="true">
                    {confettiRef.current.map(p => (
                        <div
                            key={p.id}
                            className="tour-confetti-piece"
                            style={{
                                left: `${p.x}%`,
                                width: p.size,
                                height: p.size * 0.4,
                                background: p.color,
                                animationDelay: `${p.delay}s`,
                                animationDuration: `${p.duration}s`,
                                transform: `rotate(${p.rotation}deg)`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* ── Modal backdrop (center steps only) ── */}
            {step?.isModal && (
                <div
                    className="tour-modal-backdrop"
                    style={{ zIndex: 9001 }}
                    onClick={() => !isFirst && setSkipConfirm(true)}
                    aria-hidden="true"
                />
            )}

            {/* ── SVG spotlight overlay (non-modal steps) ── */}
            {!step?.isModal && svgMask}

            {/* ── Tutorial Card ── */}
            <div
                ref={cardRef}
                className={`tour-card ${cardVisible ? 'tour-card--visible' : ''} ${step?.isModal ? 'tour-card--modal' : ''}`}
                style={cardStyle}
                role="dialog"
                aria-modal="true"
                aria-label={`Tour step ${stepIndex + 1} of ${totalSteps}: ${step?.title}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Top gradient strip */}
                <div className="tour-card__strip" />

                <div className="tour-card__body">

                    {/* Step counter (non-modal steps) */}
                    {!step?.isModal && (
                        <div className="tour-card__header">
                            <span className="tour-step-label">Step {stepIndex + 1} of {totalSteps}</span>
                            <button
                                className="tour-skip-link"
                                onClick={() => setSkipConfirm(true)}
                                aria-label="Skip tour"
                            >
                                <X size={12} style={{ marginRight: 3 }} />
                                Skip Tour
                            </button>
                        </div>
                    )}

                    {/* ── Step 1 & 9: icon ── */}
                    {step?.isModal && (
                        <div className="tour-card__icon-wrap" aria-hidden="true">
                            {step.id === 9 ? (
                                <span className={`tour-icon tour-icon--trophy ${reduceMotion ? '' : 'tour-icon--bounce'}`}>🏆</span>
                            ) : (
                                <span className={`tour-icon tour-icon--lotus ${reduceMotion ? '' : 'tour-icon--spin'}`}>🪷</span>
                            )}
                        </div>
                    )}

                    {/* ── Step 3: ⌘K badge ── */}
                    {step?.id === 3 && (
                        <div className={`tour-kbd-badge ${reduceMotion ? '' : 'tour-kbd-badge--pulse'}`} aria-hidden="true">
                            <span>⌘K</span>
                        </div>
                    )}

                    {/* ── Step 2: animated cursor ── */}
                    {step?.id === 2 && (
                        <div className={`tour-cursor-hint ${reduceMotion ? '' : 'tour-cursor-hint--animate'}`} aria-hidden="true">
                            👉 Pause button is on the left
                        </div>
                    )}

                    {/* ── Step 5: mini menu animation ── */}
                    {step?.id === 5 && !reduceMotion && (
                        <div className="tour-menu-preview" aria-hidden="true">
                            <div className="tour-menu-preview__bar" />
                            <div className="tour-menu-preview__bar" style={{ animationDelay: '0.1s' }} />
                            <div className="tour-menu-preview__bar" style={{ animationDelay: '0.2s' }} />
                        </div>
                    )}

                    {/* ── Step 7: number roll-up ── */}
                    {step?.id === 7 && (
                        <div className="tour-tally" aria-live="polite">
                            <span className="tour-tally__number">
                                {rolledNumber.toLocaleString()}
                            </span>
                            <span className="tour-tally__label">chants offered</span>
                        </div>
                    )}

                    {/* Title */}
                    <h2 className={`tour-card__title ${step?.isModal ? 'tour-card__title--center' : ''}`}>
                        {step?.id === 1
                            ? `Om Sai Ram${userName ? `, ${userName.split(' ')[0]}` : ''}! ${step.title}`
                            : step?.title}
                    </h2>

                    {/* Body */}
                    <p className={`tour-card__text ${step?.isModal ? 'tour-card__text--center' : ''}`}>
                        {step?.body}
                    </p>

                    {/* Step dots (non-modal) */}
                    {!step?.isModal && (
                        <div className="tour-dots" role="tablist" aria-label="Tour progress">
                            {TOUR_STEPS.filter(s => !s.isModal).map((s, i) => {
                                const dotIdx = TOUR_STEPS.findIndex(ts => ts.id === s.id);
                                const isActive = dotIdx === stepIndex;
                                return (
                                    <button
                                        key={s.id}
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-label={`Go to step ${s.id}`}
                                        className={`tour-dot ${isActive ? 'tour-dot--active' : ''}`}
                                        onClick={() => goToStep(dotIdx)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* ── Controls ── */}
                    {step?.isModal ? (
                        <div className="tour-modal-controls">
                            <button
                                className="tour-btn-primary tour-btn-primary--full"
                                onClick={handlePrimaryAction}
                                disabled={transitioning}
                            >
                                {step.primaryLabel || 'Continue'}
                            </button>
                            {!isLast && (
                                <button
                                    className="tour-btn-secondary-skip"
                                    onClick={handleSecondaryAction}
                                >
                                    {step.secondaryLabel || 'Skip & Explore on my own'}
                                </button>
                            )}
                            {isLast && (
                                <button
                                    className="tour-btn-ghost-navy"
                                    onClick={handleSecondaryAction}
                                    disabled={transitioning}
                                >
                                    {step.secondaryLabel || 'Explore on my own'}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="tour-nav-controls">
                            {!isFirst && (
                                <button
                                    className="tour-btn-back"
                                    onClick={handleBack}
                                    disabled={transitioning}
                                    aria-label="Previous step"
                                >
                                    <ChevronLeft size={14} />
                                    Back
                                </button>
                            )}
                            {isFirst && <div />}
                            <button
                                className="tour-btn-next"
                                onClick={handleNext}
                                disabled={transitioning}
                                aria-label={isLast ? 'Complete tour' : 'Next step'}
                            >
                                {isLast ? 'Done' : 'Next'}
                                {!isLast && <ChevronRight size={14} />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Gold accent bottom line for modal cards */}
                {step?.isModal && <div className="tour-card__bottom-accent" />}
            </div>
        </>
    );
};

export default OnboardingTour;
