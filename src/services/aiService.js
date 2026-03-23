/**
 * AI Service for component generation
 * Handles API calls to Puter.js (primary), xAI Grok and OpenAI GPT-4 (fallbacks)
 * Updated to support Puter.js as the primary AI provider
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import axios from "axios";
import { AI_CONFIG, DEFAULT_SETTINGS } from "../utils/config.js";
import {
  extractComponentName,
  detectComponentType,
} from "../utils/componentHelpers.jsx";
import {
  validatePromptComplexity,
  sanitizePrompt,
  getComplexityLimits,
} from "../utils/promptValidation.js";
import {
  generateSystemPrompt,
  getEnhancedPromptAnalysis,
} from "../utils/sharedPrompts.js";
import {
  isPuterAvailable,
  generateComponentWithPuter,
  checkPuterAuth,
  testPuterConnection,
  getAvailableModels,
  triggerPuterLogin,
  getPuterUserInfo,
  getModelCapabilities,
  supportsVision,
} from "./puterAiService.js";
import {
  isOllamaAvailable,
  generateComponentWithOllama,
  checkOllamaAuth,
  testOllamaConnection,
  getOllamaModels,
} from "./ollamaService.js";

/**
 * Makes AI API call using the best available service
 * Priority: Puter.js > xAI Grok > OpenAI GPT-4
 * @param {string} userPrompt - User's natural language description
 * @param {string} apiProvider - 'puter', 'grok', or 'openai'
 * @param {string} model - Specific model to use (for Puter.js)
 * @returns {Promise<Object>} - API response with generated component
 */
export const callAIAPI = async (
  prompt,
  settings = {},
  selectedModel = "gpt-4o-mini"
) => {
  // Validate prompt complexity first
  const validation = validatePromptComplexity(prompt);
  if (!validation.success) {
    throw new Error(validation.error);
  }

  console.log("🔄 Starting AI API call...", {
    provider: settings.apiProvider,
    model: selectedModel,
    prompt: prompt.substring(0, 100) + "...",
    settings, // Add this to see what settings are being passed
  });

  try {
    let result;

    // Try Ollama first if available and selected
    if (settings.apiProvider === "ollama") {
      try {
        if (await isOllamaAvailable()) {
          console.log("🦙 Using Ollama with model:", selectedModel);
          result = await generateComponentWithOllama(
            prompt,
            selectedModel,
            settings.abortSignal
          );

          if (result && result.success) {
            console.log("✅ Ollama generation successful");
            return result;
          } else {
            console.warn(
              "⚠️ Ollama returned unexpected format, trying fallback..."
            );
            throw new Error("Invalid Ollama response format");
          }
        } else {
          throw new Error(
            "Ollama not available - server not running on localhost:11434"
          );
        }
      } catch (ollamaError) {
        console.warn("⚠️ Ollama failed:", ollamaError.message);
        throw ollamaError; // Don't fallback for Ollama, show the specific error
      }
    }

    // Try Puter.js if available and selected
    if (settings.apiProvider === "puter" || !settings.apiProvider) {
      try {
        if (await isPuterAvailable()) {
          const authStatus = checkPuterAuth();
          console.log("🔐 Puter auth status:", authStatus);

          if (authStatus.authenticated) {
            console.log("🚀 Using Puter.js with model:", selectedModel);
            result = await generateComponentWithPuter(
              prompt,
              selectedModel,
              settings.abortSignal
            );

            // Ensure we have the right format
            if (result && result.success && result.component) {
              console.log("✅ Puter.js generation successful");

              // Transform Puter.js response to match expected format
              return {
                success: true,
                data: {
                  component: {
                    code: result.component,
                    name:
                      extractComponentName(result.component) ||
                      "GeneratedComponent",
                    type: detectComponentType(result.component),
                    description: `Component generated with ${
                      result.metadata?.model || selectedModel
                    }`,
                    prompt: prompt,
                    generated_at: new Date().toISOString(),
                  },
                },
                metadata: result.metadata || {
                  provider: "puter",
                  model: selectedModel,
                  tokens_used: 0,
                  processing_time_ms: 0,
                },
              };
            } else {
              console.warn(
                "⚠️ Puter.js returned unexpected format, trying fallback..."
              );
              throw new Error("Invalid Puter.js response format");
            }
          } else {
            console.log(
              "⚠️ Puter.js available but user not authenticated:",
              authStatus.reason
            );
          }
        } else {
          throw new Error("Puter.js not available");
        }
      } catch (puterError) {
        console.warn(
          "⚠️ Puter.js failed, trying fallback:",
          puterError.message
        );

        // If it's an auth error, don't fallback - let user know they need to authenticate
        if (
          puterError.message.includes("sign in") ||
          puterError.message.includes("authenticate")
        ) {
          throw puterError;
        }

        // For other errors, continue to fallback
      }
    }

    // Fallback to Grok if Puter.js fails or isn't selected
    if (
      settings.apiProvider === "grok" ||
      (!result && import.meta.env.VITE_XAI_API_KEY)
    ) {
      try {
        console.log("🔄 Trying Grok API...");
        result = await callTraditionalAPI(prompt, "grok", settings.abortSignal);
        if (result && result.success) {
          console.log("✅ Grok API successful");
          return result;
        }
      } catch (grokError) {
        console.warn("⚠️ Grok API failed:", grokError.message);
      }
    }

    // Final fallback to OpenAI
    if (
      settings.apiProvider === "openai" ||
      (!result && import.meta.env.VITE_OPENAI_API_KEY)
    ) {
      try {
        console.log("🔄 Trying OpenAI API...");
        result = await callTraditionalAPI(
          prompt,
          "openai",
          settings.abortSignal
        );
        if (result && result.success) {
          console.log("✅ OpenAI API successful");
          return result;
        }
      } catch (openaiError) {
        console.warn("⚠️ OpenAI API failed:", openaiError.message);
      }
    }

    // If all providers failed
    throw new Error(
      "All AI providers failed. Please check your API keys, ensure Puter.js is loaded, or try again later."
    );
  } catch (error) {
    console.error("❌ AI API call failed:", error);
    throw error;
  }
};

