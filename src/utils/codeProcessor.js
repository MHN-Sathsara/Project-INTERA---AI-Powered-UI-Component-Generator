/**
 * Code processor utilities for component code transformation and validation
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import { analyzeComponentCode, fixComponentCode } from "./componentAnalyzer.js";
import { validateReactSyntax } from "./syntaxValidator.js";
import {
  fixCommonSyntaxIssues,
  fixHtmlAttributeIssues,
  fixErrorObjectRendering,
  fixApiCalls,
  cleanupImports,
  addSandboxExport,
  fixMissingDependencies,
  fixUndefinedVariables,
  fixExternalImages,
  finalCleanup,
} from "./syntaxFixes.js";

/**
 * Configuration constants for security and processing
 */
export const SECURITY_CONFIG = {
  TIMEOUT_MS: 15000,
  PROGRESS_CAP: 85,
  PROMPT_MAX_CHARS: 500, // Increased from 300 for more detailed descriptions
  DEBOUNCE_DELAY_MS: 300,
};

/**
 * Process component code to fix common issues and ensure sandbox compatibility
 * Uses modular syntax fixes for better maintainability
 * @param {string} code - Raw component code
 * @returns {string} - Processed and fixed code
 */
export const processComponentCode = (code) => {
  if (!code || !code.trim()) {
    return "";
  }

  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Processing component code...");
      console.log("Original code length:", code.length);
    }

    // First, apply basic fixes from componentAnalyzer
    let processedCode = fixComponentCode(code);

    // Apply modular syntax fixes in logical order
    processedCode = fixCommonSyntaxIssues(processedCode);
    processedCode = fixHtmlAttributeIssues(processedCode);
    processedCode = fixErrorObjectRendering(processedCode);
    processedCode = fixApiCalls(processedCode);
    processedCode = cleanupImports(processedCode);

    // Apply Ollama-specific fixes for missing dependencies and undefined variables
    processedCode = fixMissingDependencies(processedCode);
    processedCode = fixUndefinedVariables(processedCode);
    processedCode = fixExternalImages(processedCode);

    processedCode = addSandboxExport(processedCode);
    processedCode = finalCleanup(processedCode);

    if (process.env.NODE_ENV === "development") {
      console.log(
        "✅ Code processing complete. Final code length:",
        processedCode.length
      );
    }

    return processedCode;
  } catch (error) {
    console.error("Error processing component code:", error);
    return code; // Return original code if processing fails
  }
};

/**
 * Enhanced validation for sandbox code security and compatibility
 * @param {string} code - Code to validate
 * @returns {Object} - Validation result
 */
