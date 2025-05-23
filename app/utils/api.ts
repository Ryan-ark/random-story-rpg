import axios from 'axios';
import env from './env';
import { generateDynamicOptions } from './storyUtils';
import { generateRandomItem } from './gameLogic';

// Create an axios instance for GROQ API
const api = axios.create({
  baseURL: env.GROQ_API_URL,
  headers: {
    'authorization': `bearer ${env.GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Helper function to log errors in detail
const logError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('Response error:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request error:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
  }
};

// Function to generate a random story event
export const getRandomStoryEvent = async (playerState: any, input?: string) => {
  try {
    console.log('Making API request to:', env.GROQ_API_URL);
    console.log('Using model:', env.DEFAULT_MODEL);
    
    // Build story context from previous events
    const pastContext = playerState.storyContext && playerState.storyContext.length > 0
      ? `Previous events:\n${playerState.storyContext.join('\n\n')}`
      : '';
    
    // Updated prompt to maintain story continuity
    const systemPrompt = `You're an RPG storyteller creating a CONTINUOUS adventure story. CRITICAL RULES:
    - Use DIRECT language with NO flowery words
    - Keep responses SHORT normally (30-50 words)
    - For intense moments (combat, plot twists, discoveries), use up to 100 words
    - DO NOT include options/choices in your text (no "What do you do?" or "Choose your response")
    - DO NOT use A) B) C) D) format in your text
    - Include ACTION WORDS like: attack, fight, danger, weapon when there's combat
    - ALWAYS specify a specific location name
    - End with describing the situation, not asking what to do
    - IMPORTANT: MAINTAIN CONTINUITY with previous events - don't contradict what happened before
    - Reference characters, locations, or objects from previous events
    
    Current player: Level ${playerState.level}, Health: ${playerState.health}/${playerState.maxHealth}, Gold: ${playerState.gold}`;
    
    // Build user prompt based on player input and story context
    const userPrompt = input 
      ? `Continue the adventure based on: "${input}". 
         ${pastContext ? `\n\n${pastContext}\n\nMaintain continuity with these events.` : ''}
         Be direct. Specify a location name. Don't list options.`
      : `Start new adventure. Specify a location name. Don't ask "what will you do?" or list options.`;
    
    const response = await api.post('/chat/completions', {
      model: env.DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.85,
      max_tokens: 150
    });

    // Process the response
    let content = response.data.choices[0].message.content;
    
    // Remove any A) B) C) D) patterns or "what do you do" questions
    content = content.replace(/what (?:will|do|should|would) you do\??/gi, '');
    content = content.replace(/choose (?:your|an?) (?:option|response|action|choice)/gi, '');
    content = content.replace(/[A-D]\) .+?(?=([A-D]\)|$))/g, '');
    
    // Extract location from the content if possible
    let locationName = playerState.location || "Unknown";
    
    // Try to find location patterns
    const locationPatterns = [
      /(?:in|at) (?:the|a) ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/,
      /Location: ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/,
      /([A-Z][a-z]+ (?:Forest|Village|Town|City|Castle|Cave|Dungeon|Temple|Ruins|Mountains|Valley))/
    ];
    
    for (const pattern of locationPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        locationName = match[1];
        break;
      }
    }
    
    // If no location found, try to extract a reasonable one based on context
    if (locationName === "Unknown") {
      const contextWords = ["forest", "cave", "village", "town", "castle", "mountain", "river", 
                           "temple", "dungeon", "market", "road", "path", "inn", "tavern"];
      
      for (const word of contextWords) {
        if (content.toLowerCase().includes(word)) {
          // Capitalize first letter
          locationName = word.charAt(0).toUpperCase() + word.slice(1);
          if (word === "road" || word === "path") {
            locationName += " Outside Town";
          }
          break;
        }
      }
    }
    
    // Check for random events with probability
    const includeRandomEvent = Math.random() < 0.3; // 30% chance
    
    // Potential rewards or enemies based on content
    let rewards = [];
    let enemies = [];
    
    // Check for treasure/item discovery
    if (content.toLowerCase().includes('treasure') || 
        content.toLowerCase().includes('find') || 
        content.toLowerCase().includes('discover') ||
        Math.random() < 0.2) { // 20% chance of random item
      rewards.push(generateRandomItem(playerState.level));
    }
    
    // Check for combat scenario
    if (content.toLowerCase().includes('attack') || 
        content.toLowerCase().includes('enemy') || 
        content.toLowerCase().includes('monster') ||
        content.toLowerCase().includes('fight') ||
        content.toLowerCase().includes('battle')) {
      
      // Create an appropriate enemy based on player level
      const enemyTypes = [
        'Bandit', 'Wolf', 'Skeleton', 'Goblin', 'Orc', 
        'Troll', 'Dark Mage', 'Zombie', 'Giant Rat', 'Slime'
      ];
      
      const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const enemyLevel = Math.max(1, playerState.level + Math.floor(Math.random() * 3) - 1);
      
      enemies.push({
        name: enemyType,
        health: 30 + enemyLevel * 10,
        damage: 5 + enemyLevel * 2,
        description: `A fierce ${enemyType.toLowerCase()}`,
        level: enemyLevel
      });
    }
    
    // Generate dynamic options based on story content
    const options = generateDynamicOptions(content);
    
    // Generate a structured response
    return JSON.stringify({
      story: content,
      options: options,
      location: {
        name: locationName,
        description: `A ${locationName.toLowerCase()} area with potential dangers and opportunities.`
      },
      rewards: rewards,
      enemies: enemies,
      previousContext: input || ''
    });
    
  } catch (error) {
    // Enhanced error logging
    console.error("Error fetching from GROQ API:");
    logError(error);
    
    // Return a properly formatted JSON string with an error message
    return JSON.stringify({
      story: "Connection failed. Try again.",
      options: ["Restart", "Try again"]
    });
  }
};

export default api; 