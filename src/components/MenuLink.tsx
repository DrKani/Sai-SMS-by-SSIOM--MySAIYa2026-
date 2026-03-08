import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';

interface MenuLinkProps {
    to: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    isProtected?: boolean;
    isLocked?: boolean;
    isActive?: boolean;
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, label, icon, onClick, isProtected = false, isLocked = false, isActive = false }) => (
    <div>
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center justify-between py-3.5 px-4 rounded-2xl group transition-all border-l-[3px] ${isActive
                    ? 'border-l-[#FFD700]'
                    : 'border-l-transparent hover:border-l-[#FFD700]'
                }`}
            style={isActive ? { background: 'rgba(255, 215, 0, 0.15)' } : undefined}
        >
            <div className="flex items-center gap-4">
                {icon && (
                    <span
                        className="transition-colors"
                        style={{ color: isActive ? '#FFD700' : '#E8E8E8' }}
                    >
                        {icon}
                    </span>
                )}
                <span
                    className="text-xs font-black uppercase tracking-widest transition-colors group-hover:!text-[#FFD700]"
                    style={{ color: isActive ? '#FFD700' : '#FFFFFF' }}
                >
                    {label}
                </span>
                {isProtected && isLocked && (
                    <Lock size={12} className="text-white/30 ml-1" />
                )}
            </div>
            <ChevronRight
                size={14}
                className={`transition-all ${isActive
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                style={{ color: '#FFD700' }}
            />
        </Link>
    </div>
);

export default MenuLink;