export const validateSandboxCode = (code) => {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    hasWarnings: false,
  };

  if (!code || !code.trim()) {
    result.isValid = false;
    result.errors.push("Code is empty");
    return result;
  }

  // Check for potential HTML attribute issues
  const htmlAttributePatterns = [
    {
      pattern: /jsx=\{[^}]*\}/,
      message: "jsx attribute detected - this will cause React warnings",
    },
    {
      pattern:
        /\b(div|span|p|h[1-6]|button|input|textarea|select|label)[^>]*\s+[a-zA-Z]*[A-Z][a-zA-Z]*=\{[^}]*\}/,
      message: "camelCase props on HTML elements detected - may cause warnings",
    },
    {
      pattern: /(style|className|title|alt|placeholder|value)=\{(true|false)\}/,
      message: "Boolean values passed to string attributes detected",
    },
  ];

  htmlAttributePatterns.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      result.warnings.push(`HTML Attribute Warning: ${message}`);
      result.hasWarnings = true;
    }
  });

  // Enhanced unsafe code patterns - more comprehensive security checks
  const unsafePatterns = [
    // Direct eval and function constructors
    {
      pattern: /eval\s*\(/,
      severity: "critical",
      message: "Direct eval() usage detected",
    },
    {
      pattern: /Function\s*\(/,
      severity: "critical",
      message: "Function constructor detected",
    },

    // String-based eval equivalents (NEW)
    {
      pattern: /setTimeout\s*\(\s*["'`]/,
      severity: "critical",
      message: "String-based setTimeout detected",
    },
    {
      pattern: /setInterval\s*\(\s*["'`]/,
      severity: "critical",
      message: "String-based setInterval detected",
    },
    {
      pattern: /execScript\s*\(/,
      severity: "critical",
      message: "execScript usage detected",
    },

    // DOM manipulation that can lead to XSS
    {
      pattern: /document\.write/,
      severity: "high",
      message: "document.write usage detected",
    },
    {
      pattern: /innerHTML\s*=/,
      severity: "high",
      message: "innerHTML assignment detected",
    },
    {
      pattern: /outerHTML\s*=/,
      severity: "high",
      message: "outerHTML assignment detected",
    },
    {
      pattern: /insertAdjacentHTML/,
      severity: "high",
      message: "insertAdjacentHTML usage detected",
    },

    // Prototype pollution
    {
      pattern: /__proto__/,
      severity: "high",
      message: "__proto__ usage detected",
    },
    {
      pattern: /prototype\s*\[/,
      severity: "medium",
      message: "Dynamic prototype access detected",
    },

    // Window/global access that could be dangerous
    {
      pattern: /window\s*\[\s*["'`]/,
      severity: "medium",
      message: "Dynamic window property access detected",
    },
    {
      pattern: /globalThis\s*\[/,
      severity: "medium",
      message: "Dynamic globalThis access detected",
    },

    // Data exfiltration attempts
    {
      pattern:
        /fetch\s*\(\s*["'`]https?:\/\/(?!unpkg\.com|cdn\.tailwindcss\.com)/,
      severity: "high",
      message: "External fetch to non-whitelisted domain detected",
    },
    {
      pattern: /XMLHttpRequest/,
      severity: "medium",
      message: "XMLHttpRequest usage detected",
    },
    {
      pattern: /postMessage\s*\(/,
      severity: "medium",
      message: "postMessage usage detected - verify target origin",
    },

    // Local storage / persistence
    {
      pattern: /localStorage/,
      severity: "low",
      message: "localStorage access detected",
    },
    {
      pattern: /sessionStorage/,
      severity: "low",
      message: "sessionStorage access detected",
    },
    {
      pattern: /indexedDB/,
      severity: "medium",
      message: "IndexedDB access detected",
    },

    // WebRTC and media access
    {
      pattern: /getUserMedia/,
      severity: "medium",
      message: "getUserMedia access detected",
    },
    {
      pattern: /RTCPeerConnection/,
      severity: "medium",
      message: "WebRTC usage detected",
    },

    // Worker threads
    {
      pattern: /new\s+Worker\s*\(/,
      severity: "high",
      message: "Web Worker creation detected",
    },
    {
      pattern: /new\s+SharedWorker\s*\(/,
      severity: "high",
      message: "Shared Worker creation detected",
    },

    // WebAssembly
    {
      pattern: /WebAssembly/,
      severity: "high",
      message: "WebAssembly usage detected",
    },

    // Dangerous CSS patterns
    {
      pattern: /javascript\s*:/,
      severity: "critical",
      message: "JavaScript URL detected in CSS",
    },
    {
      pattern: /expression\s*\(/,
      severity: "high",
      message: "CSS expression detected",
    },
  ];

  // Check each pattern and categorize by severity
  for (const { pattern, severity, message } of unsafePatterns) {
    if (pattern.test(code)) {
      if (severity === "critical") {
        result.isValid = false;
        result.errors.push(message);
      } else {
        result.warnings.push(`${severity.toUpperCase()}: ${message}`);
        result.hasWarnings = true;
      }
    }
  }

  // Validate React syntax using existing validator
  try {
    const syntaxValidation = validateReactSyntax(code);
    if (!syntaxValidation.isValid) {
      result.errors.push(...syntaxValidation.errors);
      result.isValid = false;
    }
    if (syntaxValidation.warnings && syntaxValidation.warnings.length > 0) {
      result.warnings.push(...syntaxValidation.warnings);
      result.hasWarnings = true;
    }
  } catch (error) {
    result.warnings.push("Could not validate syntax: " + error.message);
    result.hasWarnings = true;
  }

  return result;
};

/**
 * Transform code for different environments (preview vs production)
 * @param {string} code - Component code
 * @param {string} environment - Target environment ('preview', 'production', 'sandbox')
 * @returns {string} - Transformed code
 */
export const transformCodeForEnvironment = (code, environment = "preview") => {
  if (!code) return "";

  let transformedCode = code;

  switch (environment) {
    case "sandbox":
      // Add error boundaries and safe execution context
      transformedCode = wrapWithErrorBoundary(transformedCode);
      break;
    case "production":
      // Remove development-only code and add optimizations
      transformedCode = removeDevOnlyCode(transformedCode);
      break;
    case "preview":
    default:
      // Keep as-is for preview
      break;
  }

  return transformedCode;
};

/**
 * Wrap component code with error boundary for safe execution
 * @param {string} code - Component code
 * @returns {string} - Code wrapped with error boundary
 */
const wrapWithErrorBoundary = (code) => {
  return `
try {
${code}
} catch (error) {
  console.error('Component execution error:', error);
  return React.createElement('div', {
    style: { 
      padding: '20px', 
      border: '2px solid #ff6b6b', 
      borderRadius: '8px',
      backgroundColor: '#fff5f5',
      color: '#c53030'
    }
  }, 'Error rendering component: ' + error.message);
}
`;
};

/**
 * Remove development-only code patterns
 * @param {string} code - Component code
 * @returns {string} - Production-ready code
 */
const removeDevOnlyCode = (code) => {
  return code
    .replace(/console\.(log|debug|info)\([^)]*\);?\n?/g, "")
    .replace(/\/\*\s*TODO:.*?\*\//g, "")
    .replace(/\/\/\s*TODO:.*?\n/g, "")
    .replace(/\/\*\s*DEBUG:.*?\*\//g, "")
    .replace(/\/\/\s*DEBUG:.*?\n/g, "");
};
