import React, { useState } from 'react';
import { Home, ArrowUp, Mic, Library, Plus, X, LayoutDashboard, Calendar, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MultiFunctionFABProps {
    showScrollTop: boolean;
    onScrollTop: () => void;
}

// Explicit hex colors for each action — prevents Tailwind JIT purging custom palette names
const FAB_ACTIONS = [
    {
        icon: <Home size={20} strokeWidth={2.5} />,
        label: 'Home',
        link: '/',
        bg: '#FFFFFF',
        iconColor: '#0A2540',
        border: '2px solid #002E5B',
    },
    {
        icon: <LayoutDashboard size={20} strokeWidth={2.5} />,
        label: 'Dashboard',
        link: '/dashboard',
        bg: '#9B59B6',
        iconColor: '#FFFFFF',
        border: 'none',
    },
    {
        icon: <Calendar size={20} strokeWidth={2.5} />,
        label: 'Events Viewer',
        link: '/calendar',
        bg: '#00B894',
        iconColor: '#FFFFFF',
        border: 'none',
    },
    {
        icon: <Gamepad2 size={20} strokeWidth={2.5} />,
        label: 'Play It',
        link: '/games',
        bg: '#FF6B6B',
        iconColor: '#FFFFFF',
        border: 'none',
    },
    {
        icon: <Mic size={20} strokeWidth={2.5} />,
        label: 'Namasmarana',
        link: '/namasmarana',
        bg: '#FF6B35',
        iconColor: '#FFFFFF',
        border: 'none',
    },
    {
        icon: <Library size={20} strokeWidth={2.5} />,
        label: "This Week's Reading",
        link: '/book-club',
        bg: '#8E24AA',
        iconColor: '#FFFFFF',
        border: 'none',
    },
];

const MultiFunctionFAB: React.FC<MultiFunctionFABProps> = ({ showScrollTop, onScrollTop }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div id="tour-fab" className="fixed bottom-10 right-10 z-[70] flex flex-col-reverse items-end gap-4">
            {/* Scroll to Top FAB - only when scrolled */}
            {showScrollTop && (
                <div className="relative group">
                    <button
                        onClick={onScrollTop}
                        className="fab fab-home w-14 h-14 bg-white border-2 border-gold-500 rounded-full shadow-xl flex items-center justify-center text-navy-900 hover:scale-110 active:scale-95 transition-all"
                    >
                        <ArrowUp size={24} strokeWidth={2.5} />
                    </button>
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-navy-900 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl">
                        Back to Top
                    </div>
                </div>
            )}

            {/* Expanded Action Buttons */}
            {isExpanded && (
                <div className="flex flex-col-reverse items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {FAB_ACTIONS.map((action, index) => (
                        <div key={index} className="relative group">
                            <Link
                                to={action.link}
                                onClick={() => setIsExpanded(false)}
                                className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 hover:ring-2 hover:ring-[#D2AC47] hover:ring-offset-2 hover:ring-offset-white active:scale-95 transition-all"
                                style={{
                                    background: action.bg,
                                    color: action.iconColor,
                                    border: action.border,
                                    animationDelay: `${index * 50}ms`,
                                }}
                            >
                                {action.icon}
                            </Link>
                            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-navy-900 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl">
                                {action.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Main FAB Button */}
            <div className="relative group">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`fab fab-add w-16 h-16 bg-gold-gradient rounded-full shadow-2xl flex items-center justify-center text-navy-900 border border-white/30 hover:scale-110 active:scale-95 transition-all ${isExpanded ? 'rotate-45' : ''}`}
                    aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
                >
                    {isExpanded ? (
                        <X size={28} strokeWidth={2.5} />
                    ) : (
                        <Plus size={28} strokeWidth={2.5} />
                    )}
                </button>
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-navy-900 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xl">
                    {isExpanded ? 'Close Menu' : 'Quick Actions'}
                </div>
            </div>

            {/* Backdrop when expanded */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-navy-900/20 backdrop-blur-[2px] -z-10 animate-in fade-in duration-300"
                    onClick={() => setIsExpanded(false)}
                />
            )}
        </div>
    );
};

export default MultiFunctionFAB;
