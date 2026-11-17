import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GreetingLetter = ({ onLetterEnd }) => {
  const [currentLine, setCurrentLine] = useState(0);

  const letterLines = [
    "Dear Best Friend,",
    "Many more happy returns of the day.",
    "Life gives us many people,",
    "but very few become unforgettable.",
    "Thank you for every smile,",
    "every conversation,",
    "and every memory.",
    "Today is your day.",
    "So let's celebrate it in a special way.",
    "Happy Birthday ❤"
  ];

  useEffect(() => {
    if (currentLine >= letterLines.length) return;

    const timer = setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, 2000); // 2 seconds per line reveal

    return () => clearTimeout(timer);
  }, [currentLine]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 py-12 select-none">
      {/* Soft blue glowing background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-sky-600/10 rounded-full filter blur-[150px]" />

      <div className="w-full max-w-2xl bg-[#0b1329] border border-sky-500/20 rounded-2xl p-8 md:p-12 shadow-2xl relative">
        {/* Decorative corner items */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-sky-500/30" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-sky-500/30" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-sky-500/30" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-sky-500/30" />

        {/* Letter Text */}
        <div className="space-y-6 md:space-y-8 min-h-[380px] flex flex-col justify-center">
          {letterLines.map((line, index) => (
            <AnimatePresence key={index}>
              {index <= currentLine && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`font-handwritten text-xl md:text-3xl tracking-wide leading-relaxed ${
                    index === 0 
                      ? 'text-sky-300 font-bold text-left' 
                      : index === letterLines.length - 1 
                      ? 'text-sky-400 font-bold text-center mt-6 text-2xl md:text-4xl' 
                      : 'text-slate-100 text-left pl-4 md:pl-8'
                  }`}
                >
                  {line}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Action Button */}
        {currentLine >= letterLines.length - 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <button
              onClick={onLetterEnd}
              className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
            >
              Open Fairytale Book 📖
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GreetingLetter;
