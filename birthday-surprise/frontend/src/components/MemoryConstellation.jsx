import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

const MemoryConstellation = ({ onConstellationEnd, constellationPhotos }) => {
  const canvasRef = useRef(null);
  const [activeStar, setActiveStar] = useState(null);

  const letters = ['A', 'R', 'T', 'H', 'I'];

  // Map 5 photos to the letters A R T H I
  const getStarPhotos = () => {
    if (!constellationPhotos || constellationPhotos.length < 5) {
      return Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/id/${100 + i}/300/300`);
    }
    return constellationPhotos.slice(0, 5);
  };

  const starPhotos = getStarPhotos();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Constellation Node Positions
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const isMobile = canvas.width < 768;
    const spacing = isMobile ? 55 : 110;

    const starNodes = [
      { letter: 'A', x: cx - spacing * 2, y: cy + (isMobile ? 20 : 40), img: starPhotos[0] },
      { letter: 'R', x: cx - spacing, y: cy - (isMobile ? 30 : 60), img: starPhotos[1] },
      { letter: 'T', x: cx, y: cy + (isMobile ? 10 : 20), img: starPhotos[2] },
      { letter: 'H', x: cx + spacing, y: cy - (isMobile ? 25 : 50), img: starPhotos[3] },
      { letter: 'I', x: cx + spacing * 2, y: cy + (isMobile ? 30 : 60), img: starPhotos[4] }
    ];

    // Background stars
    const numBgStars = isMobile ? 50 : 120;
    const bgStars = Array.from({ length: numBgStars }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.02 + 0.005
    }));

    let pulseProgress = 0;

    const drawConstellation = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pulseProgress += 0.05;

      // 1. Draw twinkling background stars
      ctx.fillStyle = '#ffffff';
      bgStars.forEach(star => {
        star.alpha += Math.sin(pulseProgress * star.speed) * 0.05;
        // keep alpha inside bounds
        star.alpha = Math.max(0.1, Math.min(0.9, star.alpha));
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0; // reset

      // 2. Draw connecting constellation lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; // glowing cyan line
      ctx.lineWidth = isMobile ? 1.5 : 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0ea5e9';
      
      ctx.beginPath();
      ctx.moveTo(starNodes[0].x, starNodes[0].y);
      for (let i = 1; i < starNodes.length; i++) {
        ctx.lineTo(starNodes[i].x, starNodes[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // 3. Draw star nodes with glowing letters
      starNodes.forEach((node, idx) => {
        ctx.save();
        ctx.translate(node.x, node.y);

        // draw outer glow ring
        const glowRad = (isMobile ? 16 : 24) + Math.sin(pulseProgress + idx) * 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#0ea5e9';
        ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
        ctx.beginPath();
        ctx.arc(0, 0, glowRad, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // draw center star
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, isMobile ? 10 : 15, 0, Math.PI * 2);
        ctx.fill();

        // draw border circle
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, isMobile ? 10 : 15, 0, Math.PI * 2);
        ctx.stroke();

        // draw letter
        ctx.fillStyle = '#0369a1'; // dark blue text
        ctx.font = `bold ${isMobile ? 10 : 13}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.letter, 0, 0.5);

        ctx.restore();
      });

      animationId = requestAnimationFrame(drawConstellation);
    };

    drawConstellation();

    // Mouse check proximity to select star
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let found = null;
      const radiusThreshold = isMobile ? 22 : 32;

      starNodes.forEach(node => {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radiusThreshold) {
          found = node;
        }
      });

      if (found) {
        setActiveStar(found);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationId);
    };
  }, [starPhotos]);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden cursor-crosshair">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* HUD Info */}
      <div className="absolute top-12 inset-x-0 text-center z-10 pointer-events-none px-4">
        <span className="text-[10px] font-mono tracking-widest text-sky-400 bg-sky-950/50 border border-sky-500/20 px-3 py-1 rounded-full uppercase">
          Chapter X.5: Memory Constellation
        </span>
        <h2 className="text-xl md:text-3xl font-bold tracking-widest text-white font-sans uppercase mt-4">
          The Constellation of Arthi 🌟
        </h2>
        <p className="text-slate-400 text-xs mt-2">
          Click the stars of her name to draw her celestial portraits.
        </p>
      </div>

      {/* Slide-in Next Button */}
      <div className="absolute bottom-16 inset-x-0 text-center z-20 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConstellationEnd}
          className="px-8 py-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all"
        >
          Launch Celebratory Fireworks! 🎆
        </motion.button>
      </div>

      {/* Floating Constellation Star Tooltip card */}
      <AnimatePresence>
        {activeStar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#080d1a] border border-sky-400/40 rounded-2xl p-5 shadow-2xl flex flex-col items-center max-w-[280px] w-full z-30"
          >
            {/* Close */}
            <button
              onClick={() => setActiveStar(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Title */}
            <h3 className="text-sm font-mono tracking-widest text-sky-400 font-bold mb-3 flex items-center gap-1">
              <Star className="w-4 h-4 fill-sky-400" />
              STAR NODE: {activeStar.letter}
            </h3>

            {/* Photo */}
            <div className="w-full h-56 rounded-lg overflow-hidden border border-sky-500/20 bg-slate-900 mb-2">
              <img
                src={activeStar.img}
                alt={`Star ${activeStar.letter}`}
                className="w-full h-full object-cover animate-pulse-slow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/id/105/300/300`;
                }}
              />
            </div>
            
            <p className="text-[10px] text-slate-500 uppercase mt-1">
              Forming the Universe of Arthi
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryConstellation;
