import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-black/90 font-mono">
      <div className="flex justify-between w-full items-center px-2 border-b-2 border-cyan-500/30 pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-fuchsia-500 font-pixel">[DATA_STREAM]</span>
          <span className="text-xl font-bold text-cyan-400 font-pixel">
            PTS: {score.toString().padStart(4, '0')}
          </span>
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="px-3 py-1 bg-cyan-900/20 border border-cyan-500 text-cyan-400 text-[10px] font-pixel hover:bg-cyan-500 hover:text-black transition-all"
        >
          {isPaused ? '>>_RESUME' : '||_HALT'}
        </button>
      </div>

      <div 
        className="relative bg-[#050505] border-4 border-cyan-900/50 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 16, 
          height: GRID_SIZE * 16,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
               backgroundSize: '16px 16px'
             }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${segment.x}-${segment.y}-${i}`}
            initial={false}
            animate={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1,
            }}
            className={`border border-black ${i === 0 ? 'bg-fuchsia-500 shadow-[0_0_10px_#d946ef]' : 'bg-cyan-500'}`}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
          className="bg-white border-2 border-fuchsia-500"
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-10 p-4 text-center"
            >
              <h2 className="text-2xl font-pixel text-fuchsia-500 mb-4 glitch-text tracking-widest">FATAL_ERROR</h2>
              <p className="text-cyan-400 text-xs font-pixel mb-8">SCORE_RETAINED: {score}</p>
              <button 
                onClick={resetGame}
                className="px-6 py-3 border-2 border-fuchsia-500 text-fuchsia-500 font-pixel text-xs hover:bg-fuchsia-500 hover:text-black transition-all"
              >
                [RE_INITIALIZE]
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[8px] text-cyan-700 font-pixel uppercase tracking-tighter">
        DIR_INPUT: ARROWS | STATE_TOGGLE: SPACE
      </div>
    </div>
  );
};
