// Player types
export interface PlayerState {
  name: string;
  health: number;
  maxHealth: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  inventory: Item[];
  location: string;
  equippedWeapon: string;
  storyContext: string[]; // Store previous story segments
}

export interface PlayerStats {
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  luck: number;
}

export interface Skill {
  name: string;
  level: number;
  description: string;
}

// Item types
export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'valuable' | 'quest';
  description: string;
  effect?: {
    health?: number;
    damage?: number;
    defense?: number;
    tempDamage?: number;
    value?: number;
  };
}

export interface ItemEffect {
  stat: keyof PlayerStats | 'health';
  value: number;
  duration?: number; // In turns, undefined means permanent
}

// Enemy types
export interface Enemy {
  name: string;
  health: number;
  maxHealth?: number;
  damage: number;
  description?: string;
  level: number;
  loot?: Item[];
}

// Location types
export interface Location {
  name: string;
  description: string;
  enemies?: Enemy[];
  items?: Item[];
}

// Game event types
export interface GameEvent {
  story: string;
  options: string[];
  rewards?: Item[];
  enemies?: Enemy[];
  location?: {
    name: string;
    description: string;
  };
  events?: string[];
  npcs?: {
    name: string;
    attitude: 'friendly' | 'neutral' | 'hostile';
    dialogue?: string;
  }[];
  previousContext?: string; // Link to previous story elements
}

// Game state types
export interface GameState {
  currentEvent: GameEvent;
  eventHistory: GameEvent[];
  isLoading: boolean;
  isGameOver: boolean;
  inCombat: boolean;
  currentEnemy?: Enemy;
  message?: string;
  storyConsistency?: number; // Track how consistent the story is
}

export interface CombatResult {
  updatedPlayer: PlayerState;
  updatedEnemy: Enemy;
  combatLog: string[];
  isCombatOver: boolean;
  playerWon: boolean;
  rewards?: {
    xp: number;
    gold: number;
    items?: Item[];
  };
} 