// Utility functions for story generation

/**
 * Extracts keywords from a story text
 */
export const extractKeywords = (text: string): string[] => {
  // Extended list of important thematic words to look for
  const thematicWords = [
    // Characters & Relationships
    'love', 'friend', 'enemy', 'ally', 'betray', 'family', 'stranger',
    
    // Places
    'shop', 'tavern', 'inn', 'forest', 'village', 'town', 'castle', 'mountain', 
    'river', 'cave', 'dungeon', 'ruins', 'temple', 'church', 'camp',
    
    // Combat & Danger
    'fight', 'battle', 'attack', 'ambush', 'trap', 'weapon', 'sword', 'bow', 
    'magic', 'spell', 'monster', 'beast', 'dragon', 'undead', 'wolf',
    
    // Items & Treasure 
    'gold', 'money', 'treasure', 'chest', 'loot', 'potion', 'scroll', 'map',
    
    // Story elements
    'quest', 'mission', 'task', 'save', 'help', 'rescue', 'steal', 'escape',
    'danger', 'secret', 'mystery', 'clue', 'puzzle', 'riddle', 'trap',
    
    // Authority & Social 
    'king', 'queen', 'guard', 'soldier', 'thief', 'merchant', 'priest',
    'crime', 'law', 'arrest', 'prison', 'noble', 'peasant', 'beggar'
  ];
  
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Find matching keywords in the text
  return thematicWords.filter(word => lowerText.includes(word));
};

/**
 * Analyzes text to determine story context
 */
export const analyzeStoryContext = (text: string) => {
  const lowerText = text.toLowerCase();
  
  // More robust combat detection
  const combatWords = ['fight', 'battle', 'attack', 'defend', 'weapon', 'enemy', 'monster', 'ambush', 'defeat', 
    'sword', 'dagger', 'bow', 'arrow', 'shield', 'armor', 'warrior', 'blood', 'strike', 'hit', 'kill',
    'slay', 'combat', 'threat', 'danger', 'challenge', 'beast', 'creature'];
  
  // Check for explicit combat words
  const hasCombatWords = combatWords.some(word => lowerText.includes(word));
  
  return {
    hasCombat: hasCombatWords,
    hasTreasure: /gold|coin|treasure|money|wealth|rich|loot|chest|jewel|gem/i.test(text),
    hasSocialInteraction: /talk|speak|ask|tell|say|friend|stranger|villager|innkeeper|meet|greet/i.test(text),
    hasMystery: /mystery|secret|clue|puzzle|strange|unknown|discover|curious|odd|suspicious/i.test(text),
    hasDanger: /danger|threat|trap|risk|dangerous|careful|deadly|die|death|peril|doom/i.test(text),
    hasExploration: /path|road|door|forest|cave|dungeon|explore|find|search|discover|venture/i.test(text),
    hasMission: /quest|mission|task|job|assignment|deliver|find|rescue|help|objective/i.test(text)
  };
};

/**
 * Generates dynamic story options based on story content
 */
export const generateDynamicOptions = (text: string): string[] => {
  const keywords = extractKeywords(text);
  const context = analyzeStoryContext(text);
  let options: string[] = [];
  
  // === COMBAT OPTIONS (prioritized) ===
  if (context.hasCombat) {
    options.push("Fight"); // Use "Fight" instead of "Attack" - simpler
    options.push("Jump away"); // "Dodge" replaced with simpler language
    
    if (keywords.includes('weapon') || keywords.includes('sword') || keywords.includes('bow')) {
      options.push("Use my weapon");
    }
    
    options.push("Run away"); // "Retreat" replaced with simpler language
  }
  
  // === EXPLORATION OPTIONS ===
  if (context.hasExploration) {
    options.push("Look more");
    options.push("Go another way");
    options.push("Look for stuff");
  } else {
    options.push("Look around");
  }
  
  // === SOCIAL OPTIONS ===
  if (context.hasSocialInteraction) {
    options.push("Talk");
    options.push("Listen");
    
    if (keywords.includes('friend') || keywords.includes('ally')) {
      options.push("Ask for help");
    }
    
    if (keywords.includes('betray') || keywords.includes('enemy')) {
      options.push("Be careful");
      options.push("Talk to them"); // "Confront" replaced with simpler language
    }
  }
  
  // === TREASURE OPTIONS ===
  if (context.hasTreasure) {
    options.push("Look for treasure");
    options.push("Take stuff");
    options.push("Look closer");
  }
  
  // === MYSTERY OPTIONS ===
  if (context.hasMystery) {
    options.push("Find out more");
    options.push("Ask around");
    options.push("Look for hints");
  }
  
  // === DANGER OPTIONS ===
  if (context.hasDanger && !context.hasCombat) {
    options.push("Be careful");
    options.push("Find another way");
    options.push("Get ready");
  }
  
  // === MISSION OPTIONS ===
  if (context.hasMission) {
    options.push("Say yes");
    options.push("Say no");
    options.push("Ask for more");
  }
  
  // === LOCATION-BASED OPTIONS ===
  if (keywords.includes('shop') || keywords.includes('merchant')) {
    options.push("Buy stuff");
    options.push("Sell stuff");
    options.push("Ask for better price");
  }
  
  if (keywords.includes('tavern') || keywords.includes('inn')) {
    options.push("Get a drink");
    options.push("Get a room");
    options.push("Listen to stories");
  }
  
  if (keywords.includes('temple') || keywords.includes('church')) {
    options.push("Pray");
    options.push("Ask for help");
    options.push("Give a gift");
  }
  
  // If we still don't have enough options, add generic ones
  if (options.length < 3) {
    options.push("Keep going");
    options.push("Wait");
    options.push("Think");
  }
  
  // IMPORTANT: Add combat options a second time to ensure they're considered
  // This increases the chance that combat options will be selected
  if (context.hasCombat) {
    options.push("Fight");
    options.push("Protect myself");
  }
  
  // Shuffle the options to prevent predictability
  const shuffled = [...new Set(options)].sort(() => 0.5 - Math.random());
  
  // Return 4 options (more than before for better variety)
  return shuffled.slice(0, 4);
}; 