/**
 * Sandbox HTML template generator for safe component preview
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

/**
 * Generate HTML template for sandbox iframe preview
 * @param {string} componentCode - React component code
 * @param {boolean} isFullPage - Whether to render as full page
 * @param {Object} options - Additional options
 * @returns {string} - Complete HTML document
 */
export const generateSandboxHTML = (
  componentCode,
  isFullPage = false,
  options = {}
) => {
  const {
    title = "Component Preview",
    theme = "light",
    includeReactDevtools = true, // Default to true for better debugging
    customCSS = "",
    customJS = "",
  } = options;

  const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
      color: ${theme === "dark" ? "#ffffff" : "#333333"};
      background: ${
        theme === "dark"
          ? "#1a1a1a"
          : "linear-gradient(to bottom right, #f3f4f6, #dbeafe, #e5e7eb)"
      };
      ${isFullPage ? "height: 100vh; overflow: auto;" : "padding: 16px;"}
      min-height: ${isFullPage ? "100vh" : "200px"};
    }
    
    #root {
      ${isFullPage ? "height: 100%; width: 100%;" : "width: 100%;"}
      display: flex;
      ${
        isFullPage
          ? ""
          : "justify-content: center; align-items: center; min-height: 180px;"
      }
      flex-wrap: wrap;
    }
    
    .error-boundary {
      padding: 20px;
      border: 2px solid #ff6b6b;
      border-radius: 8px;
      background-color: #fff5f5;
      color: #c53030;
      text-align: center;
      max-width: 500px;
      margin: 20px auto;
    }
    
    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    
    .loading::after {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #ccc;
      border-top: 2px solid #333;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-left: 10px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Ensure animations and transitions work properly */
    * {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
  `;

  const errorBoundaryCode = `
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      
      componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught an error:', error, errorInfo);
        
        // Special handling for "Objects are not valid as React child" error
        if (error.message && error.message.includes('Objects are not valid as a React child')) {
          console.error('🚨 DETECTED: Objects being rendered as React children');
          console.error('This usually happens when:');
          console.error('1. Error objects are rendered directly: {errorObject}');
          console.error('2. Promises or other objects are used as JSX children');
          console.error('3. Complex objects without proper serialization');
        }
        
        // Send error info to parent window for debugging
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'sandbox-error',
            message: error.message || 'Unknown error',
            stack: error.stack,
            errorInfo: errorInfo
          }, '*');
        }
      }
      
      render() {
        if (this.state.hasError) {
          const errorMessage = this.state.error?.message || 'An unexpected error occurred';
          const isObjectError = errorMessage.includes('Objects are not valid as a React child');
          
          return React.createElement('div', {
            className: 'error-boundary',
            style: { padding: '20px', margin: '20px' }
          }, [
            React.createElement('h3', { key: 'title' }, 'Component Error'),
            React.createElement('p', { key: 'message' }, isObjectError 
              ? 'Error: Component is trying to render an object directly. This usually happens when error objects or promises are used as JSX children.'
              : errorMessage
            ),
            React.createElement('details', { key: 'details' }, [
              React.createElement('summary', { key: 'summary' }, 'Error Details'),
              React.createElement('pre', { 
                key: 'stack',
                style: { 
                  fontSize: '12px', 
                  textAlign: 'left', 
                  marginTop: '10px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }
              }, this.state.error?.stack || 'No stack trace available')
            ])
          ]);
        }
        
        return this.props.children;
      }
    }
  `;

  const componentWrapper = `
    // Wrap the component code in a try-catch for additional safety
    let ComponentToRender;
    try {
      ${componentCode}
      
      // Try to find the default export or the last defined component
      ComponentToRender = (typeof exports !== 'undefined' && exports.default) || 
                           window.GeneratedComponent || 
                           (() => React.createElement('div', { className: 'error-boundary' }, 'No component found to render'));
    } catch (error) {
      console.error('Error executing component code:', error);
      ComponentToRender = () => React.createElement('div', { 
        className: 'error-boundary' 
      }, 'Error loading component: ' + (error.message || String(error)));
    }
    
    // Enhanced App wrapper with better error handling
    const App = () => {
      const [hasError, setHasError] = React.useState(false);
      const [errorMessage, setErrorMessage] = React.useState('');
      
      React.useEffect(() => {
        const handleError = (event) => {
          console.error('Runtime error caught:', event.error);
          setHasError(true);
          setErrorMessage(event.error?.message || 'Unknown error occurred');
          event.preventDefault();
        };
        
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', (event) => {
          console.error('Unhandled promise rejection:', event.reason);
          setHasError(true);
          setErrorMessage(event.reason?.message || 'Promise rejection');
          event.preventDefault();
        });
        
        return () => {
          window.removeEventListener('error', handleError);
          window.removeEventListener('unhandledrejection', handleError);
        };
      }, []);
      
      if (hasError) {
        return React.createElement('div', { 
          className: 'error-boundary' 
        }, 'Component Error: ' + errorMessage);
      }
      
      return React.createElement(ErrorBoundary, null,
        React.createElement(ComponentToRender, null)
      );
    };
    
    // Mount the component with ReactDOM version detection and multiple fallbacks
    try {
      if (typeof ReactDOM === 'undefined') {
        throw new Error('ReactDOM is not available. Check CDN loading.');
      }
      
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        throw new Error('Root element not found');
      }
      
      // Clear any existing content
      rootElement.innerHTML = '';
      
      // Multi-level fallback approach for maximum compatibility
      let renderSuccess = false;
      
      // First try: React 18+ createRoot (preferred)
      if (typeof ReactDOM.createRoot === 'function' && !renderSuccess) {
        try {
          console.log('Attempting React 18+ createRoot method');
          const root = ReactDOM.createRoot(rootElement);
          root.render(React.createElement(App));
          renderSuccess = true;
          console.log('✅ Successfully rendered using createRoot');
        } catch (error) {
          console.warn('❌ createRoot failed:', error.message);
        }
      }
      
      // Second try: Legacy ReactDOM.render (React 16-17)
      if (typeof ReactDOM.render === 'function' && !renderSuccess) {
        try {
          console.log('Attempting legacy ReactDOM.render method');
          ReactDOM.render(React.createElement(App), rootElement);
          renderSuccess = true;
          console.log('✅ Successfully rendered using legacy render');
        } catch (error) {
          console.warn('❌ Legacy render failed:', error.message);
        }
      }
      
      // Third try: Direct DOM manipulation as absolute fallback
      if (!renderSuccess) {
        console.warn('All React rendering methods failed, using direct DOM manipulation');
        try {
          // Create a simple error display
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-boundary';
          errorDiv.innerHTML = 'Unable to render React component. ReactDOM methods not available.';
          rootElement.appendChild(errorDiv);
          
          // Still notify parent of the issue
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'sandbox-error',
              message: 'ReactDOM rendering methods not available'
            }, '*');
          }
          return;
        } catch (domError) {
          console.error('Even DOM manipulation failed:', domError);
        }
      }
      
      // Notify parent that component loaded successfully (only if render succeeded)
      if (renderSuccess && window.parent && window.parent !== window) {
        setTimeout(() => {
          window.parent.postMessage({
            type: 'sandbox-loaded'
          }, '*');
        }, 100);
      }
      
    } catch (error) {
      console.error('Critical error in component mounting:', error);
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.innerHTML = 
          '<div class="error-boundary">Failed to render component: ' + error.message + '</div>';
      }
      
      // Notify parent of error
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'sandbox-error',
          message: error.message
        }, '*');
      }
    }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Early warning suppression to catch all warnings from the start -->
  <script>
    (function() {
      const originalWarn = console.warn;
      const originalError = console.error;
      const originalLog = console.log;
      
      console.warn = function(...args) {
        const message = args[0];
        if (typeof message === 'string') {
          // Suppress common development warnings
          if (message.includes('cdn.tailwindcss.com should not be used in production') ||
              message.includes('in-browser Babel transformer') ||
              message.includes('React DevTools') ||
              message.includes('precompile your scripts for production') ||
              message.includes('Download the React DevTools') ||
              message.includes('react-devtools') ||
              message.includes('You are using the in-browser Babel transformer')) return;
        }
        originalWarn.apply(console, args);
      };
      
      console.error = function(...args) {
        const message = args[0];
        if (typeof message === 'string') {
          // Suppress React DevTools and connection errors
          if (message.includes('Download the React DevTools') ||
              message.includes('Could not establish connection') ||
              message.includes('React DevTools') ||
              message.includes('react-devtools')) return;
        }
        originalError.apply(console, args);
      };
      
      console.log = function(...args) {
        const message = args[0];
        if (typeof message === 'string') {
          // Suppress React DevTools installation messages
          if (message.includes('Download the React DevTools') ||
              message.includes('react-devtools')) return;
        }
        originalLog.apply(console, args);
      };
    })();
  </script>
  
  <!-- Content Security Policy for enhanced security -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; font-src 'self' data: https:; img-src 'self' data: https:; connect-src 'self' https://unpkg.com https://cdn.tailwindcss.com; object-src 'none'; base-uri 'self';">
  
  <!-- Pinned CDN versions for security and stability -->
  <script src="https://cdn.tailwindcss.com/3.4.0"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          animation: {
            'spin': 'spin 1s linear infinite',
            'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'bounce': 'bounce 1s infinite',
            'wiggle': 'wiggle 1s ease-in-out infinite',
            'float': 'float 3s ease-in-out infinite',
            'glow': 'glow 2s ease-in-out infinite alternate',
            'slide-up': 'slideUp 0.5s ease-out',
            'slide-down': 'slideDown 0.5s ease-out',
            'fade-in': 'fadeIn 0.5s ease-in',
            'scale-in': 'scaleIn 0.3s ease-out',
          },
          keyframes: {
            wiggle: {
              '0%, 100%': { transform: 'rotate(-3deg)' },
              '50%': { transform: 'rotate(3deg)' },
            },
            float: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
            glow: {
              '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
              '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)' },
            },
            slideUp: {
              '0%': { transform: 'translateY(100%)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            slideDown: {
              '0%': { transform: 'translateY(-100%)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            scaleIn: {
              '0%': { transform: 'scale(0)', opacity: '0' },
              '100%': { transform: 'scale(1)', opacity: '1' },
            },
          }
        }
      }
    }
  </script>
  
  <style>
    ${baseStyles}
    ${customCSS}
  </style>
  
  <!-- React and ReactDOM from CDN with fallbacks -->
  <script>
    // Load React with fallback and better error handling
    (function() {
      const reactScript = document.createElement('script');
      reactScript.crossOrigin = 'anonymous';
      reactScript.src = 'https://unpkg.com/react@18.2.0/umd/react.${
        includeReactDevtools ? "development" : "production.min"
      }.js';
      reactScript.onload = function() {
        console.log('React loaded successfully');
      };
      reactScript.onerror = function() {
        console.warn('Primary React CDN failed, trying fallback...');
        const fallback = document.createElement('script');
        fallback.crossOrigin = 'anonymous';
        fallback.src = 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.${
          includeReactDevtools ? "development" : "production.min"
        }.js';
        fallback.onload = function() {
          console.log('React fallback loaded successfully');
        };
        fallback.onerror = function() {
          console.error('All React CDN sources failed');
        };
        document.head.appendChild(fallback);
      };
      document.head.appendChild(reactScript);
    })();
  </script>
  
  <script>
    // Load ReactDOM with fallback and better error handling
    (function() {
      const reactDOMScript = document.createElement('script');
      reactDOMScript.crossOrigin = 'anonymous';
      reactDOMScript.src = 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.${
        includeReactDevtools ? "development" : "production.min"
      }.js';
      reactDOMScript.onload = function() {
        console.log('ReactDOM loaded successfully');
        console.log('ReactDOM.createRoot available:', typeof ReactDOM?.createRoot === 'function');
        console.log('ReactDOM.render available:', typeof ReactDOM?.render === 'function');
      };
      reactDOMScript.onerror = function() {
        console.warn('Primary ReactDOM CDN failed, trying fallback...');
        const fallback = document.createElement('script');
        fallback.crossOrigin = 'anonymous';
        fallback.src = 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.${
          includeReactDevtools ? "development" : "production.min"
        }.js';
        fallback.onload = function() {
          console.log('ReactDOM fallback loaded successfully');
          console.log('ReactDOM.createRoot available:', typeof ReactDOM?.createRoot === 'function');
          console.log('ReactDOM.render available:', typeof ReactDOM?.render === 'function');
        };
        fallback.onerror = function() {
          console.error('All ReactDOM CDN sources failed');
        };
        document.head.appendChild(fallback);
      };
      document.head.appendChild(reactDOMScript);
    })();
  </script>
  
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js" onerror="
    console.warn('Babel CDN failed, trying fallback...');
    const fallback = document.createElement('script');
    fallback.src = 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.22.5/babel.min.js';
    document.head.appendChild(fallback);
  "></script>
  
  ${customJS ? `<script>${customJS}</script>` : ""}
