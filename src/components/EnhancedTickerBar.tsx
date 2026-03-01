import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Pause, Play } from 'lucide-react';

interface EnhancedTickerBarProps {
    message: string;
    onClickMessage?: () => void;
}

const EnhancedTickerBar: React.FC<EnhancedTickerBarProps> = ({
    message,
    onClickMessage,
}) => {
    const [isPaused, setIsPaused] = useState(false);
    const tickerRef = useRef<HTMLDivElement>(null);

    const handleTogglePause = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPaused(!isPaused);
    };

    const handleClickMessage = () => {
        if (onClickMessage) {
            onClickMessage();
        } else {
            window.location.hash = '#/announcements';
        }
    };

    return (
        <div className="sticky top-0 z-[60] h-10 bg-gradient-to-r from-navy-700 via-purple-700 to-purple-600 text-white flex items-center overflow-hidden group">
            {/* Left Label with Pause/Play */}
            <div className="flex-shrink-0 bg-navy-900 px-4 h-full flex items-center z-10 gap-3">
                <span className="font-bold text-[10px] uppercase tracking-widest">UPDATES</span>
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
                <ChevronRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
            </div>

            {/* Ticker Content */}
            <div
                className="flex-grow overflow-hidden whitespace-nowrap relative cursor-pointer hover:bg-purple-600/50 transition-colors"
                onClick={handleClickMessage}
            >
                <div
                    ref={tickerRef}
                    key={message}
                    className={`inline-block pl-[100%] text-xs font-medium uppercase tracking-wider transition-all ${isPaused ? '' : 'animate-marquee'
                        }`}
                    style={{
                        animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                >
                    {message}
                </div>
            </div>

            {/* Click hint on hover */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[9px] font-bold bg-navy-900/80 px-3 py-1 rounded-full">
                    Click to view announcements
                </span>
            </div>
        </div>
    );
};

export default EnhancedTickerBar;
