import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    content: string | ReactNode;
    children: ReactNode;
    className?: string; // Optional class for the wrapper
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const calculatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        // 8px spacing
        let top = triggerRect.top - tooltipRect.height - 8;
        let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

        // Adjust for viewport edges
        if (top < 8) {
            // Place below if no space above
            top = triggerRect.bottom + 8;
        }

        if (left < 8) {
            left = 8;
        } else if (left + tooltipRect.width > document.documentElement.clientWidth - 8) {
            left = document.documentElement.clientWidth - tooltipRect.width - 8;
        }

        setCoords({ top, left });
    };

    useEffect(() => {
        if (isVisible) {
            calculatePosition();
            // Need to recalculate on scroll and resize
            window.addEventListener('scroll', calculatePosition, true);
            window.addEventListener('resize', calculatePosition);
        }
        return () => {
            window.removeEventListener('scroll', calculatePosition, true);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [isVisible]);

    useEffect(() => {
        // Trigger calculation after render loop if visible to get true tooltip size
        if (isVisible) {
            // Small delay to ensure DOM is updated
            const timer = setTimeout(calculatePosition, 0);
            return () => clearTimeout(timer);
        }
    }, [isVisible, content]);

    return (
        <div
            ref={triggerRef}
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible && content && createPortal(
                <div
                    ref={tooltipRef}
                    className="fixed z-[9999] bg-navy-900 text-white py-2 px-3 rounded-xl text-xs font-medium shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in duration-150"
                    style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
                    role="tooltip"
                >
                    {content}
                </div>,
                document.body
            )}
        </div>
    );
};

export default Tooltip;
