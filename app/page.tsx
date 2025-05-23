'use client';

import { useState, useEffect, useCallback } from 'react';
import ConsoleDisplay from './components/ConsoleDisplay';
import InputHandler from './components/InputHandler';
import Inventory from './components/Inventory';
import { getRandomStoryEvent } from './utils/api';
import { 
  initializePlayerState, 
  handleCombatRound, 
  handleDefend, 
  useItem,
  addItemToInventory,
  addStoryContext,
  restoreHealth,
  gainXP
} from './utils/gameLogic';
import { 
  PlayerState, 
  GameEvent, 
  GameState, 
  Enemy,
  Item
} from './utils/types';

export default function Home() {
  // Player state
  const [playerState, setPlayerState] = useState<PlayerState>(initializePlayerState());
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    currentEvent: { story: '', options: [] },
    eventHistory: [],
    isLoading: true,
    isGameOver: false,
    inCombat: false
  });
  
  // UI state
  const [showInventory, setShowInventory] = useState(false);

  // Start a new game
  const startNewGame = useCallback(async () => {
    setGameState({
      currentEvent: { story: '', options: [] },
      eventHistory: [],
      isLoading: true,
      isGameOver: false,
      inCombat: false
    });
    setPlayerState(initializePlayerState());
    
    try {
      // Get the initial random story event
      const initialEventData = await getRandomStoryEvent(initializePlayerState());
      let initialEvent: GameEvent;
      
      try {
        // Safe JSON parsing
        initialEvent = JSON.parse(initialEventData) as GameEvent;
      } catch (parseError) {
        console.error("Error parsing initial event data:", parseError);
        // Create a fallback event if parsing fails
        initialEvent = {
          story: "You begin your adventure in a mysterious land. The path ahead is shrouded in uncertainty.",
          options: ["Explore cautiously", "Look around", "Check your belongings"]
        };
      }
      
      // Update player location
      if (initialEvent.location) {
        setPlayerState(prev => ({
          ...prev,
          location: initialEvent.location!.name
        }));
      }
      
      setGameState(prev => ({
        ...prev,
        currentEvent: initialEvent,
        eventHistory: [initialEvent],
        isLoading: false
      }));
    } catch (error) {
      console.error("Error starting new game:", error);
      
      // Create a fallback initial event
      const fallbackEvent: GameEvent = {
        story: "Your adventure begins in a world of imagination. The storyteller seems a bit tired, but your journey must go on.",
        options: ["Start anyway", "Look around", "Wait patiently"]
      };
      
      setGameState(prev => ({
        ...prev,
        currentEvent: fallbackEvent,
        eventHistory: [fallbackEvent],
        isLoading: false,
        message: "Unable to connect to the storyteller. Using a basic starting point."
      }));
    }
  }, []);

  // Handle player input
  const handleInput = async (input: string) => {
    // Ignore input if loading or game over
    if (gameState.isLoading || gameState.isGameOver) {
      return;
    }
    
    // Special commands
    if (input.toLowerCase() === 'inventory' || input.toLowerCase() === 'i') {
      setShowInventory(true);
      return;
    }
    
    if (input.toLowerCase() === 'restart') {
      startNewGame();
      return;
    }
    
    if (input.toLowerCase() === 'rest' || input.toLowerCase() === 'sleep') {
      // Rest to recover some health
      const healthRestored = Math.floor(playerState.maxHealth * 0.2); // Recover 20% health
      const updatedPlayer = restoreHealth(playerState, healthRestored);
      
      setPlayerState(updatedPlayer);
      setGameState(prev => ({
        ...prev,
        message: `You take some time to rest. You recovered ${healthRestored} health.`
      }));
      return;
    }
    
    // Handle combat specific commands
    if (gameState.inCombat && gameState.currentEnemy) {
      if (input.toLowerCase() === 'attack') {
        const combatResult = handleCombatRound(playerState, gameState.currentEnemy);
        
        setPlayerState(combatResult.updatedPlayer);
        
        // Update message with combat log
        setGameState(prev => ({
          ...prev,
          currentEnemy: combatResult.updatedEnemy,
          message: combatResult.combatLog.join("\n"),
          inCombat: !combatResult.isCombatOver
        }));
        
        // If combat is over and player won, continue the story
        if (combatResult.isCombatOver) {
          if (combatResult.playerWon) {
            // Award XP for victory
            const xpGained = Math.floor(gameState.currentEnemy.health / 3 + gameState.currentEnemy.damage * 2);
            const goldGained = Math.floor(5 + Math.random() * 10);
            
            // Update player with rewards
            let updatedPlayer = gainXP(combatResult.updatedPlayer, xpGained);
            updatedPlayer.gold += goldGained;
            
            setPlayerState(updatedPlayer);
            
            // Store this victory in story context
            const victoryContext = `You defeated ${gameState.currentEnemy.name} and gained ${xpGained} XP and ${goldGained} gold.`;
            const playerWithUpdatedContext = addStoryContext(updatedPlayer, victoryContext);
            setPlayerState(playerWithUpdatedContext);
            
            // Continue the story after combat
            await getNextEvent(`You defeated ${gameState.currentEnemy.name} and continue your journey.`);
          } else {
            // Game over if player lost
            setGameState(prev => ({
              ...prev,
              isGameOver: true,
              message: "Game Over! You have been defeated."
            }));
          }
        }
        
        return;
      }
      
      if (input.toLowerCase() === 'defend') {
        const defendResult = handleDefend(playerState);
        setPlayerState(defendResult.updatedPlayer);
        setGameState(prev => ({
          ...prev,
          message: defendResult.message
        }));
        return;
      }
      
      if (input.toLowerCase() === 'flee') {
        // 50% chance to flee successfully
        const fleeSuccessful = Math.random() > 0.5;
        
        if (fleeSuccessful) {
          setGameState(prev => ({
            ...prev,
            inCombat: false,
            currentEnemy: undefined,
            message: "You managed to escape!"
          }));
          
          // Continue the story after fleeing
          await getNextEvent("You managed to escape and continue your journey.");
        } else {
          // Failed to flee, enemy gets a free attack
          const damageTaken = gameState.currentEnemy.damage;
          const updatedPlayer = {
            ...playerState,
            health: Math.max(0, playerState.health - damageTaken)
          };
          
          setPlayerState(updatedPlayer);
          
          if (updatedPlayer.health <= 0) {
            setGameState(prev => ({
              ...prev,
              isGameOver: true,
              message: `Failed to escape! ${gameState.currentEnemy?.name || 'Enemy'} dealt ${damageTaken} damage. You have been defeated.`
            }));
          } else {
            setGameState(prev => ({
              ...prev,
              message: `Failed to escape! ${gameState.currentEnemy?.name || 'Enemy'} dealt ${damageTaken} damage.`
            }));
          }
        }
        return;
      }
    }
    
    // Regular story progression
    await getNextEvent(input);
  };

  // Get the next story event
  const getNextEvent = async (input: string) => {
    setGameState(prev => ({
      ...prev,
      isLoading: true,
      message: undefined
    }));
    
    try {
      const eventData = await getRandomStoryEvent(playerState, input);
      let event: GameEvent;
      
      try {
        // Safe JSON parsing
        event = JSON.parse(eventData) as GameEvent;
      } catch (parseError) {
        console.error("Error parsing event data:", parseError);
        // Create a fallback event if parsing fails
        event = {
          story: "There was an issue generating your adventure. The story teller seems confused.",
          options: ["Try again", "Go in a different direction", "Rest for a while"]
        };
      }
      
      // Update player location if a new one is provided
      if (event.location && event.location.name !== playerState.location) {
        setPlayerState(prev => ({
          ...prev,
          location: event.location!.name
        }));
      }
      
      // Update story context to maintain continuity
      const updatedPlayerWithContext = addStoryContext(playerState, event.story);
      setPlayerState(updatedPlayerWithContext);
      
      // Add rewards to inventory if any
      if (event.rewards && event.rewards.length > 0) {
        let updatedPlayer = { ...updatedPlayerWithContext };
        
        for (const reward of event.rewards) {
          const result = addItemToInventory(updatedPlayer, reward);
          updatedPlayer = result.updatedPlayer;
          
          // Show a message about finding an item
          setGameState(prev => ({
            ...prev,
            message: prev.message 
              ? `${prev.message}\nYou found ${reward.name}!` 
              : `You found ${reward.name}!`
          }));
        }
        
        setPlayerState(updatedPlayer);
      }
      
      // Check for combat encounter
      if (event.enemies && event.enemies.length > 0) {
        // For simplicity, just use the first enemy
        const enemy = event.enemies[0];
        setGameState(prev => ({
          ...prev,
          currentEvent: event,
          eventHistory: [...prev.eventHistory, event],
          isLoading: false,
          inCombat: true,
          currentEnemy: enemy
        }));
      } else {
        // Regular story progression
        setGameState(prev => ({
          ...prev,
          currentEvent: event,
          eventHistory: [...prev.eventHistory, event],
          isLoading: false,
          inCombat: false,
          currentEnemy: undefined
        }));
      }
    } catch (error) {
      console.error("Error getting next event:", error);
      setGameState(prev => ({
        ...prev,
        isLoading: false,
        message: "Error generating the next part of your adventure. Please try again."
      }));
    }
  };

  // Handle using an item from inventory
  const handleUseItem = (itemId: string) => {
    const result = useItem(playerState, itemId);
    
    if (result.success) {
      setPlayerState(result.updatedPlayer);
      setGameState(prev => ({
        ...prev,
        message: result.message
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        message: result.message
      }));
    }
    
    setShowInventory(false);
  };

  // Start a new game on initial load
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  return (
    <div className="min-h-screen bg-gray-900 p-2 sm:p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <header className="mb-3 sm:mb-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-green-400 font-mono">Random Story RPG</h1>
          <p className="text-sm sm:text-base text-gray-400 font-mono">A text-based adventure where every playthrough is unique</p>
        </header>

        <main className="flex flex-col gap-3 sm:gap-4">
          <ConsoleDisplay 
            gameEvents={gameState.eventHistory}
            playerState={playerState}
            currentEnemy={gameState.currentEnemy}
            inCombat={gameState.inCombat}
            message={gameState.message}
            isLoading={gameState.isLoading}
          />
          
          <div className="flex gap-2 justify-between">
            <button
              onClick={() => setShowInventory(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded font-mono text-sm sm:text-base"
              aria-label="Open inventory"
            >
              Inventory [I]
            </button>
            
            <button
              onClick={startNewGame}
              className="bg-red-900 hover:bg-red-800 text-white px-3 sm:px-4 py-2 rounded font-mono text-sm sm:text-base"
              aria-label="Start new game"
            >
              {gameState.isGameOver ? "New Game" : "Restart"}
            </button>
          </div>
          
          <InputHandler 
            onSubmit={handleInput}
            disabled={gameState.isLoading || gameState.isGameOver}
            options={gameState.currentEvent.options}
            inCombat={gameState.inCombat}
          />
          
          {gameState.isGameOver && (
            <div className="text-center mt-4">
              <p className="text-red-500 font-bold mb-2">Game Over!</p>
              <button
                onClick={startNewGame}
                className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-full font-mono"
                aria-label="Start a new adventure"
              >
                Start a New Adventure
              </button>
            </div>
          )}
        </main>
        
        <footer className="mt-6 sm:mt-8 text-center text-gray-500 text-xs font-mono">
          <p>Random Story RPG - Powered by AI</p>
          <p className="mt-1">Use commands like &apos;look&apos;, &apos;inventory&apos;, &apos;examine&apos;, or choose options.</p>
        </footer>
      </div>
      
      {/* Inventory Modal */}
      <Inventory
        playerState={playerState}
        onUseItem={handleUseItem}
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
      />
    </div>
  );
}
