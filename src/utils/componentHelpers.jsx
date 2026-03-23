/**
 * Helper utilities for component processing with live code rendering
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React from 'react';

/**
 * Extracts component name from generated code
 * @param {string} code - Generated component code
 * @returns {string} - Component name
 */
export const extractComponentName = (code) => {
  const match = code.match(/const\s+(\w+)\s*=|function\s+(\w+)\s*\(/);
  return match ? (match[1] || match[2]) : 'GeneratedComponent';
};

/**
 * Detects component type from user prompt with enhanced detection for complex components
 * @param {string} prompt - User's description
 * @returns {string} - Component type
 */
export const detectComponentType = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Enhanced detection for complex components
  if (lowerPrompt.includes('login') || lowerPrompt.includes('signin') || lowerPrompt.includes('sign in') || lowerPrompt.includes('authentication')) return 'login';
  if (lowerPrompt.includes('signup') || lowerPrompt.includes('register') || lowerPrompt.includes('registration') || lowerPrompt.includes('sign up')) return 'signup';
  if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin panel') || lowerPrompt.includes('control panel')) return 'dashboard';
  if (lowerPrompt.includes('form') || lowerPrompt.includes('contact form') || lowerPrompt.includes('contact us') || lowerPrompt.includes('feedback form')) return 'form';
  if (lowerPrompt.includes('table') || lowerPrompt.includes('data table') || lowerPrompt.includes('grid') || lowerPrompt.includes('list view')) return 'table';
  if (lowerPrompt.includes('navigation') || lowerPrompt.includes('navbar') || lowerPrompt.includes('nav bar') || lowerPrompt.includes('menu') || lowerPrompt.includes('sidebar')) return 'navigation';
  if (lowerPrompt.includes('modal') || lowerPrompt.includes('dialog') || lowerPrompt.includes('popup') || lowerPrompt.includes('overlay')) return 'modal';
  if (lowerPrompt.includes('profile') || lowerPrompt.includes('user profile') || lowerPrompt.includes('account') || lowerPrompt.includes('settings')) return 'profile';
  if (lowerPrompt.includes('search') || lowerPrompt.includes('filter') || lowerPrompt.includes('search bar') || lowerPrompt.includes('search box')) return 'search';
  if (lowerPrompt.includes('card') || lowerPrompt.includes('product card') || lowerPrompt.includes('item card')) return 'card';
  if (lowerPrompt.includes('button') || lowerPrompt.includes('btn')) return 'button';
  if (lowerPrompt.includes('input') || lowerPrompt.includes('text field') || lowerPrompt.includes('text input')) return 'input';
  if (lowerPrompt.includes('checkout') || lowerPrompt.includes('payment') || lowerPrompt.includes('billing')) return 'checkout';
  if (lowerPrompt.includes('header') || lowerPrompt.includes('footer') || lowerPrompt.includes('layout')) return 'layout';
  if (lowerPrompt.includes('gallery') || lowerPrompt.includes('image gallery') || lowerPrompt.includes('photo gallery')) return 'gallery';
  if (lowerPrompt.includes('calendar') || lowerPrompt.includes('date picker') || lowerPrompt.includes('schedule')) return 'calendar';
  if (lowerPrompt.includes('chat') || lowerPrompt.includes('messaging') || lowerPrompt.includes('comments')) return 'chat';
  if (lowerPrompt.includes('pricing') || lowerPrompt.includes('price') || lowerPrompt.includes('subscription')) return 'pricing';
  if (lowerPrompt.includes('testimonial') || lowerPrompt.includes('review') || lowerPrompt.includes('feedback')) return 'testimonial';
  if (lowerPrompt.includes('hero') || lowerPrompt.includes('banner') || lowerPrompt.includes('landing')) return 'hero';
  
  return 'component';
};

/**
 * Validates React component code for basic syntax errors and common AI generation issues
 * Enhanced for complex components like forms, login pages, etc. - More permissive validation
 * @param {string} code - Component code to validate
 * @returns {object} - Validation result with success boolean and error message
 */
