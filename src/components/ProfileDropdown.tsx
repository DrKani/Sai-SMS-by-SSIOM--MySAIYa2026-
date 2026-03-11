import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Settings, Activity, LogOut, UserPlus } from 'lucide-react';
import SaiAvatar from './SaiAvatar';

interface ProfileDropdownProps {
    user: {
        name?: string;
        photoURL?: string;
        email?: string;
        gender?: 'male' | 'female';
        isGuest?: boolean;
    } | null;
    isAdmin?: boolean;
    onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, isAdmin, onLogout }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) {
        return (
            <Link
                to="/signin"
                className="px-5 py-2 rounded-xl bg-gold-gradient text-navy-900 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-gold-500/10"
            >
                <UserCircle size={14} />
                Sign In
            </Link>
        );
    }

    if (user.isGuest) {
        return (
            <div className="flex items-center gap-2">
                <span className="px-3 py-2 rounded-xl bg-neutral-100 text-navy-500 font-bold text-[10px] uppercase tracking-widest">
                    Guest
                </span>
                <Link
                    to="/signup"
                    className="px-4 py-2 rounded-xl bg-gold-gradient text-navy-900 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                >
                    <UserPlus size={14} />
                    Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all"
            >
                <SaiAvatar gender={user.gender || 'male'} photoURL={user.photoURL} size={40} />
                <div className="hidden lg:flex flex-col items-start bg-transparent ml-2">
                    <span className="text-xs font-bold text-white leading-tight">
                        {user.name || 'Devotee'}
                    </span>
                    {isAdmin && (
                        <span className="text-[8px] font-black uppercase tracking-wider text-purple-300">
                            Admin
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-navy-50 overflow-hidden z-[120] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-neutral-50 border-b border-navy-50">
                        <div className="flex items-center gap-3">
                            <SaiAvatar gender={user.gender || 'male'} photoURL={user.photoURL} size={48} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-navy-900 truncate">
                                    {user.name || 'Devotee'}
                                </p>
                                <p className="text-xs text-navy-400 truncate">{user.email}</p>
                                {isAdmin && (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[8px] font-black uppercase tracking-wider">
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="py-2">
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-navy-900"
                        >
                            <UserCircle size={18} className="text-navy-400" />
                            <span className="text-sm font-medium">Profile</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-navy-900"
                        >
                            <Activity size={18} className="text-navy-400" />
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-navy-900"
                        >
                            <Settings size={18} className="text-navy-400" />
                            <span className="text-sm font-medium">Settings</span>
                        </Link>
                    </div>

                    <div className="border-t border-navy-50 p-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 font-medium"
                        >
                            <LogOut size={18} />
                            <span className="text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