/**
 * Legacy API call function for xAI Grok and OpenAI
 * @param {string} userPrompt - User's natural language description
 * @param {string} apiProvider - 'grok' or 'openai'
 * @param {AbortSignal} abortSignal - Optional abort signal for cancellation
 * @returns {Promise<Object>} - API response with generated component
 */
const callTraditionalAPI = async (
  userPrompt,
  apiProvider = "grok",
  abortSignal = null
) => {
  // Sanitize the prompt to ensure it stays within limits
  const sanitizedPrompt = sanitizePrompt(userPrompt);
  const complexityLimits = getComplexityLimits();

  let config;
  switch (apiProvider) {
    case "grok":
      config = AI_CONFIG.GROK;
      break;
    case "openai":
      config = AI_CONFIG.OPENAI;
      break;
    default:
      config = AI_CONFIG.GROK;
  }

  // Check if API key is available
  let apiKey;
  switch (apiProvider) {
    case "grok":
      apiKey = import.meta.env.VITE_XAI_API_KEY;
      break;
    case "openai":
      apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      break;
    default:
      apiKey = import.meta.env.VITE_XAI_API_KEY;
  }

  if (!apiKey) {
    throw new Error(
      `${apiProvider.toUpperCase()} API key not found. Please set the appropriate environment variable or use Puter.js instead.`
    );
  }

  // Construct the enhanced system prompt for AI component generation
  const systemPrompt = generateSystemPrompt(sanitizedPrompt, apiProvider);

  const response = await axios.post(
    config.endpoint,
    {
      model: config.model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: sanitizedPrompt,
        },
      ],
      max_tokens: complexityLimits.maxTokens * 2, // Increased for larger components
      temperature: complexityLimits.temperature,
    },
    {
      headers: config.headers,
      timeout: DEFAULT_SETTINGS.timeout * 2, // Increased timeout for complex generation
      signal: abortSignal, // Add abort signal support
    }
  );

  // Extract and format the response
  const generatedCode = response.data.choices[0].message.content.trim();

  return {
    success: true,
    data: {
      component: {
        name: extractComponentName(generatedCode),
        code: generatedCode,
        description: `Generated simple component based on: "${sanitizedPrompt}"`,
        type: detectComponentType(sanitizedPrompt),
        prompt: sanitizedPrompt,
        originalPrompt: userPrompt,
        generated_at: new Date().toISOString(),
      },
    },
    metadata: {
      model: config.model,
      provider: apiProvider.toUpperCase(),
      tokens_used: response.data.usage?.total_tokens || 0,
      processing_time_ms: Date.now(), // Simplified timing
    },
  };
};

