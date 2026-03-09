import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Save, Send, Calendar, Clock, Bell, Monitor, Settings, Image as ImageIcon, Type, Target } from 'lucide-react';
import { Announcement } from '../types';

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-bento border border-navy-50 shadow-xl overflow-hidden ${className}`}>
        {children}
    </div>
);

const Section = ({ title, icon: Icon, children }: { title: string, icon?: any, children: React.ReactNode }) => (
    <Card className="mb-8 p-6 md:p-8">
        <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2 border-b border-navy-50 pb-4 mb-6">
            {Icon && <Icon size={24} className="text-gold-500" />} {title}
        </h3>
        <div className="space-y-6">
            {children}
        </div>
    </Card>
);

const CreateAnnouncementPage = () => {
    const navigate = useNavigate();
    const adminEmail = JSON.parse(localStorage.getItem('sms_user') || '{}')?.email || 'admin@example.com';
    const adminUid = JSON.parse(localStorage.getItem('sms_user') || '{}')?.uid || 'unknown';
    const adminName = JSON.parse(localStorage.getItem('sms_user') || '{}')?.name || 'Admin';

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'welcome' | 'update' | 'event' | 'urgent' | 'celebration'>('update');
    const [category, setCategory] = useState<'general' | 'bookclub' | 'events' | 'technical' | 'maintenance'>('general');

    // Ticker Settings
    const [showInTicker, setShowInTicker] = useState(false);
    const [tickerText, setTickerText] = useState('');
    const [tickerDuration, setTickerDuration] = useState<number | 'continuous'>(30);
    const [tickerStartDate, setTickerStartDate] = useState('');
    const [tickerEndDate, setTickerEndDate] = useState('');
    const [tickerClickable, setTickerClickable] = useState(true);

    // Notification Settings
    const [sendNotification, setSendNotification] = useState(false);
    const [notifTitle, setNotifTitle] = useState('');
    const [notifBody, setNotifBody] = useState('');
    const [targetAudience, setTargetAudience] = useState<'all' | 'role' | 'centre' | 'state'>('all');
    const [deliveryTiming, setDeliveryTiming] = useState<'immediate' | 'scheduled'>('immediate');
    const [scheduledTime, setScheduledTime] = useState('');
    const [channels, setChannels] = useState({ inApp: true, push: false, email: false, sms: false });

    // Display Settings
    const [showOnPage, setShowOnPage] = useState(true);
    const [isPinned, setIsPinned] = useState(false);
    const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
    const [expiresAt, setExpiresAt] = useState('');

    const handleSubmit = async (e: React.FormEvent, status: 'active' | 'draft' | 'scheduled') => {
        e.preventDefault();

        if (!title || !message) {
            alert("Title and Message are required.");
            return;
        }

        if (showInTicker && !tickerText) {
            alert("Ticker text is required when Ticker is enabled.");
            return;
        }

        setIsSubmitting(true);

        try {
            const annData: Partial<Announcement> = {
                title,
                message,
                content: message, // legacy fallback
                type,
                category,
                status: status,
                timestamp: serverTimestamp(), // legacy compatibility
                createdAt: serverTimestamp(),
                createdBy: {
                    uid: adminUid,
                    name: adminName,
                    role: 'Admin'
                },
                updatedAt: serverTimestamp(),
                displaySettings: {
                    showInTicker,
                    showInBellNotification: sendNotification,
                    showInAnnouncementsPage: showOnPage,
                    isPinned,
                    priority
                },
                ticker: showInTicker ? {
                    enabled: true,
                    text: tickerText,
                    duration: tickerDuration,
                    startDate: tickerStartDate ? new Date(tickerStartDate).getTime() : null,
                    endDate: tickerEndDate ? new Date(tickerEndDate).getTime() : null,
                    pausable: true,
                    clickable: tickerClickable,
                } : undefined,
                notification: sendNotification ? {
                    enabled: true,
                    title: notifTitle || title,
                    body: notifBody || message.substring(0, 100),
                    deliverTo: targetAudience,
                    sendImmediately: deliveryTiming === 'immediate',
                    scheduledFor: deliveryTiming === 'scheduled' && scheduledTime ? new Date(scheduledTime).getTime() : null,
                    channels: {
                        inApp: channels.inApp,
                        pushNotification: channels.push,
                        email: channels.email,
                        sms: channels.sms
                    }
                } : undefined,
                expiresAt: expiresAt ? new Date(expiresAt).getTime() : null,
                stats: {
                    views: 0, clicks: 0, tickerImpressions: 0, notificationsSent: 0, notificationsRead: 0, clickThroughRate: 0
                }
            };

            await addDoc(collection(db, 'announcements'), annData);

            // Log action
            const logs = JSON.parse(localStorage.getItem('sms_audit_logs') || '[]');
            logs.unshift({
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString(),
                adminEmail,
                action: `Created Announcement (${status})`,
                target: title,
                outcome: 'success'
            });
            localStorage.setItem('sms_audit_logs', JSON.stringify(logs.slice(0, 500)));
            window.dispatchEvent(new Event('storage'));

            alert(`Announcement ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
            navigate('/admin'); // Return to Admin Hub
        } catch (error) {
            console.error("Failed to create announcement:", error);
            alert("Failed to create announcement. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-24 top-notch">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-navy-10 shadow-sm relative pt-12">
                <div className="max-w-5xl mx-auto px-6 h-20 flex flex-col justify-center">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-navy-400 hover:text-navy-900 transition-colors font-bold text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Back to Admin Hub
                    </button>
                    <div className="flex justify-between items-end mt-2">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-navy-900">Create Announcement</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-8">
                <form className="space-y-8 animate-in fade-in">

                    {/* STEP 1: BASIC INFO */}
                    <Section title="1. Basic Information" icon={Type}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Announcement Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., New Book Club Chapter Available"
                                    className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    maxLength={100}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Message Content *</label>
                                <textarea
                                    required
                                    placeholder="Full announcement message..."
                                    className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base h-32 resize-none focus:border-gold-500 outline-none transition-all shadow-sm"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    maxLength={1000}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Type *</label>
                                <select
                                    className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm appearance-none"
                                    value={type}
                                    onChange={e => setType(e.target.value as any)}
                                >
                                    <option value="welcome">🎉 Welcome</option>
                                    <option value="update">📢 Update</option>
                                    <option value="event">📅 Event</option>
                                    <option value="urgent">⚠️ Urgent</option>
                                    <option value="celebration">🎊 Celebration</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Category</label>
                                <select
                                    className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm appearance-none"
                                    value={category}
                                    onChange={e => setCategory(e.target.value as any)}
                                >
                                    <option value="general">General</option>
                                    <option value="bookclub">Book Club</option>
                                    <option value="events">Events</option>
                                    <option value="technical">Technical</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>
                    </Section>

                    {/* STEP 2: TICKER SETTINGS */}
                    <Section title="2. Ticker Banner Settings" icon={Monitor}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-12 h-6 rounded-full transition-colors relative ${showInTicker ? 'bg-green-500' : 'bg-neutral-300'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${showInTicker ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </div>
                            <input type="checkbox" className="hidden" checked={showInTicker} onChange={e => setShowInTicker(e.target.checked)} />
                            <span className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">Display in Ticker Banner</span>
                        </label>

                        {showInTicker && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-neutral-50 rounded-2xl border border-navy-50 border-dashed">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Ticker Text *</label>
                                    <input
                                        type="text"
                                        placeholder="Short text for scrolling banner..."
                                        className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm"
                                        value={tickerText}
                                        onChange={e => setTickerText(e.target.value)}
                                        maxLength={150}
                                    />
                                    <p className="text-[10px] text-navy-400">Keep it concise for better readability.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Display Duration</label>
                                    <select
                                        className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm appearance-none"
                                        value={tickerDuration}
                                        onChange={e => setTickerDuration(e.target.value === 'continuous' ? 'continuous' : Number(e.target.value))}
                                    >
                                        <option value={10}>10 seconds</option>
                                        <option value={20}>20 seconds</option>
                                        <option value={30}>30 seconds (default)</option>
                                        <option value={60}>1 minute</option>
                                        <option value="continuous">Continuous</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer group mt-4">
                                        <input type="checkbox" className="w-5 h-5 accent-gold-500" checked={tickerClickable} onChange={e => setTickerClickable(e.target.checked)} />
                                        <span className="font-bold text-navy-900 text-sm">Make Ticker Clickable</span>
                                    </label>
                                    <p className="text-[10px] text-navy-400 ml-8">Clicking ticker will navigate to announcement page.</p>
                                </div>
                            </div>
                        )}
                    </Section>

                    {/* STEP 3: NOTIFICATION SETTINGS */}
                    <Section title="3. Bell Icon Notification Settings" icon={Bell}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-12 h-6 rounded-full transition-colors relative ${sendNotification ? 'bg-green-500' : 'bg-neutral-300'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${sendNotification ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </div>
                            <input type="checkbox" className="hidden" checked={sendNotification} onChange={e => setSendNotification(e.target.checked)} />
                            <span className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">Send as Notification</span>
                        </label>

                        {sendNotification && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6 bg-neutral-50 rounded-2xl border border-navy-50 border-dashed">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Notification Title</label>
                                    <input
                                        type="text"
                                        placeholder="Short notification title..."
                                        className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm"
                                        value={notifTitle}
                                        onChange={e => setNotifTitle(e.target.value)}
                                        maxLength={50}
                                    />
                                    <p className="text-[10px] text-navy-400 flex items-center gap-1">Leave blank to use Announcement Title</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Target Audience</label>
                                    <select
                                        className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm appearance-none"
                                        value={targetAudience}
                                        onChange={e => setTargetAudience(e.target.value as any)}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="role">Specific Roles</option>
                                        <option value="centre">Specific Centres</option>
                                        <option value="state">Specific States</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Notification Body</label>
                                    <textarea
                                        placeholder="Notification message..."
                                        className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base h-24 resize-none focus:border-gold-500 outline-none transition-all shadow-sm"
                                        value={notifBody}
                                        onChange={e => setNotifBody(e.target.value)}
                                        maxLength={150}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-black uppercase text-navy-400 tracking-widest block mb-3">Delivery Channels</label>
                                    <div className="flex flex-wrap gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={channels.inApp} disabled className="w-5 h-5 accent-gold-500 opacity-50" />
                                            <span className="font-bold text-navy-900 text-sm">In-App (Bell)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={channels.push} onChange={e => setChannels({ ...channels, push: e.target.checked })} className="w-5 h-5 accent-gold-500" />
                                            <span className="font-bold text-navy-900 text-sm">Push (Browser)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={channels.email} onChange={e => setChannels({ ...channels, email: e.target.checked })} className="w-5 h-5 accent-gold-500" />
                                            <span className="font-bold text-navy-900 text-sm">Email</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Section>

                    {/* STEP 4: DISPLAY SETTINGS */}
                    <Section title="4. Display Settings" icon={Settings}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-12 h-6 rounded-full transition-colors relative ${showOnPage ? 'bg-gold-500' : 'bg-neutral-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${showOnPage ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                    </div>
                                    <input type="checkbox" className="hidden" checked={showOnPage} onChange={e => setShowOnPage(e.target.checked)} />
                                    <div>
                                        <span className="font-bold text-navy-900 block group-hover:text-gold-600 transition-colors">Show on /announcements Page</span>
                                        <span className="text-[10px] text-navy-400">Display in announcement archive</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-12 h-6 rounded-full transition-colors relative ${isPinned ? 'bg-gold-500' : 'bg-neutral-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isPinned ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} />
                                    <div>
                                        <span className="font-bold text-navy-900 block group-hover:text-gold-600 transition-colors">Pin to Top</span>
                                        <span className="text-[10px] text-navy-400">Keep announcement at top of list</span>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Priority Level</label>
                                    <select
                                        className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm appearance-none"
                                        value={priority}
                                        onChange={e => setPriority(e.target.value as any)}
                                    >
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-navy-400 tracking-widest">Expiration Date (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-4 bg-white rounded-xl border border-navy-50 text-base focus:border-gold-500 outline-none transition-all shadow-sm"
                                        value={expiresAt}
                                        onChange={e => setExpiresAt(e.target.value)}
                                    />
                                    <p className="text-[10px] text-navy-400 flex items-center gap-1">Announcement will auto-archive after this date.</p>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* FORM ACTIONS */}
                    <div className="sticky bottom-6 z-50 flex flex-col md:flex-row gap-4 justify-end p-6 bg-white/80 backdrop-blur border border-navy-10 rounded-2xl shadow-2xl">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(e) => handleSubmit(e, 'draft')}
                            className="px-6 py-4 bg-white text-navy-600 border border-navy-100 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> Save as Draft
                        </button>

                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(e) => handleSubmit(e, 'scheduled')}
                            className="px-6 py-4 bg-navy-50 text-navy-700 border border-navy-100 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-navy-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Clock size={16} /> Schedule
                        </button>

                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={(e) => handleSubmit(e, 'active')}
                            className="px-8 py-4 bg-gold-gradient text-navy-900 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send size={16} /> {isSubmitting ? 'Publishing...' : 'Publish Now'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateAnnouncementPage;
