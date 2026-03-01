import React, { useState } from 'react';
import { Briefcase, X, Gamepad2, PenTool, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserBriefcaseItem } from '../types';

interface BriefcaseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: UserBriefcaseItem[];
}

const BriefcaseDrawer: React.FC<BriefcaseDrawerProps> = ({ isOpen, onClose, items }) => {
    const [segment, setSegment] = useState<'games' | 'reflections'>('games');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (!isOpen) return null;

    const gameItems = items.filter(i => i.type === 'word_card' || i.type === 'quiz_result');
    const reflectionItems = items.filter(i => i.type === 'reflection' || i.type === 'note');

    return (
        <div className="fixed inset-0 z-[100] flex justify-end font-poppins">
            <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-navy-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold-50 text-gold-600 rounded-xl">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-serif font-bold text-navy-900">My Briefcase</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-navy-300">Saved Items</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-navy-200 hover:text-navy-900 rounded-full hover:bg-neutral-100 transition-colors"><X size={24} /></button>
                </div>

                {/* Segment Selector */}
                <div className="flex gap-2 p-1 bg-neutral-100 rounded-2xl mb-6">
                    <button
                        onClick={() => setSegment('games')}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${segment === 'games' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-400 hover:text-navy-600'}`}
                    >
                        <Gamepad2 size={16} /> Games
                    </button>
                    <button
                        onClick={() => setSegment('reflections')}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${segment === 'reflections' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-400 hover:text-navy-600'}`}
                    >
                        <PenTool size={16} /> Reflections
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-2">
                    {segment === 'games' && (
                        gameItems.length === 0 ? (
                            <div className="text-center py-20 px-4 opacity-70">
                                <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4 text-navy-200">
                                    <Gamepad2 size={32} />
                                </div>
                                <h4 className="font-bold text-navy-900 mb-2">No Games Saved</h4>
                                <p className="text-sm text-navy-500 mb-6">Play and save your progress to build your spiritual vocabulary.</p>
                                <Link onClick={onClose} to="/games" className="inline-block px-6 py-3 bg-gold-gradient text-navy-900 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-md hover:scale-105 transition-all">
                                    Play Some Games
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {gameItems.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-white border border-navy-50 rounded-2xl shadow-sm hover:border-gold-300 transition-all flex items-start gap-4">
                                        <div className="p-3 bg-neutral-50 rounded-xl text-navy-400">
                                            {item.type === 'word_card' ? <Gamepad2 size={20} /> : <BookOpen size={20} />}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-gold-600 bg-gold-50 px-2 py-0.5 rounded-md">
                                                    {item.type === 'word_card' ? 'Vocabulary' : 'Quiz Result'}
                                                </span>
                                                <span className="text-[9px] text-navy-300 font-bold">{new Date(item.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-bold text-navy-900 text-sm mb-1">{item.title}</h4>
                                            {item.type === 'word_card' && item.content?.meaning && (
                                                <p className="text-xs text-navy-500 line-clamp-2">Definition: {item.content.meaning}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {segment === 'reflections' && (
                        reflectionItems.length === 0 ? (
                            <div className="text-center py-20 px-4 opacity-70">
                                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-200">
                                    <PenTool size={32} />
                                </div>
                                <h4 className="font-bold text-navy-900 mb-2">No Reflections Saved</h4>
                                <p className="text-sm text-navy-500 mb-6">Read the latest study plan chapter and share your thoughts.</p>
                                <Link onClick={onClose} to="/book-club" className="inline-block px-6 py-3 bg-navy-900 text-gold-500 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-md hover:bg-navy-800 transition-all">
                                    Go to Book Club
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {reflectionItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id as string)}
                                        className="p-4 bg-white border border-navy-50 rounded-2xl shadow-sm hover:border-purple-300 transition-all flex items-start gap-4 cursor-pointer"
                                    >
                                        <div className="p-3 bg-purple-50 rounded-xl text-purple-500 shrink-0">
                                            <PenTool size={20} />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">
                                                    My Insight
                                                </span>
                                                <span className="text-[9px] text-navy-300 font-bold">{new Date(item.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-bold text-navy-900 text-sm mb-2">{item.title}</h4>
                                            <p className={`text-xs text-navy-600 italic bg-neutral-50 p-2 rounded-lg transition-all ${expandedId === item.id ? '' : 'line-clamp-3'}`}>"{item.content}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>

                <div className="pt-6 mt-4 border-t border-navy-50">
                    <Link
                        to="/dashboard"
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-neutral-50 hover:bg-neutral-100 text-navy-900 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all border border-navy-100"
                    >
                        Go to Full Dashboard <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BriefcaseDrawer;
