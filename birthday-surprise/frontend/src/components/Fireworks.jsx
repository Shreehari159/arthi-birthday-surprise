import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const Fireworks = ({ onFireworksEnd }) => {
  const canvasRef = useRef(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti on launch
    const end = Date.now() + 4000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#0ea5e9', '#6366f1', '#22d3ee', '#3b82f6'] // blue palette
      });
    }, 200);

    // Setup Fireworks Canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Firework classes
    const fireworks = [];
    const particles = [];

    // Helper color generator matching blue theme
    const randomBlueColor = () => {
      const hues = [190, 200, 220, 240, 260];
      const hue = hues[Math.floor(Math.random() * hues.length)];
      return `hsla(${hue}, 100%, 60%, ${Math.random() * 0.4 + 0.6})`;
    };

    class Firework {
      constructor(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        // Distance to target
        this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
        this.distanceTraveled = 0;
        // Track coordinates to create trail
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 10;
        this.acceleration = 1.02;
        this.brightness = Math.random() * 50 + 50;
      }

      update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = Math.sqrt(
          Math.pow(this.x + vx - this.sx, 2) + Math.pow(this.y + vy - this.sy, 2)
        );

        if (this.distanceTraveled >= this.distanceToTarget) {
          // Trigger explosion particles
          createExplosion(this.tx, this.ty);
          fireworks.splice(index, 1);
        } else {
          this.x += vx;
          this.y += vy;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(200, 100%, 70%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 6 + 2;
        this.friction = 0.95;
        this.gravity = 0.12;
        this.hue = Math.random() * 40 + 190; // Sky blue to Indigo
        this.brightness = Math.random() * 20 + 60;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
      }

      update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
          particles.splice(index, 1);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    const createExplosion = (x, y) => {
      let count = 60;
      while (count--) {
        particles.push(new Particle(x, y));
      }
    };

    // Auto-launch rockets
    let timerTick = 0;
    const launchInterval = 40;

    const drawLoop = () => {
      // Fade canvas to leave spark trails
      ctx.fillStyle = 'rgba(3, 7, 18, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timerTick++;
      if (timerTick >= launchInterval) {
        const startX = Math.random() * canvas.width;
        const startY = canvas.height;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * (canvas.height * 0.6) + 100;
        fireworks.push(new Firework(startX, startY, targetX, targetY));
        timerTick = 0;
      }

      let i = fireworks.length;
      while (i--) {
        fireworks[i].update(i);
        if (fireworks[i]) fireworks[i].draw();
      }

      let j = particles.length;
      while (j--) {
        particles[j].update(j);
        if (particles[j]) particles[j].draw();
      }

      animationId = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    // User can trigger a firework by clicking
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      fireworks.push(new Firework(canvas.width / 2, canvas.height, clickX, clickY));
    };

    canvas.addEventListener('mousedown', handleCanvasClick);

    // Make button appear after 5.5 seconds
    const btnTimeout = setTimeout(() => {
      setShowButton(true);
    }, 5500);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleCanvasClick);
      cancelAnimationFrame(animationId);
      clearInterval(interval);
      clearTimeout(btnTimeout);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden cursor-crosshair">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* Happy Birthday Floating Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: [0.5, 1.2, 1], opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="text-4xl md:text-7xl font-extrabold tracking-widest text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 blue-glow font-sans mb-4"
        >
          HAPPY BIRTHDAY
        </motion.h1>
        
        <motion.h2
          initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: [0.5, 1.2, 1], opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.6, duration: 1.5, ease: 'easeOut' }}
          className="text-5xl md:text-8xl font-black tracking-wider text-center text-white blue-glow font-sans uppercase"
        >
          ARTHI ❤
        </motion.h2>

        <p className="text-slate-400 text-xs md:text-sm tracking-widest mt-6 opacity-80 animate-pulse">
          TAP THE SCREEN TO BURST ROCKETS
        </p>
      </div>

      {/* Slide-in Next Button */}
      {showButton && (
        <div className="absolute bottom-16 inset-x-0 text-center z-20">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={onFireworksEnd}
            className="px-8 py-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            Enter 3D Photo Tunnel 🌠
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Fireworks;
