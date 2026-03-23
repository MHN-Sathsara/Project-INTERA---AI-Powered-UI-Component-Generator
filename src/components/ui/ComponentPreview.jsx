/**
 * Component preview panel with live code rendering and enhanced error handling
 * Enhanced with performance mode toggle and accessibility improvements
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { useState, useEffect } from 'react';
import SandboxPreview from './SandboxPreview.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { PERFORMANCE_CONFIG, FEATURE_FLAGS } from '../../utils/config.js';

const ComponentPreview = ({ code, previewError, componentData, isFullPage: propIsFullPage, onFullPageModeChange, onRegenerate }) => {
  const [fullPageMode, setFullPageMode] = useState(false);
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  
  // Use theme with error boundary
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    if (FEATURE_FLAGS.ENABLE_DEBUG_LOGS) {
      console.warn('Theme context not available, using light mode as fallback');
    }
  }

  // Detect if component should be full page
  const shouldShowFullPage = (code) => {
    if (!code) return false;
    const lowerCode = code.toLowerCase();
    return lowerCode.includes('dashboard') || 
           lowerCode.includes('landing') || 
           lowerCode.includes('homepage') ||
           lowerCode.includes('full-page') ||
           lowerCode.includes('layout') ||
           lowerCode.includes('min-h-screen') ||
           lowerCode.includes('height: 100vh') ||
           lowerCode.includes('h-screen');
  };

  // Dynamic height functions to match CodeDisplay - Mobile Responsive
  const getCardHeight = () => {
    if (fullPageMode) {
      return 'h-[330px] sm:h-[430px] md:h-[530px] lg:h-[680px] xl:h-[800px]';
    }
    return 'h-[280px] sm:h-[360px] md:h-[460px] lg:h-[560px] xl:h-[600px]';
  };

  // Auto-detect full page mode
  useEffect(() => {
    if (propIsFullPage || (code && shouldShowFullPage(code))) {
      setFullPageMode(true);
    }
  }, [code, propIsFullPage]);

  // Notify parent component when full page mode changes
  useEffect(() => {
    if (onFullPageModeChange) {
      onFullPageModeChange(fullPageMode);
    }
  }, [fullPageMode, onFullPageModeChange]);

  // Error boundary effect to catch rendering errors
  useEffect(() => {
    // Component cleanup if needed
  }, [code]);

  const ErrorDisplay = ({ error, type = "Preview" }) => (
    <div className="text-center p-6">
      <div className={`border rounded-lg p-4 mb-4 ${
        isDarkMode 
          ? 'bg-red-900/20 border-red-800/40 text-red-300' 
          : 'bg-red-50 border-red-200 text-red-700'
      }`}>
        <div className="flex items-center justify-center mb-2">
          <svg className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>{type} Error</h4>
        <p className={`text-sm break-words ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
        
        {/* Enhanced: Regenerate button for errors */}
        {FEATURE_FLAGS.ENABLE_REGENERATE_BUTTON && onRegenerate && (
          <button
            onClick={onRegenerate}
            className={`mt-4 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-red-800 hover:bg-red-700 text-red-100' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            aria-label="Regenerate component"
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate Component
          </button>
        )}
      </div>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Please check your code syntax and try again
      </p>
    </div>
  );

  const EmptyState = () => (
      <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
        </svg>
        <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Component preview will appear here
        </p>
        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Generate a component to see the live preview
        </p>
        
        {/* Enhanced: Show Examples button */}
        <button
          onClick={() => setShowExamples(!showExamples)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          aria-label="Show component examples"
        >
          {showExamples ? 'Hide Examples' : 'Show Examples'}
        </button>
        
        {/* Examples display */}
        {showExamples && (
          <div className={`mt-6 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
          }`}>
            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Example Components
            </h4>
            <div className="grid gap-2 text-sm">
              {[
                "Create a blue button with hover effects",
                "Make a simple card with title and description", 
                "Build a basic input field with label",
                "Create a navigation bar with links",
                "Design a footer with text and links"
              ].map((example, index) => (
                <div key={index} className={`p-2 rounded text-left ${
                  isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-white text-gray-600'
                }`}>
                  {example}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

  return (
    <div className={`rounded-lg shadow-lg border ${getCardHeight()} flex flex-col ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b rounded-t-lg flex-shrink-0 ${
        isDarkMode 
          ? 'bg-gray-850 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Component Preview</h3>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {/* Full Page Toggle */}
            <button
              onClick={() => setFullPageMode(!fullPageMode)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                fullPageMode 
                  ? isDarkMode
                    ? 'bg-purple-900/30 text-purple-300 border-purple-700/50' 
                    : 'bg-purple-100 text-purple-700 border-purple-200'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:text-gray-100 hover:bg-gray-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:text-gray-800'
              }`}
            >
              <span className="hidden xs:inline">{fullPageMode ? 'Component' : 'Full Page'}</span>
              <span className="xs:hidden">{fullPageMode ? 'Comp' : 'Full'}</span>
            </button>

            {/* Status indicators */}
            {previewError && (
              <div className={`flex items-center gap-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Error</span>
              </div>
            )}
            {code && !previewError && (
              <div className={`flex items-center gap-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Sandbox</span>
              </div>
            )}
          </div>
        </div>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {previewError 
            ? "Fix the code errors to see the preview" 
            : `Sandboxed preview ${fullPageMode ? '(full page)' : '(component)'}`
          }
        </p>
      </div>
      <div className={`flex-1 p-4 overflow-auto custom-scrollbar ${
        isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'
      }`}>
        {previewError ? (
          <ErrorDisplay error={previewError} />
        ) : code ? (
          <SandboxPreview 
            code={code} 
            type={componentData?.type || 'component'}
            fullPage={fullPageMode}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ComponentPreview;
