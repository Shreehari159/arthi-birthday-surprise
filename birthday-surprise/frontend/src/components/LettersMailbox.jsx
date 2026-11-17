import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Shuffle, ArrowRight, ArrowLeft, Heart, X, Copy, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { LETTERS } from '../data/lettersData.js';

const LettersMailbox = ({ onContinue, isModal = false, onClose = null }) => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Floating ambient sparkles
  const [sparkles, setSparkles] = useState([]);
  useEffect(() => {
    const list = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2
    }));
    setSparkles(list);
  }, []);

  const openLetter = (letter) => {
    setIsOpeningEnvelope(true);
    setSelectedLetter(letter);
    setTimeout(() => {
      setIsOpeningEnvelope(false);
    }, 500);
  };

  const handleRandomLetter = () => {
    const available = LETTERS.filter(l => !selectedLetter || l.id !== selectedLetter.id);
    const random = available[Math.floor(Math.random() * available.length)];
    openLetter(random);
  };

  const handleNextLetter = () => {
    if (!selectedLetter) return;
    const currentIdx = LETTERS.findIndex(l => l.id === selectedLetter.id);
    const nextIdx = (currentIdx + 1) % LETTERS.length;
    openLetter(LETTERS[nextIdx]);
  };

  const handlePrevLetter = () => {
    if (!selectedLetter) return;
    const currentIdx = LETTERS.findIndex(l => l.id === selectedLetter.id);
    const prevIdx = (currentIdx - 1 + LETTERS.length) % LETTERS.length;
    openLetter(LETTERS[prevIdx]);
  };

  const handleCopyText = () => {
    if (!selectedLetter) return;
    const fullText = `${selectedLetter.title}\n\n` + selectedLetter.paragraphs.join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative w-full ${isModal ? 'h-full max-h-[90vh] overflow-y-auto' : 'min-h-screen py-12 px-4'} bg-slate-950 text-slate-100 flex flex-col justify-between select-none`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-600/10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-sky-600/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Floating Sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute bg-rose-300 rounded-full opacity-40 animate-pulse pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`
          }}
        />
      ))}

      {/* Header Bar */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-rose-400 bg-rose-950/50 border border-rose-500/20 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-rose-400 animate-bounce" />
              Special Delivery For Arthi 💌
            </span>
            <span className="text-xs text-slate-400 font-mono">({LETTERS.length} Heartfelt Letters)</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-2 tracking-wide font-sans">
            Letters From The Heart ✨
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
            Click any envelope to unseal a letter, or hit the random button to let fate choose your message.
          </p>
        </div>

        {/* Quick action controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRandomLetter}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all active:scale-95 text-xs md:text-sm"
          >
            <Shuffle className="w-4 h-4" />
            Pick A Random Mail 🎲
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Mailbox Grid (When no letter is open, or background view) */}
      {!selectedLetter ? (
        <div className="relative z-10 max-w-5xl mx-auto w-full my-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {LETTERS.map((letter, idx) => (
              <motion.div
                key={letter.id}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openLetter(letter)}
                className={`relative group cursor-pointer rounded-2xl p-5 border bg-gradient-to-br ${letter.gradient} ${letter.borderColor} backdrop-blur-md shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all flex flex-col justify-between min-h-[220px] overflow-hidden`}
              >
                {/* Vintage Postal Stamp in top-right */}
                <div className="absolute top-3 right-3 w-10 h-10 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center bg-slate-900/40 text-xl shadow-inner group-hover:rotate-6 transition-transform">
                  {letter.stamp}
                </div>

                {/* Wax Seal Badge */}
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                    style={{ backgroundColor: letter.sealColor }}
                  >
                    💌
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                    MAIL #{idx + 1}
                  </span>
                </div>

                {/* Letter Header */}
                <div className="space-y-1.5 my-2">
                  <h3 className={`font-bold text-base md:text-lg text-white group-hover:${letter.textColor} transition-colors line-clamp-1`}>
                    {letter.title}
                  </h3>
                  <p className="text-slate-300/80 text-xs line-clamp-3 leading-relaxed italic font-sans">
                    "{letter.preview}"
                  </p>
                </div>

                {/* Footer status / tags */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px] text-rose-300/80">{letter.date}</span>
                  <div className="flex items-center gap-1 text-sky-400 group-hover:translate-x-1 transition-transform font-semibold text-xs">
                    Read Letter <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Image attachment indicator */}
                {letter.image && (
                  <div className="absolute bottom-2 left-2 bg-pink-950/80 border border-pink-500/30 text-[9px] font-mono text-pink-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-2.5 h-2.5" /> Photo Poster
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom Callout banner */}
          <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-rose-950/30 to-sky-950/30 border border-rose-500/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-rose-500/20 text-rose-400">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">
                  "Words may never fully explain how much I care about you."
                </p>
                <p className="text-xs text-slate-400">
                  Every letter here was written straight from the heart.
                </p>
              </div>
            </div>

            {onContinue && !isModal && (
              <button
                onClick={onContinue}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 text-xs whitespace-nowrap"
              >
                Continue to Video Reels 🎬
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Detailed Opened Letter View */
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLetter.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 max-w-3xl mx-auto w-full my-auto"
          >
            {/* Top Navigation between letters */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={() => setSelectedLetter(null)}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white bg-slate-900/70 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Mailbox
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLetter}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Previous Letter"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {LETTERS.findIndex(l => l.id === selectedLetter.id) + 1} of {LETTERS.length}
                </span>
                <button
                  onClick={handleNextLetter}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Next Letter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* The Vintage Letter Paper Card */}
            <div className="relative bg-[#0d1424] border border-rose-500/20 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(244,63,94,0.15)] overflow-hidden">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-rose-500/30" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-rose-500/30" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-rose-500/30" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-rose-500/30" />

              {/* Watermark Stamp in background */}
              <div className="absolute right-6 top-6 text-7xl opacity-5 pointer-events-none select-none font-serif">
                {selectedLetter.stamp}
              </div>

              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-rose-500/10 pb-6 mb-6 gap-3">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase bg-rose-950/60 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                    {selectedLetter.date}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-wide font-sans">
                    {selectedLetter.title}
                  </h1>
                  {selectedLetter.subtitle && (
                    <p className="text-xs text-rose-300/80 italic mt-0.5">
                      {selectedLetter.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/50 text-xs text-slate-300 hover:text-white hover:border-rose-500/30 transition-all active:scale-95"
                    title="Copy letter text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleRandomLetter}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/50 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Random letter"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* If letter has an attached image poster (from user uploads) */}
              {selectedLetter.image && (
                <div className="mb-6 p-3 rounded-2xl bg-slate-950/60 border border-rose-500/20 flex flex-col sm:flex-row items-center gap-4">
                  <div
                    onClick={() => setShowImageZoom(true)}
                    className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden border border-rose-500/30 cursor-pointer shadow-md group relative flex-shrink-0"
                  >
                    <img
                      src={selectedLetter.image}
                      alt={selectedLetter.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[9px] font-mono text-white bg-slate-900/80 px-2 py-0.5 rounded">
                        ZOOM
                      </span>
                    </div>
                  </div>
                  <div className="text-left space-y-1">
                    <p className="text-xs font-semibold text-rose-300 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> Original Birthday Poster Attached
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Tap the thumbnail to view the full resolution keepsake card with heartfelt graphics and frames.
                    </p>
                    <button
                      onClick={() => setShowImageZoom(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:underline pt-1"
                    >
                      View Full Poster <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Letter Paragraphs */}
              <div className="space-y-4 md:space-y-6 text-slate-200 text-sm md:text-base leading-relaxed font-sans max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedLetter.paragraphs.map((p, idx) => (
                  <p key={idx} className="whitespace-pre-line tracking-wide">
                    {p}
                  </p>
                ))}
              </div>

              {/* Sign-off / Signature */}
              <div className="mt-8 pt-6 border-t border-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30 animate-pulse" />
                  <span className="text-xs text-slate-400 font-handwritten text-lg text-rose-300">
                    Always & forever in my heart
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRandomLetter}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl transition-all"
                  >
                    🎲 Read Another Mail
                  </button>
                  <button
                    onClick={() => setSelectedLetter(null)}
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                  >
                    All Letters 📬
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Poster Zoom Modal */}
      <AnimatePresence>
        {showImageZoom && selectedLetter?.image && (
          <div
            className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageZoom(false)}
          >
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative max-w-lg w-full max-h-[90vh] bg-slate-900 border border-rose-500/30 rounded-2xl p-2 shadow-2xl flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedLetter.image}
                alt={selectedLetter.title}
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LettersMailbox;