export const validateComponentCode = (code) => {
  if (!code || typeof code !== 'string') {
    return { success: false, error: 'Invalid code input' };
  }

  if (code.trim() === '') {
    return { success: false, error: 'Code is empty' };
  }

  // Basic required checks only
  const requiredChecks = [
    {
      test: /const\s+\w+\s*=|function\s+\w+\s*\(/,
      error: 'No component definition found'
    }
    // Removed export default requirement for sandbox compatibility
  ];

  // Run required checks
  for (const check of requiredChecks) {
    if (!check.test.test(code)) {
      return { success: false, error: check.error };
    }
  }

  // Check for balanced brackets and parentheses
  const bracketCount = (code.match(/\{/g) || []).length - (code.match(/\}/g) || []).length;
  const parenCount = (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length;
  
  if (bracketCount !== 0) {
    return { success: false, error: 'Unbalanced curly braces {}' };
  }
  
  if (parenCount !== 0) {
    return { success: false, error: 'Unbalanced parentheses ()' };
  }

  // Very basic hook validation - only check for obviously wrong patterns
  const hookPattern = /use[A-Z]\w*\s*\(/g;
  const hookMatches = code.match(hookPattern);
  if (hookMatches) {
    // Only check for very obvious violations - hooks directly inside if/for/while without any function wrapper
    const obviousViolations = [
      /\bif\s*\([^)]*\)\s*{\s*use[A-Z]\w*\s*\(/,  // Direct hooks in if blocks
      /\bfor\s*\([^)]*\)\s*{\s*[^}]*use[A-Z]\w*\s*\(/,  // Direct hooks in for loops
      /\bwhile\s*\([^)]*\)\s*{\s*[^}]*use[A-Z]\w*\s*\(/  // Direct hooks in while loops
    ];
    
    for (const pattern of obviousViolations) {
      if (pattern.test(code)) {
        return { 
          success: false, 
          error: 'React hooks should not be called inside loops or conditions. Move hooks to the top level of your component.' 
        };
      }
    }
  }

  // Very lenient syntax check - only flag obvious undefined variables
  if (code.includes('undefined.') || code.includes('null.')) {
    return { success: false, error: 'Code contains undefined or null variable access' };
  }

  return { success: true };
};

/**
 * Safely evaluates and creates a React component from code string with enhanced error handling
 * Improved for larger components like forms, login pages, etc.
 * @param {string} code - Component code
 * @returns {object} - Result with component or error
 */
export const createLiveComponent = (code) => {
  try {
    // Input validation
    if (!code || typeof code !== 'string') {
      return { success: false, error: 'Invalid code input' };
    }

    // Validate code first
    const validation = validateComponentCode(code);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    // Extract component name
    const componentName = extractComponentName(code);
    
    // Clean and prepare the code
    let cleanCode = code.trim();
    
    // Remove import statements (we'll provide React in the scope)
    cleanCode = cleanCode.replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, '');
    
    // Enhanced validation for complex components
    if (cleanCode.includes('undefined') || /\be\s*\.\s*\w+/.test(cleanCode)) {
      return { success: false, error: 'Code contains undefined variables or syntax errors' };
    }
    
    // Add React hooks to the scope for complex components
    const createSafeComponent = () => {
      // Create a safer evaluation environment with all necessary React features
      const safeEval = (code) => {
        // Add necessary React hooks and common utilities to scope
        const { useState, useEffect, useCallback, useMemo, useRef } = React;
        
        // Common event handlers for forms and interactive components
        const defaultHandlers = {
          onClick: (e) => console.log('Button clicked:', e),
          onSubmit: (e) => { e.preventDefault(); console.log('Form submitted:', e); },
          onChange: (e) => console.log('Input changed:', e.target.value),
          onFocus: (e) => console.log('Element focused:', e),
          onBlur: (e) => console.log('Element blurred:', e),
          onKeyPress: (e) => console.log('Key pressed:', e.key),
          onMouseEnter: (e) => console.log('Mouse entered:', e),
          onMouseLeave: (e) => console.log('Mouse left:', e)
        };
        
        try {
          // Create a function that includes all necessary scope variables
          const componentFunction = new Function(
            'React', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'defaultHandlers',
            `
            try {
              ${cleanCode}
              return ${componentName};
            } catch (error) {
              throw new Error('Component execution failed: ' + error.message);
            }
            `
          );
          
          return componentFunction(React, useState, useEffect, useCallback, useMemo, useRef, defaultHandlers);
        } catch (error) {
          throw new Error(`Code evaluation failed: ${error.message}`);
        }
      };
      
      return safeEval(cleanCode);
    };

    // Execute and get component with enhanced error handling
    let Component;
    try {
      Component = createSafeComponent();
    } catch (execError) {
      return { success: false, error: `Execution error: ${execError.message}` };
    }
    
    if (typeof Component !== 'function') {
      return { success: false, error: 'Code did not return a valid React component function' };
    }

    // Enhanced component wrapping for better rendering of complex components
    const WrappedComponent = (props) => {
      const [hasError, setHasError] = React.useState(false);
      
      React.useEffect(() => {
        // Reset error state when component changes
        setHasError(false);
      }, [Component]);
      
      if (hasError) {
        return (
          <div className="text-red-600 p-4 border border-red-200 rounded">
            <p>Component render error. Please check your code.</p>
          </div>
        );
      }
      
      try {
        // Only pass through props, no mock/sample/demo values
        const enhancedProps = {
          ...props
        };
        
        return React.createElement(Component, enhancedProps);
      } catch (renderError) {
        setHasError(true);
        console.error('Component render error:', renderError);
        return (
          <div className="text-red-600 p-4 border border-red-200 rounded">
            <p>Render error: {renderError.message}</p>
          </div>
        );
      }
    };
    
    // Test render the component
    try {
      const TestElement = React.createElement(WrappedComponent);
      
      return { 
        success: true, 
        component: WrappedComponent,
        element: TestElement,
        name: componentName
      };
    } catch (renderError) {
      return { success: false, error: `Render error: ${renderError.message}` };
    }
    
  } catch (error) {
    return { 
      success: false, 
      error: `Component creation failed: ${error.message}` 
    };
  }
};

/**
 * Creates a safe preview component with error handling and enhanced fallbacks
 * @param {string} code - Component code
 * @param {string} type - Component type
 * @returns {object} - Preview result with component or error
 */
export const createPreviewComponent = (code, type) => {
  if (!code || code.trim() === '') {
    return { success: false, error: 'No code provided' };
  }

  // Try to create live component first
  const liveResult = createLiveComponent(code);
  if (liveResult.success) {
    return {
      success: true,
      component: liveResult.element,
      isLive: true
    };
  }

  // Enhanced fallback previews that match common component patterns
  const getPreviewFromCode = (code, type) => {
    // Try to extract useful information from the code for better previews
    const hasProps = /\{[\s\S]*?(children|title|placeholder|label|text)[\s\S]*?\}/.test(code);
    const hasStyles = /(className|class)=/.test(code);
    const componentName = extractComponentName(code);
    
    // Enhanced form detection
    if (code.includes('form') || code.includes('Form') || code.includes('onSubmit') || type === 'form') {
      const hasEmailField = code.includes('email') || code.includes('Email');
      const hasPasswordField = code.includes('password') || code.includes('Password');
      const hasNameField = code.includes('name') || code.includes('Name') || code.includes('firstName') || code.includes('lastName');
      const hasValidation = code.includes('error') || code.includes('required') || code.includes('validate');
      const isLoginForm = hasEmailField && hasPasswordField && !hasNameField;
      const isSignupForm = hasEmailField && hasPasswordField && hasNameField;
      
      return (
        <div className="space-y-4 w-full max-w-md mx-auto">
          <p className="text-xs text-gray-500 mb-4">Mock Preview: {componentName}</p>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {isLoginForm ? 'Login' : isSignupForm ? 'Sign Up' : 'Form'}
            </h2>
            <form className="space-y-4">
              {(hasNameField || isSignupForm) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              {hasEmailField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              {hasPasswordField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {hasValidation && <p className="mt-1 text-sm text-red-600">Password is required</p>}
                </div>
              )}
              
              {isLoginForm && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>
              )}
              
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {isLoginForm ? 'Sign In' : isSignupForm ? 'Create Account' : 'Submit'}
              </button>
              
              {(isLoginForm || isSignupForm) && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {isLoginForm ? "Don't have an account? " : "Already have an account? "}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                      {isLoginForm ? 'Sign up' : 'Sign in'}
                    </a>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      );
    }
    
    // Enhanced login page detection
    if (code.includes('login') || code.includes('Login') || code.includes('signin') || code.includes('SignIn') || type === 'login') {
      return (
        <div className="space-y-4 w-full max-w-md mx-auto">
          <p className="text-xs text-gray-500 mb-4">Mock Preview: {componentName}</p>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-600 mt-2">Please sign in to your account</p>
            </div>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Sign In
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account? 
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium ml-1">Sign up</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      );
    }
    
    // Create enhanced mock based on detected patterns
    if (code.includes('button') || type === 'button') {
      const isDisabled = code.includes('disabled');
      const hasVariants = code.includes('variant') || code.includes('primary') || code.includes('secondary');
      
      return (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-2">Mock Preview: {componentName}</p>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              hasVariants 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDisabled}
          >
            {hasProps ? 'Sample Button' : 'Click Me'}
          </button>
        </div>
      );
    }
    
    if (code.includes('card') || type === 'card') {
      const hasTitle = code.includes('title');
      return (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-2">Mock Preview: {componentName}</p>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 max-w-sm">
            {hasTitle && <h3 className="text-lg font-semibold mb-2">Sample Title</h3>}
            <p className="text-gray-600">This is a preview based on your component code structure.</p>
          </div>
        </div>
      );
    }
    
    if (code.includes('input') || code.includes('Input') || type === 'input') {
      const hasLabel = code.includes('label');
      const hasError = code.includes('error');
      const placeholder = code.match(/placeholder[:\s]*['"`]([^'"`]+)['"`]/)?.[1] || 'Enter text...';
      
      return (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-2">Mock Preview: {componentName}</p>
          <div className="w-full max-w-sm">
            {hasLabel && <label className="block text-sm font-medium text-gray-700 mb-1">Sample Label</label>}
            <input 
              type="text" 
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {hasError && <p className="mt-1 text-sm text-red-600">Sample error message</p>}
          </div>
        </div>
      );
    }
    
    if (code.includes('modal') || code.includes('Modal') || type === 'modal') {
      return (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-2">Mock Preview: {componentName}</p>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sample Modal</h3>
              <button className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <p className="text-gray-600">Modal content would appear here based on your component.</p>
          </div>
        </div>
      );
    }
    
  // All fallback UI removed for cleanup
  return null;
}
  };
