
import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock,
  BookOpen, X, ExternalLink, Info, Video, Link2, Users, CheckCircle, RefreshCw
} from 'lucide-react';
import { SmsEvent, UserProfile } from '../types';
import { ANNUAL_STUDY_PLAN } from '../constants';
import { ToastContainer, useToast } from '../components/Toast';
import { db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

interface Props {
  events: SmsEvent[];
}

const MMM_ZOOM_URL = "https://us02web.zoom.us/j/5913670930?pwd=ZGtRalFmN0RTSXN0OFNlcjViWFNqZz09";

const InteractiveCalendar: React.FC<Props> = ({ events }) => {
  const { showToast, toasts, closeToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<SmsEvent | any | null>(null);
  const [view, setView] = useState<'month' | 'agenda'>('month');
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sms_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Format date correctly whether it's a JS Date, ISO string, or Firestore Timestamp
  const formatEventDate = (date: any) => {
    if (!date) return 'TBA';
    if (date instanceof Timestamp) return date.toDate().toDateString();
    if (typeof date.toDate === 'function') return date.toDate().toDateString();
    return new Date(date).toDateString();
  };

  const formatEventTime = (date: any) => {
    if (!date) return 'TBA';
    let d: Date;
    if (date instanceof Timestamp) d = date.toDate();
    else if (typeof date.toDate === 'function') d = date.toDate();
    else d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const allEvents = useMemo(() => {
    const year = 2026;
    const generated: any[] = [];

    // 1. MMM - Every Monday
    for (let month = 0; month < 12; month++) {
      let d = new Date(year, month, 1);
      while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
      while (d.getFullYear() === year && d.getMonth() === month) {
        generated.push({
          eventId: `mmm-${d.getTime()}`,
          id: `mmm-${d.getTime()}`,
          title: "MMM - Monday Morning Meditation",
          eventDate: new Date(d),
          date: new Date(d).toDateString(),
          time: "05:30 AM - 06:30 AM",
          location: "Via Zoom (Online)",
          type: "spiritual",
          category: "Virtual",
          description: "Start the week with Jyothi Meditation and 10-finger gratitude.",
          zoomLink: MMM_ZOOM_URL,
          isMMM: true
        });
        d.setDate(d.getDate() + 7);
      }
    }

    // 2. Book Club - Every Thursday
    ANNUAL_STUDY_PLAN.forEach(week => {
      generated.push({
        eventId: `study-${week.weekId}`,
        id: `study-${week.weekId}`,
        title: `Sai Lit Club: ${week.chapterTitle}`,
        eventDate: new Date(week.publishAt),
        date: new Date(week.publishAt).toDateString(),
        description: `National study plan for ${week.book}. Focus: ${week.topic}`,
        type: 'learning',
        category: 'Study',
        isStudy: true,
        time: 'Release Day',
        location: 'Digital Hub'
      });
    });

    return [...events, ...generated];
  }, [events]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return (day === 0 ? 6 : day - 1);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOffset = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const addMonths = (n: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + n, 1));
  };

  const getEventsForDate = (dateObj: Date) => {
    const dateStr = dateObj.toDateString();
    return allEvents.filter(e => formatEventDate(e.eventDate || e.date) === dateStr);
  };

  const isToday = (d: number) => {
    const today = new Date();
    return d === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const getCategoryColor = (type: string, category?: string) => {
    const cat = (type || category || '').toLowerCase();
    switch (cat) {
      case 'spiritual': case 'virtual': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'service': return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'festival': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'learning': case 'study': return 'bg-navy-50 text-navy-700 border-navy-100';
      default: return 'bg-gold-50 text-gold-700 border-gold-100';
    }
  };

  const handleRegister = async () => {
    if (!user) {
      showToast("Please log in to register.", "error");
      return;
    }
    if (!selectedEvent.eventId || selectedEvent.id?.startsWith('mmm-')) return;

    setIsRegistering(true);
    try {
      const eventRef = doc(db, 'calendar', selectedEvent.eventId);
      await updateDoc(eventRef, {
        registeredUsers: arrayUnion(user.uid),
        registeredCount: (selectedEvent.registeredCount || 0) + 1
      });
      showToast("Successfully registered for event!", "success");
      // Update local state if needed or wait for Firestore push
      setSelectedEvent({
        ...selectedEvent,
        registeredUsers: [...(selectedEvent.registeredUsers || []), user.uid],
        registeredCount: (selectedEvent.registeredCount || 0) + 1
      });
    } catch (error) {
      console.error("Registration error:", error);
      showToast("Registration failed. Please try again.", "error");
    } finally {
      setIsRegistering(false);
    }
  };

  const isUserRegistered = selectedEvent?.registeredUsers?.includes(user?.uid || '');

  return (
    <div className="flex flex-col lg:flex-row gap-10 font-poppins relative">
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <div className="flex-grow space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => addMonths(-1)} className="p-3 bg-neutral-100 hover:bg-navy-900 hover:text-white rounded-xl transition-all"><ChevronLeft size={20} /></button>
            <h2 className="text-3xl font-serif font-bold text-navy-900 min-w-[200px] text-center">
              {fullMonthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={() => addMonths(1)} className="p-3 bg-neutral-100 hover:bg-navy-900 hover:text-white rounded-xl transition-all"><ChevronRight size={20} /></button>
          </div>

          <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-navy-50">
            <button onClick={() => setView('month')} className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === 'month' ? 'bg-white shadow-md text-navy-900' : 'text-navy-300'}`}>Month</button>
            <button onClick={() => setView('agenda')} className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${view === 'agenda' ? 'bg-white shadow-md text-navy-900' : 'text-navy-300'}`}>Timeline</button>
          </div>
        </div>

        {view === 'month' ? (
          <div className="bg-neutral-50 rounded-[2rem] border border-navy-50 overflow-hidden shadow-inner">
            <div className="grid grid-cols-7 border-b border-navy-100/50">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="py-5 font-black uppercase tracking-widest text-[9px] text-navy-200 text-center">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`} className="aspect-square sm:aspect-auto sm:h-32 border-r border-b border-navy-100/30 bg-white/40" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayEvents = getEventsForDate(dObj);
                return (
                  <div key={day} className={`relative flex flex-col p-2 border-r border-b border-navy-100/30 aspect-square sm:aspect-auto sm:h-32 group transition-colors ${isToday(day) ? 'bg-gold-50/50' : 'bg-white'}`}>
                    <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-black ${isToday(day) ? 'bg-gold-500 text-white shadow-lg' : 'text-navy-300 group-hover:text-navy-900'}`}>{day}</span>
                    <div className="mt-2 space-y-1 overflow-y-auto custom-scrollbar max-h-[80%] pr-1">
                      {dayEvents.map((e, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedEvent(e)}
                          className={`w-full text-[8px] text-left truncate px-2 py-1 rounded-md font-bold transition-all hover:scale-105 active:scale-95 border ${getCategoryColor(e.type, e.category)}`}
                        >
                          {e.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {allEvents.sort((a, b) => {
              const da = a.eventDate instanceof Timestamp ? a.eventDate.toDate() : new Date(a.eventDate || a.date);
              const db = b.eventDate instanceof Timestamp ? b.eventDate.toDate() : new Date(b.eventDate || b.date);
              return da.getTime() - db.getTime();
            }).map(event => (
              <button
                key={event.eventId || event.id}
                onClick={() => setSelectedEvent(event)}
                className="w-full text-left bg-white p-6 rounded-3xl border border-navy-50 flex items-center gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${getCategoryColor(event.type, event.category)}`}>
                  {event.meetingLink || event.zoomLink ? <Video size={24} /> : <CalendarIcon size={24} />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[9px] font-black uppercase text-gold-600">{formatEventDate(event.eventDate || event.date)}</span>
                    <span className="w-1 h-1 bg-navy-100 rounded-full"></span>
                    <span className="text-[9px] font-black uppercase text-navy-200">{event.type || event.category}</span>
                  </div>
                  <h4 className="text-xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors">{event.title}</h4>
                </div>
                <ChevronRight size={20} className="text-navy-100 group-hover:text-navy-900 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      <aside className="lg:w-[400px] shrink-0">
        <div className="bg-white rounded-bento shadow-2xl border border-navy-50 overflow-hidden sticky top-32">
          {!selectedEvent ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-navy-100">
                <Info size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-navy-900">National Timeline</h3>
                <p className="text-xs text-navy-300 font-medium leading-relaxed">Select any event from the grid to view venue details, links, and spiritual descriptions.</p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-10 duration-500">
              <div className={`h-3 w-full ${getCategoryColor(selectedEvent.type, selectedEvent.category).split(' ')[0].replace('bg-', 'bg-')}`}></div>
              <div className="p-10 space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getCategoryColor(selectedEvent.type, selectedEvent.category)}`}>
                      {selectedEvent.type || selectedEvent.category}
                    </span>
                    <h3 className="text-3xl font-serif font-bold text-navy-900 mt-4 leading-tight">{selectedEvent.title}</h3>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="p-2 text-navy-200 hover:text-navy-900"><X size={24} /></button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                      <CalendarIcon size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-navy-200 tracking-widest">Date</p>
                      <p className="text-sm font-bold text-navy-900">{formatEventDate(selectedEvent.eventDate || selectedEvent.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-navy-200 tracking-widest">Time</p>
                      <p className="text-sm font-bold text-navy-900">{selectedEvent.time || formatEventTime(selectedEvent.eventDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-navy-200 tracking-widest">Location</p>
                      <p className="text-sm font-bold text-navy-900">{selectedEvent.location || 'Announced via Hub'}</p>
                    </div>
                  </div>
                  {selectedEvent.maxAttendees && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase text-navy-200 tracking-widest">Availability</p>
                        <p className="text-sm font-bold text-navy-900">{selectedEvent.registeredCount || 0} / {selectedEvent.maxAttendees} Enrolled</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-neutral-50 rounded-3xl border border-navy-50">
                  <p className="text-sm text-navy-500 font-medium leading-relaxed italic">"{selectedEvent.description}"</p>
                </div>

                {selectedEvent.zoomLink || selectedEvent.meetingLink ? (
                  <a
                    href={selectedEvent.zoomLink || selectedEvent.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-teal-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-teal-700 transition-all active:scale-95"
                  >
                    <Video size={16} /> Join Virtual Session
                  </a>
                ) : selectedEvent.eventId && !selectedEvent.id?.startsWith('mmm-') ? (
                  <button
                    disabled={isRegistering || isUserRegistered}
                    onClick={handleRegister}
                    className={`w-full py-5 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${isUserRegistered ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-navy-900 text-gold-500 hover:bg-navy-800'}`}
                  >
                    {isRegistering ? <RefreshCw size={16} className="animate-spin" /> : (isUserRegistered ? <CheckCircle size={16} /> : <Link2 size={16} />)}
                    {isUserRegistered ? "Already Registered" : "Register Now"}
                  </button>
                ) : (
                  <button onClick={() => showToast(`Reminder set for ${selectedEvent.title}!`, 'success')} className="w-full py-5 bg-navy-900 text-gold-500 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-navy-800 transition-all active:scale-95">
                    <Link2 size={16} /> Set Reminder
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Modal Overlay - Omitted for brevity, but same logic applies */}
    </div>
  );
};

export default InteractiveCalendar;
