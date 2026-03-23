/**
 * AI-Powered Code Editor Component
 * Allows users to modify existing code using natural language prompts
 * 
 * Features:
 * - Natural language code modification
 * - Real-time preview updates
 * - Integrated with existing AI services
 * - Smart change detection and validation
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { callAIAPIForCodeEditing } from '../../services/aiService.js';

const AICodeEditor = ({ 
  currentCode, 
  onCodeChange, 
  apiProvider = "puter", 
  selectedModel = "gpt-4o",
  isVisible = false,
  onToggle
}) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editHistory, setEditHistory] = useState([]);
  const promptInputRef = useRef(null);
  
  const { isDarkMode } = useTheme();

  /**
   * Handle AI-powered code editing
   */
  const handleAIEdit = async () => {
    if (!editPrompt.trim()) {
      setEditError('Please describe what changes you want to make to the code.');
      return;
    }

    if (!currentCode || !currentCode.trim()) {
      setEditError('No code available to edit. Generate a component first.');
      return;
    }

    setIsProcessing(true);
    setEditError(null);

    try {
      console.log('🔧 Starting AI code editing...', {
        provider: apiProvider,
        model: selectedModel,
        request: editPrompt.substring(0, 100) + '...'
      });

      // Use specialized code editing API that bypasses prompt validation
      const result = await callAIAPIForCodeEditing(
        currentCode, 
        editPrompt, 
        { apiProvider }, 
        selectedModel
      );

      if (result.success && result.data && result.data.component) {
        const modifiedCode = result.data.component.code;
        
        // Save current state to history before making changes
        setEditHistory(prev => [...prev, {
          prompt: editPrompt,
          originalCode: currentCode,
          modifiedCode,
          timestamp: new Date().toISOString()
        }]);

        // Apply the changes
        onCodeChange(modifiedCode);
        
        // Clear the prompt for next edit
        setEditPrompt('');
        
        console.log('✅ AI code editing successful');
      } else {
        throw new Error(
          result.error?.message || 
          result.error || 
          'Failed to modify code. Please try again.'
        );
      }
    } catch (err) {
      console.error('AI editing error:', err);
      setEditError(
        err.response?.data?.error?.message ||
        err.message ||
        'Failed to modify code. Please try a different description.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle Enter key press for better UX
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
      e.preventDefault();
      handleAIEdit();
    }
  };

  /**
   * Undo last change
   */
  const handleUndo = () => {
    if (editHistory.length > 0) {
      const lastChange = editHistory[editHistory.length - 1];
      onCodeChange(lastChange.originalCode);
      setEditHistory(prev => prev.slice(0, -1));
    }
  };

  /**
   * Clear edit history
   */
  const clearHistory = () => {
    setEditHistory([]);
  };

  if (!isVisible) return null;

  return (
    <div className={`mb-4 rounded-lg border shadow-lg transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b rounded-t-lg flex items-center justify-between ${
        isDarkMode 
          ? 'bg-gray-850 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <svg className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Code Assistant
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Undo button */}
          {editHistory.length > 0 && (
            <button
              onClick={handleUndo}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title="Undo last change"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
          )}
          
          {/* Close button */}
          <button
            onClick={onToggle}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Instructions */}
        <div className={`text-xs p-3 rounded-md ${
          isDarkMode 
            ? 'bg-blue-900 bg-opacity-30 text-blue-200' 
            : 'bg-blue-50 text-blue-800'
        }`}>
          <p className="font-medium mb-1">💡 How to use:</p>
          <p>Describe the changes you want to make to your code using natural language. For example:</p>
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li>"Change the button color to red"</li>
            <li>"Add a hover effect to the card"</li>
            <li>"Make the text larger and center it"</li>
            <li>"Add an icon next to the title"</li>
          </ul>
        </div>

        {/* Error Display */}
        {editError && (
          <div className={`p-3 rounded-md border ${
            isDarkMode 
              ? 'bg-red-900 bg-opacity-20 border-red-800 text-red-300' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-start">
              <svg className={`w-5 h-5 mt-0.5 mr-2 flex-shrink-0 ${
                isDarkMode ? 'text-red-400' : 'text-red-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">{editError}</p>
            </div>
          </div>
        )}

        {/* Edit History */}
        {editHistory.length > 0 && (
          <div className={`text-xs p-3 rounded-md ${
            isDarkMode 
              ? 'bg-gray-700 bg-opacity-50 text-gray-300' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Recent Changes ({editHistory.length})</span>
              <button
                onClick={clearHistory}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                }`}
              >
                Clear
              </button>
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {editHistory.slice(-3).map((change, index) => (
                <div key={index} className="text-xs opacity-75">
                  • {change.prompt.substring(0, 50)}{change.prompt.length > 50 ? '...' : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="space-y-3">
          <textarea
            ref={promptInputRef}
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe the changes you want to make to your code..."
            className={`w-full px-3 py-2 text-sm border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            rows={3}
            disabled={isProcessing}
          />
          
          <div className="flex items-center justify-between">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Press Enter to apply changes, Shift+Enter for new line
            </div>
            
            <button
              onClick={handleAIEdit}
              disabled={isProcessing || !editPrompt.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                isProcessing || !editPrompt.trim()
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-t-transparent border-white"></div>
                  <span>Applying...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Apply Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICodeEditor;
