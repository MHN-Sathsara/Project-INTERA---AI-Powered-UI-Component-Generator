/**
 * Error boundary component for handling component preview errors
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

class PreviewErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Preview Error:', error, errorInfo);
    
    // Enhanced error analysis for better debugging
    const errorAnalysis = this.analyzeError(error);
    
    this.setState({
      error: error.message,
      errorInfo: errorInfo.componentStack,
      errorAnalysis: errorAnalysis
    });
  }

  analyzeError(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('is not defined')) {
      const undefinedVar = error.message.match(/'?(\w+)'?\s+is not defined/i)?.[1];
      return {
        type: 'Variable/Function Error',
        suggestion: undefinedVar ? 
          `The variable or function '${undefinedVar}' is not defined. Check for typos, missing imports, or ensure it's declared before use. For event handlers, make sure functions are defined within the component.` :
          'Check for undefined variables or missing imports. Common issues: missing React hooks, undefined event parameters, or incorrect variable names.',
        severity: 'high'
      };
    }
    
    if (message.includes('cannot read property') || message.includes('cannot read properties')) {
      return {
        type: 'Property Access Error',
        suggestion: 'Check for null/undefined objects before accessing properties. Use optional chaining (?.) for safe property access. Ensure objects and arrays are properly initialized.',
        severity: 'medium'
      };
    }
    
    if (message.includes('hook') || message.includes('useState') || message.includes('useEffect')) {
      return {
        type: 'React Hooks Error',
        suggestion: 'Hooks can only be called at the top level of functional components. Check hook usage and placement. Ensure useState is properly destructured: const [state, setState] = useState()',
        severity: 'high'
      };
    }

    if (message.includes('unexpected token') || message.includes('syntax error') || message.includes('expected')) {
      return {
        type: 'Syntax Error',
        suggestion: 'Check for missing brackets, parentheses, or incorrect JSX syntax. Ensure proper component structure. Common issues: missing commas in objects, unclosed JSX tags, or incorrect arrow function syntax.',
        severity: 'critical'
      };
    }

    if (message.includes('adjacent jsx elements') || message.includes('wrap in an enclosing tag')) {
      return {
        type: 'JSX Structure Error',
        suggestion: 'Adjacent JSX elements must be wrapped in a single parent element. Use a <div>, React Fragment (<>...</>) or <React.Fragment>.',
        severity: 'high'
      };
    }

    if (message.includes('cannot appear as a child')) {
      return {
        type: 'JSX Content Error',
        suggestion: 'Objects and complex data cannot be rendered directly. Convert to string or use proper JSX elements. For arrays, use .map() to render lists.',
        severity: 'medium'
      };
    }

    if (message.includes('maximum update depth exceeded') || message.includes('infinite loop')) {
      return {
        type: 'Infinite Render Loop',
        suggestion: 'Check useEffect dependencies and setState calls. Avoid setting state directly in render methods. Ensure effect dependencies are correct to prevent infinite rerenders.',
        severity: 'critical'
      };
    }

    if (message.includes('hydration') || message.includes('mismatch')) {
      return {
        type: 'Rendering Mismatch',
        suggestion: 'Server and client rendering mismatch. Check for dynamic content that differs between server and client rendering.',
        severity: 'medium'
      };
    }

    if (message.includes('invalid hook call')) {
      return {
        type: 'Invalid Hook Usage',
        suggestion: 'Hooks must be called at the top level of React functions. They cannot be called inside loops, conditions, or nested functions.',
        severity: 'critical'
      };
    }
    
    return {
      type: 'General Component Error',
      suggestion: 'Review the component code for common React patterns and best practices. Check the browser console for more detailed error information.',
      severity: 'medium'
    };
  }

  render() {
    if (this.state.hasError) {
      const analysis = this.state.errorAnalysis || {};
      const { isDarkMode } = this.props;
      const severityColors = {
        critical: isDarkMode ? 'border-red-600 bg-red-900/20' : 'border-red-500 bg-red-50',
        high: isDarkMode ? 'border-red-500 bg-red-900/20' : 'border-red-400 bg-red-50',
        medium: isDarkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-400 bg-orange-50'
      };
      
      return (
        <div className={`border rounded-lg p-4 ${severityColors[analysis.severity] || (isDarkMode ? 'border-red-700 bg-red-900/20' : 'border-red-200 bg-red-50')}`}>
          <div className="flex items-center gap-2 mb-3">
            <svg className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
              {analysis.type || 'Component Render Error'}
            </span>
            {analysis.severity && (
              <span className={`text-xs px-2 py-1 rounded ${
                analysis.severity === 'critical' ? (isDarkMode ? 'bg-red-700 text-red-100' : 'bg-red-600 text-white') :
                analysis.severity === 'high' ? (isDarkMode ? 'bg-red-600 text-red-100' : 'bg-red-500 text-white') :
                (isDarkMode ? 'bg-orange-600 text-orange-100' : 'bg-orange-500 text-white')
              }`}>
                {analysis.severity.toUpperCase()}
              </span>
            )}
          </div>
          
          <p className={`text-sm mb-2 font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{this.state.error}</p>
          
          {analysis.suggestion && (
            <div className={`border rounded p-3 mb-3 ${
              isDarkMode ? 'bg-blue-900/20 border-blue-800/40' : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>💡 Suggestion:</p>
              <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{analysis.suggestion}</p>
            </div>
          )}
          
          <p className={`text-xs mb-3 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            For complex components like forms and login pages, ensure all event handlers have proper parameter declarations and state is managed correctly.
          </p>
          
          <details className="mt-2">
            <summary className={`text-xs cursor-pointer font-medium ${
              isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
            }`}>
              Show Detailed Error Information
            </summary>
            <div className="mt-2 space-y-2">
              <div className={`p-2 rounded ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Error Message:</p>
                <pre className={`text-xs overflow-auto ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{this.state.error}</pre>
              </div>
              {this.state.errorInfo && (
                <div className={`p-2 rounded ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                  <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Component Stack:</p>
                  <pre className={`text-xs overflow-auto max-h-32 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{this.state.errorInfo}</pre>
                </div>
              )}
            </div>
          </details>
          
          <div className={`mt-3 pt-2 border-t ${isDarkMode ? 'border-red-800' : 'border-red-200'}`}>
            <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              <strong>Quick Fixes:</strong> Try regenerating the component, check for typos in variable names, or ensure proper React hook usage.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to provide theme context to the class component
const PreviewErrorBoundary = ({ children }) => {
  // Use theme with error boundary
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }
  
  return (
    <PreviewErrorBoundaryInner isDarkMode={isDarkMode}>
      {children}
    </PreviewErrorBoundaryInner>
  );
};

export default PreviewErrorBoundary;
