/**
 * Component information display panel
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const ComponentInfo = ({ componentData }) => {
  if (!componentData) return null;

  // Use theme context with fallback
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }

  return (
    <div className={`mt-6 rounded-lg shadow-lg border p-6 transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Component Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <span className={`font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Name:</span>
          <span className={`ml-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{componentData.name}</span>
        </div>
        <div>
          <span className={`font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Type:</span>
          <span className={`ml-2 capitalize ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{componentData.type}</span>
        </div>
        <div>
          <span className={`font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Generated:</span>
          <span className={`ml-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {new Date(componentData.generated_at).toLocaleTimeString()}
          </span>
        </div>
      </div>
      {componentData.description && (
        <div className="mt-3">
          <span className={`font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Description:</span>
          <p className={`mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{componentData.description}</p>
        </div>
      )}
    </div>
  );
};

export default ComponentInfo;
