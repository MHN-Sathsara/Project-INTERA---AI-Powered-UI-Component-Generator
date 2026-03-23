/**
 * Usage instructions component with editing features
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const UsageInstructions = () => {
  // Use theme context with fallback
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }

  return (
    <div className={`mt-8 border rounded-lg p-6 transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-blue-900 bg-opacity-30 border-blue-700' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-3 ${
        isDarkMode ? 'text-blue-300' : 'text-blue-900'
      }`}>How to Use</h3>
      <div className={`space-y-3 text-sm ${
        isDarkMode ? 'text-blue-200' : 'text-blue-800'
      }`}>
        <div>
          <p><strong>1. Generate:</strong> Describe your component in natural language (e.g., "Create a red button with rounded corners")</p>
          <p><strong>2. Review:</strong> Click "Generate Component" to create the React code and see the preview</p>
        </div>
        
        <div className={`p-3 rounded-md ${
          isDarkMode 
            ? 'bg-blue-800 bg-opacity-50' 
            : 'bg-blue-100'
        }`}>
          <p className={`font-semibold mb-2 ${
            isDarkMode ? 'text-blue-200' : 'text-blue-900'
          }`}>✨ Code Editing Options</p>
          <p><strong>3a. AI Edit:</strong> Click the "AI Edit" button and describe changes in natural language (e.g., "make the button red", "add a hover effect")</p>
          <p><strong>3b. Manual Edit:</strong> Click the "Edit" button to modify the code directly in the text editor</p>
          <p><strong>4. Sandbox Preview:</strong> See your component rendered in a safe sandbox environment</p>
          <p><strong>5. Error Handling:</strong> Any syntax errors will be shown in the preview area</p>
          <p><strong>6. Reset:</strong> Use the "Reset" button to return to the original generated code</p>
        </div>
        
        <div>
          <p><strong>7. Copy:</strong> Click "Copy" to save the final code to your clipboard</p>
          <p><strong>8. Use:</strong> Paste the code into your React project - components are built with Tailwind CSS</p>
        </div>
        
        <div className={`mt-4 p-3 rounded-md ${
          isDarkMode 
            ? 'bg-green-900 bg-opacity-50' 
            : 'bg-green-100'
        }`}>
          <p className={`font-semibold ${
            isDarkMode ? 'text-green-300' : 'text-green-800'
          }`}>💡 Tips:</p>
          <ul className={`list-disc list-inside space-y-1 text-xs mt-1 ${
            isDarkMode ? 'text-green-200' : 'text-green-700'
          }`}>
            <li>The preview shows components in a sandbox environment for safe rendering</li>
            <li>Green "Sandbox" indicator means the component is being rendered safely</li>
            <li>Error indicators help you fix syntax issues quickly</li>
            <li>Edit mode saves automatically when you click "Save" or toggle off editing</li>
            <li>AI Edit lets you modify code using simple language - no programming needed!</li>
            <li>Undo feature in AI Edit lets you revert unwanted changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UsageInstructions;
