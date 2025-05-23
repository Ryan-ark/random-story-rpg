// Centralized place to access environment variables
const env = {
  // Always use the default URL even if env var is missing
  GROQ_API_URL: 'https://api.groq.com/openai/v1',
  
  // Hard-coded API key (temporary for testing)
  GROQ_API_KEY: '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',
  
  // Valid GROQ model IDs (as of July 2023)
  VALID_MODELS: [
    'llama3-8b-8192',
    'llama3-70b-8192',
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
  ],
  
  // Default model to use
  DEFAULT_MODEL: 'llama3-8b-8192',
};

// Log environment variables during initialization
console.log('=== Environment Variables (Hardcoded) ===');
console.log('GROQ_API_URL:', env.GROQ_API_URL);
console.log('GROQ_API_KEY exists:', !!env.GROQ_API_KEY);
console.log('GROQ_API_KEY first 6 chars:', env.GROQ_API_KEY.substring(0, 6));
console.log('Using default model:', env.DEFAULT_MODEL);

export default env; 