import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MemoryCorridor = ({ onCorridorEnd, corridorPhotos }) => {
  // Safeguard in case photos array is empty
  const getPhotosList = () => {
    if (!corridorPhotos || corridorPhotos.length === 0) {
      return Array.from({ length: 10 }).map((_, i) => ({
        url: `https://picsum.photos/id/${50 + i}/300/400`,
        caption: `Memory Moment #${i + 1}`
      }));
    }
    return corridorPhotos.map((url, i) => ({
      url,
      caption: url.split('/').pop().split('.')[0].replace(/[-_]/g, ' ')
    }));
  };

  const list = getPhotosList();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 py-20 px-4 select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-sky-600/5 rounded-full filter blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-indigo-600/5 rounded-full filter blur-[120px]" />

      {/* Corridor HUD */}
      <div className="max-w-2xl mx-auto text-center mb-24 z-10 relative">
        <span className="text-[10px] font-mono tracking-widest text-sky-400 bg-sky-950/50 border border-sky-500/20 px-3 py-1 rounded-full uppercase">
          Chapter VII: Memory Corridor
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-white mt-4 font-sans leading-tight">
          Stroll Through the Corridor 🌌
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-3">
          Scroll down to walk through the floating corridors of her memories.
        </p>
      </div>

      {/* Floating Corridor items */}
      <div className="max-w-3xl mx-auto relative space-y-36">
        {/* Infinite guide wire */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-sky-500/10 via-indigo-500/20 to-sky-500/10 border-dashed border-sky-500/20" />

        {list.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={index}
              className={`w-full flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}
            >
              {/* Scroll Triggered Floating Photo Card */}
              <motion.div
                initial={{ 
                  opacity: 0, 
                  scale: 0.75, 
                  z: -200, 
                  x: isEven ? -100 : 100,
                  filter: 'blur(10px)'
                }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1, 
                  z: 0,
                  x: 0,
                  filter: 'blur(0px)'
                }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, type: 'spring', damping: 20 }}
                className="relative max-w-[280px] w-full glass-card p-4 border border-sky-500/20 hover:border-sky-500/40 shadow-2xl transition-all duration-300 group"
              >
                {/* Photo frame */}
                <div className="w-full h-64 overflow-hidden rounded-lg bg-slate-900 border border-sky-500/10">
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/id/${60 + index}/300/400`;
                    }}
                  />
                </div>

                {/* Light reflection detail */}
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/60 border border-sky-500/20 text-sky-400 opacity-60">
                  <Sparkles className="w-3 h-3" />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Exit Gate Button */}
      <div className="text-center mt-32 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCorridorEnd}
          className="px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all mx-auto"
        >
          Proceed to Polaroid Wall 📍
        </motion.button>
      </div>
    </div>
  );
};

export default MemoryCorridor;
