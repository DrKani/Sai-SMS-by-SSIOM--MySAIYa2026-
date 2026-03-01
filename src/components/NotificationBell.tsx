import React from 'react';
import { Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationBellProps {
    unreadCount: number;
    onClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="relative p-2 text-navy-900 hover:text-purple-600 transition-colors group"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
            <Bell size={24} className="transition-transform group-hover:scale-110" />

            {unreadCount > 0 && (
                <>
                    {/* Red dot indicator */}
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-sm" />

                    {/* Unread count badge */}
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                </>
            )}

            {/* Tooltip */}
            <div className="absolute right-0 top-full mt-2 bg-navy-900 text-white px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'Notifications'}
            </div>
        </button>
    );
};

export default NotificationBell;
