import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbit, X, Maximize2 } from 'lucide-react';

const MemoryGalaxy = ({ onGalaxyEnd, galaxyPhotos }) => {
  const canvasRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const orbitRotation = useRef({ x: 0.3, y: 0.5 }); // orbit pitch & yaw angles

  const getPhotosList = () => {
    if (!galaxyPhotos || galaxyPhotos.length === 0) {
      return Array.from({ length: 15 }).map((_, i) => ({
        url: `https://picsum.photos/id/${90 + i}/300/300`,
        title: `Galaxy Star #${i + 1}`
      }));
    }
    return galaxyPhotos.map((url, i) => ({
      url,
      title: url.split('/').pop().split('.')[0].replace(/[-_]/g, ' ')
    }));
  };

  const list = getPhotosList();

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

    // Mobile Optimization check
    const isMobile = window.innerWidth < 768;
    const numStars = isMobile ? 60 : 180;
    
    // Background Space Stars
    const stars = Array.from({ length: numStars }).map(() => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      z: Math.random() * canvas.width,
      size: Math.random() * 1.5 + 0.5
    }));

    // Pre-load all photo images
    const planetImages = list.map(photo => {
      const img = new Image();
      img.src = photo.url;
      return {
        photo,
        img,
        loaded: false,
        // Set coordinates in a 3D spherical shell
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos((Math.random() * 2) - 1),
        radius: isMobile ? 180 : 280,
        // Projected coordinates
        px: 0,
        py: 0,
        pz: 0,
        pSize: 0
      };
    });

    planetImages.forEach(planet => {
      planet.img.onload = () => {
        planet.loaded = true;
      };
    });

    let currentAngleY = 0;

    const drawGalaxy = () => {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Space Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      stars.forEach(star => {
        // Perspective projection
        const k = 400 / star.z;
        const sx = star.x * k + canvas.width / 2;
        const sy = star.y * k + canvas.height / 2;
        
        if (sx >= 0 && sx <= canvas.width && sy >= 0 && sy <= canvas.height) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Slowly move stars closer
        star.z -= 0.3;
        if (star.z <= 0) {
          star.z = canvas.width;
        }
      });

      // Slowly rotate planet shell automatically when not dragging
      if (!isDragging.current) {
        orbitRotation.current.y += 0.003;
      }

      // 2. Project Planet Spheres
      planetImages.forEach(planet => {
        // Spherical to Cartesian coordinates
        const x3d = planet.radius * Math.sin(planet.phi) * Math.cos(planet.theta);
        const y3d = planet.radius * Math.sin(planet.phi) * Math.sin(planet.theta);
        const z3d = planet.radius * Math.cos(planet.phi);

        // Apply 3D Rotations (Yaw / Pitch)
        // Rotate Y (Yaw)
        const cosY = Math.cos(orbitRotation.current.y);
        const sinY = Math.sin(orbitRotation.current.y);
        const xRotY = x3d * cosY - z3d * sinY;
        const zRotY = x3d * sinY + z3d * cosY;

        // Rotate X (Pitch)
        const cosX = Math.cos(orbitRotation.current.x);
        const sinX = Math.sin(orbitRotation.current.x);
        const yRotX = y3d * cosX - zRotY * sinX;
        const zRotX = y3d * sinX + zRotY * cosX;

        // Perspective Math
        const cameraDepth = isMobile ? 350 : 500;
        const scaleK = cameraDepth / (cameraDepth + zRotX);
        planet.px = xRotY * scaleK + canvas.width / 2;
        planet.py = yRotX * scaleK + canvas.height / 2;
        planet.pz = zRotX;
        planet.pSize = (isMobile ? 26 : 40) * scaleK;
      });

      // Sort planetImages by depth Z so we render back planets first, then front planets
      const sortedPlanets = [...planetImages].sort((a, b) => b.pz - a.pz);

      // 3. Draw Planet Spheres
      sortedPlanets.forEach(planet => {
        if (planet.px < -50 || planet.px > canvas.width + 50 || planet.py < -50 || planet.py > canvas.height + 50) {
          return;
        }

        ctx.save();
        ctx.translate(planet.px, planet.py);

        // Orbit neon ring glow (skipped on mobile for FPS)
        if (!isMobile) {
          ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, planet.pSize + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Clip circular planet
        ctx.beginPath();
        ctx.arc(0, 0, planet.pSize, 0, Math.PI * 2);
        ctx.clip();

        if (planet.loaded) {
          // Draw planet image
          ctx.drawImage(
            planet.img, 
            -planet.pSize, 
            -planet.pSize, 
            planet.pSize * 2, 
            planet.pSize * 2
          );
        } else {
          // Fallback solid color planet
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        }

        ctx.restore();

        // Draw planet border
        ctx.strokeStyle = planet.pz < 0 ? '#38adf8' : '#6366f1'; // blue for front, purple for back
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(planet.px, planet.py, planet.pSize, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationId = requestAnimationFrame(drawGalaxy);
    };

    drawGalaxy();

    // Mouse Drag Listeners
    const handleDragStart = (e) => {
      isDragging.current = true;
      startX.current = e.clientX || e.touches[0].clientX;
      startY.current = e.clientY || e.touches[0].clientY;
    };

    const handleDragMove = (e) => {
      if (!isDragging.current) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      if (x === undefined || y === undefined) return;

      const dx = x - startX.current;
      const dy = y - startY.current;

      orbitRotation.current.y += dx * 0.005;
      orbitRotation.current.x += dy * 0.005;

      // cap pitch to avoid vertical flips
      orbitRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, orbitRotation.current.x));

      startX.current = x;
      startY.current = y;
    };

    const handleDragEnd = () => {
      isDragging.current = false;
    };

    // Click selector (checks proximity to projected planet center)
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let found = null;
      for (const planet of planetImages) {
        const dx = clickX - planet.px;
        const dy = clickY - planet.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= planet.pSize + 8) {
          found = planet.photo;
          break;
        }
      }

      if (found) {
        setSelectedPhoto(found);
      }
    };

    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('click', handleCanvasClick);

    canvas.addEventListener('touchstart', handleDragStart);
    canvas.addEventListener('touchmove', handleDragMove);
    canvas.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleDragStart);
      canvas.removeEventListener('mousemove', handleDragMove);
      canvas.removeEventListener('mouseup', handleDragEnd);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('touchstart', handleDragStart);
      canvas.removeEventListener('touchmove', handleDragMove);
      canvas.removeEventListener('touchend', handleDragEnd);
      cancelAnimationFrame(animationId);
    };
  }, [list, isDragging]);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* Galaxy HUD UI */}
      <div className="absolute top-12 inset-x-0 text-center z-10 pointer-events-none px-4">
        <span className="text-[10px] font-mono tracking-widest text-sky-400 bg-sky-950/50 border border-sky-500/20 px-3 py-1 rounded-full uppercase">
          Chapter IX: 3D Memory Galaxy
        </span>
        <h2 className="text-xl md:text-3xl font-bold tracking-widest text-white font-sans uppercase mt-4">
          Memory Galaxy 🌌
        </h2>
        <p className="text-slate-400 text-xs mt-2">
          Drag to orbit. Click a planet photo to zoom.
        </p>
      </div>

      {/* Slide-in Continue Button */}
      <div className="absolute bottom-16 inset-x-0 text-center z-20 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGalaxyEnd}
          className="px-8 py-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all"
        >
          Form Memory Constellation 🌟
        </motion.button>
      </div>

      {/* Lightbox details modal */}
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
              className="relative max-w-sm w-full bg-[#080d1a] border border-sky-500/30 rounded-2xl p-6 shadow-2xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950 border border-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo */}
              <div className="w-full h-72 rounded-xl overflow-hidden border border-sky-500/20 mb-4 bg-slate-900">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://picsum.photos/id/102/300/300`;
                  }}
                />
              </div>

              {/* Caption */}
              <div className="text-center w-full">
                <h3 className="text-lg font-bold text-sky-400 mb-2 font-sans">
                  Star Memory ✨
                </h3>
                <p className="text-slate-400 text-xs">
                  Revolving inside Arthi's memory planetarium.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryGalaxy;
