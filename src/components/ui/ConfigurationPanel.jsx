/**
 * Configuration panel for API settings
 * Updated to include Puter.js support
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { useState, useEffect } from 'react';
import { isPuterAvailable, checkPuterAuth, triggerPuterLogin, triggerPuterLogout } from '../../services/puterAiService';
import { isOllamaAvailable } from '../../services/ollamaService';
import { AI_CONFIG } from '../../utils/config.js';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const ConfigurationPanel = ({ 
  apiProvider, 
  setApiProvider,
  selectedModel,
  setSelectedModel
}) => {
  const [puterStatus, setPuterStatus] = useState(false);
  const [puterAuthStatus, setPuterAuthStatus] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState(false);
  
  // Use theme context with fallback
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }

  useEffect(() => {
    // Check if Puter.js is available
    const checkPuter = () => {
      setPuterStatus(isPuterAvailable());
    };
    
    // Check if Ollama is available
    const checkOllama = async () => {
      const available = await isOllamaAvailable();
      setOllamaStatus(available);
    };
    
    checkPuter();
    checkOllama();
    
    // Recheck after a short delay in case services are still loading
    setTimeout(() => {
      checkPuter();
      checkOllama();
    }, 1000);
  }, []);

  useEffect(() => {
    // Check Puter auth status periodically
    const checkAuth = () => {
      const status = checkPuterAuth();
      setPuterAuthStatus(status);
    };
    
    checkAuth();
    const interval = setInterval(checkAuth, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handlePuterLogin = async () => {
    const success = await triggerPuterLogin();
    if (success) {
      // Check status again after login
      setTimeout(() => {
        const status = checkPuterAuth();
        setPuterAuthStatus(status);
      }, 1000);
    }
  };

  const handlePuterLogout = async () => {
    const result = await triggerPuterLogout();
    if (result.success) {
      // Check status again after logout
      setTimeout(() => {
        const status = checkPuterAuth();
        setPuterAuthStatus(status);
      }, 1000);
    }
  };

  return (
    <div className={`rounded-xl shadow-lg border p-7 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-3">
          <label className={`text-sm font-semibold ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>AI Provider:</label>
          <select
            value={apiProvider}
            onChange={(e) => setApiProvider(e.target.value)}
            className={`px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            {puterStatus && (
              <option value="puter">🚀 Puter.js</option>
            )}
            <option value="ollama">🦙 Ollama (Local)</option>
            <option value="grok">xAI Grok</option>
            <option value="openai">OpenAI GPT-4</option>
          </select>
        </div>

        {/* Model Selection for Puter.js */}
        {apiProvider === 'puter' && puterStatus && (
          <div className="flex items-center gap-3">
            <label className={`text-sm font-semibold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
              disabled={!puterAuthStatus?.authenticated}
            >
              {AI_CONFIG.PUTER.models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
            {!puterAuthStatus?.authenticated && (
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>(Sign in to enable)</span>
            )}
          </div>
        )}

        {/* Model Selection for Ollama */}
        {apiProvider === 'ollama' && (
          <div className="flex items-center gap-3">
            <label className={`text-sm font-semibold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              {AI_CONFIG.OLLAMA.models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Indicator for selected provider only */}
        {apiProvider === 'puter' && (
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${puterStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Puter.js: {puterStatus ? 'Available' : 'Not Available'}
            </span>
          </div>
        )}
        {apiProvider === 'ollama' && (
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${ollamaStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Ollama: {ollamaStatus ? 'Running' : 'Not Running'}
            </span>
          </div>
        )}
      </div>

      {/* Puter.js Auth Status Section */}
      {apiProvider === 'puter' && (
        <div className="space-y-5 mt-6">
          <div className={`p-4 rounded-xl border ${
            puterAuthStatus?.authenticated 
              ? (isDarkMode 
                  ? 'bg-green-900 bg-opacity-30 border-green-700' 
                  : 'bg-green-50 border-green-200') 
              : (isDarkMode 
                  ? 'bg-yellow-900 bg-opacity-30 border-yellow-700' 
                  : 'bg-yellow-50 border-yellow-200')
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {puterAuthStatus?.authenticated ? '✅ Signed in to Puter.js' : '⚠️ Not signed in'}
              </span>
              <div className="flex items-center gap-2">
                {!puterAuthStatus?.authenticated && (
                  <button
                    onClick={handlePuterLogin}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium"
                  >
                    Sign In
                  </button>
                )}
                {puterAuthStatus?.authenticated && (
                  <button
                    onClick={handlePuterLogout}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' 
                        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title="Sign out from Puter.js"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className={`text-sm mt-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {puterAuthStatus?.reason || 'Checking...'}
            </p>
          </div>
        </div>
      )}

      {/* Ollama Status Section */}
      {apiProvider === 'ollama' && (
        <div className="space-y-5 mt-6">
          <div className={`p-4 rounded-xl border ${
            ollamaStatus 
              ? (isDarkMode 
                  ? 'bg-green-900 bg-opacity-30 border-green-700' 
                  : 'bg-green-50 border-green-200') 
              : (isDarkMode 
                  ? 'bg-red-900 bg-opacity-30 border-red-700' 
                  : 'bg-red-50 border-red-200')
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {ollamaStatus ? '✅ Ollama Server Running' : '❌ Ollama Server Not Running'}
              </span>
            </div>
            <p className={`text-sm mt-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {ollamaStatus 
                ? 'Connected to local Ollama instance on localhost:11434' 
                : 'Please start Ollama server: Run "ollama serve" in terminal'
              }
            </p>
            {!ollamaStatus && (
              <div className={`text-sm mt-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>To use Ollama:</p>
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                  <li>Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline">ollama.ai</a></li>
                  <li>Run: <code className="bg-gray-700 px-2 py-1 rounded text-xs">ollama pull codellama</code></li>
                  <li>Start server: <code className="bg-gray-700 px-2 py-1 rounded text-xs">ollama serve</code></li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPanel;
