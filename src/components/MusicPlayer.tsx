import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-black/90 p-6 flex flex-col gap-4 font-mono">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="flex items-center gap-4 border-b border-fuchsia-500/30 pb-4">
        <div className="relative w-16 h-16 border-2 border-fuchsia-500">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-fuchsia-500/20 animate-pulse pointer-events-none" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-cyan-400 font-pixel text-[10px] truncate uppercase tracking-tighter">{currentTrack.title}</h3>
          <p className="text-fuchsia-500 text-[8px] font-pixel uppercase tracking-widest mt-1">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-2 w-full bg-cyan-900/20 border border-cyan-500/30 overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] font-pixel text-cyan-700">
          <span>{audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ':' + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '0:00'}</span>
          <span>[STREAMING]</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button onClick={handlePrev} className="text-cyan-500 hover:text-fuchsia-500 transition-colors">
          <SkipBack size={20} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="px-4 py-2 border-2 border-fuchsia-500 text-fuchsia-500 font-pixel text-[10px] hover:bg-fuchsia-500 hover:text-black transition-all"
        >
          {isPlaying ? '[_STOP_]' : '[_PLAY_]'}
        </button>

        <button onClick={handleNext} className="text-cyan-500 hover:text-fuchsia-500 transition-colors">
          <SkipForward size={20} />
        </button>
      </div>

      <div className="text-[8px] text-fuchsia-900 font-pixel text-center animate-pulse">
        ENCRYPTED_SIGNAL_STRENGTH: 98%
      </div>
    </div>
  );
};
