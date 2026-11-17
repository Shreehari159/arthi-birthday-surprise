import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, ZoomIn } from 'lucide-react';

const PolaroidWall = ({ onPolaroidEnd, polaroidPhotos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const getPhotosList = () => {
    if (!polaroidPhotos || polaroidPhotos.length === 0) {
      return Array.from({ length: 12 }).map((_, i) => ({
        url: `https://picsum.photos/id/${70 + i}/300/300`,
        title: `Cozy Moment #${i + 1}`,
        desc: 'A beautiful candid snapshot hanging on the cozy memory wall.'
      }));
    }
    return polaroidPhotos.map((url, i) => ({
      url,
      title: url.split('/').pop().split('.')[0].replace(/[-_]/g, ' '),
      desc: 'Captured and preserved on Arthi\'s beautiful birthday wall.'
    }));
  };

  const list = getPhotosList();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 py-16 px-4 select-none overflow-hidden">
      {/* Warm Golden Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-16 relative z-10">
        <span className="text-[10px] font-mono tracking-widest text-amber-400 bg-amber-950/40 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
          Chapter VIII: Cozy Polaroid Wall
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-white mt-4 font-sans leading-tight">
          Cozy Polaroid Wall 📍
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-3">
          Candid memories suspended from fairy lights. Tap any snapshot to read.
        </p>
      </div>

      {/* Fairy Lights String */}
      <div className="relative w-full max-w-5xl mx-auto mb-12 flex justify-around items-center border-b border-amber-500/20 pb-4">
        {/* Glow Light Bulbs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center relative">
            <div className="w-1.5 h-3 bg-slate-700" />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2 + Math.random(), 
                repeat: Infinity,
                ease: 'easeInOut' 
              }}
              className="w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_12px_#f59e0b] -mt-0.5"
            />
          </div>
        ))}
      </div>

      {/* Pinned polaroids grid */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-items-center relative z-10">
        {list.map((photo, index) => {
          // Add random initial sway offsets to polaroids
          const swayDelay = Math.random() * 2;
          const swayAngle = Math.random() * 2 + 1; // 1 to 3 degrees

          return (
            <motion.div
              key={index}
              animate={{ 
                rotate: [swayAngle, -swayAngle, swayAngle]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: swayDelay
              }}
              onClick={() => setSelectedPhoto(photo)}
              className="w-[170px] bg-slate-100 p-3 pb-8 text-slate-800 shadow-xl rounded border border-slate-200 cursor-pointer transform origin-top hover:scale-105 active:scale-95 transition-transform duration-300 relative group"
              style={{
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            >
              {/* String attachment pin */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full border border-amber-900 shadow z-25" />

              {/* Photo */}
              <div className="w-full h-36 bg-slate-200 rounded-sm overflow-hidden border border-slate-300 relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://picsum.photos/id/${70 + index}/300/300`;
                  }}
                />
                
                {/* Zoom indicator on hover */}
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Polaroids bottom border */}
              <div className="mt-2 text-center">
                <span className="text-sky-500 text-xs">💙</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide-in Next Button */}
      <div className="text-center mt-20 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPolaroidEnd}
          className="px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all mx-auto"
        >
          Discover 3D Memory Galaxy 🌌
        </motion.button>
      </div>

      {/* Lightbox / Details Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-sm w-full bg-slate-100 p-4 pb-8 text-slate-800 shadow-2xl rounded-lg border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo */}
              <div className="w-full h-80 rounded overflow-hidden border border-slate-300 mb-4 bg-slate-200">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://picsum.photos/id/${80}/300/300`;
                  }}
                />
              </div>

              {/* Caption */}
              <div className="text-center px-2">
                <h3 className="font-handwritten text-2xl text-slate-900 font-bold mb-2">
                  Forever Arthi 💙
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed font-sans">
                  {selectedPhoto.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PolaroidWall;
