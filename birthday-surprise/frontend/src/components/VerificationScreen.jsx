import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const VerificationScreen = ({ onVerifySuccess }) => {
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [responseMsg, setResponseMsg] = useState('');
  const [isAngry, setIsAngry] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const moveNoButton = () => {
    // Generate random coordinates inside a safe zone
    const randomX = (Math.random() - 0.5) * 200; // -100px to 100px
    const randomY = (Math.random() - 0.5) * 150; // -75px to 75px
    setNoBtnPos({ x: randomX, y: randomY });
  };

  const handleNoHover = () => {
    moveNoButton();
    setIsAngry(true);
    setResponseMsg("How dare you? 😤");
    setTimeout(() => setIsAngry(false), 800);
  };

  const handleNoClick = () => {
    // For mobile/touch where hover isn't active
    moveNoButton();
    setIsAngry(true);
    setResponseMsg("How dare you? 😤 Get inside right now.");
    
    // Auto-proceed after 2 seconds anyway with a playful nudge
    setTimeout(() => {
      handleYesClick();
    }, 2000);
  };

  const handleYesClick = () => {
    setIsSuccess(true);
    setResponseMsg("Good Gurl ❤");
    setTimeout(() => {
      onVerifySuccess();
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-4">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/20 rounded-full filter blur-[120px]" />

      <div className="relative glass-card max-w-sm w-full p-8 text-center border border-indigo-500/20 z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold tracking-wider text-slate-100 mb-8 font-sans"
        >
          Do you want to enter? 🤔
        </motion.h2>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-6 mb-8 h-20 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYesClick}
            className="px-8 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
          >
            YES
          </motion.button>

          <motion.button
            animate={{ 
              x: noBtnPos.x, 
              y: noBtnPos.y,
              rotate: isAngry ? [0, -10, 10, -10, 10, 0] : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onMouseEnter={handleNoHover}
            onClick={handleNoClick}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700/50"
          >
            NO
          </motion.button>
        </div>

        {/* Playful reactions */}
        <div className="h-16 flex items-center justify-center">
          {responseMsg && (
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={responseMsg}
              className={`text-lg font-bold ${
                isSuccess ? 'text-emerald-400' : 'text-sky-300'
              }`}
            >
              {responseMsg}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
