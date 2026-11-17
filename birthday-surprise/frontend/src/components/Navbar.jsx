import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Film, Image as ImageIcon, Volume2, VolumeX, Menu, X, Sparkles, Compass } from 'lucide-react';
import { FLOW_STATES } from '../constants/flowStates.js';

const CHAPTERS = [
  { id: FLOW_STATES.LOGIN, name: '1. Lock Screen 🔐' },
  { id: FLOW_STATES.VERIFY, name: '2. The Question 💖' },
  { id: FLOW_STATES.ROLLERCOASTER, name: '3. Rollercoaster 🎢' },
  { id: FLOW_STATES.ENVELOPE, name: '4. Envelope Opening 💌' },
  { id: FLOW_STATES.LETTER, name: '5. Greeting Letter 📜' },
  { id: FLOW_STATES.BOOK, name: '6. Fairytale Book 📖' },
  { id: FLOW_STATES.GARDEN, name: '7. Blooming Garden 🌸' },
  { id: FLOW_STATES.CORRIDOR, name: '8. Memory Corridor ✨' },
  { id: FLOW_STATES.POLAROID, name: '9. Polaroid Wall 📍' },
  { id: FLOW_STATES.GALAXY, name: '10. Memory Galaxy 🌌' },
  { id: FLOW_STATES.CONSTELLATION, name: '11. Constellation ⭐' },
  { id: FLOW_STATES.FIREWORKS, name: '12. Fireworks Finale 🎆' },
  { id: FLOW_STATES.LETTERS, name: '13. Letters Mailbox 💌' },
  { id: FLOW_STATES.VIDEOS, name: '14. Video Reels 🎬' },
  { id: FLOW_STATES.SCRAPBOOK, name: '15. Full Scrapbook 📸' }
];

const Navbar = ({
  currentState,
  onNavigate,
  onOpenLetters,
  onOpenVideos,
  isAudioMuted,
  onToggleAudio
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show full nav in login/verify to preserve mystery unless user wants to jump
  const isLocked = currentState === FLOW_STATES.LOGIN || currentState === FLOW_STATES.VERIFY;

  return (
    <>
      {/* Top Floating Glass Pill */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl">
        <div className="glass-card bg-[#070c18]/80 border border-sky-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-3 sm:px-5 py-2.5 rounded-2xl flex items-center justify-between backdrop-blur-xl">
          
          {/* Brand Logo / Arthi Badge */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-xs sm:text-sm text-white font-sans tracking-wide">
              Arthi's Day 💙
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-500/20 px-2 py-0.5 rounded-full">
              Nov 18
            </span>
          </div>

          {/* Quick Direct Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Letters Button with glowing badge */}
            <button
              onClick={onOpenLetters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 text-rose-300 hover:text-white hover:border-rose-400 text-xs font-semibold transition-all active:scale-95 shadow-sm"
              title="Open Letters Mailbox"
            >
              <Mail className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">Letters</span>
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                8
              </span>
            </button>

            {/* Video Reels Button */}
            <button
              onClick={onOpenVideos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400 text-xs font-semibold transition-all active:scale-95 shadow-sm"
              title="Watch Video Reels"
            >
              <Film className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Reels</span>
              <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                5
              </span>
            </button>

            {/* Scrapbook Button */}
            <button
              onClick={() => onNavigate(FLOW_STATES.SCRAPBOOK)}
              className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400 text-xs font-semibold transition-all active:scale-95 shadow-sm"
              title="View Full Scrapbook"
            >
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Archive</span>
            </button>

            {/* Music Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono ${
                !isAudioMuted
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
              title={isAudioMuted ? "Unmute Music" : "Mute Music"}
            >
              {!isAudioMuted ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span className="hidden md:inline text-[10px]">MUSIC ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden md:inline text-[10px]">MUTED</span>
                </>
              )}
            </button>

            {/* Chapter Navigator Drawer Trigger */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:border-sky-500/40 transition-colors"
              title="Chapters Menu"
            >
              <Compass className="w-4 h-4 text-sky-400" />
            </button>
          </div>

        </div>
      </div>

      {/* Chapter Navigation Modal / Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#080d1a] border border-sky-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-sky-500/10 mb-4">
                <div>
                  <h3 className="font-bold text-white text-base font-sans">
                    Explore Experience Chapters ✨
                  </h3>
                  <p className="text-xs text-slate-400">
                    Jump directly to any memory chapter
                  </p>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chapter List */}
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {CHAPTERS.map((ch) => {
                  const isActive = currentState === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        onNavigate(ch.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                          : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{ch.name}</span>
                      {isActive && (
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded">
                          CURRENT
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
