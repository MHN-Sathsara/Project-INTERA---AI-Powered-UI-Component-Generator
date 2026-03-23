/**
 * Enhanced prompt validation utilities with fuzzy matching and improved heuristics
 * Ensures the project focuses on simple UI components only
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import { partial_ratio } from "fuzzball";

// Enhanced configuration (moved here to avoid circular imports)
export const VALIDATION_CONFIG = {
  FUZZY_MATCH_THRESHOLD: 80, // Minimum similarity score for fuzzy matching
  MAX_TOKENS: 150, // Dynamic token-based limit instead of character count
  COMPLEXITY_SCORE_THRESHOLD: 7, // Max complexity score allowed
  MIN_PROMPT_LENGTH: 10, // Minimum meaningful prompt length
};

// Enhanced allowed component types for larger, more complex components
export const ALLOWED_COMPONENT_TYPES = [
  // Basic components
  "button",
  "input",
  "text",
  "label",
  "link",
  "badge",
  "tag",
  "icon",

  // Layout components
  "card",
  "container",
  "grid",
  "flex",
  "layout",
  "section",
  "div",
  "header",
  "footer",
  "sidebar",
  "main",
  "article",

  // Navigation components
  "nav",
  "navbar",
  "menu",
  "breadcrumb",
  "pagination",
  "tabs",
  "stepper",

  // Form components
  "form",
  "login",
  "signup",
  "registration",
  "contact",
  "feedback",
  "search",
  "filter",
  "select",
  "checkbox",
  "radio",
  "textarea",
  "datepicker",
  "slider",
  "toggle",
  "switch",

  // Data display
  "table",
  "list",
  "grid",
  "timeline",
  "calendar",
  "accordion",
  "collapse",
  "dropdown",
  "tooltip",
  "popover",

  // Feedback components
  "alert",
  "notification",
  "toast",
  "snackbar",
  "progress",
  "spinner",
  "loading",
  "skeleton",
  "empty",
  "error",

  // Interactive components
  "modal",
  "dialog",
  "drawer",
  "overlay",
  "popup",
  "lightbox",

  // Complex layouts
  "dashboard",
  "admin",
  "profile",
  "settings",
  "wizard",
  "checkout",
  "pricing",
  "testimonial",
  "hero",
  "landing",
  "gallery",

  // E-commerce
  "product",
  "cart",
  "wishlist",
  "review",
  "rating",
  "comparison",

  // User interface
  "avatar",
  "user",
  "account",
  "authentication",
  "authorization",
  "chat",
  "messaging",
  "comment",
  "post",
  "feed",
  "timeline",
];

// Restricted keywords that indicate complex/3D/high-requirement components
export const RESTRICTED_KEYWORDS = [
  // 3D and complex graphics
  "3d",
  "three.js",
  "webgl",
  "canvas",
  "svg animation",
  "threejs",
  "babylon",
  "aframe",
  "cesium",

  // Complex interactions
  "drag and drop",
  "draggable",
  "sortable",
  "resizable",
  "drag",
  "drop",
  "dnd",
  "resize handles",

  // Advanced animations
  "complex animation",
  "keyframe",
  "spring animation",
  "physics animation",
  "gsap",
  "framer motion complex",
  "lottie",
  "rive",

  // Media handling
  "video player",
  "audio player",
  "media player",
  "video streaming",
  "audio streaming",
  "webcam",
  "camera",
  "microphone",
  "screen recording",

  // File operations
  "file upload",
  "file drop",
  "file picker",
  "image upload",
  "drag drop files",
  "dropzone",

  // Advanced charts and visualizations
  "chart",
  "graph",
  "visualization",
  "plot",
  "d3.js",
  "chartjs",
  "recharts complex",
  "data visualization",
  "dashboard complex",

  // Database and backend integration
  "database",
  "api integration",
  "websocket",
  "real-time",
  "socket.io",
  "backend",
  "server",
  "authentication complex",

  // Advanced frameworks and libraries
  "redux",
  "mobx",
  "zustand complex",
  "react router complex",
  "next.js ssr",
  "gatsby",
  "remix",

  // Performance intensive
  "virtual scroll",
  "infinite scroll complex",
  "lazy loading complex",
  "code splitting",
  "web workers",
  "service worker",

  // External services
  "maps",
  "google maps",
  "mapbox",
  "payment",
  "stripe",
  "paypal",
  "social login",
  "oauth",

  // Advanced UI patterns
  "accordion complex",
  "carousel complex",
  "slider complex",
  "calendar complex",
  "date picker complex",
  "time picker",
  "rich text editor",
  "wysiwyg",
  "code editor",
  "syntax highlighting complex",
];

// Simple component examples to guide users
export const SIMPLE_COMPONENT_EXAMPLES = [
  "Create a blue button with hover effects",
  "Make a simple card with title and description",
  "Build a basic input field with label",
  "Create a navigation bar with links",
  "Design a footer with text and links",
  "Make a simple alert message",
  "Create a basic list of items",
  "Build a simple form with inputs",
  "Design a header with logo and title",
  "Create a badge with text",
];

/**
 * Enhanced token counting for more accurate length limits
 * @param {string} text - Text to count tokens for
 * @returns {number} - Approximate token count
 */
