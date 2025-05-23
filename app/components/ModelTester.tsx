'use client';

import { useState } from 'react';
import axios from 'axios';
import env from '../utils/env';

const ModelTester = () => {
  const [showTester, setShowTester] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3-8b-8192');
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(false);
  
  // List of models to try
  const modelOptions = [
    'llama3-8b-8192',
    'llama3-70b-8192',
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
  ];
  
  const testModel = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Make a very simple request to test if the model works
      const response = await axios.post(
        `${env.GROQ_API_URL}/chat/completions`, 
        {
          model: selectedModel,
          messages: [
            { role: 'user', content: 'Say hello' }
          ],
          max_tokens: 10
        },
        {
          headers: {
            'authorization': `bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResult({
        success: true,
        message: `Success! Model responded with: "${response.data.choices[0].message.content}"`
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
      setResult({
        success: false,
        message: `Error: ${errorMessage}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed top-4 left-4 z-50">
      <button 
        onClick={() => setShowTester(!showTester)}
        className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
      >
        {showTester ? 'Hide Tester' : 'Model Tester'}
      </button>
      
      {showTester && (
        <div className="bg-gray-900 text-white p-4 rounded mt-2 text-xs font-mono max-w-md">
          <h3 className="font-bold mb-2">Test GROQ Models:</h3>
          
          <div className="mb-4">
            <label className="block mb-1">Select Model:</label>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-gray-800 text-white p-1 w-full rounded"
            >
              {modelOptions.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={testModel}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test This Model'}
          </button>
          
          {result && (
            <div className={`mt-4 p-2 rounded ${result.success ? 'bg-green-900' : 'bg-red-900'}`}>
              {result.message}
            </div>
          )}
          
          <div className="mt-4 text-gray-400">
            <p>This tool tests if the selected model is available with your API key.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelTester; 