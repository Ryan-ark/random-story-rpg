'use client';

import { useEffect } from 'react';

const EnvTest = () => {
  useEffect(() => {
    // Log the environment variables to the console
    console.log('Environment variables check:');
    console.log('NEXT_PUBLIC_GROQ_API_URL:', process.env.NEXT_PUBLIC_GROQ_API_URL);
    console.log('NEXT_PUBLIC_GROQ_API_KEY exists:', !!process.env.NEXT_PUBLIC_GROQ_API_KEY);
    
    // Also log all available environment variables that start with NEXT_PUBLIC
    console.log('All NEXT_PUBLIC environment variables:');
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        console.log(`${key}: ${key.includes('KEY') ? '[HIDDEN]' : process.env[key]}`);
      }
    });
  }, []);
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white p-4 rounded text-xs font-mono">
      <h3 className="font-bold mb-2">Environment Test:</h3>
      <p>API URL: {process.env.NEXT_PUBLIC_GROQ_API_URL || 'Not set'}</p>
      <p>API KEY: {process.env.NEXT_PUBLIC_GROQ_API_KEY ? 'Set' : 'Not set'}</p>
      <p className="mt-2 text-yellow-400">Check browser console for all env vars</p>
    </div>
  );
};

export default EnvTest; 