const countTokens = (text) => {
  // Simple approximation: split by spaces and punctuation
  return text.split(/[\s\W]+/).filter((token) => token.length > 0).length;
};

/**
 * Fuzzy match restricted keywords for better detection
 * @param {string} prompt - User prompt
 * @returns {Array} - Array of matched restricted terms
 */
const fuzzyMatchRestrictedKeywords = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  const matchedKeywords = [];

  for (const keyword of RESTRICTED_KEYWORDS) {
    // Direct substring match (existing behavior)
    if (lowerPrompt.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
      continue;
    }

    // Fuzzy matching for variations
    const ratio = partial_ratio(lowerPrompt, keyword.toLowerCase());
    if (ratio >= VALIDATION_CONFIG.FUZZY_MATCH_THRESHOLD) {
      matchedKeywords.push(`${keyword} (similar)`);
    }
  }

  return matchedKeywords;
};

/**
 * Calculate complexity score based on multiple factors
 * @param {string} prompt - User prompt
 * @returns {number} - Complexity score (0-10)
 */
const calculateComplexityScore = (prompt) => {
  let score = 0;
  const lowerPrompt = prompt.toLowerCase();

  // Length factor (tokens)
  const tokenCount = countTokens(prompt);
  if (tokenCount > 50) score += 2;
  else if (tokenCount > 30) score += 1;

  // Technical complexity indicators
  const complexityIndicators = [
    "api",
    "database",
    "fetch",
    "backend",
    "server",
    "state management",
    "redux",
    "context",
    "animation",
    "transition",
    "gsap",
    "framer",
    "real-time",
    "websocket",
    "socket.io",
    "authentication",
    "auth",
    "login system",
    "routing",
    "navigation",
    "spa",
    "responsive",
    "mobile",
    "desktop",
    "drag",
    "drop",
    "sortable",
    "resizable",
  ];

  const foundComplexity = complexityIndicators.filter((indicator) =>
    lowerPrompt.includes(indicator)
  );
  score += foundComplexity.length;

  // Multiple component requests
  const componentSeparators = /\band\b|\&|,|with|plus|also|including/gi;
  const separatorCount = (lowerPrompt.match(componentSeparators) || []).length;
  if (separatorCount > 3) score += 2;
  else if (separatorCount > 1) score += 1;

  // Complex sentences (multiple clauses)
  const clauseCount = prompt
    .split(/[.!?;]/)
    .filter((clause) => clause.trim().length > 0).length;
  if (clauseCount > 3) score += 1;

  return Math.min(score, 10); // Cap at 10
};

/**
 * Enhanced multiple component detection using NLP-like heuristics
 * @param {string} prompt - User prompt
 * @returns {boolean} - True if multiple components detected
 */
const detectMultipleComponents = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();

  // Count explicit component mentions
  const componentTypes = [
    "button",
    "card",
    "form",
    "input",
    "header",
    "footer",
    "nav",
    "sidebar",
    "modal",
    "dialog",
    "table",
    "list",
    "grid",
    "menu",
    "dropdown",
    "alert",
  ];

  const mentionedComponents = componentTypes.filter((type) =>
    lowerPrompt.includes(type)
  ).length;

  // If more than 1 component type mentioned, likely multiple components
  if (mentionedComponents > 1) return true;

  // Check for sentence structure indicating multiple requests
  const multipleIndicators = [
    /create .+ and .+ and/i,
    /build .+ with .+ and .+ including/i,
    /make .+ plus .+ also/i,
    /add .+ then .+ finally/i,
  ];

  return multipleIndicators.some((pattern) => pattern.test(prompt));
};

/**
 * Enhanced validation with fuzzy matching and improved heuristics
 * @param {string} prompt - User's component description
 * @returns {object} - Validation result with success boolean and messages
 */
