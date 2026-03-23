/**
 * Puter.js AI Service for component generation
 * Provides AI capabilities without API keys using Puter.com
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import {
  extractComponentName,
  detectComponentType,
} from "../utils/componentHelpers.jsx";
import {
  validatePromptComplexity,
  sanitizePrompt,
  getComplexityLimits,
} from "../utils/promptValidation.js";
import { generateSystemPrompt } from "../utils/sharedPrompts.js";

/**
 * Clean up generated component code
 * @param {string} code - Raw component code from AI
 * @returns {string} - Cleaned component code
 */
const cleanComponentCode = (code) => {
  if (!code) return "";

  let cleanedCode = code.trim();

  // Remove markdown code blocks if present
  cleanedCode = cleanedCode.replace(/^```[\w]*\n/, "").replace(/\n```$/, "");

  // Remove explanatory text before/after code
  const codeStart = cleanedCode.search(
    /(?:const|function|class)\s+\w+|^\/\*|\/\*\*/
  );
  if (codeStart > 0) {
    cleanedCode = cleanedCode.substring(codeStart);
  }

  // Remove trailing explanatory text
  const lastBraceIndex = cleanedCode.lastIndexOf("}");
  if (lastBraceIndex > 0) {
    // Find if there's significant content after the last brace
    const afterBrace = cleanedCode.substring(lastBraceIndex + 1).trim();
    if (
      afterBrace &&
      !afterBrace.startsWith("export") &&
      afterBrace.length > 50
    ) {
      cleanedCode = cleanedCode.substring(0, lastBraceIndex + 1);
    }
  }

  return cleanedCode.trim();
};

/**
 * Check if Puter.js is available
 * @returns {boolean} - Whether Puter.js is loaded and available
 */
export const isPuterAvailable = () => {
  return typeof window !== "undefined" && window.puter && window.puter.ai;
};

/**
 * Get model capabilities
 * @param {string} modelId - Model identifier
 * @returns {Array} - Array of capabilities
 */
export const getModelCapabilities = (modelId) => {
  // Optimized model list for code generation tasks
  const models = [
    { id: "deepseek-coder", capabilities: ["text"] }, // Best for coding
    { id: "gpt-4o-mini", capabilities: ["text"] }, // Fast and efficient
    { id: "claude-3-5-sonnet-20241022", capabilities: ["text", "vision"] }, // High quality
    { id: "gpt-4o", capabilities: ["text", "vision"] }, // Complex components
    { id: "deepseek-chat", capabilities: ["text"] }, // General purpose with code support
    { id: "llama-3.2-90b-instruct", capabilities: ["text"] }, // Large context for complex generation
  ];

  const model = models.find((m) => m.id === modelId);
  return model ? model.capabilities : ["text"];
};

/**
 * Check if model supports vision/image analysis
 * @param {string} modelId - Model identifier
 * @returns {boolean} - Whether the model supports vision
 */
export const supportsVision = (modelId) => {
  return getModelCapabilities(modelId).includes("vision");
};

/**
 * Analyze image with AI model (for future features)
 * @param {string} prompt - Description prompt
 * @param {string} imageUrl - URL of the image to analyze
 * @param {string} model - AI model to use
 * @returns {Promise<Object>} - Analysis result
 */
export const analyzeImageWithPuter = async (
  prompt,
  imageUrl,
  model = "gpt-4o"
) => {
  try {
    if (!isPuterAvailable()) {
      throw new Error("Puter.js is not available");
    }

    if (!supportsVision(model)) {
      throw new Error(`Model ${model} does not support vision capabilities`);
    }

    if (!puter.auth || !puter.auth.isSignedIn()) {
      throw new Error("User not authenticated with Puter.js");
    }

    console.log("🔍 Analyzing image with Puter.js...", { prompt, model });

    const response = await puter.ai.chat(prompt, imageUrl, { model });

    return {
      success: true,
      analysis:
        typeof response === "string"
          ? response
          : response.content || response.text,
      metadata: {
        provider: "puter",
        model: model,
        prompt: prompt,
        imageUrl: imageUrl,
        timestamp: new Date().toISOString(),
        api_version: "v2",
      },
    };
  } catch (error) {
    console.error("❌ Puter.js image analysis error:", error);
    throw new Error(`Image analysis failed: ${error.message}`);
  }
};

