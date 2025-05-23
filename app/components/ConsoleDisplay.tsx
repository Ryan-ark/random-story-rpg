import React, { useEffect, useRef } from 'react';
import { GameEvent, PlayerState, Enemy, Item } from '../utils/types';

interface ConsoleDisplayProps {
  gameEvents: GameEvent[];
  playerState: PlayerState;
  currentEnemy?: Enemy;
  inCombat: boolean;
  message?: string;
  isLoading: boolean;
}

const ConsoleDisplay = ({
  gameEvents,
  playerState,
  currentEnemy,
  inCombat,
  message,
  isLoading,
}: ConsoleDisplayProps) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [gameEvents, message]);

  return (
    <div className="flex flex-col w-full">
      {/* Player stats - mobile friendly */}
      <div className="bg-gray-800 text-green-300 p-2 rounded-t-md font-mono text-sm flex flex-col sm:flex-row sm:justify-between">
        <div className="mb-1 sm:mb-0">HP: {playerState.health}/{playerState.maxHealth}</div>
        <div className="mb-1 sm:mb-0">LVL: {playerState.level} | XP: {playerState.xp}/{playerState.xpToNextLevel}</div>
        <div>LOC: {playerState.location}</div>
      </div>

      {/* Main console output */}
      <div 
        ref={consoleRef}
        className="bg-black text-green-400 p-2 sm:p-4 h-72 sm:h-96 overflow-y-auto font-mono text-xs sm:text-sm rounded-b-md space-y-4"
        aria-live="polite"
        aria-label="Game console"
      >
        {gameEvents.map((event, index) => (
          <div key={index} className="space-y-2">
            <p className="break-words">{event.story}</p>
            
            {event.location && (
              <div className="text-yellow-400">
                Location: {event.location.name} - {event.location.description}
              </div>
            )}
            
            {event.enemies && event.enemies.length > 0 && (
              <div className="text-red-400">
                {event.enemies.map((enemy, eidx) => (
                  <div key={eidx}>
                    Enemy: {enemy.name} - {enemy.description}
                  </div>
                ))}
              </div>
            )}
            
            {event.rewards && event.rewards.length > 0 && (
              <div className="text-blue-400">
                {event.rewards.map((reward, ridx) => (
                  <div key={ridx}>
                    Found: {reward.name} - {reward.description}
                  </div>
                ))}
              </div>
            )}
            
            {event.options && (
              <div className="text-gray-400 mt-2">
                {event.options.map((option, oidx) => (
                  <div key={oidx} className="break-words">
                    [{oidx + 1}] {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Current combat display */}
        {inCombat && currentEnemy && (
          <div className="border border-red-500 p-2 my-2">
            <div className="text-red-500">COMBAT: {currentEnemy.name} (HP: {currentEnemy.health}/{currentEnemy.maxHealth || currentEnemy.health})</div>
            <div>Attack power: {currentEnemy.damage}</div>
          </div>
        )}
        
        {/* System message */}
        {message && (
          <div className="text-yellow-500 italic break-words">{message}</div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="text-gray-500 animate-pulse">Generating adventure...</div>
        )}
      </div>
    </div>
  );
};

export default ConsoleDisplay; 