export const validatePromptComplexity = (prompt) => {
  if (!prompt || prompt.trim() === "") {
    return {
      success: false,
      error: "Please provide a component description.",
      suggestions: SIMPLE_COMPONENT_EXAMPLES.slice(0, 3),
    };
  }

  // Check minimum length
  if (prompt.trim().length < VALIDATION_CONFIG.MIN_PROMPT_LENGTH) {
    return {
      success: false,
      error:
        "Please provide a more detailed description of the component you want to create.",
      suggestions: SIMPLE_COMPONENT_EXAMPLES.slice(0, 2),
    };
  }

  // Enhanced fuzzy matching for restricted keywords
  const foundRestricted = fuzzyMatchRestrictedKeywords(prompt);

  if (foundRestricted.length > 0) {
    return {
      success: false,
      error: `This project is limited to simple UI components. The following features are not supported: ${foundRestricted
        .slice(0, 3)
        .join(", ")}`,
      suggestions: [
        "Try creating basic buttons, cards, or forms instead",
        "Focus on simple layouts and text components",
        "Use basic styling and hover effects only",
      ],
      restrictedKeywords: foundRestricted,
    };
  }

  // Token-based length validation
  const tokenCount = countTokens(prompt);
  if (tokenCount > VALIDATION_CONFIG.MAX_TOKENS) {
    return {
      success: false,
      error: `Component description is too detailed (${tokenCount} tokens). Please keep it simple and under ${VALIDATION_CONFIG.MAX_TOKENS} tokens.`,
      suggestions: [
        "Break down your request into smaller, simpler components",
        "Focus on one basic UI element at a time",
        "Use simple, clear descriptions",
      ],
    };
  }

  // Complexity score validation
  const complexityScore = calculateComplexityScore(prompt);
  if (complexityScore > VALIDATION_CONFIG.COMPLEXITY_SCORE_THRESHOLD) {
    return {
      success: false,
      error: `Request is too complex (score: ${complexityScore}/${VALIDATION_CONFIG.COMPLEXITY_SCORE_THRESHOLD}). Please simplify your component request.`,
      suggestions: [
        "Remove advanced features and focus on basic functionality",
        "Request simpler styling and interactions",
        "Avoid multiple components in one request",
      ],
    };
  }

  // Enhanced multiple component detection
  if (detectMultipleComponents(prompt)) {
    return {
      success: false,
      error: "Please request one simple component at a time.",
      suggestions: [
        "Create one component first, then generate others separately",
        "Focus on a single UI element per request",
        "Simplify your component description",
      ],
    };
  }

  // All validation passed
  return {
    success: true,
    message: "Prompt validated successfully",
    metadata: {
      tokenCount,
      complexityScore,
      detectedComponents: detectMultipleComponents(prompt)
        ? "multiple"
        : "single",
    },
  };
};

/**
 * Detects simple component type from prompt
 * @param {string} lowerPrompt - Lowercase prompt
 * @returns {string} - Detected component type
 */
const detectSimpleComponentType = (lowerPrompt) => {
  for (const type of ALLOWED_COMPONENT_TYPES) {
    if (lowerPrompt.includes(type)) {
      return type;
    }
  }
  return "basic-component";
};

/**
 * Gets complexity limits configuration
 * @returns {object} - Configuration object with limits
 */
// Full page keywords for sandbox detection
export const FULL_PAGE_KEYWORDS = [
  "dashboard",
  "landing page",
  "homepage",
  "full page",
  "entire page",
  "complete page",
  "layout",
  "admin panel",
  "user profile page",
  "settings page",
  "login page",
  "signup page",
  "checkout page",
  "pricing page",
  "portfolio page",
  "contact page",
  "about page",
  "hero section",
  "full screen",
  "full width",
  "viewport",
  "min-h-screen",
];

/**
 * Detects if the prompt is asking for a full page component
 * @param {string} prompt - The user prompt
 * @returns {boolean} - True if it should be rendered as full page
 */
export const detectFullPageComponent = (prompt) => {
  if (!prompt) return false;
  const lowerPrompt = prompt.toLowerCase();
  return FULL_PAGE_KEYWORDS.some((keyword) => lowerPrompt.includes(keyword));
};

export const getComplexityLimits = () => {
  return {
    maxPromptLength: 500, // Increased for more detailed component descriptions
    maxTokens: 3000, // Increased significantly for larger components like forms and dashboards
    temperature: 0.7, // Slightly higher for more creative and feature-rich components
    allowedTypes: ALLOWED_COMPONENT_TYPES,
    restrictedKeywords: RESTRICTED_KEYWORDS,
    examples: SIMPLE_COMPONENT_EXAMPLES,
  };
};

/**
 * Sanitizes prompt to ensure it stays within limits
 * @param {string} prompt - Original prompt
 * @returns {string} - Sanitized prompt
 */
export const sanitizePrompt = (prompt) => {
  if (!prompt) return "";

  // Increased length limit for more detailed component descriptions
  if (prompt.length > 500) {
    prompt = prompt.substring(0, 497) + "...";
  }

  // Remove any restricted keywords and replace with simpler alternatives
  let sanitized = prompt.toLowerCase();

  // Enhanced replacements for common restricted terms
  const replacements = {
    "3d": "styled",
    "complex animation": "hover effect",
    "drag and drop": "clickable",
    advanced: "simple",
    sophisticated: "clean",
    dynamic: "interactive",
  };

  Object.entries(replacements).forEach(([restricted, simple]) => {
    sanitized = sanitized.replace(new RegExp(restricted, "g"), simple);
  });

  return sanitized;
};