/**
 * Get available AI providers and their status
 * @returns {Promise<Object>} - Status of all AI providers
 */
export const getAIProvidersStatus = async () => {
  const status = {
    puter: {
      available: isPuterAvailable(),
      authenticated: false,
      models: [],
      error: null,
    },
    ollama: {
      available: false,
      authenticated: false,
      models: [],
      error: null,
      endpoint: "http://localhost:11434",
    },
    grok: {
      available: !!import.meta.env.VITE_XAI_API_KEY,
      authenticated: !!import.meta.env.VITE_XAI_API_KEY,
      model: AI_CONFIG.GROK.model,
      error: null,
    },
    openai: {
      available: !!import.meta.env.VITE_OPENAI_API_KEY,
      authenticated: !!import.meta.env.VITE_OPENAI_API_KEY,
      model: AI_CONFIG.OPENAI.model,
      error: null,
    },
  };

  // Test Ollama connection
  try {
    const ollamaTest = await testOllamaConnection();
    status.ollama.available = ollamaTest.success;
    status.ollama.authenticated = ollamaTest.success; // No auth needed for local
    if (ollamaTest.success) {
      status.ollama.models = ollamaTest.models || [];
    } else {
      status.ollama.error = ollamaTest.error;
    }
  } catch (error) {
    status.ollama.error = error.message;
  }

  // Test Puter connection if available
  if (status.puter.available) {
    try {
      const puterTest = await testPuterConnection();
      status.puter.authenticated = puterTest.authenticated;
      status.puter.error = puterTest.error;

      if (puterTest.authenticated) {
        status.puter.models = await getAvailableModels();
      }
    } catch (error) {
      status.puter.error = error.message;
    }
  }

  return status;
};

/**
 * Specialized AI API call for code editing that bypasses prompt validation
 * @param {string} originalCode - The existing component code
 * @param {string} editRequest - User's natural language edit request
 * @param {Object} settings - API settings
 * @param {string} selectedModel - Model to use
 * @returns {Promise<Object>} - API response with modified component
 */
