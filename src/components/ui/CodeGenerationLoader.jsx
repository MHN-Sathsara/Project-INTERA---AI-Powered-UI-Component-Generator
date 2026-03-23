/**
 * Enhanced loading animation for code generation process
 * Similar to the initial app loading animation but tailored for code generation
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import ParticleBallLoader from './ParticleBallLoader.jsx';

const CodeGenerationLoader = ({ 
  isVisible, 
  onComplete, 
  progress: externalProgress, 
  step: externalStep, 
  generationPhase,
  onCancel
}) => {
  const { isDarkMode } = useTheme();
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Analyzing your request...');

  const phaseSteps = {
    initializing: { text: 'Initializing AI models...', baseProgress: 10 },
    analyzing: { text: 'Analyzing your requirements...', baseProgress: 25 },
    generating: { text: 'Generating component structure...', baseProgress: 50 },
    styling: { text: 'Adding styles and animations...', baseProgress: 75 },
    finalizing: { text: 'Finalizing and optimizing...', baseProgress: 90 },
    complete: { text: 'Component ready! ✨', baseProgress: 100 }
  };

  useEffect(() => {
    if (isVisible) {
      setShowLoader(true);

      // Handle external progress or generate based on phase
      if (typeof externalProgress === 'number') {
        setProgress(externalProgress);
      } else if (generationPhase && phaseSteps[generationPhase]) {
        setProgress(phaseSteps[generationPhase].baseProgress);
      } else {
        // Auto-increment if no external progress
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 95) return 95;
            return prev + Math.random() * 2;
          });
        }, 150);

        return () => clearInterval(interval);
      }

      // Handle step text
      if (externalStep) {
        setCurrentStep(externalStep);
      } else if (generationPhase && phaseSteps[generationPhase]) {
        setCurrentStep(phaseSteps[generationPhase].text);
      }

      // Handle completion
      if ((externalProgress === 100 || generationPhase === 'complete') && isVisible) {
        setTimeout(() => {
          setShowLoader(false);
          if (onComplete) {
            onComplete();
          }
        }, 800);
      }
    } else {
      setShowLoader(false);
      setProgress(0);
      setCurrentStep('Analyzing your request...');
    }
  }, [isVisible, externalProgress, externalStep, generationPhase, onComplete]);

  if (!showLoader) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md ${
      isDarkMode 
        ? 'bg-gray-900/85' 
        : 'bg-white/85'
    }`}>
      {/* Subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Just a few subtle floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 magnetic-particle ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
            }`}
            style={{
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative p-12 rounded-3xl backdrop-blur-md border shadow-2xl max-w-md w-full mx-4 ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700/50' 
          : 'bg-white/90 border-gray-200/50'
      }`}>
        {/* Subtle Particle Ball Animation */}
        <div className="flex justify-center items-center mb-8">
          <div className="relative">
            {/* Clean particle ball animation */}
            <ParticleBallLoader isActive={true} size={32} />
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
                  ? 'bg-blue-400' 
                  : 'bg-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={`text-sm mt-2 text-center ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {Math.round(progress)}%
          </div>
        </div>
        
        {/* Loading text with subtle styling */}
        <div className="text-center space-y-3">
          <p className={`text-lg font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {currentStep}
          </p>
          
          {/* Simple animated dots */}
          <div className={`flex justify-center items-center space-x-1 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Cancel button - show only between 0% and 95% */}
          {onCancel && progress < 95 && (
            <div className="mt-6">
              <button
                onClick={onCancel}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 border-2 transform hover:scale-105 active:scale-95 ${
                  isDarkMode 
                    ? 'border-red-600 bg-red-600/10 text-red-400 hover:bg-red-600/20 hover:border-red-500 hover:text-red-300' 
                    : 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-400 hover:text-red-700'
                } shadow-lg hover:shadow-xl`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Generation
                </div>
              </button>
            </div>
          )}

          {/* Simple AI branding */}
          <div className={`mt-4 text-lg font-semibold ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            INTERA AI ✨
          </div>
          
          <div className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Powered by Advanced AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerationLoader;
