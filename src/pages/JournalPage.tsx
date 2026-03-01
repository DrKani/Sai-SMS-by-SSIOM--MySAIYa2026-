
import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare, Plus, Search, Calendar,
  Trash2, Heart, Filter, Sparkles, X,
  ChevronRight, Bookmark as BookmarkIcon, BookOpen, Clock,
  Send, PenTool, SortAsc, SortDesc, BookMarked, BrainCircuit, Loader2
} from 'lucide-react';
import { UserProfile, JournalEntry, Bookmark } from '../types';
import { getAIClient, MODELS } from '../lib/ai';

const CATEGORIES = ['All', 'Gratitude', 'Prayer', 'Lesson', 'General'] as const;

const JournalPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeFilter, setActiveFilter] = useState<typeof CATEGORIES[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'entryDate_desc' | 'entryDate_asc'>('entryDate_desc');
  const [activeTab, setActiveTab] = useState<'journal' | 'bookmarks'>('journal');

  // AI States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    category: 'General' as JournalEntry['category'],
    entryDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('sms_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      const savedEntries = localStorage.getItem(`sms_journal_${u.uid}`);
      if (savedEntries) setEntries(JSON.parse(savedEntries));

      const savedBookmarks = localStorage.getItem(`sms_bookmarks_${u.uid}`);
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const saveToStorage = (updatedEntries: JournalEntry[]) => {
    if (user) {
      localStorage.setItem(`sms_journal_${user.uid}`, JSON.stringify(updatedEntries));
    }
  };

  const getAIEncouragement = async (content: string) => {
    if (!content || content.length < 10) return;
    setIsAnalyzing(true);
    try {
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: MODELS.text,
        contents: `Provide a short, 2-sentence spiritual encouragement based on this journal entry: "${content}". 
                   Tone should be humble, loving, and inspired by Sathya Sai Baba's teachings on Love and Seva.`,
      });
      setAiInsight(response.text || "Your path is blessed. Continue your sadhana with love.");
    } catch (error) {
      console.error("AI Insight Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!newEntry.title || !newEntry.content) return;
    setIsSubmitting(true);
    try {
      // Simulate network wait for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const entry: JournalEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        category: newEntry.category,
        entryDate: newEntry.entryDate,
        timestamp: new Date().toISOString()
      };
      const updated = [entry, ...entries];
      setEntries(updated);
      saveToStorage(updated);
      setNewEntry({
        title: '',
        content: '',
        category: 'General',
        entryDate: new Date().toISOString().split('T')[0]
      });
      setAiInsight(null);
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this reflection?")) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      saveToStorage(updated);
    }
  };

  const filteredEntries = useMemo(() => {
    let result = entries.filter(e => {
      const matchesFilter = activeFilter === 'All' || e.category === activeFilter;
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.entryDate).getTime();
      const dateB = new Date(b.entryDate).getTime();
      return sortBy === 'entryDate_desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [entries, activeFilter, searchQuery, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 font-poppins" role="main" aria-label="Spiritual Journal">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><PenTool size={18} aria-hidden="true" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-navy-300">Inner Sadhana Diary</span>
          </div>
          <h1 className="font-serif text-6xl font-bold text-navy-900 leading-tight">My Reflections</h1>
          <p className="text-navy-500 max-w-md mt-2 font-medium italic">"Capture your insights, deepen your practice"</p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative group flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search entries..."
              aria-label="Search journal entries"
              className="pl-12 pr-6 py-4 bg-white border border-navy-50 rounded-2xl outline-none focus:border-gold-500 transition-all text-sm font-bold w-full md:w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-200 group-focus-within:text-gold-500 transition-colors" />
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            aria-expanded={isAdding}
            aria-label={isAdding ? "Cancel entry" : "Write new reflection"}
            className={`p-5 rounded-2xl shadow-xl transition-all duration-500 flex items-center gap-3 ${isAdding ? 'bg-magenta-500 text-white rotate-0' : 'bg-navy-900 text-gold-500 hover:scale-105'}`}
          >
            {isAdding ? <X size={24} /> : <><Plus size={24} /> <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Write Reflection</span></>}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex bg-navy-50 p-1.5 rounded-2xl border border-navy-50 w-full md:w-fit mb-10" aria-label="Journal navigation">
        <button
          onClick={() => setActiveTab('journal')}
          aria-current={activeTab === 'journal' ? 'page' : undefined}
          className={`flex-1 md:px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'journal' ? 'bg-navy-900 text-gold-500 shadow-lg' : 'text-navy-300'}`}
        >
          <MessageSquare size={14} /> Daily Journal
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          aria-current={activeTab === 'bookmarks' ? 'page' : undefined}
          className={`flex-1 md:px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'bookmarks' ? 'bg-navy-900 text-gold-500 shadow-lg' : 'text-navy-300'}`}
        >
          <BookMarked size={14} /> Bookmarked Wisdom
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 space-y-8">
          {activeTab === 'journal' && (
            <div className="bg-white p-8 rounded-bento shadow-xl border border-navy-50">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-navy-900 mb-6 flex items-center gap-2">
                <Filter size={14} className="text-gold-500" /> Filter & Sort
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-navy-300 block mb-2">Category</label>
                  <div className="flex flex-col gap-2" role="group" aria-label="Category filters">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`text-left px-5 py-3 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${activeFilter === cat ? 'bg-gold-50 text-gold-700 shadow-sm' : 'text-navy-300 hover:bg-neutral-50'}`}
                      >
                        {cat}
                        {activeFilter === cat && <ChevronRight size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-navy-900 p-8 rounded-bento text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><Heart size={100} /></div>
            <h3 className="text-xl font-bold mb-4 text-gold-500 flex items-center gap-2"><BrainCircuit size={20} /> AI Companion</h3>
            <p className="text-sm font-medium leading-relaxed italic text-navy-100 opacity-90">
              "Our spiritual wing uses Gemini AI to analyze your thoughts and offer Swami's wisdom."
            </p>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-8">
          {activeTab === 'journal' && isAdding && (
            <section className="bg-white rounded-bento shadow-2xl border-4 border-gold-500/20 overflow-hidden animate-in slide-in-from-top-10 duration-500">
              <div className="bg-neutral-50 p-6 border-b border-navy-50 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-2">
                  {(['General', 'Gratitude', 'Prayer', 'Lesson'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewEntry({ ...newEntry, category: cat })}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${newEntry.category === cat ? 'bg-navy-900 text-gold-500 shadow-md' : 'bg-white text-navy-300 border border-navy-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="date"
                  aria-label="Entry Date"
                  className="bg-white border border-navy-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-navy-900 outline-none"
                  value={newEntry.entryDate}
                  onChange={e => setNewEntry({ ...newEntry, entryDate: e.target.value })}
                />
              </div>
              <div className="p-10">
                <input
                  autoFocus
                  type="text"
                  placeholder="Reflective Headline..."
                  className="w-full text-4xl font-serif font-bold text-navy-900 bg-transparent border-none focus:ring-0 mb-8 placeholder:opacity-30"
                  value={newEntry.title}
                  onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
                />
                <textarea
                  placeholder="Begin your dialogue..."
                  className="w-full h-80 bg-neutral-50 rounded-3xl p-10 text-xl font-serif leading-relaxed text-navy-700 outline-none focus:ring-4 ring-gold-500/10 transition-all resize-none border border-navy-50"
                  value={newEntry.content}
                  onChange={e => setNewEntry({ ...newEntry, content: e.target.value })}
                ></textarea>

                {aiInsight && (
                  <div className="mt-8 p-6 bg-gold-50 border-l-4 border-gold-500 rounded-r-2xl animate-in fade-in duration-700">
                    <div className="flex items-center gap-2 mb-2 text-gold-700 font-black text-[10px] uppercase">
                      <Sparkles size={14} /> Divine Insight
                    </div>
                    <p className="text-sm font-medium italic text-gold-900">{aiInsight}</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    onClick={() => getAIEncouragement(newEntry.content)}
                    disabled={isAnalyzing || newEntry.content.length < 10}
                    className="px-8 py-4 bg-purple-50 text-purple-700 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-purple-100 flex items-center justify-center gap-2 hover:bg-purple-100 transition-all disabled:opacity-30"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                    Seek Encouragement
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={isSubmitting}
                    className="px-12 py-5 bg-gold-gradient text-navy-900 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Save to My Path
                  </button>
                </div>
              </div>
            </section>
          )}

          <div className="space-y-6">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-40 bg-white rounded-bento border-4 border-dashed border-navy-50 flex flex-col items-center gap-8">
                <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center text-navy-100">
                  <MessageSquare size={48} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-navy-900">Your spiritual pages await.</h3>
              </div>
            ) : (
              filteredEntries.map(entry => (
                <div key={entry.id} className="bg-white p-10 rounded-bento border border-navy-50 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${entry.category === 'Gratitude' ? 'bg-green-400' : 'bg-gold-500'}`}></div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-navy-50 text-navy-500">{entry.category}</span>
                      <h3 className="text-2xl font-serif font-bold text-navy-900 mt-3">{entry.title}</h3>
                    </div>
                    <button onClick={() => handleDelete(entry.id)} className="p-3 bg-red-50 text-red-300 hover:text-red-500 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                  <p className="text-lg text-navy-600 leading-relaxed font-serif italic opacity-80">"{entry.content}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