</head>
<body>
  <div id="root">
    <div class="loading">Loading component...</div>
  </div>
  
  <script type="text/babel">
    // Suppress Tailwind CDN production warning for preview environment
    (function() {
      const originalWarn = console.warn;
      const originalError = console.error;
      
      console.warn = (...args) => {
        const message = args[0];
        if (typeof message === 'string') {
          // Suppress Tailwind CDN production warning
          if (message.includes('cdn.tailwindcss.com should not be used in production')) return;
          // Suppress Babel production warning
          if (message.includes('You are using the in-browser Babel transformer')) return;
        }
        originalWarn.apply(console, args);
      };
      
      // Also suppress some React development warnings that aren't relevant in sandbox
      console.error = (...args) => {
        const message = args[0];
        if (typeof message === 'string') {
          // Suppress React DevTools message
          if (message.includes('Download the React DevTools')) return;
          // Suppress React connection errors that don't affect functionality
          if (message.includes('Could not establish connection')) return;
        }
        originalError.apply(console, args);
      };
    })();
    
    // Wait for React and ReactDOM to be loaded with timeout
    function waitForLibraries(callback) {
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds maximum wait time
      
      const checkLibraries = () => {
        attempts++;
        
        if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
          console.log('Libraries loaded successfully after ' + (attempts * 100) + 'ms');
          console.log('React version:', React.version);
          console.log('ReactDOM methods available:', {
            createRoot: typeof ReactDOM.createRoot === 'function',
            render: typeof ReactDOM.render === 'function'
          });
          callback();
        } else if (attempts >= maxAttempts) {
          console.error('Timeout waiting for React libraries to load');
          const rootElement = document.getElementById('root');
          if (rootElement) {
            rootElement.innerHTML = '<div class="error-boundary">Failed to load React libraries. Please refresh the page.</div>';
          }
        } else {
          console.log('Waiting for libraries... (attempt ' + attempts + '/' + maxAttempts + ')');
          setTimeout(checkLibraries, 100);
        }
      };
      checkLibraries();
    }
    
    waitForLibraries(() => {
      // Make React hooks available globally for components
      const { useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer, useLayoutEffect, useImperativeHandle, useDebugValue, Fragment, StrictMode, Suspense, createContext, forwardRef, memo, lazy } = React;
      
      // Make hooks globally accessible
      window.useState = useState;
      window.useEffect = useEffect;
      window.useCallback = useCallback;
      window.useMemo = useMemo;
      window.useRef = useRef;
      window.useContext = useContext;
      window.useReducer = useReducer;
      window.useLayoutEffect = useLayoutEffect;
      window.useImperativeHandle = useImperativeHandle;
      window.useDebugValue = useDebugValue;
      
      // Make React utilities globally accessible
      window.Fragment = Fragment;
      window.StrictMode = StrictMode;
      window.Suspense = Suspense;
      window.createContext = createContext;
      window.forwardRef = forwardRef;
      window.memo = memo;
      window.lazy = lazy;
      
      // Version compatibility check and setup
      console.log('Setting up React rendering with version:', React.version);
      const isReact18Plus = React.version && parseInt(React.version.split('.')[0]) >= 18;
      const hasCreateRoot = typeof ReactDOM.createRoot === 'function';
      const hasLegacyRender = typeof ReactDOM.render === 'function';
      
      console.log('React version analysis:', {
        version: React.version,
        isReact18Plus,
        hasCreateRoot,
        hasLegacyRender
      });
      
      ${errorBoundaryCode}
      ${componentWrapper}
    });
  </script>
  
  <script>
    // Global error handler for unhandled errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      
      // Special handling for Babel syntax errors
      if (event.message && event.message.includes('Missing semicolon')) {
        console.error('🚨 BABEL SYNTAX ERROR: Missing semicolon detected');
        console.error('This usually happens with complex array operations or nested function calls');
      }
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'sandbox-error',
          message: event.error?.message || event.message || 'Unknown error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }, '*');
      }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'sandbox-error',
          message: 'Promise rejection: ' + (event.reason?.message || event.reason)
        }, '*');
      }
    });
  </script>