/**
 * Generate image with AI (for future features)
 * @param {string} prompt - Image generation prompt
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Generated image result
 */
export const generateImageWithPuter = async (prompt, options = {}) => {
  try {
    if (!isPuterAvailable()) {
      throw new Error("Puter.js is not available");
    }

    if (!puter.auth || !puter.auth.isSignedIn()) {
      throw new Error("User not authenticated with Puter.js");
    }

    console.log("🎨 Generating image with Puter.js...", { prompt, options });

    // Use test mode for development to avoid consuming credits
    const testMode = options.testMode !== undefined ? options.testMode : true;

    const imageElement = await puter.ai.txt2img(prompt, testMode);

    return {
      success: true,
      image: imageElement,
      metadata: {
        provider: "puter",
        prompt: prompt,
        testMode: testMode,
        timestamp: new Date().toISOString(),
        api_version: "v2",
      },
    };
  } catch (error) {
    console.error("❌ Puter.js image generation error:", error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

/**
 * Get available AI models from Puter
 * @returns {Promise<Array>} - List of available models
 */
export const getAvailableModels = async () => {
  if (!isPuterAvailable()) {
    throw new Error(
      "Puter.js is not available. Please check your internet connection."
    );
  }

  try {
    // Optimized models for code generation tasks
    return [
      // Specialized coding models
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
    ];
  } catch (error) {
    console.error("Error getting available models:", error);
    return [];
  }
};

/**
 * Generate UI component using Puter.js AI
 * @param {string} userPrompt - User's natural language description
 * @param {string} model - AI model to use (default: 'gpt-4o-mini')
 * @param {AbortSignal} abortSignal - Optional abort signal for cancellation
 * @param {Object} options - Additional options (streaming, vision, etc.)
 * @returns {Promise<Object>} - Generated component data
 */
export const generateComponentWithPuter = async (
  prompt,
  model = "deepseek-coder", // Updated default to specialized coding model
  abortSignal = null,
  options = {}
) => {
  try {
    console.log("🚀 Generating component with Puter.js...", {
      prompt,
      model,
      options,
    });

    // Check if operation was cancelled before starting
    if (abortSignal && abortSignal.aborted) {
      throw new Error("Generation cancelled by user");
    }

    // Check if user is authenticated
    if (!puter.auth || !puter.auth.isSignedIn()) {
      console.log("❌ User not signed in to Puter.js");
      throw new Error(
        "User not authenticated with Puter.js. Please login first."
      );
    }

    // Enhanced system prompt for larger, more complex components
    const enhancedSystemPrompt = generateSystemPrompt(prompt, "puter");

    // Check if cancelled before API call
    if (abortSignal && abortSignal.aborted) {
      throw new Error("Generation cancelled by user");
    }

    // Prepare API call options
    const apiOptions = {
      model: model,
      ...(options.stream && { stream: false }), // Disable streaming for component generation to ensure complete response
      ...(options.maxTokens && { max_tokens: options.maxTokens }),
      ...(options.temperature && { temperature: options.temperature }),
    };

    // Use updated Puter.js v2 API with improved error handling
    const response = await puter.ai.chat(
      [
        {
          role: "system",
          content: enhancedSystemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      apiOptions
    );

    // Check if cancelled after API call
    if (abortSignal && abortSignal.aborted) {
      throw new Error("Generation cancelled by user");
    }

    // Handle Puter.js response format (updated for v2)
    let componentCode;

    if (typeof response === "string") {
      componentCode = response.trim();
    } else if (response && response.message && response.message.content) {
      // Handle OpenAI-style response format
      componentCode = response.message.content.trim();
    } else if (response && response.content) {
      // Handle direct content property
      componentCode = response.content.trim();
    } else if (response && response.choices && response.choices[0]) {
      // Handle choices array format
      componentCode =
        response.choices[0].message?.content?.trim() ||
        response.choices[0].text?.trim();
    } else if (response && response.text) {
      // Handle direct text property
      componentCode = response.text.trim();
    } else if (response && response.data && response.data.content) {
      // Handle nested data structure
      componentCode = response.data.content.trim();
    } else {
      console.error("❌ Unexpected Puter.js response format:", response);
      throw new Error("Invalid response format from Puter.js");
    }

    if (!componentCode) {
      throw new Error("Empty response from Puter.js");
    }

    // Clean up the component code
    componentCode = cleanComponentCode(componentCode);

    console.log("✅ Puter.js component generated successfully");

    return {
      success: true,
      component: componentCode,
      metadata: {
        provider: "puter",
        model: model,
        prompt: prompt,
        timestamp: new Date().toISOString(),
        tokens_used: componentCode.length, // Approximate
        api_version: "v2",
        capabilities: getModelCapabilities(model),
      },
    };
  } catch (error) {
    console.error("❌ Puter.js generation error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
      response: error.response,
      status: error.status,
    });

    // Provide more specific error messages based on error type
    let errorMessage = error.message || "Unknown error occurred";

    if (error.name === "NetworkError" || error.message?.includes("fetch")) {
      errorMessage = "Network error: Please check your internet connection";
    } else if (
      error.message?.includes("authentication") ||
      error.message?.includes("unauthorized") ||
      error.message?.includes("sign")
    ) {
      errorMessage = "Authentication failed: Please sign in to Puter.js";
    } else if (
      error.message?.includes("quota") ||
      error.message?.includes("limit") ||
      error.message?.includes("credits")
    ) {
      errorMessage =
        "API quota exceeded: Please try again later or check your Puter account";
    } else if (error.response?.status === 429) {
      errorMessage =
        "Rate limit exceeded: Please wait before making another request";
    } else if (error.response?.status === 401) {
      errorMessage = "Authentication required: Please sign in to Puter.js";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server error: Puter.js service temporarily unavailable";
    } else if (
      error.message?.includes("model") ||
      error.message?.includes("unsupported")
    ) {
      errorMessage = `Model '${model}' is not available. Please try a different model.`;
    }

    throw new Error(`Puter.js Error: ${errorMessage}`);
  }
};

/**
 * Test Puter connection and authentication
 * @returns {Promise<Object>} - Connection status and user info
 */
export const testPuterConnection = async () => {
  if (!isPuterAvailable()) {
    return {
      success: false,
      error: "Puter.js is not loaded",
      authenticated: false,
      version: null,
    };
  }

  try {
    // Check authentication status first
    const authStatus = checkPuterAuth();
    if (!authStatus.authenticated) {
      return {
        success: false,
        authenticated: false,
        error: authStatus.reason,
        message: "Please authenticate with Puter to use AI features",
      };
    }

    // Try a simple AI call to test connection with the latest model
    const testResponse = await window.puter.ai.chat(
      "Hello! Please respond with just 'OK' to test the connection.",
      {
        model: "deepseek-coder", // Use coding-optimized model for testing
        max_tokens: 5,
      }
    );

    // Get user info if available
    let userInfo = null;
    try {
      if (puter.auth && puter.auth.getUser) {
        userInfo = await puter.auth.getUser();
      }
    } catch (userError) {
      console.warn("Could not get user info:", userError);
    }

    return {
      success: true,
      authenticated: true,
      message: "Puter.js is ready for AI generation",
      response: testResponse,
      userInfo: userInfo,
      availableModels: await getAvailableModels(),
      api_version: "v2",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Puter connection test failed:", error);

    // Provide specific error messages
    let errorMessage = error.message;
    if (
      error.message?.includes("credits") ||
      error.message?.includes("quota")
    ) {
      errorMessage =
        "No AI credits available. Please check your Puter account.";
    } else if (
      error.message?.includes("rate") ||
      error.message?.includes("limit")
    ) {
      errorMessage = "Rate limit reached. Please wait before testing again.";
    } else if (error.message?.includes("model")) {
      errorMessage = "Test model not available. Puter service may be down.";
    }

    return {
      success: false,
      authenticated: true, // Auth might be OK but AI service failed
      error: errorMessage,
      message: "Puter.js connection test failed",
      timestamp: new Date().toISOString(),
    };
  }
};

// Enhanced authentication status check
export const checkPuterAuth = () => {
  if (typeof puter === "undefined") {
    return {
      authenticated: false,
      reason: "Puter.js not loaded",
      canRetry: true,
      action: "reload",
    };
  }

  if (!puter.auth) {
    return {
      authenticated: false,
      reason: "Puter.js auth not available",
      canRetry: true,
      action: "reload",
    };
  }

  if (!puter.auth.isSignedIn()) {
    return {
      authenticated: false,
      reason: "User not signed in",
      canRetry: true,
      action: "login",
    };
  }

  return {
    authenticated: true,
    reason: "User signed in",
    canRetry: false,
    action: null,
  };
};

// Enhanced login function with better error handling
export const triggerPuterLogin = async () => {
  try {
    if (typeof puter === "undefined") {
      throw new Error("Puter.js not loaded");
    }

    if (!puter.auth) {
      throw new Error("Puter.js auth service not available");
    }

    console.log("🔐 Triggering Puter.js login...");

    // Check if already signed in
    if (puter.auth.isSignedIn()) {
      console.log("✅ User already signed in to Puter.js");
      return {
        success: true,
        message: "Already authenticated",
        alreadySignedIn: true,
      };
    }

    // Trigger the login flow
    await puter.auth.signIn();

    // Verify the login was successful
    if (puter.auth.isSignedIn()) {
      console.log("✅ Puter.js login successful");
      return {
        success: true,
        message: "Login successful",
        alreadySignedIn: false,
      };
    } else {
      throw new Error("Login completed but authentication status unclear");
    }
  } catch (error) {
    console.error("❌ Puter login failed:", error);
    return {
      success: false,
      error: error.message,
      message: "Login failed",
    };
  }
};

// Get current user information
export const getPuterUserInfo = async () => {
  try {
    if (!isPuterAvailable()) {
      throw new Error("Puter.js not available");
    }

    const authStatus = checkPuterAuth();
    if (!authStatus.authenticated) {
      throw new Error(authStatus.reason);
    }

    let userInfo = null;
    if (puter.auth && puter.auth.getUser) {
      userInfo = await puter.auth.getUser();
    }

    return {
      success: true,
      userInfo: userInfo,
      authenticated: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to get user info:", error);
    return {
      success: false,
      error: error.message,
      authenticated: false,
    };
  }
};

// Enhanced logout function for Puter.js
export const triggerPuterLogout = async () => {
  try {
    if (typeof puter === "undefined") {
      throw new Error("Puter.js not loaded");
    }

    if (!puter.auth) {
      throw new Error("Puter.js auth service not available");
    }

    console.log("🔓 Triggering Puter.js logout...");

    // Check if user is signed in
    if (!puter.auth.isSignedIn()) {
      console.log("ℹ️ User already signed out from Puter.js");
      return {
        success: true,
        message: "Already signed out",
        alreadySignedOut: true,
      };
    }

    // Trigger the logout flow
    await puter.auth.signOut();

    // Verify the logout was successful
    if (!puter.auth.isSignedIn()) {
      console.log("✅ Puter.js logout successful");
      return {
        success: true,
        message: "Logout successful",
        alreadySignedOut: false,
      };
    } else {
      throw new Error("Logout completed but authentication status unclear");
    }
  } catch (error) {
    console.error("❌ Puter logout failed:", error);
    return {
      success: false,
      error: error.message,
      message: "Logout failed",
    };
  }
};
