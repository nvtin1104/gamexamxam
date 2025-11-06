"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Fix: Import TargetAndTransition to correctly type the animation object.
import { motion, TargetAndTransition } from 'framer-motion';
export interface Duck {
  id: number;
  speed: number; // Represents animation duration, lower is faster
}

export enum RaceState {
  Idle = 'idle',
  Running = 'running',
  Finished = 'finished',
}

// Helper to generate a set of ducks
const generateDucks = (count: number): Duck[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i, // Use timestamp for more unique keys on adding
    speed: Math.random() * 5 + 4, // Random duration between 4 and 9 seconds
  }));
};

// Reusable Button component defined outside the main component
const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    className={`px-6 py-2 font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const DuckRace: React.FC<{ initialDuckCount?: number }> = ({ initialDuckCount = 8 }) => {
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [raceState, setRaceState] = useState<RaceState>(RaceState.Idle);
  const [winner, setWinner] = useState<Duck | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const raceTrackRef = useRef<HTMLDivElement>(null);

  // Initialize ducks
  useEffect(() => {
    setDucks(generateDucks(initialDuckCount));
  }, [initialDuckCount]);
  
  // Measure race track and update on resize
  useEffect(() => {
    const updateWidth = () => {
      if (raceTrackRef.current) {
        setTrackWidth(raceTrackRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleStart = () => {
    if (raceState === RaceState.Idle || raceState === RaceState.Finished) {
      setWinner(null);
      // Reshuffle speeds for a new race
      setDucks(currentDucks => currentDucks.map(duck => ({ ...duck, speed: Math.random() * 5 + 4 })));
      setRaceState(RaceState.Running);
    }
  };

  const handleReset = () => {
    setRaceState(RaceState.Idle);
    setWinner(null);
    setDucks(generateDucks(ducks.length));
  };

  const handleAddDuck = () => {
    if (ducks.length < 12) { // Cap at 12 ducks
      const newDuck = generateDucks(1)[0];
      setDucks(prev => [...prev, newDuck]);
    }
  };
  
  const handleRaceEnd = useCallback((finishedDuck: Duck) => {
    setWinner((currentWinner: Duck | null) => {
        if (currentWinner === null) {
            setRaceState(RaceState.Finished);
            return finishedDuck;
        }
        return currentWinner;
    });
  }, []);

  // Fix: Add explicit return type TargetAndTransition to satisfy Framer Motion's animate prop type.
  const getDuckAnimation = (duck: Duck): TargetAndTransition => {
    if (raceState === RaceState.Running && trackWidth > 0) {
      return {
        x: trackWidth - 60, // 60 is approx width of duck container
        transition: { duration: duck.speed, ease: 'linear' },
      };
    }
    // For idle or finished states, Framer Motion will hold the last animated value.
    // This makes ducks stop in place when the race ends.
    return {};
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <ActionButton
          onClick={handleStart}
          disabled={raceState === RaceState.Running}
          className="bg-green-500 text-white hover:bg-green-600 focus:ring-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {raceState === RaceState.Finished ? 'Race Again' : 'Start Race'}
        </ActionButton>
        <ActionButton
          onClick={handleReset}
          className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 w-full sm:w-auto"
        >
          Reset
        </ActionButton>
        <ActionButton
          onClick={handleAddDuck}
          disabled={raceState === RaceState.Running || ducks.length >= 12}
          className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 disabled:bg-gray-600 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Add Duck
        </ActionButton>
      </div>

      {winner && (
        <div className="text-center mb-4 p-3 bg-yellow-400/20 rounded-lg animate-pulse">
          <h2 className="text-2xl font-bold text-yellow-300">Winner is Duck #{ducks.findIndex(d => d.id === winner.id) + 1}! 🏆</h2>
        </div>
      )}

      <div ref={raceTrackRef} className="relative w-full bg-blue-900/50 rounded-lg p-2 space-y-2 overflow-hidden border-2 border-dashed border-gray-600">
        <div className="absolute top-0 right-4 h-full w-1 bg-white/50 z-0" />
        <div className="absolute top-0 right-2 h-full w-2 bg-white z-0" />

        {ducks.map((duck, index) => (
          <div key={duck.id} className="relative h-16 bg-blue-500/10 rounded flex items-center">
             <span className="absolute left-2 font-bold text-gray-400 text-sm z-10">{index + 1}</span>
             <motion.div
                className="absolute top-0 left-0 h-full"
                initial={{ x: 0 }}
                animate={getDuckAnimation(duck)}
                onAnimationComplete={() => {
                    if (raceState === RaceState.Running) {
                        handleRaceEnd(duck);
                    }
                }}
             >
                <motion.div
                    animate={winner?.id === duck.id ? { y: [0, -8, 0] } : {}}
                    transition={winner?.id === duck.id ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                    className={`relative w-14 h-full flex items-center justify-center ${winner?.id === duck.id ? 'z-20' : 'z-10'}`}
                >
                    <span className="text-4xl md:text-5xl transform -scale-x-100 inline-block drop-shadow-lg">🦆</span>
                    {winner?.id === duck.id && (
                        <div className="absolute -top-1 text-2xl animate-bounce">👑</div>
                    )}
                </motion.div>
             </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DuckRace;