import { PlayerState, Enemy, Item } from './types';

// Handle combat round between player and enemy
export const handleCombatRound = (
  playerState: PlayerState, 
  enemy: Enemy
): {
  updatedPlayer: PlayerState;
  updatedEnemy: Enemy;
  combatLog: string[];
  isCombatOver: boolean;
  playerWon: boolean;
} => {
  const combatLog: string[] = [];
  let updatedPlayer = { ...playerState };
  let updatedEnemy = { ...enemy };
  let isCombatOver = false;
  let playerWon = false;

  // Calculate player damage (base + weapon bonus)
  const playerWeapon = updatedPlayer.inventory.find(
    item => item.id === updatedPlayer.equippedWeapon
  );
  const playerDamage = 
    Math.floor(5 + (playerWeapon?.effect?.damage || 0) * (1 + 0.1 * (updatedPlayer.level - 1)));

  // Player attacks enemy
  updatedEnemy.health = Math.max(0, updatedEnemy.health - playerDamage);
  combatLog.push(`You hit ${enemy.name} for ${playerDamage} damage!`);

  // Check if enemy is defeated
  if (updatedEnemy.health <= 0) {
    combatLog.push(`You have defeated ${enemy.name}!`);
    
    // Award experience and gold are now handled in the page component
    
    isCombatOver = true;
    playerWon = true;
    
    return { updatedPlayer, updatedEnemy, combatLog, isCombatOver, playerWon };
  }

  // Enemy counter-attacks
  const enemyDamage = Math.max(1, enemy.damage);
  updatedPlayer.health = Math.max(0, updatedPlayer.health - enemyDamage);
  combatLog.push(`${enemy.name} hits you for ${enemyDamage} damage!`);

  // Check if player is defeated
  if (updatedPlayer.health <= 0) {
    combatLog.push(`You have been defeated by ${enemy.name}!`);
    isCombatOver = true;
    playerWon = false;
  }

  return { updatedPlayer, updatedEnemy, combatLog, isCombatOver, playerWon };
};

// Handle player defending (reduced damage in next enemy attack)
export const handleDefend = (
  playerState: PlayerState
): {
  updatedPlayer: PlayerState;
  message: string;
} => {
  // Restore a small amount of health when defending
  const healthRestored = Math.floor(playerState.maxHealth * 0.05);
  const updatedPlayer = {
    ...playerState,
    health: Math.min(playerState.maxHealth, playerState.health + healthRestored)
  };
  
  return {
    updatedPlayer,
    message: `You take a defensive stance and recover ${healthRestored} health.`
  };
};

// Add item to player inventory
export const addItemToInventory = (
  playerState: PlayerState,
  item: Item
): {
  updatedPlayer: PlayerState;
  success: boolean;
  message: string;
} => {
  // Create a copy of the player state
  const updatedPlayer = { ...playerState };
  
  // Add the item to the inventory
  updatedPlayer.inventory = [...updatedPlayer.inventory, item];
  
  return {
    updatedPlayer,
    success: true,
    message: `${item.name} added to your inventory!`
  };
};

// Use item from inventory
export const useItem = (
  playerState: PlayerState,
  itemId: string
): {
  updatedPlayer: PlayerState;
  success: boolean;
  message: string;
} => {
  // Find the item in the inventory
  const itemIndex = playerState.inventory.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return {
      updatedPlayer: playerState,
      success: false,
      message: 'Item not found in inventory.'
    };
  }
  
  const item = playerState.inventory[itemIndex];
  
  // Handle consumable items
  if (item.type === 'consumable') {
    // Create a copy of the player state
    const updatedPlayer = { ...playerState };
    
    // Apply item effects
    if (item.effect && item.effect.health) {
      updatedPlayer.health = Math.min(
        updatedPlayer.maxHealth,
        updatedPlayer.health + item.effect.health
      );
    }
    
    // Remove the item from inventory
    updatedPlayer.inventory = [
      ...updatedPlayer.inventory.slice(0, itemIndex),
      ...updatedPlayer.inventory.slice(itemIndex + 1)
    ];
    
    return {
      updatedPlayer,
      success: true,
      message: `Used ${item.name}. ${
        item.effect?.health ? `Restored ${item.effect.health} health.` : ''
      }`
    };
  }
  
  // Handle equippable items
  if (item.type === 'weapon') {
    const updatedPlayer = {
      ...playerState,
      equippedWeapon: item.id
    };
    
    return {
      updatedPlayer,
      success: true,
      message: `Equipped ${item.name}.`
    };
  }
  
  return {
    updatedPlayer: playerState,
    success: false,
    message: `Cannot use ${item.name}.`
  };
};

