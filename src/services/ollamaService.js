/**
 * Ollama AI Service for local CodeLlama integration
 * Provides AI capabilities without API keys using local Ollama instance
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import { AI_CONFIG } from "../utils/config.js";
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
 * Check if Ollama is available
 * @returns {Promise<boolean>} - Whether Ollama is running
 */
export const isOllamaAvailable = async () => {
  try {
    const response = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn("Ollama not available:", error.message);
    return false;
  }
};

/**
 * Get available Ollama models
 * @returns {Promise<Array>} - List of available models
 */
export const getOllamaModels = async () => {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    const data = await response.json();

    return (
      data.models?.map((model) => ({
        id: model.name,
        name: model.name,
        provider: "Ollama",
        size: model.size,
        modified_at: model.modified_at,
      })) || AI_CONFIG.OLLAMA.models
    );
  } catch (error) {
    console.warn("Failed to get Ollama models:", error);
    return AI_CONFIG.OLLAMA.models;
  }
};

/**
 * Generate UI component using Ollama
 * @param {string} userPrompt - User's natural language description
 * @param {string} model - AI model to use (default: 'codellama')
 * @param {AbortSignal} abortSignal - Optional abort signal for cancellation
 * @returns {Promise<Object>} - Generated component data
 */
export const generateComponentWithOllama = async (
  prompt,
  model = "codellama",
  abortSignal = null
) => {
  try {
    console.log("🦙 Generating component with Ollama...", { prompt, model });

    // Validate prompt first
    const validation = validatePromptComplexity(prompt);
    if (!validation.success) {
      throw new Error(validation.error);
    }

    const sanitizedPrompt = sanitizePrompt(prompt);

    // Enhanced system prompt similar to Puter service but optimized for CodeLlama
    const systemPrompt = generateSystemPrompt(sanitizedPrompt, "ollama");

    const response = await fetch(AI_CONFIG.OLLAMA.endpoint, {
      method: "POST",
      headers: AI_CONFIG.OLLAMA.headers,
      body: JSON.stringify({
        model: model,
        prompt: `You are an expert React developer. Generate only React component code with Tailwind CSS. No explanations, no markdown formatting, just the component code.\n\n${systemPrompt}`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 2000,
        },
      }),
      signal: abortSignal, // Add abort signal support
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `Model '${model}' not found. Please install it with: ollama pull ${model}`
        );
      }
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("No response from Ollama");
    }

    // Clean the generated code
    const cleanedCode = cleanComponentCode(data.response);

    if (!cleanedCode) {
      throw new Error("Generated code is empty or invalid");
    }

    // Extract component metadata
    const componentName = extractComponentName(cleanedCode, sanitizedPrompt);
    const componentType = detectComponentType(cleanedCode);

    const componentData = {
      name: componentName,
      type: componentType,
      code: cleanedCode,
      prompt: sanitizedPrompt,
      timestamp: new Date().toISOString(),
      provider: "Ollama",
      model: model,
      local: true,
    };

    console.log("✅ Ollama generation successful:", {
      componentName,
      componentType,
      codeLength: cleanedCode.length,
    });

    return {
      success: true,
      data: {
        component: componentData,
      },
      metadata: {
        model: model,
        provider: "Ollama",
        local: true,
        prompt_tokens: data.prompt_eval_count || 0,
        completion_tokens: data.eval_count || 0,
        total_time: data.total_duration || 0,
      },
    };
  } catch (error) {
    console.error("❌ Ollama generation failed:", error);
    throw new Error(`Ollama generation failed: ${error.message}`);
  }
};

/**
 * Test Ollama connection and get system info
 * @returns {Promise<Object>} - Connection status and available models
 */
export const testOllamaConnection = async () => {
  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return {
        success: false,
        error: "Ollama server not running on localhost:11434",
      };
    }

    const models = await getOllamaModels();
    return {
      success: true,
      models: models,
      endpoint: "http://localhost:11434",
      version: "local",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check Ollama authentication (always returns true for local)
 * @returns {Promise<Object>} - Authentication status
 */
export const checkOllamaAuth = async () => {
  const available = await isOllamaAvailable();
  return {
    isAuthenticated: available,
    requiresAuth: false,
    message: available
      ? "Ollama is running locally"
      : "Ollama server not available",
  };
};
