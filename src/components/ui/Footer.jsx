/**
 * Enhanced Footer component with animations
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React from 'react';
import { APP_CONFIG } from '../../utils/config.js';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const Footer = () => {
  // Use theme context with fallback
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }

  return (
    <div className={`relative mt-12 p-8 rounded-2xl backdrop-blur-md border transition-all duration-500 animate-fadeInUp ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700/50 text-gray-300' 
        : 'bg-white/70 border-gray-200/50 text-gray-600'
    }`}>
      {/* Animated background pattern */}
      <div className={`absolute inset-0 rounded-2xl opacity-5 ${
        isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
      }`} style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Floating decorative elements */}
      <div className={`absolute top-2 right-4 w-2 h-2 rounded-full animate-pulse ${
        isDarkMode ? 'bg-blue-400/30' : 'bg-blue-500/30'
      }`}></div>
      <div className={`absolute bottom-2 left-4 w-1.5 h-1.5 rounded-full animate-ping ${
        isDarkMode ? 'bg-purple-400/40' : 'bg-purple-500/40'
      }`} style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 text-center space-y-3">
        {/* Enhanced project info */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm font-medium">
          <span className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDarkMode ? 'bg-green-400' : 'bg-green-500'
            }`}></div>
            Final Year Project
          </span>
          
          <span className="text-gray-500">|</span>
          
          <span className={`font-bold bg-gradient-to-r bg-clip-text text-transparent ${
            isDarkMode 
              ? 'from-blue-400 via-purple-400 to-indigo-400' 
              : 'from-blue-600 via-purple-600 to-indigo-600'
          }`}>
            {APP_CONFIG.name}
          </span>
          
          <span className="text-gray-500">|</span>
          
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="font-semibold">{APP_CONFIG.author}</span>
          </span>
        </div>
        
        {/* Tech stack with icons */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
            }`}></div>
            <span>React</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${
              isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
            }`}></div>
            <span>Vite</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${
              isDarkMode ? 'bg-cyan-400' : 'bg-cyan-500'
            }`}></div>
            <span>Tailwind CSS</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isDarkMode ? 'bg-green-400' : 'bg-green-500'
            }`}></div>
            <span>AI Integration</span>
          </div>
        </div>
        
        {/* Copyright with animation */}
        <div className={`pt-2 text-xs opacity-75 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="flex justify-center items-center gap-2">
            <span>© 2025</span>
            <div className={`w-1 h-1 rounded-full animate-bounce ${
              isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
            }`}></div>
            <span>Built with ❤️ for innovation</span>
          </div>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' 
          : 'bg-gradient-to-r from-blue-400/10 to-purple-400/10'
      }`}></div>
    </div>
  );
};

export default Footer;
