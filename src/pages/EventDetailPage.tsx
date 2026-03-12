import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { SmsEvent, UserProfile } from '../types';
import {
    Calendar, MapPin, Users, Clock, ArrowLeft,
    Share2, ExternalLink, Video, CheckCircle, RefreshCw,
    Info, Bell, Map as MapIcon, Calendar as CalendarIcon
} from 'lucide-react';
import { ToastContainer, useToast } from '../components/Toast';
import { MOCK_EVENTS } from '../constants';
import { fetchEventById, registerForEvent } from '../services/eventService';

const EventDetailPage: React.FC = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { showToast, toasts, closeToast } = useToast();

    const [event, setEvent] = useState<SmsEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('sms_user');
        if (saved) setUser(JSON.parse(saved));

        const fetchEvent = async () => {
            if (!eventId) return;

            // Check if it's a mock event first
            const mock = MOCK_EVENTS.find(e => (e.eventId || e.id) === eventId);
            if (mock) {
                setEvent(mock);
                setIsLoading(false);
                return;
            }

            try {
                const liveEvent = await fetchEventById(eventId);
                if (liveEvent) {
                    setEvent(liveEvent);
                } else {
                    showToast("Event not found.", "error");
                    navigate('/events');
                }
            } catch (error) {
                console.error("Error fetching event:", error);
                showToast("Failed to load event.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, navigate]);

    const handleRegister = async () => {
        if (!user) {
            showToast("Please log in to register.", "error");
            return;
        }
        if (!event || !event.eventId || (event as any).id?.startsWith('f')) {
            showToast("This is a fixed national event and doesn't require registration.", "info");
            return;
        }

        if (event.maxAttendees && (event.registeredCount || 0) >= event.maxAttendees) {
            showToast("Registration is full for this event.", "error");
            return;
        }

        setIsRegistering(true);
        try {
            await registerForEvent(event, user.uid);
            showToast("Successfully registered for event!", "success");
            setEvent({
                ...event,
                registeredUsers: [...(event.registeredUsers || []), user.uid],
                registeredCount: (event.registeredCount || 0) + 1
            });
        } catch (error) {
            console.error("Registration error:", error);
            showToast("Registration failed. Please try again.", "error");
        } finally {
            setIsRegistering(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <RefreshCw size={48} className="text-gold-500 animate-spin" />
                <p className="text-xs font-black uppercase tracking-[0.4em] text-navy-300">Summoning Sacred Timeline...</p>
            </div>
        );
    }

    if (!event) return null;

    const isUserRegistered = event.registeredUsers?.includes(user?.uid || '');
    const isMock = (event as any).id?.startsWith('f') || (event as any).id?.startsWith('e');

    const formattedDate = (event.eventDate as any)?.toDate ? (event.eventDate as any).toDate().toDateString() : new Date(event.eventDate || event.date).toDateString();
    const formattedTime = (event.eventDate as any)?.toDate ? (event.eventDate as any).toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (event.time || 'TBA');

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 font-poppins min-h-screen">
            <ToastContainer toasts={toasts} onClose={closeToast} />

            <button
                onClick={() => navigate('/events')}
                className="flex items-center gap-2 text-navy-400 hover:text-navy-900 font-black uppercase text-[10px] tracking-widest mb-12 transition-all hover:-translate-x-2"
            >
                <ArrowLeft size={16} /> Back to Events
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md ${event.type === 'spiritual' ? 'bg-purple-100 text-purple-700' :
                            event.type === 'service' ? 'bg-teal-100 text-teal-700' :
                                event.type === 'festival' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {event.type || event.category}
                        </span>
                        <h1 className="font-serif text-5xl md:text-6xl font-black text-navy-900 leading-tight">{event.title}</h1>
                        <div className="flex flex-wrap gap-6 items-center pt-4">
                            <div className="flex items-center gap-3">
                                <CalendarIcon size={20} className="text-gold-500" />
                                <span className="text-sm font-bold text-navy-900">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-gold-500" />
                                <span className="text-sm font-bold text-navy-900">{formattedTime}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-gold-500" />
                                <span className="text-sm font-bold text-navy-900">{event.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full rounded-bento overflow-hidden shadow-2xl relative group">
                        {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        ) : (
                            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                <CalendarIcon size={100} className="text-navy-100" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent"></div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-2xl font-serif font-bold text-navy-900 border-b border-navy-50 pb-4 flex items-center gap-3">
                            <Info size={24} className="text-gold-500" /> Event Description
                        </h3>
                        <p className="text-lg text-navy-500 leading-relaxed font-medium italic">
                            "{event.description}"
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                    <div className="bg-white p-10 rounded-bento shadow-2xl border border-navy-50 space-y-10 sticky top-32 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-gradient"></div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase text-navy-300 tracking-[0.3em]">Quick Actions</h4>

                            {isMock ? (
                                <p className="text-xs text-navy-400 font-medium italic">Stay tuned for specific participation links for this national milestone.</p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-neutral-50 p-6 rounded-2xl flex items-center justify-between border border-navy-50">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-navy-300 tracking-widest">Enrolled</p>
                                            <p className="text-2xl font-black text-navy-900">{event.registeredCount || 0} / {event.maxAttendees || '∞'}</p>
                                        </div>
                                        <Users className="text-navy-100" size={32} />
                                    </div>

                                    {isUserRegistered ? (
                                        <div className="flex flex-col items-center gap-4 py-8 bg-green-50 rounded-3xl border border-green-100 animate-in zoom-in-95">
                                            <CheckCircle size={48} className="text-green-500" />
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-green-700 uppercase tracking-widest">Registered!</p>
                                                <p className="text-[10px] text-green-600 font-medium mt-1">Check your profile for details.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleRegister}
                                            disabled={isRegistering}
                                            className="w-full py-6 bg-navy-900 text-gold-500 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                            {isRegistering ? <RefreshCw size={20} className="animate-spin" /> : <CalendarIcon size={20} />}
                                            {isRegistering ? "Securing Spot..." : "Register Now"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {event.status === 'cancelled' && (
                                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-4 text-red-700">
                                    <Bell size={24} />
                                    <p className="text-sm font-bold">This event has been cancelled.</p>
                                </div>
                            )}

                            <button
                                onClick={() => showToast("Event link copied to clipboard!", "success")}
                                className="w-full py-5 bg-white border border-navy-50 text-navy-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-sm hover:bg-neutral-50 transition-all flex items-center justify-center gap-3"
                            >
                                <Share2 size={16} /> Share Event
                            </button>
                        </div>

                        <div className="pt-8 border-t border-navy-50 space-y-6">
                            <h4 className="text-[10px] font-black uppercase text-navy-300 tracking-[0.3em]">Venue Details</h4>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center shrink-0">
                                    <MapIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-navy-900">{event.location}</p>
                                    <p className="text-[10px] text-navy-400 font-medium">Click to navigate in Maps</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default EventDetailPage;
