'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import env from '../utils/env';

interface Model {
  id: string;
  owned_by: string;
  context_window: number;
}

const ModelSelector = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModels, setShowModels] = useState(false);
  
  const apiUrl = env.GROQ_API_URL;
  const apiKey = env.GROQ_API_KEY;
  
  useEffect(() => {
    const fetchModels = async () => {
      if (!apiKey) {
        setError('API key not set');
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${apiUrl}/models`, {
          headers: {
            'authorization': `bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data?.data) {
          setModels(response.data.data);
        } else {
          setError('No models found in response');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [apiUrl, apiKey]);
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={() => setShowModels(!showModels)}
        className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
      >
        {showModels ? 'Hide Models' : 'Show Models'}
      </button>
      
      {showModels && (
        <div className="bg-gray-900 text-white p-4 rounded mt-2 text-xs font-mono max-w-md max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-2">Available GROQ Models:</h3>
          
          {loading && <p className="text-yellow-400">Loading models...</p>}
          
          {error && <p className="text-red-400">Error: {error}</p>}
          
          {!loading && !error && models.length === 0 && (
            <p className="text-gray-400">No models available</p>
          )}
          
          {models.length > 0 && (
            <ul className="space-y-2">
              {models.map(model => (
                <li key={model.id} className="border-b border-gray-800 pb-1">
                  <div className="font-bold text-green-400">{model.id}</div>
                  <div className="text-gray-400">Owner: {model.owned_by}</div>
                  <div className="text-gray-400">Context Window: {model.context_window}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 