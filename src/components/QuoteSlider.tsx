import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { QUOTES_LIST as QUOTES } from '../constants';
import { db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

const GRADIENTS = [
  'linear-gradient(135deg, #22c55e, #15803d)',
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #a855f7, #7e22ce)',
  'linear-gradient(135deg, #facc15, #f59e0b)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #ec4899, #e11d48)',
  'linear-gradient(135deg, #16a34a, #ca8a04)',
  'linear-gradient(135deg, #2563eb, #1e40af)',
  'linear-gradient(135deg, #f97316, #dc2626)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #d946ef, #a21caf)'
];

interface QuoteSliderProps {
  quotes?: string[]; // Optional override for displaying specific quotes
  title?: string;
}

const QuoteSlider: React.FC<QuoteSliderProps> = ({ quotes = QUOTES, title }) => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [colorIndex, setColorIndex] = useState(() => Math.floor(Math.random() * GRADIENTS.length));
  const [fade, setFade] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 8000); // 8 seconds per quote
  }, [quotes.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const changeSlide = (newIndex: number) => {
    setFade(false); // Start fade out
    setTimeout(() => {
      setIndex(newIndex);
      setColorIndex((c) => (c + 1) % GRADIENTS.length);
      setIsSaved(false); // reset saved status visually
      setFade(true); // Start fade in
      startTimer(); // reset interval
    }, 300); // Quick fade duration
  };

  const handleNext = () => {
    changeSlide((index + 1) % quotes.length);
  };

  const handlePrev = () => {
    changeSlide((index - 1 + quotes.length) % quotes.length);
  };

  const handleDotClick = (dotIndex: number) => {
    if (dotIndex !== index) {
      changeSlide(dotIndex);
    }
  };

  const handleSaveQuote = async () => {
    if (isSaving || isSaved) return;
    try {
      setIsSaving(true);
      const savedUserStr = localStorage.getItem('sms_user');
      if (!savedUserStr) return;

      const user = JSON.parse(savedUserStr);
      if (user.isGuest || !user.uid) return;

      const quoteText = quotes[index];
      const userRef = doc(db, 'users', user.uid);

      // We don't want to error if the user document is missing the array, arrayUnion handles creating it.
      await updateDoc(userRef, {
        savedQuotes: arrayUnion(quoteText)
      });
      setIsSaved(true);
    } catch (e) {
      console.error("Error saving quote", e);
    } finally {
      setIsSaving(false);
    }
  };

  const currentGradient = GRADIENTS[colorIndex];

  // For dots, if there are too many quotes (like the default 100+), 
  // we only show dots if length is reasonable (e.g. <= 15). 
  // Otherwise, we skip dots to avoid clutter.
  const showDots = quotes.length <= 15;

  return (
    <div
      className="w-full relative py-16 px-6 md:px-16 transition-colors duration-500 ease-in-out flex flex-col justify-center items-center text-center min-h-[350px] rounded-[2.5rem] shadow-xl overflow-hidden group"
      style={{ background: currentGradient, color: '#ffffff' }}
    >
      {title && (
        <h3 className="absolute top-6 left-8 text-sm font-black uppercase tracking-widest opacity-80 z-10">
          {title}
        </h3>
      )}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40 z-10"
        aria-label="Previous quote"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40 z-10"
        aria-label="Next quote"
      >
        <ChevronRight size={24} />
      </button>

      {/* Save Button */}
      <button
        onClick={handleSaveQuote}
        disabled={isSaved || isSaving}
        className={`absolute top-6 right-6 p-3 rounded-full flex items-center justify-center transition-all z-10 ${isSaved ? 'bg-white text-rose-500 shadow-lg scale-110' : 'bg-black/20 text-white hover:bg-black/40'}`}
        title={isSaved ? "Saved to favourites" : "Save this quote"}
      >
        <Heart size={20} className={isSaved ? "fill-rose-500" : ""} />
      </button>

      <div
        className={`max-w-4xl w-full transition-all duration-300 ease-in-out transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <p className="text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed font-medium italic px-4">
          "{quotes[index]}"
        </p>

        <div className="mt-8">
          <span className="block text-lg md:text-xl font-sans italic opacity-90">
            – Sathya Sai Baba
          </span>
          <span className="block mt-2 text-xs md:text-sm font-bold tracking-widest uppercase opacity-75 font-sans">
            #SAIQUOTESALLSHOULDKNOW
          </span>
        </div>
      </div>

      {/* Navigation Dots */}
      {showDots && quotes.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-2 h-2 rounded-full transition-all ${index === i ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to quote ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteSlider;
