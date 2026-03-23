/**
 * Enhanced configuration constants for AI APIs and security/performance settings
 * Updated to include enhanced sandbox security and performance configurations
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

// Security Configuration
export const SECURITY_CONFIG = {
  // Timeouts and limits
  TIMEOUT_MS: 15000,
  PROGRESS_CAP: 85,
  DEBOUNCE_DELAY_MS: 300,

  // CDN Configuration
  ALLOWED_CDNS: [
    "https://unpkg.com",
    "https://cdn.tailwindcss.com",
    "https://cdnjs.cloudflare.com",
  ],

  // Pinned CDN versions for security
  CDN_VERSIONS: {
    REACT: "18.2.0",
    REACT_DOM: "18.2.0",
    TAILWIND: "3.4.0",
  },
};

// Validation Configuration
export const VALIDATION_CONFIG = {
  // Prompt validation
  FUZZY_MATCH_THRESHOLD: 80,
  MAX_TOKENS: 150,
  COMPLEXITY_SCORE_THRESHOLD: 7,
  MIN_PROMPT_LENGTH: 10,
  PROMPT_MAX_CHARS: 500, // Legacy support
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  // Loading progress milestones
  LOADING_MILESTONES: {
    CODE_PROCESSING: 20,
    CDN_CHECK: 40,
    IFRAME_LOAD: 60,
    COMPONENT_RENDER: 85,
    COMPLETE: 100,
  },

  // Performance thresholds
  MAX_PROCESSING_TIME_MS: 1000,
  MAX_VALIDATION_TIME_MS: 100,
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_CSP: true,
  ENABLE_FUZZY_MATCHING: true,
  ENABLE_DEBOUNCING: true,
  ENABLE_MEMOIZATION: true,
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === "development",
};

// Configuration for AI APIs
export const AI_CONFIG = {
  // Puter.js AI configuration (NEW - preferred method)
  PUTER: {
    name: "Puter.js",
    description: "No API keys required - uses Puter.com authentication",
    models: [
      // Specialized coding models (prioritized)
      {
        id: "deepseek-coder",
        name: "DeepSeek Coder",
        provider: "DeepSeek",
        capabilities: ["text"],
        description: "Specialized for code generation tasks",
      },
      {
        id: "deepseek-chat",
        name: "DeepSeek Chat",
        provider: "DeepSeek",
        capabilities: ["text"],
        description: "General purpose with strong coding abilities",
      },

      // High-quality OpenAI models
      {
        id: "gpt-4o-mini",
        name: "GPT-4 Omni Mini",
        provider: "OpenAI",
        capabilities: ["text"],
        description: "Fast and efficient for UI components",
      },
      {
        id: "gpt-4o",
        name: "GPT-4 Omni",
        provider: "OpenAI",
        capabilities: ["text", "vision"],
        description: "High-quality for complex components",
      },

      // Anthropic model
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        capabilities: ["text", "vision"],
        description: "Excellent for complex code generation",
      },

      // Meta model for large context
      {
        id: "llama-3.2-90b-instruct",
        name: "Llama 3.2 90B",
        provider: "Meta",
        capabilities: ["text"],
        description: "Large context for complex generation",
      },
    ],
    defaultModel: "deepseek-coder", // Updated to specialized coding model
    requiresApiKey: false,
    authMethod: "puter-account",
    apiVersion: "v2",
    supportedFeatures: ["text-generation", "vision", "image-generation"],
  },
  // xAI Grok API configuration (fallback)
  GROK: {
    endpoint: "https://api.x.ai/v1/chat/completions",
    model: "grok-beta",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    requiresApiKey: true,
    authMethod: "api-key",
  },
  // Ollama local AI configuration (NEW)
  OLLAMA: {
    endpoint: "http://localhost:11434/api/generate",
    chatEndpoint: "http://localhost:11434/api/chat",
    model: "codellama",
    headers: {
      "Content-Type": "application/json",
    },
    models: [
      { id: "phi3:mini", name: "Phi-3 Mini", provider: "Ollama" },
      { id: "codellama:7b", name: "CodeLlama 7B", provider: "Ollama" },
      // To add more models, first install them with: ollama pull <model-name>
      // Then add them here, e.g.: { id: "llama3.1:8b", name: "Llama 3.1 8B", provider: "Ollama" }
    ],
    defaultModel: "codellama:7b",
    requiresApiKey: false,
    authMethod: "none",
    isLocal: true,
  },
  // OpenAI GPT-4 API configuration (fallback)
  OPENAI: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    requiresApiKey: true,
    authMethod: "api-key",
  },
};

export const APP_CONFIG = {
  name: "INTERA an AI-Powered UI Component Generator",
  author: "M.H. Nishan Sathsara",
  timeline: "January 2025 - November 2025",
  description:
    "Transform your ideas into simple React components with Tailwind CSS using natural language",
  version: "1.1.0", // Updated version for Puter integration
  complexityLevel: "Basic UI Components Only",
  limitations:
    "Simple components only - No 3D, complex animations, or advanced features",
  poweredBy: "Puter.com", // NEW: Attribution as required
  puterLink: "https://developer.puter.com", // NEW: Required link
};

// Default settings (Updated for Puter.js integration)
export const DEFAULT_SETTINGS = {
  apiProvider: "puter", // Changed to puter as default
  puterModel: "gpt-4o", // NEW: Default Puter model
  enableStreaming: false, // NEW: Option for streaming responses
  maxTokens: 1500, // Reduced for simpler components
  temperature: 0.5, // Lower temperature for more consistent simple outputs
  timeout: 30000,
  maxPromptLength: 300, // Limit prompt complexity
  complexityLevel: "basic", // complexity level restriction
};
