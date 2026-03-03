import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { SmsEvent } from '../types';
import { Calendar, MapPin, Users, ChevronRight, Filter, Search, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_EVENTS } from '../constants';

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<SmsEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'spiritual' | 'service' | 'festival'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'calendar'), orderBy('eventDate', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            const evts = snap.docs.map(doc => ({
                ...doc.data(),
                eventId: doc.id
            })) as SmsEvent[];
            setEvents(evts);
            setIsLoading(false);
        });
        return () => unsub();
    }, []);

    const combinedEvents = [...MOCK_EVENTS, ...events];

    const filteredEvents = combinedEvents.filter(e => {
        const matchesFilter = filter === 'all' || e.type === filter;
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const categories = [
        { id: 'all', label: 'All Events', color: 'bg-navy-900 text-gold-500' },
        { id: 'spiritual', label: 'Spiritual', color: 'bg-purple-100 text-purple-700' },
        { id: 'service', label: 'Service', color: 'bg-teal-100 text-teal-700' },
        { id: 'festival', label: 'Festivals', color: 'bg-orange-100 text-orange-700' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 font-poppins min-h-screen">
            <div className="space-y-4 mb-16">
                <div className="flex items-center gap-3 text-gold-600">
                    <Sparkles size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">National Gatherings</span>
                </div>
                <h1 className="font-serif text-6xl font-black text-navy-900 leading-tight">National Event Hub</h1>
                <p className="max-w-2xl text-navy-500 font-medium text-lg leading-relaxed">
                    Discover opportunities to serve, learn, and celebrate together.
                    From virtual workshops to nationwide festivals.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div className="flex bg-neutral-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id as any)}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat.id ? 'bg-navy-900 text-gold-500 shadow-lg' : 'text-navy-400 hover:text-navy-900'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-navy-50 rounded-2xl text-sm font-bold focus:border-gold-500 outline-none shadow-sm shadow-navy-900/5 transition-all"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-bento shadow-xl border border-navy-50">
                    <Loader2 size={48} className="text-gold-500 animate-spin" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-navy-300">Summoning Event Data...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="bg-white p-20 rounded-bento text-center border-2 border-dashed border-navy-50 shadow-sm">
                    <Calendar size={64} className="mx-auto text-navy-100 mb-6" />
                    <h3 className="text-2xl font-serif font-bold text-navy-900">No Events Found</h3>
                    <p className="text-navy-400 max-w-sm mx-auto mt-2 italic font-medium">"Wait for the divine timing." — Try adjusting your filters or search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map(event => (
                        <Link
                            to={`/events/${event.eventId || event.id}`}
                            key={event.eventId || event.id}
                            className="bg-white group rounded-bento overflow-hidden shadow-lg border border-navy-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                        >
                            <div className="h-48 bg-neutral-100 relative overflow-hidden">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${event.type === 'spiritual' ? 'bg-purple-50' :
                                            event.type === 'service' ? 'bg-teal-50' :
                                                event.type === 'festival' ? 'bg-orange-50' : 'bg-blue-50'
                                        }`}>
                                        <Calendar size={48} className={`opacity-20 ${event.type === 'spiritual' ? 'text-purple-600' :
                                                event.type === 'service' ? 'text-teal-600' :
                                                    event.type === 'festival' ? 'text-orange-600' : 'text-blue-600'
                                            }`} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md ${event.type === 'spiritual' ? 'bg-purple-600 text-white' :
                                            event.type === 'service' ? 'bg-teal-600 text-white' :
                                                event.type === 'festival' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                                        }`}>
                                        {event.type || event.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex-grow space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-2">{event.title}</h3>
                                </div>
                                <p className="text-navy-400 text-sm line-clamp-3 font-medium leading-relaxed italic">"{event.description}"</p>

                                <div className="pt-4 border-t border-navy-50 space-y-3">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-navy-300 tracking-widest">
                                        <Calendar size={14} className="text-gold-500" />
                                        {(event.eventDate as any)?.toDate ? (event.eventDate as any).toDate().toDateString() : new Date(event.eventDate || event.date).toDateString()}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-navy-300 tracking-widest truncate">
                                        <MapPin size={14} className="text-gold-500" />
                                        {event.location}
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 py-5 bg-neutral-50 flex justify-between items-center group-hover:bg-navy-900 transition-colors">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-navy-300 group-hover:text-gold-500">View Details</span>
                                <ChevronRight size={16} className="text-navy-200 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsPage;
