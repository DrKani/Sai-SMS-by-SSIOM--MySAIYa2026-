
import React, { useState } from 'react';
import { Gamepad2, Puzzle, Sparkles, HelpCircle, Search } from 'lucide-react';
import WordSearchGame from '../components/games/WordSearchGame';
import QuoteGame from '../components/games/QuoteGame';
import SacredCrossword from '../components/games/SacredCrossword';
import ParikshyaGame from '../components/games/ParikshyaGame';

const GamesPage: React.FC = () => {
  const [gameMode, setGameMode] = useState<'puzzle' | 'quiz' | 'wordsearch' | 'crossword'>('puzzle');

  const handleWordSearchComplete = (score: number, _timeSaved: number) => {
    awardBadges('wordsearch', score);

    const userStr = localStorage.getItem('sms_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (!user.isGuest) {
        const key = `sms_briefcase_${user.uid}`;
        const briefcase = JSON.parse(localStorage.getItem(key) || '[]');
        const percentScore = Math.min(100, Math.round(score / 10));
        briefcase.push({
          id: Date.now().toString(),
          type: 'quiz_result',
          title: 'Word Search: Prasanthi Nilayam',
          content: { score: percentScore, rawScore: score },
          timestamp: new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(briefcase));
        window.dispatchEvent(new Event('storage'));
      }
    }
  };

  const handleWordSearchSaveCard = (card: { word: string; desc: string }) => {
    const userStr = localStorage.getItem('sms_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (!user.isGuest) {
        const key = `sms_briefcase_${user.uid}`;
        const briefcase = JSON.parse(localStorage.getItem(key) || '[]');
        const exists = briefcase.some((item: any) => item.type === 'word_card' && item.title === card.word);

        if (!exists) {
          briefcase.push({
            id: Date.now().toString(),
            type: 'word_card',
            title: card.word,
            content: card.desc,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem(key, JSON.stringify(briefcase));
          window.dispatchEvent(new Event('storage'));

          const cardCount = briefcase.filter((i: any) => i.type === 'word_card').length;
          if (cardCount >= 30) {
            awardBadges('wordsearch');
          }
        }
      }
    }
  };

  const awardBadges = (type: 'puzzle' | 'wordsearch', score?: number) => {
    const badges = JSON.parse(localStorage.getItem('sms_badges') || '[]');
    const existing = badges.map((b: any) => b.title);

    if (type === 'wordsearch') {
      if (!existing.includes('Pilgrim of Prasanthi')) {
        badges.push({ title: 'Pilgrim of Prasanthi', earnedAt: new Date().toISOString() });
      }
      if (score && score > 300 && !existing.includes('Golden Victory')) {
        badges.push({ title: 'Golden Victory', earnedAt: new Date().toISOString(), type: 'elite' });
      }
      const userStr = localStorage.getItem('sms_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const key = `sms_briefcase_${user.uid}`;
        const briefcase = JSON.parse(localStorage.getItem(key) || '[]');
        const cardCount = briefcase.filter((i: any) => i.type === 'word_card').length;
        if (cardCount >= 30 && !existing.includes('Sai Scholar')) {
          badges.push({ title: 'Sai Scholar', earnedAt: new Date().toISOString(), type: 'elite' });
        }
      }
    }
    localStorage.setItem('sms_badges', JSON.stringify(badges));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16 font-poppins">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 text-gold-700 rounded-full border border-gold-200">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Interactive Spiritual Hub 2026</span>
        </div>
        <h1 className="font-serif text-6xl font-bold text-navy-900 leading-tight">Sai SMS Games</h1>
        <p className="text-navy-500 max-w-2xl mx-auto font-medium">Life is a Game, Play it! BABA.<br /><br />Explore. Experience. Evolve.&nbsp; Engage the Mind, Awaken the Heart in this series of simple Games structured to assist you in learning the Sathya Sai Teachings and living the values</p>
      </header>

      <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
        <button
          onClick={() => { setGameMode('puzzle'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all border-2 ${gameMode === 'puzzle' ? 'bg-navy-900 text-gold-500 border-navy-900 shadow-2xl scale-105' : 'bg-white text-navy-300 border-navy-50 hover:border-navy-100'}`}
        >
          <Puzzle size={18} /> Quotescapes
        </button>
        <button
          onClick={() => { setGameMode('quiz'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all border-2 ${gameMode === 'quiz' ? 'bg-navy-900 text-gold-500 border-navy-900 shadow-2xl scale-105' : 'bg-white text-navy-300 border-navy-50 hover:border-navy-100'}`}
        >
          <HelpCircle size={18} /> Sai SMS Parikshya
        </button>
        <button
          onClick={() => { setGameMode('wordsearch'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all border-2 ${gameMode === 'wordsearch' ? 'bg-navy-900 text-gold-500 border-navy-900 shadow-2xl scale-105' : 'bg-white text-navy-300 border-navy-50 hover:border-navy-100'}`}
        >
          <Search size={18} /> Word Search
        </button>
        <button
          onClick={() => { setGameMode('crossword'); }}
          className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all border-2 ${gameMode === 'crossword' ? 'bg-navy-900 text-gold-500 border-navy-900 shadow-2xl scale-105' : 'bg-white text-navy-300 border-navy-50 hover:border-navy-100'}`}
        >
          <Gamepad2 size={18} /> Sacred Crossword
        </button>
      </nav>

      <div className="w-full max-w-7xl mx-auto">
        {gameMode === 'wordsearch' ? (
          <WordSearchGame
            onComplete={handleWordSearchComplete}
            onSaveCard={handleWordSearchSaveCard}
          />
        ) : gameMode === 'quiz' ? (
          <ParikshyaGame />
        ) : gameMode === 'crossword' ? (
          <SacredCrossword />
        ) : (
          <QuoteGame />
        )}
      </div>
    </div>
  );
};

export default GamesPage;
