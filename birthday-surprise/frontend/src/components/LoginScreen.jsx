import React, { useState, useEffect } from 'react';
import { Heart, Lock, ArrowRight } from 'lucide-react';

const LoginScreen = ({ onLoginSuccess, coverPhoto }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate background space stars
  useEffect(() => {
    const starArray = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 2
    }));
    setStars(starArray);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError(data.message || 'Access Denied! Think of her birthdate...');
      }
    } catch (err) {
      console.error(err);
      // Local fallback verification in case API is unavailable during builds
      setTimeout(() => {
        setIsLoading(false);
        if (password === '181104') {
          onLoginSuccess();
        } else {
          setError('Incorrect password! Hint: 6 digits of your birthday date (DDMMYY).');
        }
      }, 800);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4">
      {/* Floating Stars Background */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-sky-400 rounded-full opacity-50 animate-pulse-slow"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}

      {/* Blue neon glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-600 rounded-full filter blur-[120px] opacity-15 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600 rounded-full filter blur-[120px] opacity-15 animate-float" style={{ animationDelay: '3.5s' }} />

      {/* Main Glassmorphic Card (Two-column split view on md screens) */}
      <div className="relative w-full max-w-4xl bg-slate-900/40 border border-sky-500/20 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(14,165,233,0.1)] rounded-2xl overflow-hidden flex flex-col md:flex-row z-10">
        
        {/* Left Side: Arthi's Cover Photo */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between items-center bg-[#070b16]/60 border-b md:border-b-0 md:border-r border-sky-500/10 min-h-[250px] md:min-h-[450px]">
          <div className="w-full text-left md:pl-2">
            <span className="text-[9px] font-mono tracking-widest text-sky-400 uppercase">
              Realm Authorization
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              A secret world awaits...
            </h2>
            <p className="text-slate-400 text-xs mt-1">Only one special girl can enter.</p>
          </div>

          {/* Photo Frame with Glowing Ring */}
          <div className="relative w-36 h-36 md:w-56 md:h-56 my-6 md:my-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-sky-400 animate-spin-slow blur-[1px]" />
            <img
              src={coverPhoto || '/images/Arthu_1.jpeg'}
              alt="Birthday Girl"
              className="w-[136px] h-[136px] md:w-[216px] md:h-[216px] object-cover rounded-2xl absolute inset-[4px] border-2 border-slate-900 bg-slate-800"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="hidden md:block text-slate-500 text-[10px] tracking-wider font-mono">
            SYS_SECURE_COORDS: BIRTHDAY_PORTAL
          </div>
        </div>

        {/* Right Side: Security Password Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center bg-slate-950/20">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-sky-950/60 rounded-full border border-sky-500/20">
              <Heart className="w-8 h-8 text-sky-400 fill-sky-400/25 animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300 font-sans mb-1">
            ❤ Welcome Bestie Arthi ❤
          </h1>
          <p className="text-slate-400 text-xs mb-8">Enter the portal key to decrypt your memories</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-sky-400/60" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Secret Password (DDMMYY)"
                className="block w-full pl-10 pr-3 py-3.5 border border-sky-500/25 bg-slate-950/80 rounded-xl text-center placeholder-slate-600 text-sky-300 tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-mono text-sm"
              />
            </div>

            {error && (
              <div className="text-rose-400 text-xs mt-2 bg-rose-950/20 border border-rose-500/10 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.25)] hover:shadow-[0_0_25px_rgba(14,165,233,0.45)] active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Decrypt surprise
                  <ArrowRight className="w-5 h-5 text-sky-200" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-slate-500 text-xs tracking-wider">
            Hint: 6 digits of your birthday date (DDMMYY) 😉
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;
