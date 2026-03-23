/**
 * Header component for the UI Component Generator
 */

import React from 'react';
import { APP_CONFIG } from '../../utils/config.js';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const Header = ({ onMenuClick }) => {
  // Use theme with error boundary
  let isDarkMode = false;
  let toggleTheme = () => {};
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
    toggleTheme = theme.toggleTheme;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }

  return (
    <div className="flex items-center justify-between mb-10 animate-fadeInDown">
      {/* Left side - Menu button with enhanced animations */}
      <button
        onClick={onMenuClick}
        className={`group relative p-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border transform hover:scale-105 hover:-rotate-3 active:scale-95 shadow-lg hover:shadow-2xl ${
          isDarkMode 
            ? 'hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 bg-gray-800 border-gray-600 hover:border-gray-500' 
            : 'hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100 bg-gray-100 border-gray-300 hover:border-gray-400'
        }`}
      >
        {/* Animated background glow */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${
          isDarkMode ? 'bg-blue-400/20' : 'bg-blue-500/20'
        }`}></div>
        
        <svg className={`relative z-10 w-6 h-6 transition-all duration-300 group-hover:rotate-12 ${
          isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        
        {/* Ripple effect */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 transition-opacity duration-200 ${
          isDarkMode ? 'bg-white/10' : 'bg-black/10'
        }`}></div>
      </button>

      {/* Center - Title and description with enhanced styling */}
      <div className="flex-1 ml-6">
        <div className="relative">
          {/* Animated gradient text background */}
          <div className={`absolute inset-0 bg-gradient-to-r opacity-10 rounded-2xl blur-3xl ${
            isDarkMode 
              ? 'from-blue-400 via-purple-500 to-indigo-600' 
              : 'from-blue-500 via-purple-600 to-indigo-700'
          }`}></div>
          
          <h1 className={`relative text-6xl font-extrabold mb-3 text-center sm:text-left tracking-tight bg-gradient-to-r bg-clip-text text-transparent animate-pulse ${
            isDarkMode 
              ? 'from-white via-blue-100 to-indigo-200' 
              : 'from-gray-900 via-blue-800 to-indigo-900'
          }`}>
            INTERA
          </h1>
          
          {/* Animated subtitle with typewriter effect */}
          <div className="relative overflow-hidden">
            <p className={`text-xl text-center sm:text-left leading-relaxed font-medium animate-fadeInUp ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>Generate.</span>
              <span className="inline-block animate-bounce mx-2" style={{ animationDelay: '0.2s' }}>Preview.</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>Build.</span>
            </p>
            
            {/* Decorative elements */}
            <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full animate-ping ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
            }`}></div>
            <div className={`absolute -bottom-1 -left-1 w-2 h-2 rounded-full animate-pulse ${
              isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Right side - Theme toggle with enhanced effects */}
      <button
        onClick={toggleTheme}
        className={`group relative p-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border transform hover:scale-110 hover:rotate-12 active:scale-95 shadow-lg hover:shadow-2xl ${
          isDarkMode 
            ? 'hover:bg-gradient-to-r hover:from-yellow-700 hover:to-orange-700 bg-gray-800 border-gray-600 hover:border-yellow-500' 
            : 'hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 bg-gray-100 border-gray-300 hover:border-indigo-400'
        }`}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {/* Animated glow effect */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl ${
          isDarkMode ? 'bg-yellow-400/30' : 'bg-indigo-500/30'
        }`}></div>
        
        {/* Icon with enhanced animations */}
        <div className="relative z-10">
          {isDarkMode ? (
            <svg className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-all duration-300 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700 group-hover:text-indigo-700 transition-all duration-300 group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </div>
        
        {/* Ripple effect */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 transition-opacity duration-200 ${
          isDarkMode ? 'bg-yellow-400/20' : 'bg-indigo-400/20'
        }`}></div>
        
        {/* Floating particles effect */}
        <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping ${
          isDarkMode ? 'bg-yellow-400' : 'bg-indigo-400'
        }`}></div>
        <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full animate-pulse ${
          isDarkMode ? 'bg-orange-400' : 'bg-purple-400'
        }`} style={{ animationDelay: '0.5s' }}></div>
      </button>
    </div>
  );
};

export default Header;
