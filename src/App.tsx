import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 selection:bg-magenta-500/30 overflow-hidden relative font-mono">
      <div className="crt-overlay" />
      <div className="scanline" />
      
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen gap-12">
        <header className="text-center space-y-4">
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-6xl font-pixel glitch-text uppercase tracking-tighter text-fuchsia-500"
          >
            NEON_VOID_v0.1
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-cyan-400 text-sm uppercase tracking-[0.5em] animate-pulse"
          >
            [INITIALIZING_NEURAL_LINK] • [SYNC_STABLE]
          </motion.p>
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full lg:w-auto border-4 border-cyan-500 shadow-[0_0_20px_#06b6d4]"
          >
            <SnakeGame />
          </motion.div>

          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full lg:w-auto flex flex-col gap-6"
          >
            <div className="border-4 border-fuchsia-500 shadow-[0_0_20px_#d946ef]">
              <MusicPlayer />
            </div>
            
            <div className="bg-black/80 border-2 border-cyan-500/50 p-6 space-y-4 font-mono text-xs">
              <h4 className="text-fuchsia-500 uppercase tracking-widest">[TERMINAL_LOG]</h4>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span className="text-cyan-600">0x001:</span>
                  <span>ENCRYPTED_STREAM_DETECTED</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-600">0x002:</span>
                  <span>SNAKE_PROTOCOL_OVERRIDE_ENABLED</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-600">0x003:</span>
                  <span className="animate-pulse">WAITING_FOR_USER_INPUT...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-8 text-fuchsia-500/40 text-[10px] uppercase tracking-[1em]">
          [VOID_TECH_CORP] • [NO_ESCAPE]
        </footer>
      </main>
    </div>
  );
}
