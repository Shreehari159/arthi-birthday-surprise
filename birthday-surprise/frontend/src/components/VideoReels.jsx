import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Play, Pause, Volume2, VolumeX, Maximize2, X, Download, Sparkles, ChevronRight } from 'lucide-react';
import { ALL_VIDEOS } from '../data/mediaData.js';

const VideoReels = ({ onContinue, isModal = false, onClose = null }) => {
  const [activeVideo, setActiveVideo] = useState(ALL_VIDEOS[0]?.url || '');
  const [activeTitle, setActiveTitle] = useState(ALL_VIDEOS[0]?.title || 'Special Memory Reel');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const videoPlayerRef = useRef(null);

  const handleSelectVideo = (video) => {
    setActiveVideo(video.url);
    setActiveTitle(video.title);
    setIsPlaying(true);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.load();
      videoPlayerRef.current.play().catch(e => console.log('Autoplay:', e));
    }
  };

  const togglePlay = () => {
    if (videoPlayerRef.current) {
      if (videoPlayerRef.current.paused) {
        videoPlayerRef.current.play();
        setIsPlaying(true);
      } else {
        videoPlayerRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoPlayerRef.current) {
      const target = !videoPlayerRef.current.muted;
      videoPlayerRef.current.muted = target;
      setIsMuted(target);
    }
  };

  return (
    <div className={`relative w-full ${isModal ? 'max-h-[85vh] overflow-y-auto' : 'min-h-screen py-14 px-4'} bg-slate-950 text-slate-100 flex flex-col justify-between select-none`}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/10 rounded-full filter blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto w-full mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-sky-400 bg-sky-950/50 border border-sky-500/20 px-3 py-1 rounded-full uppercase flex items-center gap-1.5 w-max">
            <Film className="w-3 h-3 text-sky-400" />
            Chapter XII: Cinematic Video Reels
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-2 tracking-wide font-sans">
            Moving Memories & Video Reels 🎬
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Real captured moments, smiles, and laughter preserved in motion.
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Video Cinema Theater */}
      <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 my-auto">
        {/* Main Cinema Screen (2 Cols) */}
        <div className="lg:col-span-2 bg-[#080d1a] border border-sky-500/20 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col justify-between">
          <div className="relative w-full aspect-video md:aspect-[16/10] bg-black rounded-2xl overflow-hidden border border-sky-500/10 flex items-center justify-center group">
            <video
              ref={videoPlayerRef}
              src={activeVideo}
              controls
              playsInline
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Quick Cinema Controls Overlay when paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer backdrop-blur-[2px] transition-all group-hover:bg-black/20"
              >
                <div className="w-16 h-16 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-[0_0_25px_rgba(14,165,233,0.6)] group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Under screen details */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                NOW SCREENING
              </p>
              <h3 className="text-lg md:text-xl font-bold text-white capitalize mt-0.5">
                {activeTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={activeVideo}
                download
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-sky-500/20 hover:border-sky-400/40 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                Download Reel
              </a>
            </div>
          </div>
        </div>

        {/* Video Playlist Sidebar (1 Col) */}
        <div className="bg-[#080d1a] border border-sky-500/20 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sky-500/10 mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Reel Gallery ({ALL_VIDEOS.length})
              </span>
              <span className="text-[10px] text-sky-400 font-mono">1080p HD</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {ALL_VIDEOS.map((vid, index) => {
                const isSelected = activeVideo === vid.url;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectVideo(vid)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-sky-950/60 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                        : 'bg-slate-900/50 border-sky-500/10 hover:border-sky-500/30 text-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-sky-500/20 flex items-center justify-center flex-shrink-0 text-sky-400">
                      {isSelected && isPlaying ? (
                        <Pause className="w-5 h-5 text-emerald-400 animate-pulse" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-sky-300' : 'text-white'}`}>
                        {vid.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Memory Video #{index + 1}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-sky-500/10 mt-4">
            <p className="text-[11px] text-slate-400 leading-relaxed italic text-center">
              "Some memories can only be told through smiles in motion." 🌸
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Continue Bar */}
      {onContinue && !isModal && (
        <div className="relative z-10 max-w-5xl mx-auto w-full mt-10 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Up Next: The Grand Scrapbook Archive
          </span>
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 text-xs sm:text-sm"
          >
            Enter Final Scrapbook 📸 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoReels;
