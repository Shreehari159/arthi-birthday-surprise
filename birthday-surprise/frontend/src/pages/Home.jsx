import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import LoginScreen from '../components/LoginScreen.jsx';
import VerificationScreen from '../components/VerificationScreen.jsx';
import RollercoasterEntrance from '../components/RollercoasterEntrance.jsx';
import EnvelopeAnimation from '../components/EnvelopeAnimation.jsx';
import GreetingLetter from '../components/GreetingLetter.jsx';
import FairytaleBook from '../components/FairytaleBook.jsx';
import FlowerBloom from '../components/FlowerBloom.jsx';
import MemoryCorridor from '../components/MemoryCorridor.jsx';
import PolaroidWall from '../components/PolaroidWall.jsx';
import MemoryGalaxy from '../components/MemoryGalaxy.jsx';
import MemoryConstellation from '../components/MemoryConstellation.jsx';
import Fireworks from '../components/Fireworks.jsx';
import LettersMailbox from '../components/LettersMailbox.jsx';
import VideoReels from '../components/VideoReels.jsx';
import FinalScrapbook from '../components/FinalScrapbook.jsx';
import Navbar from '../components/Navbar.jsx';
import { ALL_IMAGES, REAL_PHOTOS, ARTISTIC_PHOTOS, getAssetUrl } from '../data/mediaData.js';
import { FLOW_STATES } from '../constants/flowStates.js';

