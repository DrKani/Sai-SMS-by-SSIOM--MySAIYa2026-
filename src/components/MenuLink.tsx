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
    isChild?: boolean;
}

const MenuLink: React.FC<MenuLinkProps> = ({ to, label, icon, onClick, isProtected = false, isLocked = false, isActive = false, isChild = false }) => (
    <li className="list-none">
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center justify-between py-3 px-4 rounded-2xl group transition-all duration-300 ${isChild ? 'ml-6 py-2.5 mt-1' : 'mt-1.5'} ${isActive
                ? 'bg-gold-50 border-2 border-gold-500 shadow-sm'
                : 'hover:bg-navy-50 border-2 border-transparent hover:scale-[1.02] hover:shadow-sm'
                }`}
        >
            <div className="flex items-center gap-3">
                {icon && (
                    <span
                        className={`transition-colors ${isActive
                            ? 'text-gold-600'
                            : 'text-navy-300 group-hover:text-gold-600'
                            }`}
                    >
                        {icon}
                    </span>
                )}
                <span
                    className={`${isChild ? 'text-[11px]' : 'text-xs'} font-black uppercase tracking-widest transition-colors ${isActive
                        ? 'text-gold-700'
                        : 'text-navy-900 group-hover:text-gold-600'
                        }`}
                >
                    {label}
                </span>
                {isProtected && isLocked && (
                    <Lock size={12} className="text-navy-300 ml-1" />
                )}
            </div>
            <ChevronRight
                size={14}
                className={`transition-all ${isActive
                    ? 'opacity-100 text-gold-600'
                    : 'opacity-0 group-hover:opacity-100 text-gold-500'
                    }`}
            />
        </Link>
    </li>
);

export default MenuLink;
