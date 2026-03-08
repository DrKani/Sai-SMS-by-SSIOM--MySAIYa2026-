import React from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';

import { AppNotification } from '../types';

interface NotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: AppNotification[];
    onMarkRead: (id: string) => void;
    onClearAll: () => void;
    onEnablePush?: () => void;
    pushPermissionStatus?: NotificationPermission;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, notifications, onMarkRead, onClearAll, onEnablePush, pushPermissionStatus }) => {
    if (!isOpen) return null;

    const unreadCount = notifications.filter((a) => !a.isRead).length;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-navy-50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bell className="text-navy-900" size={24} />
                            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-500 rounded-full animate-pulse"></span>}
                        </div>
                        <div>
                            <h3 className="text-lg font-serif font-bold text-navy-900">Notifications</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-navy-300">{unreadCount} Unread</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-navy-200 hover:text-navy-900"><X size={24} /></button>
                </div>

                {pushPermissionStatus === 'default' && onEnablePush && (
                    <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                        <h4 className="text-sm font-bold text-teal-900 mb-1">Stay updated</h4>
                        <p className="text-xs text-teal-700 mb-3">Enable push notifications so you don't miss important announcements or events from Sai SMS.</p>
                        <button onClick={onEnablePush} className="w-full py-2 bg-teal-600 text-white rounded-lg text-xs font-bold shadow hover:bg-teal-700 transition">
                            Enable Notifications
                        </button>
                    </div>
                )}

                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4">
                    {notifications.length === 0 ? (
                        <div className="text-center py-20 opacity-40">
                            <Bell size={48} className="mx-auto mb-4 text-navy-200" />
                            <p className="text-sm font-bold text-navy-300">No updates yet</p>
                        </div>
                    ) : (
                        notifications.map((ann) => {
                            const isRead = ann.isRead;
                            return (
                                <div key={ann.id} className={`p-5 rounded-2xl border transition-all ${isRead ? 'bg-white border-navy-50 opacity-60' : 'bg-gold-50/30 border-gold-100 shadow-sm'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${ann.type === 'event' ? 'bg-magenta-100 text-magenta-600' : 'bg-teal-100 text-teal-600'}`}>{ann.type}</span>
                                        <span className="text-[9px] font-bold text-navy-300">{ann.createdAt && new Date(ann.createdAt?.seconds ? ann.createdAt.toDate() : ann.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-bold text-navy-900 mb-1">{ann.title}</h4>
                                    <p className="text-xs text-navy-500 line-clamp-2 mb-3">{ann.body}</p>
                                    {!isRead && (
                                        <button onClick={() => onMarkRead(ann.id!)} className="text-[10px] font-black uppercase tracking-widest text-gold-600 hover:text-gold-700 flex items-center gap-1">
                                            <CheckCheck size={12} /> Mark as Read
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pt-6 mt-auto border-t border-navy-50 space-y-3">
                    <a
                        href="#/announcements"
                        onClick={onClose}
                        className="w-full py-4 flex items-center justify-center gap-2 text-navy-900 bg-gold-50 hover:bg-gold-100 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest border border-gold-200"
                    >
                        <Bell size={14} /> View All Notifications
                    </a>
                    <button onClick={onClearAll} className="w-full py-4 flex items-center justify-center gap-2 text-navy-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest">
                        <span className="text-lg">🗑</span> Clear All Notifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDrawer;
