/**
 * Theme Context for Dark Mode Management
 * 
 * This context provides theme state management across the entire application.
 * It handles dark/light mode toggling and persists the user's preference.
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme state - start with light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return false;
    
    // Check saved preference first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Default to light mode (not system preference)
    return false;
  });

  // Apply theme changes to DOM (optimized to prevent multiple triggers)
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
