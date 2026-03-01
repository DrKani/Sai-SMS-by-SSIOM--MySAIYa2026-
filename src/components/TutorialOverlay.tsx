import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TutorialStep {
    /** DOM element ID to spotlight, or 'center' for full-screen overlay */
    target: string;
    title: string;
    text: string;
    /** Override tooltip position. Auto-calculated if omitted. */
    preferredPosition?: 'top' | 'bottom' | 'left' | 'right';
    /** Renders as a full-screen centered modal (no spotlight) */
    isWelcome?: boolean;
    /** Primary CTA label (default: "Continue") */
    primaryLabel?: string;
}

export interface TutorialOverlayProps {
    steps: TutorialStep[];
    isVisible: boolean;
    onComplete: () => void;
    onSkip: () => void;
    storageKey: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface TargetRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const TOOLTIP_WIDTH = 340;
const TOOLTIP_HEIGHT_ESTIMATE = 220;
const PADDING = 16;

function calcPosition(
    rect: TargetRect,
    viewportW: number,
    viewportH: number,
    preferred?: string
): { pos: 'top' | 'bottom' | 'left' | 'right'; x: number; y: number } {
    // Mobile: always bottom-center
    if (viewportW < 768) {
        const x = Math.max(PADDING, (viewportW - TOOLTIP_WIDTH) / 2);
        const y = viewportH - TOOLTIP_HEIGHT_ESTIMATE - 80;
        return { pos: 'bottom', x, y };
    }

    const spaceBelow = viewportH - rect.top - rect.height;
    const spaceAbove = rect.top;
    const spaceRight = viewportW - rect.left - rect.width;
    const spaceLeft = rect.left;

    let pos: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
    if (preferred && ['top', 'bottom', 'left', 'right'].includes(preferred)) {
        pos = preferred as 'top' | 'bottom' | 'left' | 'right';
    } else if (spaceBelow >= TOOLTIP_HEIGHT_ESTIMATE + PADDING) {
        pos = 'bottom';
    } else if (spaceAbove >= TOOLTIP_HEIGHT_ESTIMATE + PADDING) {
        pos = 'top';
    } else if (spaceRight >= TOOLTIP_WIDTH + PADDING) {
        pos = 'right';
    } else {
        pos = 'left';
    }

    let x = 0;
    let y = 0;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    switch (pos) {
        case 'bottom':
            x = Math.min(Math.max(centerX - TOOLTIP_WIDTH / 2, PADDING), viewportW - TOOLTIP_WIDTH - PADDING);
            y = rect.top + rect.height + PADDING;
            break;
        case 'top':
            x = Math.min(Math.max(centerX - TOOLTIP_WIDTH / 2, PADDING), viewportW - TOOLTIP_WIDTH - PADDING);
            y = rect.top - TOOLTIP_HEIGHT_ESTIMATE - PADDING;
            break;
        case 'right':
            x = rect.left + rect.width + PADDING;
            y = Math.min(Math.max(centerY - TOOLTIP_HEIGHT_ESTIMATE / 2, PADDING), viewportH - TOOLTIP_HEIGHT_ESTIMATE - PADDING);
            break;
        case 'left':
            x = rect.left - TOOLTIP_WIDTH - PADDING;
            y = Math.min(Math.max(centerY - TOOLTIP_HEIGHT_ESTIMATE / 2, PADDING), viewportH - TOOLTIP_HEIGHT_ESTIMATE - PADDING);
            break;
    }

    return { pos, x, y };
}

// ─── Component ────────────────────────────────────────────────────────────────

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
    steps,
    isVisible,
    onComplete,
    onSkip,
    storageKey,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ pos: string; x: number; y: number } | null>(null);
    const [showSkipConfirm, setShowSkipConfirm] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [visible, setVisible] = useState(false);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = steps[currentStep];
    const totalSteps = steps.length;
    const isFirst = currentStep === 0;
    const isLast = currentStep === totalSteps - 1;
    const isOverlay = !step || step.target === 'center' || !!step.isWelcome;

    // ── Recompute spotlight position ──────────────────────────────────────────
    const updatePosition = useCallback(() => {
        if (!step || isOverlay) {
            setTargetRect(null);
            setTooltipPos(null);
            return;
        }
        const el = document.getElementById(step.target);
        if (!el) {
            setTargetRect(null);
            setTooltipPos(null);
            return;
        }
        const rect = el.getBoundingClientRect();
        const scrolled: TargetRect = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
        };
        setTargetRect(scrolled);

        const vp = { w: window.innerWidth, h: window.innerHeight };
        const viewportRect: TargetRect = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        };
        const computed = calcPosition(viewportRect, vp.w, vp.h, step.preferredPosition);
        setTooltipPos({
            pos: computed.pos,
            x: computed.x + window.scrollX,
            y: computed.y + window.scrollY,
        });

        // Scroll target into view
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [step, isOverlay]);

    // ── Mount / step change ──────────────────────────────────────────────────
    useEffect(() => {
        if (!isVisible) {
            setVisible(false);
            return;
        }
        setAnimating(true);
        const t = setTimeout(() => {
            setAnimating(false);
            setVisible(true);
            updatePosition();
        }, 50);
        return () => clearTimeout(t);
    }, [isVisible, currentStep, updatePosition]);

    // ── ResizeObserver for live adjustments ──────────────────────────────────
    useEffect(() => {
        if (!isVisible || isOverlay) return;
        const el = step ? document.getElementById(step.target) : null;
        if (!el) return;

        resizeObserverRef.current = new ResizeObserver(() => updatePosition());
        resizeObserverRef.current.observe(el);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            resizeObserverRef.current?.disconnect();
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isVisible, step, isOverlay, updatePosition]);

    // ── ESC key ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isVisible) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showSkipConfirm) setShowSkipConfirm(false);
                else setShowSkipConfirm(true);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isVisible, showSkipConfirm]);

    // ── Navigation ────────────────────────────────────────────────────────────
    const goToStep = (index: number) => {
        if (animating) return;
        setAnimating(true);
        setVisible(false);
        setTimeout(() => {
            setCurrentStep(index);
            setAnimating(false);
        }, 300);
    };

    const handleNext = () => {
        if (isLast) {
            localStorage.setItem(storageKey, 'true');
            onComplete();
        } else {
            goToStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (!isFirst) goToStep(currentStep - 1);
    };

    const handleSkip = () => {
        localStorage.setItem(storageKey, 'true');
        setShowSkipConfirm(false);
        onSkip();
    };

    const handleBackdropClick = () => {
        if (!isOverlay) setShowSkipConfirm(true);
    };

    if (!isVisible) return null;

    // ─── Spotlight box-shadow style ───────────────────────────────────────────
    const spotlightStyle: React.CSSProperties | undefined =
        targetRect
            ? {
                position: 'absolute',
                top: targetRect.top - 6,
                left: targetRect.left - 6,
                width: targetRect.width + 12,
                height: targetRect.height + 12,
                borderRadius: 16,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
                pointerEvents: 'none',
                zIndex: 2,
                transition: 'all 0.3s ease-in-out',
            }
            : undefined;

    // ─── Tooltip / card position ─────────────────────────────────────────────
    const tooltipStyle: React.CSSProperties =
        tooltipPos
            ? {
                position: 'absolute',
                top: tooltipPos.y,
                left: tooltipPos.x,
                width: TOOLTIP_WIDTH,
                zIndex: 9999,
                transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
            }
            : {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: visible ? 'translate(-50%, -50%)' : 'translate(-50%, -44%)',
                opacity: visible ? 1 : 0,
                zIndex: 9999,
                width: Math.min(TOOLTIP_WIDTH + 60, window.innerWidth - 32),
                transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
            };

    return (
        <>
            {/* ── Dark overlay (full viewport) ── */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: isOverlay ? 9990 : 1,
                    background: isOverlay ? 'rgba(0,0,0,0.82)' : 'transparent',
                    backdropFilter: isOverlay ? 'blur(2px)' : undefined,
                }}
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* ── Spotlight cutout (non-overlay steps) ── */}
            {!isOverlay && spotlightStyle && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'visible' }}>
                    <div style={spotlightStyle} />
                </div>
            )}

            {/* ── Skip Confirmation Modal ── */}
            {showSkipConfirm && (
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl p-10 text-center"
                        style={{ maxWidth: 360, width: '90%' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-4xl mb-4">🙏</div>
                        <h3 className="font-serif font-bold text-navy-900 text-2xl mb-3">Skip the Tour?</h3>
                        <p className="text-navy-500 text-sm mb-8 leading-relaxed">
                            You can always replay it later from your profile settings.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setShowSkipConfirm(false)}
                                className="px-6 py-3 rounded-2xl border-2 border-navy-100 text-navy-700 font-black text-xs uppercase tracking-widest hover:bg-navy-50 transition-colors"
                            >
                                Resume Tour
                            </button>
                            <button
                                onClick={handleSkip}
                                className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-colors"
                            >
                                Skip Tour
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tooltip / Card ── */}
            <div
                ref={tooltipRef}
                style={{ ...tooltipStyle, pointerEvents: 'all' }}
                role="dialog"
                aria-modal="true"
                aria-label={`Tutorial step ${currentStep + 1} of ${totalSteps}: ${step?.title}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Card */}
                <div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    style={{
                        background: isOverlay
                            ? 'linear-gradient(135deg, #0A1628 0%, #1B2A52 50%, #2D1B69 100%)'
                            : undefined,
                    }}
                >
                    {/* Decorative top bar */}
                    <div
                        style={{
                            height: 4,
                            background: 'linear-gradient(90deg, #D4AF37, #FFD700, #bf0449)',
                        }}
                    />

                    <div className="p-8">
                        {/* Step counter */}
                        {!isOverlay && (
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-navy-400"
                                >
                                    Step {currentStep + 1} of {totalSteps}
                                </span>
                                <button
                                    onClick={() => setShowSkipConfirm(true)}
                                    className="text-[10px] font-black uppercase tracking-widest text-navy-300 hover:text-red-500 flex items-center gap-1 transition-colors"
                                    aria-label="Skip tour"
                                >
                                    <SkipForward size={12} /> Skip Tour
                                </button>
                            </div>
                        )}

                        {/* Welcome icon */}
                        {isOverlay && (
                            <div className="text-center mb-6">
                                <div
                                    className="text-5xl mb-4"
                                    aria-hidden="true"
                                >
                                    {isLast ? '🙏' : '🪷'}
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <h2
                            className={`font-serif font-bold mb-3 leading-tight ${isOverlay
                                    ? 'text-gold-500 text-3xl text-center'
                                    : 'text-navy-900 text-xl'
                                }`}
                        >
                            {step?.title}
                        </h2>

                        {/* Body text */}
                        <p
                            className={`leading-relaxed text-sm mb-8 ${isOverlay ? 'text-navy-100/80 text-center' : 'text-navy-500'
                                }`}
                        >
                            {step?.text}
                        </p>

                        {/* Buttons */}
                        <div
                            className={`flex gap-3 ${isOverlay ? 'justify-center flex-col' : 'justify-between items-center'}`}
                        >
                            {/* Back button */}
                            {!isFirst && !isOverlay && (
                                <button
                                    onClick={handleBack}
                                    disabled={animating}
                                    className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-navy-100 text-navy-600 font-black text-[10px] uppercase tracking-widest hover:bg-navy-50 transition-all disabled:opacity-50"
                                >
                                    <ChevronLeft size={14} /> Back
                                </button>
                            )}

                            {isFirst && !isOverlay && <div />}

                            {/* Primary button */}
                            <button
                                onClick={handleNext}
                                disabled={animating}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 ${isLast || isOverlay
                                        ? 'bg-gold-gradient text-navy-900 hover:brightness-105 shadow-gold-500/20'
                                        : 'bg-navy-900 text-white hover:bg-navy-800 shadow-navy-900/20'
                                    } ${isOverlay ? 'w-full justify-center text-sm py-4' : ''}`}
                            >
                                {step?.primaryLabel || (isLast ? 'Begin My Journey' : 'Continue')}
                                {!isLast && <ChevronRight size={14} />}
                            </button>
                        </div>

                        {/* Skip link for first welcome step */}
                        {isFirst && isOverlay && !isLast && (
                            <button
                                onClick={handleSkip}
                                className="block w-full text-center mt-5 text-navy-400/70 hover:text-navy-200 text-xs font-medium transition-colors"
                            >
                                Skip &amp; Explore on my own
                            </button>
                        )}
                    </div>
                </div>

                {/* Position indicator dots */}
                {!isOverlay && totalSteps > 2 && (
                    <div className="flex justify-center gap-2 mt-3">
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToStep(i)}
                                aria-label={`Go to step ${i + 1}`}
                                style={{
                                    width: i === currentStep ? 20 : 8,
                                    height: 8,
                                    borderRadius: 4,
                                    background: i === currentStep ? '#D4AF37' : '#CBD5E1',
                                    transition: 'all 0.3s ease',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default TutorialOverlay;
