import type { NextConfig } from "next";

// Load environment variables from .env.local if not already loaded
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_GROQ_API_URL: process.env.NEXT_PUBLIC_GROQ_API_URL || 'https://api.groq.com/openai/v1',
    NEXT_PUBLIC_GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  }
};

export default nextConfig;
