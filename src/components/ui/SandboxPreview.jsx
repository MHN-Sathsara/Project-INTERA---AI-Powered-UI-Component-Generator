/**
 * Sandbox Preview Component for isolated rendering with iframe
 * Enhanced with security, performance, and error handling improvements
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { processComponentCode, validateSandboxCode, SECURITY_CONFIG } from '../../utils/codeProcessor.js';
import { generateSandboxHTML } from '../../utils/sandboxTemplate.js';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import debounce from 'lodash.debounce';
import memoizeOne from 'memoize-one';

const SandboxPreview = ({ code, type = 'component', fullPage = false }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [networkCheckComplete, setNetworkCheckComplete] = useState(false);
  const loadingRef = useRef(true); // Track loading state for closures
  const timeoutRef = useRef(null);
  
  // Use theme with error boundary
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn('Theme context not available, using light mode as fallback');
    }
  }

  // Memoized code processing to avoid repeated expensive operations
  const memoizedProcessSandboxCode = useMemo(() => 
    memoizeOne((code) => {
      const processedCode = processComponentCode(code);
      const validation = validateSandboxCode(processedCode);
      
      if (!validation.isValid) {
        // Only log critical errors quietly
        const criticalErrors = validation.errors.filter(error => 
          error.includes('Syntax error') || 
          error.includes('unsafe code') ||
          error.includes('Code is empty') ||
          error.includes('Mismatched braces') ||
          error.includes('Mismatched parentheses')
        );
        
        if (criticalErrors.length > 0) {
          if (process.env.NODE_ENV === "development") {
            console.warn('Critical code validation error:', criticalErrors[0]);
          }
          throw new Error(`Code validation failed: ${criticalErrors[0]}`);
        }
      }
      
      // Only log warnings in development mode and keep them minimal
      if (validation.hasWarnings && process.env.NODE_ENV === 'development') {
        console.debug('Code validation passed with minor warnings (non-critical)');
      }
      
      return processedCode;
    })
  , []);

  // Memoized sandbox content creation
  const createSandboxContent = useMemo(() => 
    memoizeOne((componentCode, isFullPage, theme) => {
      try {
        const processedCode = memoizedProcessSandboxCode(componentCode);
        return generateSandboxHTML(processedCode, isFullPage, {
          theme: theme,
          includeReactDevtools: true // Always include for better debugging
        });
      } catch (error) {
        throw error;
      }
    })
  , [memoizedProcessSandboxCode]);

  // Enhanced CDN availability check
  const checkCDNAvailability = useCallback(async () => {
    const cdnUrls = [
      'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
      'https://cdn.tailwindcss.com@3.4.0'
    ];

    try {
      await Promise.all(
        cdnUrls.map(url => 
          fetch(url, { method: 'HEAD', mode: 'no-cors' })
            .then(() => true)
            .catch(() => false)
        )
      );
      setNetworkCheckComplete(true);
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn('CDN availability check failed:', error);
      }
      setNetworkCheckComplete(true);
      return false;
    }
  }, []);

  // Real loading progress based on actual milestones
  const updateLoadingProgress = useCallback((milestone) => {
    const milestones = {
      'code-processing': 20,
      'cdn-check': 40,
      'iframe-load': 60,
      'component-render': 85,
      'complete': 100
    };

    const progress = milestones[milestone] || 0;
    setLoadingProgress(progress);

    if (milestone === 'complete') {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // Debounced iframe update to prevent rapid reloads
  const debouncedUpdateIframe = useCallback(
    debounce((code, fullPage, theme) => {
      if (!iframeRef.current) return;

      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);
      setNetworkCheckComplete(false);
      loadingRef.current = true;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set timeout for iframe loading (adjust for performance mode)
      timeoutRef.current = setTimeout(() => {
        if (loadingRef.current) {
          loadingRef.current = false;
          setIsLoading(false);
          setError('Component loading timeout. This may be due to network issues or complex component logic.');
        }
      }, SECURITY_CONFIG.TIMEOUT_MS);

      const processAndRender = async () => {
        try {
          // Milestone 1: Code processing
          updateLoadingProgress('code-processing');
          
          // Milestone 2: CDN check - always perform for better reliability
          updateLoadingProgress('cdn-check');
          await checkCDNAvailability();
          
          const sandboxContent = createSandboxContent(code, fullPage, theme);
          
          // Milestone 3: iframe load
          updateLoadingProgress('iframe-load');
          
          const iframe = iframeRef.current;
          if (!iframe) return;

          // Enhanced iframe message handling
          const handleIframeMessage = (event) => {
            if (event.data && event.data.type === 'sandbox-error') {
              if (process.env.NODE_ENV === "development") {
                console.error('Sandbox iframe error:', event.data);
              }
              loadingRef.current = false;
              clearTimeout(timeoutRef.current);
              
              // Provide more helpful error messages based on error type
              let errorMessage = event.data.message || 'Unknown error';
              if (errorMessage.includes('Unexpected token') || errorMessage.includes('SyntaxError')) {
                errorMessage = 'Syntax Error: The generated code has formatting issues. Please try regenerating the component.';
              } else if (errorMessage.includes('Script error')) {
                errorMessage = 'Script Error: There was an issue loading the component. Please try again.';
              }
              
              setError(`Component Error: ${errorMessage}`);
              setIsLoading(false);
            } else if (event.data && event.data.type === 'sandbox-loaded') {
              if (process.env.NODE_ENV === "development") {
                console.log('Sandbox component loaded successfully via message');
              }
              updateLoadingProgress('component-render');
              setTimeout(() => updateLoadingProgress('complete'), 500);
            }
          };
          
          // Set up event handlers before setting srcdoc
          const handleLoad = () => {
            if (process.env.NODE_ENV === "development") {
              console.log('Sandbox iframe loaded successfully');
            }
            updateLoadingProgress('component-render');
            setTimeout(() => updateLoadingProgress('complete'), 1000);
          };
          
          const handleError = (err) => {
            if (process.env.NODE_ENV === "development") {
              console.warn('Iframe load error:', err);
            }
            loadingRef.current = false;
            clearTimeout(timeoutRef.current);
            setError('Failed to load preview - check console for details');
            setIsLoading(false);
          };
          
          window.addEventListener('message', handleIframeMessage);
          iframe.addEventListener('load', handleLoad);
          iframe.addEventListener('error', handleError);
          
          // Use srcdoc instead of blob URL for better sandbox compatibility
          iframe.srcdoc = sandboxContent;
          
          // Cleanup function
          return () => {
            window.removeEventListener('message', handleIframeMessage);
            iframe.removeEventListener('load', handleLoad);
            iframe.removeEventListener('error', handleError);
            clearTimeout(timeoutRef.current);
          };

        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.error('Sandbox creation error:', err);
          }
          loadingRef.current = false;
          setError(err.message);
          setIsLoading(false);
        }
      };

      processAndRender();
    }, SECURITY_CONFIG.DEBOUNCE_DELAY_MS),
    [createSandboxContent, updateLoadingProgress, checkCDNAvailability]
  );

  // Effect to trigger debounced iframe update
  useEffect(() => {
    if (!code || !iframeRef.current) return;

    debouncedUpdateIframe(code, fullPage, isDarkMode ? 'dark' : 'light');

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      debouncedUpdateIframe.cancel?.();
    };
  }, [code, fullPage, isDarkMode, debouncedUpdateIframe]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center z-10 ${
          isDarkMode ? 'bg-gray-900/80' : 'bg-gray-50'
        }`}>
          <div className={`flex flex-col items-center justify-center gap-4 p-6 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${
              isDarkMode ? 'border-blue-400' : 'border-blue-600'
            }`}></div>
            <div className="max-w-xs">
              <div className="text-sm font-medium mb-2">Loading preview...</div>
              <div className="text-xs opacity-75 mb-3">
                {loadingProgress < 30 ? 'Processing component code...' :
                 loadingProgress < 60 ? 'Setting up preview environment...' :
                 loadingProgress < 85 ? 'Rendering component...' :
                 'Finalizing preview...'}
              </div>
              {/* Progress bar */}
              <div className="flex flex-col items-center">
                <div className={`w-48 h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
                    }`}
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs mt-2 opacity-60">
                  Large or complex components may take longer to load
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center z-10 ${
          isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
        }`}>
          <div className="text-center p-4">
            <div className={`font-medium mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>Preview Error</div>
            <div className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</div>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        className={`w-full border-0 h-full ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-200 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-100 via-blue-100/30 to-gray-200'
        } rounded-lg`}
        sandbox="allow-scripts allow-forms"
        title="Component Preview"
      />
    </div>
  );
};

export default SandboxPreview;
