import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';

const MemoryTimeline = ({ onTimelineEnd }) => {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/memories')
      .then(res => res.json())
      .then(data => setMemories(data))
      .catch(err => {
        setMemories([
          { id: 1, year: '2022', title: 'The Beginning of Chaos 💙', description: 'The year filled with endless laughter, getting to know each other, and laying the foundation for the best bond ever.', image: '/images/Arthu_1.jpeg' },
          { id: 2, year: '2022', title: 'Late Night Gossip Sessions 🌙', description: 'From discussing life to sending silly memes at 3 AM. Time always flew when we talked.', image: '/images/Arthu_2.jpeg' },
          { id: 3, year: '2023', title: 'Crazy Adventures & Fun 🌈', description: 'Making memories outside, exploring places, eating good food, and clicking a thousand pictures together.', image: '/images/Arthu_3.jpeg' },
          { id: 4, year: '2023', title: 'Partner in Crime 🕵️‍♀️', description: 'Through highs and lows, you stood by me like a rock. Thank you for always having my back.', image: '/images/Arthu_4.jpeg' },
          { id: 5, year: '2024', title: 'Growing and Glowing ✨', description: 'Stepping up in life, sharing achievements, and encouraging each other to be our absolute best versions.', image: '/images/Arthu_5.jpeg' },
          { id: 6, year: '2024', title: 'Unstoppable Duo 🔥', description: 'Double the drama, double the laughs. No matter the distance or how busy we get, nothing changes.', image: '/images/Arthu_6.jpeg' },
          { id: 7, year: '2025', title: 'To Infinity & Beyond 🚀', description: 'Stepping into a new year of memories. Ready for all the future chaos, laughter, and milestones with you.', image: '/images/Arthu_7.jpeg' }
        ]);
      });
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 py-16 px-4 select-none">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300 font-sans mb-4">
          Our Memory Timeline 📜
        </h2>
        <p className="text-slate-400 text-sm">
          A scroll down memory lane representing Arthi's amazing years.
        </p>
      </div>

      {/* Timeline Structure */}
      <div className="max-w-4xl mx-auto relative">
        {/* Central connecting line (hidden on small screen, left-aligned on mobile) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-600 via-indigo-600 to-sky-600 pointer-events-none" />

        {memories.map((mem, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={mem.id} 
              className={`relative flex flex-col md:flex-row items-stretch mb-12 md:mb-16 ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-[7px] w-4 h-4 bg-sky-400 border-2 border-slate-950 rounded-full shadow-[0_0_10px_#0ea5e9] z-10" />

              {/* Spacing filler for desktop */}
              <div className="hidden md:block w-1/2" />

              {/* Timeline Card */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 50 : -50, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="w-full md:w-[45%] pl-10 pr-4 md:px-6"
              >
                <div className="glass-card p-6 border border-indigo-500/20 hover:border-sky-500/30 transition-all duration-300 relative group">
                  {/* Photo inside card */}
                  <div className="w-full h-48 overflow-hidden rounded-xl border border-sky-500/10 mb-4 bg-slate-900">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/id/${20 + mem.id}/300/200`;
                      }}
                    />
                  </div>

                  {/* Header Row */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1 text-xs font-mono text-sky-400 bg-sky-950/45 px-2.5 py-1 border border-sky-500/20 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {mem.year}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {mem.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {mem.description}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Footer Continue Button */}
      <div className="text-center mt-16 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTimelineEnd}
          className="px-10 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all flex items-center gap-2 mx-auto"
        >
          A Final Message for Arthi
          <ChevronRight className="w-5 h-5 text-sky-200" />
        </motion.button>
      </div>
    </div>
  );
};

export default MemoryTimeline;
