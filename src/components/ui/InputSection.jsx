/**
 * Input section for component generation prompts with complexity limits
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { useState, useRef } from 'react';
import { validatePromptComplexity, SIMPLE_COMPONENT_EXAMPLES } from '../../utils/promptValidation.js';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import ParticleBallLoader from './ParticleBallLoader.jsx';
import { createClickRipple, createButtonPulse, createSparkBurst, createEnergyWave } from '../../utils/buttonAnimations.js';

const InputSection = ({ 
  prompt, 
  setPrompt, 
  isLoading, 
  handleGenerateComponent, 
  handleKeyPress, 
  clearAll,
  promptRef
}) => {
  const [validationMessage, setValidationMessage] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const [showRestrictedWarning, setShowRestrictedWarning] = useState(false);
  const generateButtonRef = useRef(null);
  
  // Use theme context with fallback
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }

  const handleEnhancedGenerate = (event) => {
    if (!generateButtonRef.current || isLoading) return;
    
    // Trigger spectacular animations
    createClickRipple(generateButtonRef.current, event);
    createButtonPulse(generateButtonRef.current);
    createSparkBurst(generateButtonRef.current, isDarkMode);
    createEnergyWave(generateButtonRef.current);
    
    // Call the original handler
    handleGenerateComponent();
  };

  const handlePromptChange = (e) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    
    // Real-time validation
    if (newPrompt.trim()) {
      const validation = validatePromptComplexity(newPrompt);
      setValidationMessage(validation);
      
      // Show warning only when restricted keywords are detected
      setShowRestrictedWarning(!validation.success && validation.restrictedKeywords);
    } else {
      setValidationMessage(null);
      setShowRestrictedWarning(false);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
    setValidationMessage({ success: true, message: 'Good example selected!' });
    setShowExamples(false);
  };

  return (
    <div className={`group relative rounded-xl sm:rounded-2xl shadow-2xl border p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 transition-all duration-500 transform hover:scale-[1.01] hover:-translate-y-1 animate-slideInBottom ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 shadow-gray-900/50' 
        : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 border-gray-200 hover:border-gray-300 shadow-gray-400/20'
    }`}>
      {/* Animated background pattern */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-indigo-900/10' 
          : 'bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-indigo-50/50'
      }`} style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, ${isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)'} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${isDarkMode ? 'rgba(147, 51, 234, 0.05)' : 'rgba(147, 51, 234, 0.1)'} 0%, transparent 50%)`
      }}></div>
      
      {/* Floating decorative elements */}
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse ${
        isDarkMode ? 'bg-blue-400/30' : 'bg-blue-500/30'
      }`}></div>
      <div className={`absolute bottom-4 left-4 w-2 h-2 rounded-full animate-ping ${
        isDarkMode ? 'bg-purple-400/40' : 'bg-purple-500/40'
      }`} style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="prompt" className={`block text-lg sm:text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-fadeInUp ${
            isDarkMode 
              ? 'from-white via-blue-100 to-indigo-200' 
              : 'from-gray-900 via-blue-800 to-indigo-900'
          }`}>
            ✨ Describe Your Idea:
          </label>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className={`group relative flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-500 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 transform hover:scale-110 hover:-rotate-1 active:scale-95 shadow-lg hover:shadow-2xl ${
              showExamples 
                ? isDarkMode 
                  ? 'text-blue-300 bg-gradient-to-r from-blue-800/60 to-indigo-800/60 border-blue-600/80 shadow-blue-900/50' 
                  : 'text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300/80 shadow-blue-400/30'
                : isDarkMode 
                  ? 'text-blue-400 hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-800/50 hover:to-indigo-800/50 border-blue-700/40 hover:border-blue-600/80 hover:shadow-blue-900/50' 
                  : 'text-blue-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-blue-200/60 hover:border-blue-300/80 hover:shadow-blue-400/30'
            }`}
          >
            {/* Animated glow effect */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-400/20'
            }`}></div>
            
            {/* Icon with enhanced animation */}
            <svg className={`relative z-10 w-4 h-4 transition-all duration-500 ${
              showExamples ? 'rotate-180 scale-110' : 'group-hover:scale-125 group-hover:rotate-12'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            
            <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
              {showExamples ? 'Hide Examples' : 'Show Examples'}
            </span>
            
            {!showExamples && (
              <span className={`relative z-10 text-xs px-3 py-1 rounded-full font-bold animate-pulse ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-500/40 to-indigo-500/40 text-blue-300' 
                  : 'bg-gradient-to-r from-blue-200/80 to-indigo-200/80 text-blue-600'
              }`}>
                6 ideas ✨
              </span>
            )}
            
            {/* Decorative sparkles */}
            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
            }`}></div>
          </button>
        </div>
        
        {/* Limitations Notice - Only show when restricted keywords detected */}
        {showRestrictedWarning && (
          <div className={`border rounded-xl p-4 mb-4 ${
            isDarkMode 
              ? 'bg-yellow-900 bg-opacity-30 border-yellow-700' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-start">
              <svg className={`w-5 h-5 mt-0.5 mr-2 flex-shrink-0 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className={`font-semibold text-sm mb-1 ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
                }`}>Simple Components Only</h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                }`}>
                  This project is limited to basic UI components. No 3D objects, complex animations, file uploads, or advanced features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Examples Section */}
        {showExamples && (
          <div className={`relative overflow-hidden border rounded-2xl p-6 mb-4 transition-all duration-300 transform ${
            isDarkMode 
              ? 'bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-purple-900/20 border-blue-700/60 shadow-2xl' 
              : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200/80 shadow-xl'
          }`}>
            {/* Background Pattern */}
            <div className={`absolute inset-0 opacity-5 ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
            }`} style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
            
            {/* Header Section */}
            <div className="relative z-10 flex items-center gap-3 mb-5">
              <div className={`p-2 rounded-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md'
              }`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className={`font-bold text-lg ${
                  isDarkMode ? 'text-blue-100' : 'text-blue-900'
                }`}>
                  ✨ Quick Examples
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-200/80' : 'text-blue-700/80'
                }`}>
                  Click any example below to get started instantly
                </p>
              </div>
            </div>
            
            {/* Examples Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {SIMPLE_COMPONENT_EXAMPLES.slice(0, 6).map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 active:scale-95 ${
                    isDarkMode 
                      ? 'text-blue-200 hover:text-white bg-blue-800/20 hover:bg-blue-700/40 border-blue-600/40 hover:border-blue-400 shadow-lg hover:shadow-2xl' 
                      : 'text-blue-800 hover:text-blue-900 bg-white/80 hover:bg-white border-blue-300/60 hover:border-blue-400 shadow-md hover:shadow-xl'
                  }`}
                >
                  {/* Card Background Gradient */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-600/10 to-indigo-600/10' 
                      : 'bg-gradient-to-r from-blue-100/50 to-indigo-100/50'
                  }`}></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 flex items-start gap-3">
                    <div className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-blue-500/20 group-hover:bg-blue-400/30 text-blue-400 group-hover:text-blue-300' 
                        : 'bg-blue-100 group-hover:bg-blue-200 text-blue-600 group-hover:text-blue-700'
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-relaxed group-hover:text-opacity-100 transition-all duration-300">
                        "{example}"
                      </p>
                      
                      {/* Subtle arrow indicator */}
                      <div className={`mt-2 flex items-center gap-1 text-xs opacity-60 group-hover:opacity-100 transition-all duration-300 ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        <span>Click to use</span>
                        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Bottom Decoration */}
            <div className={`mt-6 pt-4 border-t ${
              isDarkMode ? 'border-blue-700/40' : 'border-blue-200/60'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isDarkMode ? 'bg-blue-400/60' : 'bg-blue-500/60'
                }`}></div>
                <p className={`text-xs ${
                  isDarkMode ? 'text-blue-300/70' : 'text-blue-600/70'
                }`}>
                  Perfect for beginners • No complex features required
                </p>
                <div className={`w-2 h-2 rounded-full ${
                  isDarkMode ? 'bg-blue-400/60' : 'bg-blue-500/60'
                }`}></div>
              </div>
            </div>
          </div>
        )}

        <p className={`text-sm mb-4 leading-relaxed animate-fadeInUp ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`} style={{ animationDelay: '0.2s' }}>
          💡 Keep it simple: buttons, cards, forms, navigation bars, lists, headers, footers, alerts, and basic layouts only.
        </p>
        
        <div className="relative group">
          {/* Enhanced textarea with glassmorphism effect */}
          <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' 
              : 'bg-gradient-to-r from-blue-100/30 to-purple-100/30'
          } opacity-0 group-hover:opacity-100 blur-xl`}></div>
          
          <textarea
            ref={promptRef}
            id="prompt"
            value={prompt}
            onChange={handlePromptChange}
            onKeyPress={handleKeyPress}
            placeholder="✨ Enter your simple component description here... (e.g., 'Create a blue button with hover effects')"
            className={`relative w-full h-32 px-6 py-5 border-2 rounded-2xl focus:ring-4 resize-none transition-all duration-500 transform focus:scale-[1.02] backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-700/80 text-white placeholder-gray-400 border-gray-600 focus:border-blue-500 focus:ring-blue-500/30' 
                : 'bg-white/90 text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
            } ${
              validationMessage && !validationMessage.success 
                ? (isDarkMode 
                    ? 'border-red-500 bg-red-900/30 ring-red-500/30' 
                    : 'border-red-400 bg-red-50 ring-red-400/20') 
                : ''
            } shadow-lg hover:shadow-xl focus:shadow-2xl`}
            disabled={isLoading}
            maxLength={300}
          />
          
          {/* Corner decorations - moved to not interfere with text */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${
            isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
          }`}></div>
          <div className={`absolute -bottom-1 -left-1 w-2 h-2 rounded-full animate-pulse opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${
            isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
          }`} style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Enhanced character count and validation */}
        <div className="flex justify-between items-center mt-4">
          <div className={`flex items-center gap-2 text-sm transition-all duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              prompt.length > 250 
                ? 'bg-red-400 animate-pulse' 
                : prompt.length > 200 
                  ? 'bg-yellow-400 animate-pulse' 
                  : 'bg-green-400'
            }`}></div>
            <span className="font-medium">
              {prompt.length}/300 characters
            </span>
            {prompt.length > 250 && (
              <span className="text-red-400 text-xs animate-bounce">
                Almost there!
              </span>
            )}
          </div>
          
          {/* Enhanced Validation Message */}
          {validationMessage && (
            <div className={`flex items-center gap-2 text-sm font-medium animate-slideInRight ${
              validationMessage.success 
                ? (isDarkMode ? 'text-green-400' : 'text-green-600') 
                : (isDarkMode ? 'text-red-400' : 'text-red-600')
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                validationMessage.success 
                  ? 'bg-green-400 animate-pulse' 
                  : 'bg-red-400 animate-ping'
              }`}></div>
              {validationMessage.success ? '✅ Perfect prompt!' : `❌ ${validationMessage.error}`}
            </div>
          )}
        </div>
        
        {/* Validation Suggestions */}
        {validationMessage && !validationMessage.success && validationMessage.suggestions && (
          <div className={`border rounded-xl p-4 mt-3 ${
            isDarkMode 
              ? 'bg-red-900 bg-opacity-30 border-red-700' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h4 className={`font-semibold text-sm mb-2 ${
              isDarkMode ? 'text-red-300' : 'text-red-800'
            }`}>Suggestions:</h4>
            <ul className={`text-sm space-y-1 ${
              isDarkMode ? 'text-red-400' : 'text-red-700'
            }`}>
              {validationMessage.suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Enhanced action buttons */}
      <div className="flex flex-wrap gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
        <button
          ref={generateButtonRef}
          onClick={handleEnhancedGenerate}
          disabled={isLoading || !prompt.trim() || (validationMessage && !validationMessage.success)}
          className={`btn-futuristic group relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-10 rounded-2xl transition-all duration-500 flex items-center gap-3 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 hover:-translate-y-1 active:scale-95 overflow-hidden ${
            isLoading ? 'animate-pulse shadow-blue-400/60 shadow-2xl border border-blue-400/30' : ''
          }`}
        >
          {/* Animated background shine */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
            isLoading ? 'animate-pulse' : ''
          }`}></div>
          
          {/* Loading state energy field */}
          {isLoading && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
          
          {/* Button content */}
          <div className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <>
                <ParticleBallLoader isActive={true} size={10} />
                <span className="animate-pulse font-semibold">Generating Magic...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {/* Spark effect */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="transition-transform duration-300 group-hover:scale-105">
                  ✨ Generate Component
                </span>
              </>
            )}
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        </button>
        
        <button
          onClick={clearAll}
          className={`group relative font-bold py-4 px-8 rounded-2xl transition-all duration-500 shadow-xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white hover:shadow-gray-500/50' 
              : 'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 text-white hover:shadow-gray-500/50'
          }`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          {/* Button content */}
          <div className="relative z-10 flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear All</span>
          </div>
          
          {/* Hover glow */}
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg ${
            isDarkMode ? 'bg-gray-600/50' : 'bg-gray-500/50'
          }`}></div>
        </button>
      </div>
    </div>
  );
};

// Find the AI provider selection section and update it to include Puter
const AI_PROVIDERS = [
  { 
    id: 'puter', 
    name: 'Puter.js', 
    description: 'Multiple AI models (No API key required)',
    models: [
      'gpt-5-nano',
      'gpt-4o', 
      'gpt-4o-mini',
      'claude',
      'claude-3-5-sonnet-20241022',
      'gemini',
      'gemini-1.5-flash',
      'gemini-pro',
      'deepseek-chat',
      'deepseek-coder',
      'llama-3.1-70b-instruct',
      'llama-3.2-90b-instruct',
      'mistral-large',
      'qwen2.5-72b-instruct'
    ],
    requiresAuth: true,
    authType: 'puter'
  },
  { 
    id: 'openai', 
    name: 'OpenAI GPT', 
    description: 'GPT-4 and GPT-3.5 models',
    requiresAuth: true,
    authType: 'apikey'
  },
  { 
    id: 'grok', 
    name: 'Grok AI', 
    description: 'X.AI Grok models',
    requiresAuth: true,
    authType: 'apikey'
  }
];

export default InputSection;
