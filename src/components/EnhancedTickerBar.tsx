import React, { useState, useRef } from 'react';
import { ChevronRight, Pause, Play, X } from 'lucide-react';

interface EnhancedTickerBarProps {
    message: string;
    onClickMessage?: () => void;
}

const EnhancedTickerBar: React.FC<EnhancedTickerBarProps> = ({
    message,
    onClickMessage,
}) => {
    const [isPaused, setIsPaused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isDismissed, setIsDismissed] = useState(() => {
        try {
            return localStorage.getItem('sms_ticker_dismissed') === 'true';
        } catch { return false; }
    });
    const tickerRef = useRef<HTMLDivElement>(null);

    const handleTogglePause = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPaused(!isPaused);
    };

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDismissed(true);
        try { localStorage.setItem('sms_ticker_dismissed', 'true'); } catch { }
    };

    const handleClickMessage = () => {
        if (onClickMessage) {
            onClickMessage();
        } else {
            window.location.hash = '#/announcements';
        }
    };

    if (isDismissed) return null;

    const effectivelyPaused = isPaused || isHovered;

    return (
        <div className="sticky top-0 z-[60] h-10 bg-gradient-to-r from-navy-700 via-purple-700 to-purple-600 text-white flex items-center overflow-hidden group">
            {/* Left Label with Pause/Play */}
            <div className="flex-shrink-0 bg-navy-900 px-4 h-full flex items-center z-10 gap-3">
                <span className="font-bold text-[10px] uppercase tracking-widest">UPDATES</span>
                <div className="relative group/pause">
                    <button
                        onClick={handleTogglePause}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
                    >
                        {isPaused ? (
                            <Play size={12} className="fill-current" />
                        ) : (
                            <Pause size={12} className="fill-current" />
                        )}
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-navy-900 text-white px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover/pause:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl z-20 border border-white/10">
                        {isPaused ? 'Resume updates' : 'Pause updates'}
                    </div>
                </div>
                <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
            </div>

            {/* Ticker Content */}
            <div
                className="flex-grow overflow-hidden whitespace-nowrap relative cursor-pointer hover:bg-purple-600/50 transition-colors"
                onClick={handleClickMessage}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    ref={tickerRef}
                    key={message}
                    className={`inline-block pl-[100%] text-xs font-medium uppercase tracking-wider transition-all ${effectivelyPaused ? '' : 'animate-marquee'
                        }`}
                    style={{
                        animationPlayState: effectivelyPaused ? 'paused' : 'running',
                    }}
                >
                    {message}
                </div>
            </div>

            {/* Click hint on hover */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[9px] font-bold bg-navy-900/80 px-3 py-1 rounded-full">
                    Click to view announcements
                </span>
            </div>

            {/* Dismiss button */}
            <div className="relative group/dismiss flex-shrink-0">
                <button
                    onClick={handleDismiss}
                    className="px-3 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Dismiss ticker"
                >
                    <X size={14} />
                </button>
                <div className="absolute right-0 top-full mt-2 bg-navy-900 text-white px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover/dismiss:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl z-20 border border-white/10">
                    Dismiss
                </div>
            </div>
        </div>
    );
};

export default EnhancedTickerBar;