// Initialize default player state
export const initializePlayerState = (): PlayerState => {
  return {
    name: 'Adventurer',
    health: 100,
    maxHealth: 100,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gold: 10,
    inventory: [
      {
        id: 'healing_potion',
        name: 'Healing Potion',
        type: 'consumable' as const,
        description: 'Restores 25 health points.',
        effect: { health: 25 }
      },
      {
        id: 'rusty_sword',
        name: 'Rusty Sword',
        type: 'weapon' as const,
        description: 'An old but serviceable blade.',
        effect: { damage: 5 }
      }
    ],
    location: 'Village Outskirts',
    equippedWeapon: 'rusty_sword',
    storyContext: [] // Track story history
  };
};

// Calculate XP reward based on enemy and player level
export const calculateXPReward = (enemy: Enemy, playerLevel: number): number => {
  // Base XP from enemy
  const baseXP = enemy.health / 3 + enemy.damage * 2;
  
  // Adjust XP based on level difference
  const levelDiff = enemy.level - playerLevel;
  const levelMultiplier = Math.max(0.5, 1 + levelDiff * 0.1);
  
  return Math.floor(baseXP * levelMultiplier);
};

// Calculate gold reward based on enemy
export const calculateGoldReward = (enemy: Enemy): number => {
  return Math.floor(enemy.level * 5 + Math.random() * 10);
};

// Grant XP to player and handle level ups
export const gainXP = (playerState: PlayerState, amount: number): PlayerState => {
  const updatedPlayer = { ...playerState };
  updatedPlayer.xp += amount;
  
  // Check for level up
  while (updatedPlayer.xp >= updatedPlayer.xpToNextLevel) {
    updatedPlayer.xp -= updatedPlayer.xpToNextLevel;
    updatedPlayer.level += 1;
    
    // Increase stats for level up
    updatedPlayer.maxHealth += 10;
    updatedPlayer.health = updatedPlayer.maxHealth; // Full heal on level up
    
    // Increase XP required for next level
    updatedPlayer.xpToNextLevel = Math.floor(updatedPlayer.xpToNextLevel * 1.5);
  }
  
  return updatedPlayer;
};

// Rest to restore health
export const restoreHealth = (playerState: PlayerState, amount: number): PlayerState => {
  return {
    ...playerState,
    health: Math.min(playerState.maxHealth, playerState.health + amount)
  };
};

// Add story context to track narrative continuity
export const addStoryContext = (
  playerState: PlayerState, 
  newContext: string
): PlayerState => {
  // Keep only the last 3 story events for context (to avoid prompt getting too large)
  const updatedContext = [...playerState.storyContext, newContext].slice(-3);
  
  return {
    ...playerState,
    storyContext: updatedContext
  };
};

// Generate a random item based on player level
export const generateRandomItem = (playerLevel: number): Item => {
  const itemTypes = ['weapon', 'consumable', 'valuable'] as const;
  const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  
  if (itemType === 'consumable') {
    const potions = [
      {
        id: `health_potion_${Date.now()}`,
        name: 'Health Potion',
        type: 'consumable' as const,
        description: 'Restores 25 health points.',
        effect: { health: 25 }
      },
      {
        id: `strength_potion_${Date.now()}`,
        name: 'Strength Potion',
        type: 'consumable' as const,
        description: 'Temporarily increases damage.',
        effect: { tempDamage: 5 }
      }
    ];
    
    return potions[Math.floor(Math.random() * potions.length)];
  }
  
  if (itemType === 'weapon') {
    const weapons = [
      {
        id: `sword_${Date.now()}`,
        name: 'Fine Sword',
        type: 'weapon' as const,
        description: 'A well-crafted sword.',
        effect: { damage: 7 + Math.floor(playerLevel / 2) }
      },
      {
        id: `axe_${Date.now()}`,
        name: 'Battle Axe',
        type: 'weapon' as const,
        description: 'A heavy axe that deals good damage.',
        effect: { damage: 9 + Math.floor(playerLevel / 2) }
      },
      {
        id: `dagger_${Date.now()}`,
        name: 'Sharp Dagger',
        type: 'weapon' as const,
        description: 'A quick blade for swift attacks.',
        effect: { damage: 5 + Math.floor(playerLevel / 2) }
      }
    ];
    
    return weapons[Math.floor(Math.random() * weapons.length)];
  }
  
  // Valuable item
  const valuables = [
    {
      id: `gem_${Date.now()}`,
      name: 'Sparkling Gem',
      type: 'valuable' as const,
      description: 'Worth a good amount of gold.',
      effect: { value: 20 + playerLevel * 5 }
    },
    {
      id: `jewelry_${Date.now()}`,
      name: 'Gold Necklace',
      type: 'valuable' as const,
      description: 'A valuable piece of jewelry.',
      effect: { value: 15 + playerLevel * 4 }
    }
  ];
  
  return valuables[Math.floor(Math.random() * valuables.length)];
}; 