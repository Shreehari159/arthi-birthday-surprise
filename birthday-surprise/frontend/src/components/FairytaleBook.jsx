import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FairytaleBook = ({ onBookEnd, realPhotos }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Poetic story snippets mapped to pages
  const storyPages = [
    {
      text: "Once upon a time,\nthere was a girl whose smile\ncould brighten even the quietest day.",
      title: "Chapter I: The Magic Smile"
    },
    {
      text: "Every chapter of life\nbecame a little more beautiful\nbecause she was part of it.",
      title: "Chapter II: Shared Wonders"
    },
    {
      text: "Some people become memories.\nSome become stories.\nA few become both.",
      title: "Chapter III: The Unforgettable"
    },
    {
      text: "And in the grand book of time,\nthe best pages are the ones\nwe shared together.",
      title: "Chapter IV: Bond of Eternity"
    },
    {
      text: "For she is not just a year older,\nbut a year more magical,\na year more wonderful.",
      title: "Chapter V: Magic Unfolds"
    },
    {
      text: "So here is to the laughter,\nthe secrets, and the endless bond\nthat time can never erase.",
      title: "Chapter VI: The Story Continues"
    }
  ];

  // Safeguard if realPhotos array is empty or small
  const getPhoto = (idx) => {
    if (!realPhotos || realPhotos.length === 0) {
      return `https://picsum.photos/id/${30 + idx}/400/500`;
    }
    return realPhotos[idx % realPhotos.length];
  };

  const handleNext = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      onBookEnd();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between py-12 px-4 bg-slate-950 overflow-hidden select-none">
      {/* Background magical ambient gold/blue glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-sky-600/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="text-center z-10 pointer-events-none">
        <h2 className="text-sm font-mono tracking-widest text-sky-400 uppercase mb-2">
          Chapter V: The Fairytale Book
        </h2>
        <p className="text-slate-400 text-xs md:text-sm">
          A collection of real-life moments written in stars
        </p>
      </div>

      {/* 3D Book Stage */}
      <div className="w-full max-w-4xl flex justify-center items-center my-6 z-10 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ rotateY: -30, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col md:flex-row bg-[#080d1a] border border-sky-500/20 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(14,165,233,0.15)] min-h-[420px]"
          >
            {/* Left Page (Text / Poetry) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-sky-500/10 bg-slate-900/40 relative">
              <span className="text-[10px] font-mono text-sky-400 tracking-wider">
                {storyPages[currentPage].title}
              </span>
              
              <div className="my-8">
                <p className="font-handwritten text-2xl md:text-4xl text-slate-100 leading-relaxed whitespace-pre-line text-left md:pl-4">
                  {storyPages[currentPage].text}
                </p>
              </div>

              <div className="flex justify-between items-center text-slate-500 text-xs font-mono">
                <span>PAGE {currentPage * 2 + 1}</span>
                <span className="w-8 h-0.5 bg-sky-500/20" />
              </div>
            </div>

            {/* Right Page (Photo) */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between items-center bg-[#070b16] relative">
              {/* Photo Frame */}
              <div className="w-full flex-1 flex items-center justify-center p-2">
                <div className="relative p-3 bg-slate-950 border border-sky-500/30 rounded-xl shadow-inner max-h-[300px] aspect-[4/5] overflow-hidden group">
                  <div className="absolute inset-0 bg-sky-500/5 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={getPhoto(currentPage)}
                    alt={`Real Photo ${currentPage + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-sky-500/20"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/id/${40 + currentPage}/300/400`;
                    }}
                  />
                </div>
              </div>

              <div className="w-full flex justify-between items-center text-slate-500 text-xs font-mono mt-4">
                <span className="w-8 h-0.5 bg-sky-500/20" />
                <span>PAGE {currentPage * 2 + 2}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Book Navigation controls */}
      <div className="flex items-center gap-6 z-10">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="p-3 rounded-xl bg-slate-900 border border-sky-500/20 text-sky-400 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all flex items-center gap-2"
        >
          {currentPage === storyPages.length - 1 ? "Enter Blooming Garden 🌸" : "Turn Page"}
          {currentPage < storyPages.length - 1 && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default FairytaleBook;
