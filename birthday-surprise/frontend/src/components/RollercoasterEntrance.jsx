import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RollercoasterEntrance = ({ onTransitionEnd, audioRef }) => {
  const canvasRef = useRef(null);
  const [displayText, setDisplayText] = useState("Entering Memory Universe...");
  const textOptions = [
    "Entering Memory Universe...",
    "Disabling Gravity...",
    "Buckle up, Arthi...",
    "Loading 3D Memories..."
  ];

  useEffect(() => {
    // Play background audio
    if (audioRef && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log("Audio play blocked by browser policy; user interaction needed", err);
      });
    }

    // Cycle cinematic text
    let textIdx = 0;
    const textInterval = setInterval(() => {
      textIdx++;
      if (textIdx < textOptions.length) {
        setDisplayText(textOptions[textIdx]);
      } else {
        clearInterval(textInterval);
      }
    }, 1800);

    // Setup Canvas Particle Field (3D Warp Tunnel)
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles and Hearts
    const numParticles = 180;
    const particles = [];
    const hearts = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * canvas.width;
        this.y = (Math.random() - 0.5) * canvas.height;
        this.z = Math.random() * canvas.width + 200; // depth
        this.color = Math.random() > 0.5 ? '#38adf8' : '#6366f1'; // blue/indigo neon
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.z -= 12; // move closer (warp effect speed)
        if (this.z <= 0) {
          this.reset();
        }
      }

      draw() {
        // Perspective projection
        const k = 600 / this.z;
        const px = this.x * k + canvas.width / 2;
        const py = this.y * k + canvas.height / 2;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = this.size * k;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = size * 2;
          ctx.shadowColor = this.color;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }
    }

    class FloatingHeart {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * canvas.width * 1.5;
        this.y = (Math.random() - 0.5) * canvas.height * 1.5;
        this.z = Math.random() * canvas.width + 400;
        this.size = Math.random() * 8 + 6;
        this.angle = Math.random() * Math.PI * 2;
        this.rotateSpeed = (Math.random() - 0.5) * 0.05;
      }

      update() {
        this.z -= 6; // slightly slower than particles for parallax
        this.angle += this.rotateSpeed;
        if (this.z <= 0) {
          this.reset();
        }
      }

      draw() {
        const k = 600 / this.z;
        const px = this.x * k + canvas.width / 2;
        const py = this.y * k + canvas.height / 2;

        if (px >= -50 && px <= canvas.width + 50 && py >= -50 && py <= canvas.height + 50) {
          const s = this.size * k;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(this.angle);
          ctx.fillStyle = 'rgba(14, 165, 233, 0.6)'; // Blue heart
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#0ea5e9';
          
          // Draw heart path
          ctx.beginPath();
          ctx.moveTo(0, -s / 4);
          ctx.bezierCurveTo(s / 2, -s, s, -s / 3, 0, s);
          ctx.bezierCurveTo(-s, -s / 3, -s / 2, -s, 0, -s / 4);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Initialize elements
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
    for (let i = 0; i < 20; i++) {
      hearts.push(new FloatingHeart());
    }

    // Loop
    const drawTunnel = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.25)'; // slight trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      hearts.forEach(h => {
        h.update();
        h.draw();
      });

      animationId = requestAnimationFrame(drawTunnel);
    };
    drawTunnel();

    // End cinematic entrance after 7.5 seconds
    const endTimeout = setTimeout(() => {
      onTransitionEnd();
    }, 7500);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      clearInterval(textInterval);
      clearTimeout(endTimeout);
    };
  }, [onTransitionEnd, audioRef]);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* Central flying text HUD */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayText}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 font-sans uppercase blue-glow mb-4">
              {displayText}
            </h2>
            <p className="text-sky-300/60 text-xs md:text-sm tracking-widest">
              ANTI-GRAVITY DRIVE ACTIVE
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Futuristic borders */}
      <div className="absolute inset-4 border border-sky-500/10 pointer-events-none rounded-xl" />
      <div className="absolute top-4 left-4 text-sky-500/40 font-mono text-[10px] tracking-widest">
        SYS_STATUS: WARP_MODE
      </div>
      <div className="absolute bottom-4 right-4 text-indigo-500/40 font-mono text-[10px] tracking-widest">
        COORDINATES: 18.11.2004
      </div>
    </div>
  );
};

export default RollercoasterEntrance;
