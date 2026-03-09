import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Tag, ChevronRight, Share2, Info } from 'lucide-react';
import { Announcement } from '../types';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AnnouncementsPage: React.FC = () => {
  const [anns, setAnns] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<'All' | 'Event' | 'News' | 'Spiritual'>('All');

  useEffect(() => {
    const fetchAnns = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'announcements'), orderBy('timestamp', 'desc')));
        const ans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Announcement));
        setAnns(ans);
      } catch (e) {
        console.error("Failed to fetch announcements:", e);
      }
    };
    fetchAnns();
  }, []);

  const filteredAnn = filter === 'All'
    ? anns
    : anns.filter(a => a.category === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-playfair text-5xl font-bold text-navy-900 mb-2">Announcements</h1>
          <p className="text-navy-500">Official updates from the SSIOM Spiritual Wing.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-navy-50">
          {(['All', 'Event', 'News', 'Spiritual'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-purple-600 text-white shadow-md' : 'text-navy-400 hover:text-navy-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {filteredAnn.length > 0 ? filteredAnn.map(ann => (
          <div key={ann.id} className="bg-white rounded-bento shadow-xl border border-navy-50 overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500">
            {ann.imageUrl && (
              <div className="h-56 w-full overflow-hidden">
                <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ann.category === 'events' || ann.category === 'Event' ? 'bg-magenta-100 text-magenta-600' :
                  ann.category === 'News' ? 'bg-teal-100 text-teal-600' :
                    ann.category === 'maintenance' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                  {ann.category || 'General'}
                </span>
                {ann.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gold-600">
                    <Tag size={12} /> PINNED
                  </span>
                )}
                <span className="text-[10px] text-navy-300 ml-auto flex items-center gap-1 font-bold">
                  <Calendar size={12} /> {new Date(ann.timestamp).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-navy-900 mb-4 group-hover:text-purple-600 transition-colors">
                {ann.title}
              </h3>
              <p className="text-navy-600 leading-relaxed mb-8 whitespace-pre-wrap">
                {ann.content || ann.message}
              </p>
              <div className="flex justify-between items-center pt-6 border-t border-neutral-50">
                <button className="flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-purple-600 transition-colors">
                  Mark as Read <ChevronRight size={16} />
                </button>
                <button className="p-3 bg-neutral-50 rounded-full text-navy-300 hover:text-purple-600 hover:bg-purple-50 transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-bento shadow-xl border border-navy-50 p-20 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center text-navy-200">
              <Info size={40} />
            </div>
            <p className="text-navy-400 font-medium italic">
              {anns.length === 0 ? "No announcements have been published yet." : "No announcements found matching this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;