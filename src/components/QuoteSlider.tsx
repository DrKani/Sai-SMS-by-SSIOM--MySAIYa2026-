
import React, { useState, useEffect } from 'react';
import { QUOTES_LIST as QUOTES } from '../constants';

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

const QuoteSlider: React.FC = () => {
  // Initialize with a random index for both quote and color
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [colorIndex, setColorIndex] = useState(() => Math.floor(Math.random() * GRADIENTS.length));
  const [fade, setFade] = useState(true);

  // Function to get a random index that is different from the current one
  const getRandomIndex = (currentIndex: number) => {
    if (QUOTES.length <= 1) return 0;
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * QUOTES.length);
    } while (nextIndex === currentIndex);
    return nextIndex;
  };

  const getRandomColorIndex = (currentIndex: number) => {
    if (GRADIENTS.length <= 1) return 0;
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * GRADIENTS.length);
    } while (nextIndex === currentIndex);
    return nextIndex;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out

      // Wait for fade out to complete before changing text/color
      setTimeout(() => {
        setIndex((prevIndex) => getRandomIndex(prevIndex));
        setColorIndex((prevColorIndex) => getRandomColorIndex(prevColorIndex));
        setFade(true); // Start fade in
      }, 500); // 0.5s fade duration matches CSS transition

    }, 8000); // 8 seconds per quote

    return () => clearInterval(interval);
  }, []);

  const currentGradient = GRADIENTS[colorIndex];

  return (
    <div
      className="w-full py-16 px-6 md:px-12 transition-colors duration-500 ease-in-out flex justify-center items-center text-center min-h-[350px] rounded-[2.5rem] shadow-xl overflow-hidden"
      style={{ background: currentGradient, color: '#ffffff' }}
    >
      <div
        className={`max-w-4xl transition-all duration-500 ease-in-out transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <p className="text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed font-medium italic">
          "{QUOTES[index]}"
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
    </div>
  );
};

export default QuoteSlider;