const Home = () => {
  const [currentState, setCurrentState] = useState(FLOW_STATES.LOGIN);
  const [allImages, setAllImages] = useState(ALL_IMAGES);
  
  // Partitioned photo states
  const [coverPhoto, setCoverPhoto] = useState(REAL_PHOTOS[0] || getAssetUrl('images/Arthu_1.jpeg'));
  const [realPhotos, setRealPhotos] = useState(REAL_PHOTOS);
  const [aiPhotos, setAiPhotos] = useState(ARTISTIC_PHOTOS);
  const [corridorPhotos, setCorridorPhotos] = useState([]);
  const [polaroidPhotos, setPolaroidPhotos] = useState([]);
  const [galaxyPhotos, setGalaxyPhotos] = useState([]);
  
  // Modal states for floating mailbox / reels
  const [isLettersModalOpen, setIsLettersModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Audio state
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showAudioPill, setShowAudioPill] = useState(false);
  const audioRef = useRef(null);

  // Initialize partitions immediately and try backend discovery
  useEffect(() => {
    partitionImages(ALL_IMAGES);

    fetch('http://localhost:5000/api/images')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.images && data.images.length > 0) {
          setAllImages(data.images);
          partitionImages(data.images);
        }
      })
      .catch(err => {
        // Safe silent fallback to bundled ALL_IMAGES
        console.log('Using pre-bundled mediaData catalog');
      });
  }, []);

  const partitionImages = (images) => {
    // Real photos of Arthi
    const real = images.filter(img => {
      const lower = img.toLowerCase();
      return lower.includes('arthu') || lower.includes('kid_') || lower.includes('whatsapp image');
    });
    const realList = real.length > 0 ? real : images.slice(0, 10);
    setRealPhotos(realList);

    if (realList.length > 0) {
      setCoverPhoto(realList[0]);
    }

    // Creative / artistic photos
    const other = images.filter(img => !real.includes(img) && !img.includes('letter_'));
    const otherList = other.length > 0 ? other : images;
    setAiPhotos(otherList);

    // Segment distributions
    setCorridorPhotos(otherList.slice(0, 18));
    setPolaroidPhotos(otherList.slice(18, 45));
    setGalaxyPhotos(otherList.slice(45));
  };

  const transitionTo = (nextState) => {
    setCurrentState(nextState);
    
    // Show audio controls after user unlocks
    if (nextState !== FLOW_STATES.LOGIN && nextState !== FLOW_STATES.VERIFY) {
      setShowAudioPill(true);
    } else {
      setShowAudioPill(false);
    }
  };

  const toggleAudioMute = () => {
    if (audioRef.current) {
      const targetMute = !audioRef.current.muted;
      audioRef.current.muted = targetMute;
      setIsAudioMuted(targetMute);

      if (!targetMute) {
        audioRef.current.play().catch(err => console.log('Autoplay blocked:', err));
      }
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.muted = true;
    }
    setIsAudioMuted(true);
    setShowAudioPill(false);
    transitionTo(FLOW_STATES.LOGIN);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
      {/* Persistent HTML5 Background Audio */}
      <audio
        ref={audioRef}
        src={getAssetUrl('music/bg-music.mp3')}
        loop
        preload="auto"
      />

      {/* Persistent Glassmorphism Top Navigation Bar */}
      <Navbar
        currentState={currentState}
        onNavigate={transitionTo}
        onOpenLetters={() => setIsLettersModalOpen(true)}
        onOpenVideos={() => setIsVideoModalOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={toggleAudioMute}
      />

      {/* Screen Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full min-h-screen pt-14 sm:pt-16"
        >
          {currentState === FLOW_STATES.LOGIN && (
            <LoginScreen 
              onLoginSuccess={() => transitionTo(FLOW_STATES.VERIFY)} 
              coverPhoto={coverPhoto}
            />
          )}

          {currentState === FLOW_STATES.VERIFY && (
            <VerificationScreen onVerifySuccess={() => transitionTo(FLOW_STATES.ROLLERCOASTER)} />
          )}

          {currentState === FLOW_STATES.ROLLERCOASTER && (
            <RollercoasterEntrance 
              onTransitionEnd={() => transitionTo(FLOW_STATES.ENVELOPE)} 
              audioRef={audioRef} 
            />
          )}

          {currentState === FLOW_STATES.ENVELOPE && (
            <EnvelopeAnimation onEnvelopeOpen={() => transitionTo(FLOW_STATES.LETTER)} />
          )}

          {currentState === FLOW_STATES.LETTER && (
            <GreetingLetter onLetterEnd={() => transitionTo(FLOW_STATES.BOOK)} />
          )}

          {currentState === FLOW_STATES.BOOK && (
            <FairytaleBook 
              onBookEnd={() => transitionTo(FLOW_STATES.GARDEN)} 
              realPhotos={realPhotos}
            />
          )}

          {currentState === FLOW_STATES.GARDEN && (
            <FlowerBloom 
              onBloomEnd={() => transitionTo(FLOW_STATES.CORRIDOR)} 
              aiPhotos={aiPhotos}
            />
          )}

          {currentState === FLOW_STATES.CORRIDOR && (
            <MemoryCorridor 
              onCorridorEnd={() => transitionTo(FLOW_STATES.POLAROID)} 
              corridorPhotos={corridorPhotos}
            />
          )}

          {currentState === FLOW_STATES.POLAROID && (
            <PolaroidWall 
              onPolaroidEnd={() => transitionTo(FLOW_STATES.GALAXY)} 
              polaroidPhotos={polaroidPhotos}
            />
          )}

          {currentState === FLOW_STATES.GALAXY && (
            <MemoryGalaxy 
              onGalaxyEnd={() => transitionTo(FLOW_STATES.CONSTELLATION)} 
              galaxyPhotos={galaxyPhotos}
            />
          )}

          {currentState === FLOW_STATES.CONSTELLATION && (
            <MemoryConstellation 
              onConstellationEnd={() => transitionTo(FLOW_STATES.FIREWORKS)} 
              constellationPhotos={aiPhotos}
            />
          )}

          {currentState === FLOW_STATES.FIREWORKS && (
            <Fireworks onFireworksEnd={() => transitionTo(FLOW_STATES.LETTERS)} />
          )}

          {/* New Chapter 13: Heartfelt Letters Mailbox */}
          {currentState === FLOW_STATES.LETTERS && (
            <LettersMailbox onContinue={() => transitionTo(FLOW_STATES.VIDEOS)} />
          )}

          {/* New Chapter 14: Cinematic Video Reels */}
          {currentState === FLOW_STATES.VIDEOS && (
            <VideoReels onContinue={() => transitionTo(FLOW_STATES.SCRAPBOOK)} />
          )}

          {/* Chapter 15: The Complete Scrapbook & Archive */}
          {currentState === FLOW_STATES.SCRAPBOOK && (
            <FinalScrapbook 
              onReset={handleReset} 
              allPhotos={allImages}
              audioRef={audioRef}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Letters Mailbox Modal (Accessible anytime) */}
      <AnimatePresence>
        {isLettersModalOpen && (
          <div
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
            onClick={() => setIsLettersModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[92vh] bg-slate-950 border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col"
            >
              <LettersMailbox isModal={true} onClose={() => setIsLettersModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Video Reels Modal (Accessible anytime) */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[92vh] bg-slate-950 border border-sky-500/30 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col"
            >
              <VideoReels isModal={true} onClose={() => setIsVideoModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
