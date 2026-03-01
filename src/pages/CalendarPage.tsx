
import React from 'react';
import InteractiveCalendar from '../components/InteractiveCalendar';
import { MOCK_EVENTS } from '../constants';
import { Calendar as CalendarIcon, Info, Bell, MapPin } from 'lucide-react';

const CalendarPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4 text-gold-600">
             <CalendarIcon size={20} />
             <span className="text-[10px] font-black uppercase tracking-widest">National Spiritual Timeline</span>
          </div>
          <h1 className="font-serif text-6xl font-bold text-navy-900 leading-tight">SSIOM Calendar</h1>
          <p className="text-navy-500 text-lg mt-4 leading-relaxed font-medium">
            Stay connected with nationwide spiritual events, workshops, and bhajan sessions. 
            Synchronize your personal sadhana with our collective national journey.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white p-6 rounded-3xl shadow-xl border border-navy-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-magenta-50 text-magenta-500 rounded-2xl flex items-center justify-center">
                 <Bell size={24} className="animate-swing" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-navy-300">Upcoming Today</p>
                 <p className="text-sm font-bold text-navy-900">No Events Scheduled</p>
              </div>
           </div>
        </div>
      </div>

      <section className="bg-white rounded-bento shadow-2xl border border-navy-50 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-gradient"></div>
         <div className="p-8 md:p-12">
            <InteractiveCalendar events={MOCK_EVENTS} />
         </div>
      </section>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-neutral-50 p-8 rounded-3xl border border-navy-50">
            <h4 className="text-xs font-black uppercase text-navy-900 tracking-widest mb-4 flex items-center gap-2">
               <Info size={14} className="text-gold-500" /> Event Participation
            </h4>
            <p className="text-sm text-navy-500 leading-relaxed font-medium">Unless stated otherwise, all events are open to registered SSIOM members. Please RSVP via the provided links where applicable.</p>
         </div>
         <div className="bg-neutral-50 p-8 rounded-3xl border border-navy-50">
            <h4 className="text-xs font-black uppercase text-navy-900 tracking-widest mb-4 flex items-center gap-2">
               <MapPin size={14} className="text-gold-500" /> Physical Venues
            </h4>
            <p className="text-sm text-navy-500 leading-relaxed font-medium">Addresses for physical events are linked to Google Maps. Tap on the location in the event details to navigate.</p>
         </div>
         <div className="bg-navy-900 p-8 rounded-3xl text-white">
            <h4 className="text-xs font-black uppercase text-gold-500 tracking-widest mb-4 flex items-center gap-2">
               <Bell size={14} /> Ticker Notifications
            </h4>
            <p className="text-sm text-navy-200 leading-relaxed font-medium">Urgent changes to schedules will be pushed via the live update ticker at the top of the app.</p>
         </div>
      </div>
      
      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
        }
        .animate-swing { animation: swing 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CalendarPage;