</body>
</html>`;
};

/**
 * Generate basic Tailwind CSS classes for common utilities
 * @returns {string} - CSS classes
 */
const generateTailwindClasses = () => {
  return `
    /* Basic Tailwind-like utilities */
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .justify-center { justify-content: center; }
    .items-center { align-items: center; }
    .text-center { text-align: center; }
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .m-4 { margin: 1rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-4 { margin-top: 1rem; }
    .rounded { border-radius: 0.375rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
    .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .border { border-width: 1px; border-style: solid; border-color: #d1d5db; }
    .bg-white { background-color: #ffffff; }
    .bg-gray-100 { background-color: #f3f4f6; }
    .bg-blue-500 { background-color: #3b82f6; }
    .bg-blue-600 { background-color: #2563eb; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .text-white { color: #ffffff; }
    .hover\\:bg-blue-600:hover { background-color: #2563eb; }
    .transition-colors { transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .max-w-sm { max-width: 24rem; }
    .max-w-md { max-width: 28rem; }
    .cursor-pointer { cursor: pointer; }
    .select-none { user-select: none; }
  `;
};

/**
 * Generate sandbox HTML with custom React version
 * @param {string} componentCode - React component code
 * @param {string} reactVersion - React version to use
 * @param {boolean} isFullPage - Whether to render as full page
 * @returns {string} - Complete HTML document
 */
export const generateCustomSandboxHTML = (
  componentCode,
  reactVersion = "18",
  isFullPage = false
) => {
  return generateSandboxHTML(componentCode, isFullPage, {
    title: `Component Preview (React ${reactVersion})`,
    includeReactDevtools: reactVersion !== "18",
  });
};

/**
 * Generate minimal sandbox HTML for simple components
 * @param {string} componentCode - React component code
 * @returns {string} - Minimal HTML document
 */
export const generateMinimalSandboxHTML = (componentCode) => {
  const minimalTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  
  <!-- Tailwind CSS CDN for full utility support -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          animation: {
            'spin': 'spin 1s linear infinite',
            'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'bounce': 'bounce 1s infinite',
            'wiggle': 'wiggle 1s ease-in-out infinite',
            'float': 'float 3s ease-in-out infinite',
            'glow': 'glow 2s ease-in-out infinite alternate',
            'slide-up': 'slideUp 0.5s ease-out',
            'slide-down': 'slideDown 0.5s ease-out',
            'fade-in': 'fadeIn 0.5s ease-in',
            'scale-in': 'scaleIn 0.3s ease-out',
          },
          keyframes: {
            wiggle: {
              '0%, 100%': { transform: 'rotate(-3deg)' },
              '50%': { transform: 'rotate(3deg)' },
            },
            float: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
            glow: {
              '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
              '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)' },
            },
            slideUp: {
              '0%': { transform: 'translateY(100%)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            slideDown: {
              '0%': { transform: 'translateY(-100%)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            scaleIn: {
              '0%': { transform: 'scale(0)', opacity: '0' },
              '100%': { transform: 'scale(1)', opacity: '1' },
            },
          }
        }
      }
    }
  </script>
  
  <script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" onload="console.log('React loaded')" onerror="
    console.warn('Primary React failed, trying fallback');
    const fallback = document.createElement('script');
    fallback.crossOrigin = 'anonymous';
    fallback.src = 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js';
    fallback.onload = () => console.log('React fallback loaded');
    document.head.appendChild(fallback);
  "></script>
  <script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" onload="
    console.log('ReactDOM loaded');
    console.log('ReactDOM.createRoot available:', typeof ReactDOM?.createRoot === 'function');
    console.log('ReactDOM.render available:', typeof ReactDOM?.render === 'function');
  " onerror="
    console.warn('Primary ReactDOM failed, trying fallback');
    const fallback = document.createElement('script');
    fallback.crossOrigin = 'anonymous';
    fallback.src = 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js';
    fallback.onload = () => {
      console.log('ReactDOM fallback loaded');
      console.log('ReactDOM.createRoot available:', typeof ReactDOM?.createRoot === 'function');
      console.log('ReactDOM.render available:', typeof ReactDOM?.render === 'function');
    };
    document.head.appendChild(fallback);
  "></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      font-family: system-ui; 
      padding: 20px; 
    }
    #root { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      min-height: 200px; 
    }
    * {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // Suppress warnings for preview environment
    (function() {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const message = args[0];
        if (typeof message === 'string' && 
            (message.includes('cdn.tailwindcss.com should not be used in production') ||
             message.includes('in-browser Babel transformer') ||
             message.includes('React DevTools'))) return;
        originalWarn.apply(console, args);
      };
    })();
    
    // Wait for libraries to load with timeout
    function waitForLibraries(callback) {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds maximum wait time
      
      const checkLibraries = () => {
        attempts++;
        
        if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
          console.log('Libraries loaded successfully after ' + (attempts * 100) + 'ms');
          console.log('ReactDOM methods available:', {
            createRoot: typeof ReactDOM.createRoot === 'function',
            render: typeof ReactDOM.render === 'function'
          });
          callback();
        } else if (attempts >= maxAttempts) {
          console.error('Timeout waiting for React libraries to load');
          document.getElementById('root').innerHTML = '<div style="padding: 20px; border: 2px solid red; color: red;">Failed to load React libraries. Please refresh the page.</div>';
        } else {
          setTimeout(checkLibraries, 100);
        }
      };
      checkLibraries();
    }
    
    waitForLibraries(() => {
      // Make React hooks and utilities available globally
      const { useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer, useLayoutEffect, useImperativeHandle, useDebugValue, Fragment, StrictMode, Suspense, createContext, forwardRef, memo, lazy } = React;
      
      // Make hooks globally accessible
      window.useState = useState;
      window.useEffect = useEffect;
      window.useCallback = useCallback;
      window.useMemo = useMemo;
      window.useRef = useRef;
      window.useContext = useContext;
      window.useReducer = useReducer;
      window.useLayoutEffect = useLayoutEffect;
      window.useImperativeHandle = useImperativeHandle;
      window.useDebugValue = useDebugValue;
      
      // Make React utilities globally accessible
      window.Fragment = Fragment;
      window.StrictMode = StrictMode;
      window.Suspense = Suspense;
      window.createContext = createContext;
      window.forwardRef = forwardRef;
      window.memo = memo;
      window.lazy = lazy;
      
      try {
        ${componentCode}
        
        const Component = typeof exports !== 'undefined' && exports.default || window.GeneratedComponent || (() => React.createElement('div', null, 'No component found'));
        
        if (typeof ReactDOM === 'undefined') {
          throw new Error('ReactDOM is not available');
        }
        
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          throw new Error('Root element not found');
        }
        
        // Clear any existing content
        rootElement.innerHTML = '';
        
        // Multi-level fallback approach for maximum compatibility
        let renderSuccess = false;
        
        // First try: React 18+ createRoot (preferred)
        if (typeof ReactDOM.createRoot === 'function' && !renderSuccess) {
          try {
            console.log('Using React 18+ createRoot');
            ReactDOM.createRoot(rootElement).render(React.createElement(Component));
            renderSuccess = true;
          } catch (error) {
            console.warn('createRoot failed, trying legacy render:', error.message);
          }
        }
        
        // Second try: Legacy ReactDOM.render (React 16-17)
        if (typeof ReactDOM.render === 'function' && !renderSuccess) {
          try {
            console.log('Using legacy ReactDOM.render');
            ReactDOM.render(React.createElement(Component), rootElement);
            renderSuccess = true;
          } catch (error) {
            console.warn('Legacy render also failed:', error.message);
          }
        }
        
        // Third try: Direct DOM manipulation as absolute fallback
        if (!renderSuccess) {
          throw new Error('All ReactDOM rendering methods failed');
        }
        
      } catch (error) {
        console.error('Component error:', error);
        const rootElement = document.getElementById('root');
        if (rootElement) {
          rootElement.innerHTML = '<div style="padding: 20px; border: 2px solid red; color: red;">Error: ' + error.message + '</div>';
        }
      }
    });
  </script>
</body>
</html>`;

  return minimalTemplate;
};
