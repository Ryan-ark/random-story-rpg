'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../utils/env';

const Debug = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiError, setApiError] = useState<string | null>(null);
  
  const apiUrl = env.GROQ_API_URL;
  const apiKey = env.GROQ_API_KEY;
  const apiKeyExists = !!apiKey;
  
  // Mask the API key for display (show only first 6 and last 4 chars)
  const maskedApiKey = apiKey 
    ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`
    : 'Not set';

  // Test the API connection
  useEffect(() => {
    if (!apiKeyExists) {
      setApiStatus('error');
      setApiError('API key not set');
      return;
    }

    const testApiConnection = async () => {
      try {
        // Just test if we can connect to the models endpoint as a simple check
        const response = await axios.get(`${apiUrl}/models`, {
          headers: {
            'authorization': `bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          setApiStatus('success');
        } else {
          setApiStatus('error');
          setApiError(`Unexpected status code: ${response.status}`);
        }
      } catch (error: any) {
        setApiStatus('error');
        setApiError(error.message || 'Unknown error');
      }
    };

    testApiConnection();
  }, [apiUrl, apiKey, apiKeyExists]);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
      >
        {showDetails ? 'Hide Debug' : 'Show Debug'}
      </button>
      
      {showDetails && (
        <div className="bg-gray-900 text-white p-4 rounded mt-2 text-xs font-mono max-w-md">
          <h3 className="font-bold mb-2">Environment Variables:</h3>
          <p>NEXT_PUBLIC_GROQ_API_URL: {apiUrl}</p>
          <p>NEXT_PUBLIC_GROQ_API_KEY: {maskedApiKey}</p>
          
          <h3 className="font-bold mt-3 mb-2">API Status:</h3>
          <p>Status: 
            {apiStatus === 'loading' && <span className="text-yellow-400 ml-1">Testing connection...</span>}
            {apiStatus === 'success' && <span className="text-green-400 ml-1">Connected successfully</span>}
            {apiStatus === 'error' && <span className="text-red-400 ml-1">Connection failed</span>}
          </p>
          {apiError && <p className="text-red-400 break-words">Error: {apiError}</p>}
          
          <div className="mt-3 text-xs text-gray-400">
            <p>Note: Make sure you have a valid GROQ API key from <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">console.groq.com/keys</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debug; 