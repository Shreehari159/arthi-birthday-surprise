import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const EnvelopeAnimation = ({ onEnvelopeOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenedFully, setIsOpenedFully] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Timeline of envelope opening:
    // 1. Top flap flips open (0.6s)
    // 2. Card slides out of the envelope (1s)
    // 3. Screen transitions to the Greeting Letter (0.4s)
    setTimeout(() => {
      setIsOpenedFully(true);
      setTimeout(() => {
        onEnvelopeOpen();
      }, 1200);
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-4 select-none">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky-600/10 rounded-full filter blur-[150px]" />

      <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-sky-400 mb-12 text-center font-sans">
        A Special Message Just For You ✉
      </h1>

      {/* Envelope Container */}
      <div 
        onClick={handleOpen}
        className={`relative w-80 h-56 md:w-96 md:h-64 cursor-pointer perspective-1000 group transition-transform duration-500 ${
          isOpen ? '' : 'hover:scale-105 active:scale-95'
        }`}
      >
        {/* Envelope back */}
        <div className="absolute inset-0 bg-sky-950/80 border border-sky-500/30 rounded-lg shadow-2xl z-0" />

        {/* The Letter Card inside */}
        <motion.div
          animate={
            isOpenedFully 
              ? { y: -200, opacity: 0, scale: 1.05 } 
              : isOpen 
              ? { y: -60, scale: 0.95 } 
              : { y: 0 }
          }
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-x-4 bottom-4 top-4 bg-sky-100 rounded-md p-6 text-slate-800 shadow-inner flex flex-col items-center justify-center z-10 border border-sky-200"
        >
          <div className="w-12 h-0.5 bg-sky-400 mb-2" />
          <p className="font-handwritten text-xl text-sky-900 font-bold">To Arthi...</p>
          <p className="text-[10px] uppercase text-sky-600 tracking-widest mt-2">Click to unfold</p>
        </motion.div>

        {/* Envelope front covers (left/right/bottom folds) */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)',
            background: 'linear-gradient(135deg, #075985 0%, #0369a1 100%)',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            borderRadius: '8px'
          }}
        />

        {/* Envelope bottom flap overlap */}
        <div 
          className="absolute inset-0 z-25 pointer-events-none"
          style={{
            clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)',
            background: 'linear-gradient(0deg, #0c4a6e 0%, #075985 100%)',
            borderBottom: '1px solid rgba(14, 165, 233, 0.4)',
            borderRadius: '8px'
          }}
        />

        {/* Top Flap (flips open) */}
        <motion.div
          animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-sky-800 to-sky-700 border-t border-sky-500/20 z-30 preserve-3d origin-top"
          style={{
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            backfaceVisibility: 'hidden',
            borderRadius: '8px 8px 0 0'
          }}
        />

        {/* Heart Seal */}
        {!isOpen && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-950/90 hover:bg-slate-900 border border-sky-400 p-3 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.4)] z-40 transition-all duration-300 group-hover:scale-110 active:scale-90">
            <Heart className="w-6 h-6 text-sky-400 fill-sky-400/20 animate-pulse" />
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-slate-400/70 text-sm">
        {!isOpen ? "Tap the heart seal to open the letter" : "Opening..."}
      </div>
    </div>
  );
};

export default EnvelopeAnimation;
