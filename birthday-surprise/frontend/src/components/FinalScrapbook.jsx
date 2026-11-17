import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, Heart, Play, Pause, Download, ChevronLeft, ChevronRight, X, Film, Mail, Image as ImageIcon, Search, Filter, Sparkles } from 'lucide-react';
import { ALL_VIDEOS } from '../data/mediaData.js';
import { LETTERS } from '../data/lettersData.js';
import LettersMailbox from './LettersMailbox.jsx';

const FinalScrapbook = ({ onReset, allPhotos = [], audioRef }) => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('photos'); // 'photos', 'videos', 'letters'
  const [photoFilter, setPhotoFilter] = useState('all'); // 'all', 'real', 'childhood', 'artistic'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // { type: 'photo' | 'video', url, title, idx }
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [activeLetterModal, setActiveLetterModal] = useState(null);

  // Floating Hearts background canvas
  useEffect(() => {
    if (audioRef && audioRef.current) {
      setIsPlaying(!audioRef.current.paused);
      audioRef.current.volume = volume;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const hearts = [];
    const numHearts = window.innerWidth < 768 ? 16 : 32;

    class FloatingHeart {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 10 + 6;
        this.speedY = Math.random() * 1.2 + 0.5;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.3;
        this.alpha = Math.random() * 0.35 + 0.15;
        this.angle = Math.random() * 0.2 - 0.1;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < 120) this.alpha -= 0.004;
        if (this.y < -20 || this.alpha <= 0) this.reset();
      }

      draw() {
        const s = this.size;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(14, 165, 233, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#0ea5e9';

        ctx.beginPath();
        ctx.moveTo(0, -s / 4);
        ctx.bezierCurveTo(s / 2, -s, s, -s / 3, 0, s);
        ctx.bezierCurveTo(-s, -s / 3, -s / 2, -s, 0, -s / 4);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < numHearts; i++) {
      hearts.push(new FloatingHeart());
    }

    const drawLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(1, '#07050a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hearts.forEach(h => {
        h.update();
        h.draw();
      });

      animationId = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [audioRef, volume]);

  const handleToggleMusic = () => {
    if (audioRef && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => console.log(err));
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef && audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter(url => {
      const lower = url.toLowerCase();
      // Search query check
      if (searchQuery && !lower.includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Tag filter
      if (photoFilter === 'real') {
        return lower.includes('arthu') || lower.includes('whatsapp image');
      }
      if (photoFilter === 'childhood') {
        return lower.includes('kid_');
      }
      if (photoFilter === 'artistic') {
        return !lower.includes('arthu') && !lower.includes('kid_') && !lower.includes('whatsapp image');
      }
      return true;
    });
  }, [allPhotos, photoFilter, searchQuery]);

  const handlePrevItem = () => {
    if (!selectedItem) return;
    if (selectedItem.type === 'photo') {
      const nextIdx = (selectedItem.idx - 1 + filteredPhotos.length) % filteredPhotos.length;
      setSelectedItem({
        type: 'photo',
        url: filteredPhotos[nextIdx],
        idx: nextIdx,
        title: filteredPhotos[nextIdx].split('/').pop().split('.')[0].replace(/[-_]/g, ' ')
      });
    } else if (selectedItem.type === 'video') {
      const nextIdx = (selectedItem.idx - 1 + ALL_VIDEOS.length) % ALL_VIDEOS.length;
      setSelectedItem({
        type: 'video',
        url: ALL_VIDEOS[nextIdx].url,
        idx: nextIdx,
        title: ALL_VIDEOS[nextIdx].title
      });
    }
  };

  const handleNextItem = () => {
    if (!selectedItem) return;
    if (selectedItem.type === 'photo') {
      const nextIdx = (selectedItem.idx + 1) % filteredPhotos.length;
      setSelectedItem({
        type: 'photo',
        url: filteredPhotos[nextIdx],
        idx: nextIdx,
        title: filteredPhotos[nextIdx].split('/').pop().split('.')[0].replace(/[-_]/g, ' ')
      });
    } else if (selectedItem.type === 'video') {
      const nextIdx = (selectedItem.idx + 1) % ALL_VIDEOS.length;
      setSelectedItem({
        type: 'video',
        url: ALL_VIDEOS[nextIdx].url,
        idx: nextIdx,
        title: ALL_VIDEOS[nextIdx].title
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 overflow-y-auto select-none flex flex-col justify-between">
      {/* Canvas Floating Hearts */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none z-0" />

      {/* Main Scrapbook Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 w-full z-10 relative">

        {/* Hero Section Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono tracking-widest text-sky-400 bg-sky-950/60 border border-sky-500/30 px-3.5 py-1 rounded-full uppercase">
            Chapter XIII: The Complete Archive 📸
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wide text-white mt-4 font-sans leading-tight">
            Arthi's Scrapbook of Memories 💙
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            Every smile, every photo, every video reel, and every heartfelt letter preserved for all time.
          </p>

          {/* Tab Selector: Photos | Videos | Letters */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'photos'
                  ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-sky-500/10'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              All Photos ({allPhotos.length})
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'videos'
                  ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-sky-500/10'
              }`}
            >
              <Film className="w-4 h-4" />
              Video Reels ({ALL_VIDEOS.length})
            </button>

            <button
              onClick={() => setActiveTab('letters')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'letters'
                  ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-sky-500/10'
              }`}
            >
              <Mail className="w-4 h-4" />
              Heartfelt Letters ({LETTERS.length})
            </button>
          </div>
        </div>

        {/* TAB 1: ALL PHOTOS */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-sky-500/15 p-4 rounded-2xl backdrop-blur-md">
              {/* Category Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-sky-400" /> Filter:
                </span>
                {[
                  { id: 'all', label: `All (${allPhotos.length})` },
                  { id: 'real', label: 'Arthi Moments' },
                  { id: 'childhood', label: 'Childhood Memories' },
                  { id: 'artistic', label: 'Creative Portraits' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setPhotoFilter(f.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      photoFilter === f.id
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search photo name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-sky-500/20 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Thumbnail Masonry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredPhotos.map((photoUrl, idx) => {
                const title = photoUrl.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedItem({ type: 'photo', url: photoUrl, title, idx })}
                    className="aspect-square bg-slate-900 border border-sky-500/10 rounded-xl overflow-hidden cursor-pointer hover:border-sky-400/40 transition-all duration-300 shadow-md group relative"
                  >
                    <img
                      src={photoUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/id/${(idx + 1) % 100}/200/200`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-2.5 transition-opacity">
                      <span className="text-[10px] font-mono text-sky-400 font-semibold tracking-wider">
                        EXPAND PHOTO ✨
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No photos found matching your search. Try another filter!
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VIDEO REELS */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_VIDEOS.map((vid, index) => (
                <div
                  key={index}
                  className="bg-[#080d1a] border border-sky-500/20 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group"
                >
                  <div
                    onClick={() => setSelectedItem({ type: 'video', url: vid.url, title: vid.title, idx: index })}
                    className="relative aspect-video bg-black cursor-pointer flex items-center justify-center overflow-hidden"
                  >
                    <video
                      src={vid.url}
                      className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 flex items-center justify-center transition-all">
                      <div className="w-14 h-14 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 ml-1" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-slate-950/80 px-2 py-0.5 rounded text-sky-300 border border-sky-500/20">
                      REEL #{index + 1}
                    </span>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm capitalize truncate max-w-[180px]">
                        {vid.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">Special Birthday Video</p>
                    </div>

                    <a
                      href={vid.url}
                      download
                      className="p-2 rounded-xl bg-slate-900 border border-sky-500/20 text-sky-400 hover:text-white hover:border-sky-400/40 transition-colors"
                      title="Download video"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HEARTFELT LETTERS */}
        {activeTab === 'letters' && (
          <LettersMailbox isModal={false} />
        )}

        {/* Heartfelt Quote Banner */}
        <div className="max-w-2xl mx-auto mt-20 text-center glass-card p-8 md:p-12 border border-sky-500/20 shadow-2xl relative">
          <div className="space-y-6">
            <Heart className="w-10 h-10 text-rose-400 fill-rose-400/20 mx-auto animate-pulse mb-3" />
            <p className="text-xl md:text-2xl font-semibold tracking-wide text-slate-100 font-sans leading-relaxed">
              "You are my best friend, my safest place, and always will be."
            </p>
            <p className="text-base md:text-lg font-medium text-slate-300 font-sans leading-relaxed">
              "Thank you for being such a beautiful part of my life."
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-sky-400 blue-glow pt-4">
              Happy Birthday, Arthi! 💙✨
            </h2>
          </div>
        </div>

      </div>

      {/* Control Deck (Fixed/Persistent at the bottom) */}
      <div className="w-full z-20 relative bg-[#070b16]/90 border-t border-sky-500/15 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-mono tracking-widest text-sky-400 font-bold">
            ARTHI'S SURPRISE: ARCHIVE LOADED 💙
          </p>
          <p className="text-[9px] text-slate-400">
            {allPhotos.length} Photos &bull; {ALL_VIDEOS.length} Videos &bull; {LETTERS.length} Heartfelt Letters
          </p>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-3 w-full max-w-xs justify-center">
          <button
            onClick={handleToggleMusic}
            className="p-2.5 rounded-xl bg-slate-950 border border-sky-500/20 text-sky-400 hover:bg-slate-900 active:scale-95 transition-all shadow-md"
            title={isPlaying ? "Mute" : "Play"}
          >
            {isPlaying ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
          
          <div className="flex-1 flex items-center gap-2">
            <span className="text-[9px] font-mono text-slate-400">VOL</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
        </div>

        {/* Replay surprise button */}
        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-xl bg-slate-950 border border-sky-500/20 text-sky-400 hover:bg-slate-900 hover:border-sky-400/40 active:scale-95 transition-all shadow-md flex items-center gap-1.5 font-sans font-bold text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Relive From Beginning
        </button>
      </div>

      {/* Lightbox Overlay (Handles both photo and video) */}
      <AnimatePresence>
        {selectedItem !== null && (
          <div
            className="fixed inset-0 bg-slate-950/95 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedItem(null)}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700/50 text-slate-400 hover:text-white transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative max-w-4xl w-full bg-[#080d1a] border border-sky-500/20 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                onClick={handlePrevItem}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/80 border border-sky-500/20 text-sky-400 hover:bg-slate-900 transition-colors z-40"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Media Container */}
              <div className="w-full max-h-[520px] h-[60vh] flex items-center justify-center rounded-xl overflow-hidden bg-slate-950/80 border border-sky-500/10 relative">
                {selectedItem.type === 'photo' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/id/100/600/600`;
                    }}
                  />
                ) : (
                  <video
                    src={selectedItem.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextItem}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/80 border border-sky-500/20 text-sky-400 hover:bg-slate-900 transition-colors z-40"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Caption & Download Bar */}
              <div className="w-full flex items-center justify-between mt-4 px-2">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 bg-slate-950/60 px-2.5 py-1 rounded border border-sky-500/20 uppercase tracking-wider">
                    {selectedItem.type === 'photo' ? `PHOTO #${selectedItem.idx + 1} 💙` : `VIDEO: ${selectedItem.title}`}
                  </span>
                </div>

                <a
                  href={selectedItem.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs shadow-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FinalScrapbook;
