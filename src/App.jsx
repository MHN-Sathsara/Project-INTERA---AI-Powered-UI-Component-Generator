/**
 * Main App Component for AI-Powered UI Component Generator
 * 
 * This is the root component that renders the entire application.
 * The app is designed to help developers generate React components
 * using natural language prompts powered by AI.
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 * Final Year Project - Timeline: January 2025 - November 2025
 * 
 * Supervisor: Dr. Rasika Ranaweera
 * Institution: NSBM Green University
 */

import React, { useState, useEffect } from 'react';
import UIComponentGenerator from './components/UIComponentGenerator';
import { useAuth } from './hooks/useAuth.js';
import { ThemeProvider, useTheme } from './contexts/ThemeContext.jsx';
import './App.css';
import './styles/enhanced-ui.css';

const AppContent = () => {
  const { loading } = useAuth();
  const { isDarkMode } = useTheme();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing INTERA...');

  // Enhanced loading sequence with progress updates
  useEffect(() => {
    if (loading) {
      const loadingSteps = [
        { progress: 0, text: 'Initializing INTERA...', delay: 0 },
        { progress: 25, text: 'Loading AI Components...', delay: 600 },
        { progress: 50, text: 'Preparing Code Editor...', delay: 1200 },
        { progress: 75, text: 'Setting up Preview...', delay: 1800 },
        { progress: 100, text: 'Almost Ready!', delay: 2200 }
      ];

      loadingSteps.forEach(step => {
        setTimeout(() => {
          if (loading) {
            setLoadingProgress(step.progress);
            setLoadingText(step.text);
          }
        }, step.delay);
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800' 
          : 'bg-gradient-to-br from-gray-100 via-blue-100/30 to-gray-200'
      }`}>
        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full opacity-30 animate-float ${
                isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="text-center p-10 rounded-3xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl max-w-md w-full mx-4">
          {/* Enhanced loading spinner with multiple rings */}
          <div className="spinner-center mb-8">
            <div className="relative w-24 h-24">
              {/* Outer ring */}
              <div className={`spinner-ring spinner-ring-outer border-4 border-transparent animate-spin ${
                isDarkMode ? 'border-t-blue-400 border-r-purple-400' : 'border-t-blue-600 border-r-purple-600'
              }`}></div>
              
              {/* Middle ring */}
              <div className={`spinner-ring spinner-ring-middle border-3 border-transparent animate-spin ${
                isDarkMode ? 'border-b-indigo-400 border-l-pink-400' : 'border-b-indigo-600 border-l-pink-600'
              }`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              
              {/* Inner ring */}
              <div className={`spinner-ring spinner-ring-inner border-2 border-transparent animate-spin ${
                isDarkMode ? 'border-t-cyan-400 border-r-violet-400' : 'border-t-cyan-600 border-r-violet-600'
              }`} style={{ animationDuration: '2s' }}></div>
              
              {/* Center dot with pulse */}
              <div className={`spinner-center-dot w-4 h-4 rounded-full animate-pulse ${
                isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}></div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}>
              <div 
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className={`text-sm mt-2 text-center ${
              isDarkMode ? 'text-blue-300' : 'text-blue-600'
            }`}>
              {loadingProgress}%
            </div>
          </div>
          
          {/* Loading text with typing animation */}
          <div className="space-y-3">
            <p className={`text-xl font-bold animate-pulse ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {loadingText}
            </p>
            
            {/* Animated dots */}
            <div className={`flex justify-center items-center space-x-1 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-600'
            }`}>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>

            {/* Brand name with glow effect */}
            <div className={`mt-4 text-2xl font-bold tracking-wider ${
              isDarkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            }`}>
              INTERA
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`App min-h-screen relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-800' 
        : 'bg-gradient-to-br from-gray-100 via-blue-100/20 to-gray-200'
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <div className={`absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 animate-float ${
          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
        }`} style={{ animationDelay: '0s' }}></div>
        
        <div className={`absolute top-40 right-32 w-24 h-24 rounded-full opacity-10 animate-float ${
          isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
        }`} style={{ animationDelay: '2s' }}></div>
        
        <div className={`absolute bottom-32 left-40 w-28 h-28 rounded-full opacity-10 animate-float ${
          isDarkMode ? 'bg-indigo-400' : 'bg-indigo-500'
        }`} style={{ animationDelay: '4s' }}></div>
        
        <div className={`absolute bottom-20 right-20 w-36 h-36 rounded-full opacity-10 animate-float ${
          isDarkMode ? 'bg-pink-400' : 'bg-pink-500'
        }`} style={{ animationDelay: '1s' }}></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-30 animate-pulse bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-30 animate-pulse bg-gradient-to-r from-indigo-500/20 to-pink-500/20 blur-3xl" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main content with animation */}
      <div className="relative z-10 animate-fadeInUp">
        <UIComponentGenerator />
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