export const callAIAPIForCodeEditing = async (
  originalCode,
  editRequest,
  settings = {},
  selectedModel = "gpt-4o-mini"
) => {
  // Validate inputs
  if (!originalCode || !originalCode.trim()) {
    throw new Error("No original code provided for editing");
  }

  if (!editRequest || !editRequest.trim()) {
    throw new Error("No edit request provided");
  }

  console.log("🔧 Starting AI code editing...", {
    provider: settings.apiProvider,
    model: selectedModel,
    editRequest: editRequest.substring(0, 100) + "...",
  });

  // Create system prompt for code editing
  const systemPrompt = `You are an expert React developer helping to modify existing code based on user requests.

IMPORTANT INSTRUCTIONS:
1. You will receive existing React component code and a modification request
2. Make ONLY the requested changes - don't rewrite the entire component
3. Preserve the existing structure, styling, and functionality unless specifically asked to change it
4. Return ONLY the complete modified React component code
5. Ensure the code is valid, functional React code
6. Maintain the same component name and export structure
7. Keep existing imports and dependencies

EXISTING CODE:
\`\`\`jsx
${originalCode}
\`\`\`

USER REQUEST: ${editRequest}

Please provide the modified React component code that implements the requested changes while preserving everything else:`;

  try {
    let result;

    // Try Ollama first if available and selected
    if (settings.apiProvider === "ollama") {
      try {
        if (await isOllamaAvailable()) {
          console.log(
            "🦙 Using Ollama for code editing with model:",
            selectedModel
          );
          result = await generateComponentWithOllama(
            systemPrompt,
            selectedModel,
            settings.abortSignal
          );

          if (result && result.success) {
            console.log("✅ Ollama code editing successful");
            return result;
          } else {
            console.warn(
              "⚠️ Ollama returned unexpected format, trying fallback..."
            );
            throw new Error("Invalid Ollama response format");
          }
        } else {
          throw new Error(
            "Ollama not available - server not running on localhost:11434"
          );
        }
      } catch (ollamaError) {
        console.warn("⚠️ Ollama failed:", ollamaError.message);
        throw ollamaError;
      }
    }

    // Try Puter.js if available and selected
    if (settings.apiProvider === "puter" || !settings.apiProvider) {
      try {
        if (await isPuterAvailable()) {
          const authStatus = checkPuterAuth();
          console.log("🔐 Puter auth status:", authStatus);

          if (authStatus.authenticated) {
            console.log(
              "🚀 Using Puter.js for code editing with model:",
              selectedModel
            );
            result = await generateComponentWithPuter(
              systemPrompt,
              selectedModel,
              settings.abortSignal
            );

            if (result && result.success && result.component) {
              console.log("✅ Puter.js code editing successful");

              return {
                success: true,
                data: {
                  component: {
                    code: result.component,
                    name:
                      extractComponentName(result.component) ||
                      "GeneratedComponent",
                    type: detectComponentType(result.component),
                    description: `Component modified with ${
                      result.metadata?.model || selectedModel
                    }`,
                  },
                },
                metadata: result.metadata || {
                  provider: "puter",
                  model: selectedModel,
                  tokens_used: 0,
                  processing_time_ms: 0,
                },
              };
            } else {
              console.warn(
                "⚠️ Puter.js returned unexpected format, trying fallback..."
              );
              throw new Error("Invalid Puter.js response format");
            }
          } else {
            console.log(
              "⚠️ Puter.js available but user not authenticated:",
              authStatus.reason
            );
          }
        } else {
          throw new Error("Puter.js not available");
        }
      } catch (puterError) {
        console.warn(
          "⚠️ Puter.js failed, trying fallback:",
          puterError.message
        );

        if (
          puterError.message.includes("sign in") ||
          puterError.message.includes("authenticate")
        ) {
          throw puterError;
        }
      }
    }

    // Fallback to traditional APIs
    if (
      settings.apiProvider === "grok" ||
      (!result && import.meta.env.VITE_XAI_API_KEY)
    ) {
      try {
        console.log("🔄 Trying Grok API for code editing...");
        result = await callTraditionalAPI(
          systemPrompt,
          "grok",
          settings.abortSignal
        );
        if (result && result.success) {
          console.log("✅ Grok API code editing successful");
          return result;
        }
      } catch (grokError) {
        console.warn("⚠️ Grok API failed:", grokError.message);
      }
    }

    if (
      settings.apiProvider === "openai" ||
      (!result && import.meta.env.VITE_OPENAI_API_KEY)
    ) {
      try {
        console.log("🔄 Trying OpenAI API for code editing...");
        result = await callTraditionalAPI(
          systemPrompt,
          "openai",
          settings.abortSignal
        );
        if (result && result.success) {
          console.log("✅ OpenAI API code editing successful");
          return result;
        }
      } catch (openaiError) {
        console.warn("⚠️ OpenAI API failed:", openaiError.message);
      }
    }

    // If all methods failed
    throw new Error(
      "All AI services failed to process the code editing request. Please try again."
    );
  } catch (err) {
    console.error("Code editing error:", err);
    throw err;
  }
};

/**
 * Export provider-specific functions for direct use
 */
export {
  generateComponentWithPuter,
  isPuterAvailable,
  testPuterConnection,
  getAvailableModels,
  triggerPuterLogin,
  getPuterUserInfo,
  getModelCapabilities,
  supportsVision,
  generateComponentWithOllama,
  isOllamaAvailable,
  testOllamaConnection,
  getOllamaModels,
  checkOllamaAuth,
};
