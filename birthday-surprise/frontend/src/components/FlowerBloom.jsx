import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FlowerBloom = ({ onBloomEnd, aiPhotos }) => {
  const canvasRef = useRef(null);
  const [showButton, setShowButton] = useState(false);

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

    // Falling Petals
    const numPetals = 40;
    const petals = [];

    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        const colors = [
          'rgba(56, 189, 248, 0.7)',  // sky blue
          'rgba(14, 165, 233, 0.6)',  // light blue
          'rgba(99, 102, 241, 0.6)',  // indigo
          'rgba(147, 197, 253, 0.7)'  // soft blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size, -this.size, this.size * 1.5, this.size / 2, 0, this.size * 2);
        ctx.bezierCurveTo(-this.size * 1.5, this.size / 2, -this.size, -this.size, 0, 0);
        ctx.fill();
        ctx.restore();
      }
    }

    // Programmatic Growing Flower Stem with Photo at center
    class GrowingStem {
      constructor(startX, startY, angle, maxLength, color, photoUrl, flowerType) {
        this.startX = startX;
        this.startY = startY;
        this.angle = angle;
        this.maxLength = maxLength;
        this.color = color;
        this.currentLength = 0;
        this.points = [{ x: startX, y: startY }];
        this.growthRate = 2.5;
        this.isDone = false;
        this.flowerBloomed = false;
        this.flowerProgress = 0;
        this.flowerType = flowerType; // "Rose", "Tulip", "Lily"

        // Load photo image
        this.img = null;
        if (photoUrl) {
          const imageObj = new Image();
          imageObj.src = photoUrl;
          imageObj.onload = () => {
            this.img = imageObj;
          };
        }
      }

      update() {
        if (this.currentLength < this.maxLength) {
          this.currentLength += this.growthRate;
          const lastPoint = this.points[this.points.length - 1];
          const nextAngle = this.angle + Math.sin(this.currentLength * 0.05) * 0.15;
          const nextX = lastPoint.x + Math.cos(nextAngle) * this.growthRate;
          const nextY = lastPoint.y + Math.sin(nextAngle) * this.growthRate;
          this.points.push({ x: nextX, y: nextY });
        } else {
          this.isDone = true;
          if (this.flowerProgress < 1) {
            this.flowerProgress += 0.015;
          } else {
            this.flowerBloomed = true;
          }
        }
      }

      draw() {
        // Draw stem
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        this.points.forEach(p => {
          ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = '#075985'; // Deep blue stem
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw leaves along the path
        if (this.points.length > 20) {
          for (let i = 15; i < this.points.length - 5; i += 30) {
            const p = this.points[i];
            const pNext = this.points[i + 1];
            const angle = Math.atan2(pNext.y - p.y, pNext.x - p.x);
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillStyle = '#0369a1'; // Blue leaf
            ctx.beginPath();
            ctx.ellipse(0, 0, 5, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Draw blooming flower at the tip
        if (this.isDone) {
          const tip = this.points[this.points.length - 1];
          const bloomRadius = 40 * this.flowerProgress;

          ctx.save();
          ctx.translate(tip.x, tip.y);
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#0ea5e9';

          // Draw Outer Petals
          ctx.fillStyle = this.color;
          const numPetals = this.flowerType === 'Rose' ? 6 : this.flowerType === 'Lily' ? 5 : 4;
          for (let i = 0; i < numPetals; i++) {
            ctx.beginPath();
            ctx.arc(
              Math.cos((i * Math.PI * 2) / numPetals) * (bloomRadius * 0.6),
              Math.sin((i * Math.PI * 2) / numPetals) * (bloomRadius * 0.6),
              bloomRadius * 0.55,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          // Draw Inner Petals (Indigo)
          ctx.fillStyle = 'rgba(79, 70, 229, 0.8)';
          for (let i = 0; i < numPetals - 1; i++) {
            ctx.beginPath();
            ctx.arc(
              Math.cos((i * Math.PI * 2) / (numPetals - 1) + 0.3) * (bloomRadius * 0.4),
              Math.sin((i * Math.PI * 2) / (numPetals - 1) + 0.3) * (bloomRadius * 0.4),
              bloomRadius * 0.4,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          // Draw AI Photo in Center of Flower
          if (this.img && this.flowerProgress > 0.6) {
            const photoRadius = bloomRadius * 0.45 * (this.flowerProgress - 0.2);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, photoRadius, 0, Math.PI * 2);
            ctx.clip(); // circular clipping path
            
            // Draw image cropped in circle
            ctx.drawImage(
              this.img, 
              -photoRadius, 
              -photoRadius, 
              photoRadius * 2, 
              photoRadius * 2
            );
            ctx.restore();

            // Draw clean circle border over the photo
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, photoRadius, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            // Gold center fallback
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, 0, bloomRadius * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }
    }

    // Spawn 3 Growing Flowers: Rose (Left), Tulip (Center), Lily (Right)
    const stems = [];
    const getAiPhoto = (idx) => {
      if (!aiPhotos || aiPhotos.length === 0) return null;
      return aiPhotos[idx % aiPhotos.length];
    };

    const initStems = () => {
      stems.push(new GrowingStem(
        canvas.width * 0.25, 
        canvas.height, 
        -Math.PI / 2 - 0.2, 
        canvas.height * 0.48, 
        'rgba(14, 165, 233, 0.85)', 
        getAiPhoto(0),
        'Rose'
      ));
      stems.push(new GrowingStem(
        canvas.width * 0.5, 
        canvas.height, 
        -Math.PI / 2, 
        canvas.height * 0.55, 
        'rgba(99, 102, 241, 0.85)', 
        getAiPhoto(1),
        'Tulip'
      ));
      stems.push(new GrowingStem(
        canvas.width * 0.75, 
        canvas.height, 
        -Math.PI / 2 + 0.2, 
        canvas.height * 0.48, 
        'rgba(6, 182, 212, 0.85)', 
        getAiPhoto(2),
        'Lily'
      ));
    };

    for (let i = 0; i < numPetals; i++) {
      petals.push(new Petal());
    }

    initStems();

    // Loop
    const drawBloom = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background ambient gradient
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stems
      stems.forEach(stem => {
        stem.update();
        stem.draw();
      });

      // Petals
      petals.forEach(p => {
        p.update();
        p.draw();
      });

      // Show button when done
      if (stems.every(s => s.flowerBloomed) && !showButton) {
        setShowButton(true);
      }

      animationId = requestAnimationFrame(drawBloom);
    };

    drawBloom();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [showButton, aiPhotos]);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* HUD Message */}
      <div className="absolute top-12 inset-x-0 text-center z-10 pointer-events-none px-4">
        <h2 className="text-xl md:text-3xl font-bold tracking-widest text-sky-400 font-sans uppercase animate-pulse">
          Chapter VI: Blooming Garden 🌸
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-2">
          AI fairytale portraits blooming at the hearts of the flowers
        </p>
      </div>

      {/* Action Button */}
      {showButton && (
        <div className="absolute bottom-16 inset-x-0 text-center z-20">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={onBloomEnd}
            className="px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            Walk down Memory Corridor 🌌
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default FlowerBloom;
