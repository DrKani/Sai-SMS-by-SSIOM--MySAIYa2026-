
import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock,
  BookOpen, X, ExternalLink, Info, Video, Link2
} from 'lucide-react';
import { Event } from '../types';
import { ANNUAL_STUDY_PLAN } from '../constants';
import { ToastContainer, useToast } from '../components/Toast';

interface Props {
  events: Event[];
}

const MMM_ZOOM_URL = "https://us02web.zoom.us/j/5913670930?pwd=ZGtRalFmN0RTSXN0OFNlcjViWFNqZz09";

const InteractiveCalendar: React.FC<Props> = ({ events }) => {
  const { showToast, toasts, closeToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [view, setView] = useState<'month' | 'agenda'>('month');
  const [customEvents, setCustomEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load custom events from Admin Dashboard
    const saved = JSON.parse(localStorage.getItem('sms_custom_events') || '[]');
    setCustomEvents(saved);

    const handleStorage = () => {
      const updated = JSON.parse(localStorage.getItem('sms_custom_events') || '[]');
      setCustomEvents(updated);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Generate recurring events dynamically for the current year (2026)
  const allEvents = useMemo(() => {
    const year = 2026;
    const generated: any[] = [];

    // 1. MMM - Every Monday
    for (let month = 0; month < 12; month++) {
      let d = new Date(year, month, 1);
      while (d.getDay() !== 1) d.setDate(d.getDate() + 1); // Move to first Monday
      while (d.getFullYear() === year && d.getMonth() === month) {
        generated.push({
          id: `mmm-${d.getTime()}`,
          title: "MMM - Monday Morning Meditation",
          date: new Date(d).toDateString(),
          time: "05:30 AM - 06:30 AM",
          location: "Via Zoom (Online)",
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
        id: `study-${week.weekId}`,
        title: `Sai Lit Club: ${week.chapterTitle}`,
        date: new Date(week.publishAt).toDateString(),
        description: `National study plan for ${week.book}. Focus: ${week.topic}`,
        category: 'Study',
        isStudy: true,
        time: 'Release Day',
        location: 'Digital Hub'
      });
    });

    // Merge static, generated, and custom events
    return [...events, ...generated, ...customEvents];
  }, [events, customEvents]);

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
    return allEvents.filter(e => e.date === dateStr);
  };

  const isToday = (d: number) => {
    const today = new Date();
    return d === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'virtual': return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'live': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'festival': return 'bg-green-50 text-green-700 border-green-100';
      case 'study': return 'bg-navy-50 text-navy-700 border-navy-100';
      default: return 'bg-gold-50 text-gold-700 border-gold-100';
    }
  };

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
                          className={`w-full text-[8px] text-left truncate px-2 py-1 rounded-md font-bold transition-all hover:scale-105 active:scale-95 border ${getCategoryColor(e.category)}`}
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
            {allEvents.filter(e => new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0))).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="w-full text-left bg-white p-6 rounded-3xl border border-navy-50 flex items-center gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${event.category === 'Live' ? 'bg-purple-50 text-purple-600' : event.category === 'Virtual' ? 'bg-teal-50 text-teal-600' : 'bg-gold-50 text-gold-600'}`}>
                  {event.meetingLink || event.zoomLink ? <Video size={24} /> : <CalendarIcon size={24} />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[9px] font-black uppercase text-gold-600">{event.date}</span>
                    <span className="w-1 h-1 bg-navy-100 rounded-full"></span>
                    <span className="text-[9px] font-black uppercase text-navy-200">{event.category}</span>
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
              <div className={`h-3 w-full ${selectedEvent.category === 'Virtual' ? 'bg-teal-500' : selectedEvent.category === 'Live' ? 'bg-purple-500' : 'bg-gold-500'}`}></div>
              <div className="p-10 space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getCategoryColor(selectedEvent.category)}`}>
                      {selectedEvent.category}
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
                      <p className="text-sm font-bold text-navy-900">{selectedEvent.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-navy-200 tracking-widest">Time</p>
                      <p className="text-sm font-bold text-navy-900">{selectedEvent.time || 'Check Hub Ticker'}</p>
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
                </div>

                <div className="p-8 bg-neutral-50 rounded-3xl border border-navy-50">
                  <p className="text-sm text-navy-500 font-medium leading-relaxed italic">"{selectedEvent.description}"</p>
                </div>

                {(selectedEvent.zoomLink || selectedEvent.meetingLink) ? (
                  <a
                    href={selectedEvent.zoomLink || selectedEvent.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-teal-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-teal-700 transition-all active:scale-95"
                  >
                    <Video size={16} /> Join Virtual Session
                  </a>
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

      {/* Mobile Modal Overlay */}
      {selectedEvent && (
        <div className="lg:hidden fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 mt-20 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gold-500"></div>
            <div className="flex justify-between items-start mt-2">
              <div>
                <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${getCategoryColor(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </span>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 -mt-2 -mr-2 text-navy-200 hover:text-navy-900 bg-neutral-50 rounded-full"><X size={20} /></button>
            </div>

            <h3 className="text-2xl font-serif font-bold text-navy-900 mt-4 leading-tight mb-6">{selectedEvent.title}</h3>

            <div className="space-y-5 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-navy-200 tracking-widest">Date</p>
                  <p className="text-sm font-bold text-navy-900">{selectedEvent.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-navy-200 tracking-widest">Time</p>
                  <p className="text-sm font-bold text-navy-900">{selectedEvent.time || 'Check Hub Ticker'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-50 text-navy-300 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-navy-200 tracking-widest">Location</p>
                  <p className="text-sm font-bold text-navy-900">{selectedEvent.location || 'Announced via Hub'}</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-neutral-50 rounded-2xl border border-navy-50 mb-6">
              <p className="text-sm text-navy-500 font-medium leading-relaxed italic">"{selectedEvent.description}"</p>
            </div>

            {(selectedEvent.zoomLink || selectedEvent.meetingLink) ? (
              <a
                href={selectedEvent.zoomLink || selectedEvent.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-teal-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-md flex items-center justify-center gap-2 hover:bg-teal-700 transition-all active:scale-95"
              >
                <Video size={16} /> Join Virtual Session
              </a>
            ) : (
              <button onClick={() => showToast(`Reminder set for ${selectedEvent.title}!`, 'success')} className="w-full py-4 bg-navy-900 text-gold-500 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-md flex items-center justify-center gap-2 hover:bg-navy-800 transition-all active:scale-95">
                <Link2 size={16} /> Set Reminder
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCalendar;
