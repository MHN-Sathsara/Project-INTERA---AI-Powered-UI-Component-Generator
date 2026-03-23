/**
 * Custom hook for managing component generation state and logic with live editing
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import { useState, useCallback } from "react";
import { callAIAPI } from "../services/aiService.js";
import { detectFullPageComponent } from "../utils/promptValidation.js";
import { saveComponent } from "../services/componentStorage.js";
import { useAuth } from "./useAuth.js";
import autoLogger from "../services/autoLogger.js";

export const useComponentGenerator = () => {
  // State management
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [currentCode, setCurrentCode] = useState(""); // For edited code
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [componentData, setComponentData] = useState(null);
  const [apiProvider, setApiProvider] = useState("puter"); // Changed to puter as default
  const [selectedModel, setSelectedModel] = useState("gpt-4o"); // For Puter.js model selection
  const [isFullPage, setIsFullPage] = useState(false); // For sandbox full page mode

  // Loading animation state
  const [generationPhase, setGenerationPhase] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState("");

  // Cancellation support
  const [abortController, setAbortController] = useState(null);

  // Update selected model when API provider changes
  const handleApiProviderChange = useCallback((newProvider) => {
    setApiProvider(newProvider);
    // Set appropriate default model for each provider
    switch (newProvider) {
      case "puter":
        setSelectedModel("gpt-4o");
        break;
      case "ollama":
        setSelectedModel("codellama:7b"); // Use the model you have installed
        break;
      case "grok":
        setSelectedModel("grok-beta");
        break;
      case "openai":
        setSelectedModel("gpt-4");
        break;
      default:
        setSelectedModel("gpt-4o");
    }
  }, []);

  const { user } = useAuth();

  /**
   * Handles code changes from the editor
   */
  const handleCodeChange = useCallback((newCode) => {
    setCurrentCode(newCode);
  }, []);

  /**
   * Cancels the current generation process
   */
  const cancelGeneration = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }

    // Reset all loading states
    setIsLoading(false);
    setGenerationPhase(null);
    setLoadingProgress(0);
    setLoadingStep("");
    setError("Generation cancelled by user");
  }, [abortController]);

  /**
   * Handles the generation of UI components from natural language prompts
   */
  const handleGenerateComponent = async () => {
    // Input validation
    if (!prompt.trim()) {
      setError(
        "Please enter a description for the component you want to create."
      );
      // Reset loading states on validation error
      setGenerationPhase(null);
      setLoadingProgress(0);
      setLoadingStep("");
      return;
    }

    // Track generation start time for logging
    const generationStartTime = performance.now();

    // Create new AbortController for this generation
    const controller = new AbortController();
    setAbortController(controller);

    // Initialize loading state
    setIsLoading(true);
    setError(null);
    setPreviewError(null);
    setGeneratedCode("");
    setCurrentCode("");
    setComponentData(null);

    // Start tracking generation phases
    setGenerationPhase("initializing");
    setLoadingProgress(5);
    setLoadingStep("Analyzing your request...");

    try {
      // Phase 1: Validation
      setGenerationPhase("validating");
      setLoadingProgress(15);
      setLoadingStep("Understanding requirements...");

      // Detect if this should be a full page component
      const shouldBeFullPage = detectFullPageComponent(prompt);
      setIsFullPage(shouldBeFullPage);

      // Small delay to show validation step
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Phase 2: API Connection
      setGenerationPhase("api_call");
      setLoadingProgress(30);
      setLoadingStep("Connecting to AI service...");

      // Small delay to show API connection step
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Phase 3: Generation
      setGenerationPhase("generating");
      setLoadingProgress(60);
      setLoadingStep("Generating React code...");

      // Check if cancelled before API call
      if (controller.signal.aborted) {
        throw new Error("Generation cancelled by user");
      }

      // Use real AI API with model selection for Puter.js
      const result = await callAIAPI(
        prompt,
        { apiProvider, abortSignal: controller.signal },
        selectedModel
      );

      // Phase 4: Processing
      setGenerationPhase("processing");
      setLoadingProgress(85);
      setLoadingStep("Adding styling & animations...");

      // Check if cancelled before processing
      if (controller.signal.aborted) {
        throw new Error("Generation cancelled by user");
      }

      // Small delay to show processing step
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 800);
        controller.signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new Error("Generation cancelled by user"));
        });
      });

      // Phase 5: Finalizing
      setGenerationPhase("finalizing");
      setLoadingProgress(95);
      setLoadingStep("Optimizing performance...");

      if (result.success && result.data) {
        const { component } = result.data;

        // Small delay before completion
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Phase 6: Complete
        setGenerationPhase("complete");
        setLoadingProgress(100);
        setLoadingStep("Component ready!");

        setGeneratedCode(component.code);
        setCurrentCode(component.code);
        setComponentData(component);

        // Log successful generation
        const generationEndTime = performance.now();
        autoLogger.logGeneration({
          prompt: prompt.trim(),
          apiProvider,
          model: selectedModel,
          duration: generationEndTime - generationStartTime,
          success: true,
          codeLength: component.code.length,
        });

        // Let the animation complete before hiding loader
        setTimeout(() => {
          setIsLoading(false);
          setGenerationPhase(null);
          setLoadingProgress(0);
          setLoadingStep("");
          setAbortController(null);
        }, 1000);
      } else {
        throw new Error(
          result.error?.message ||
            result.error ||
            "Failed to generate component. Please try again."
        );
      }
    } catch (err) {
      console.error("Generation error:", err);

      // Log failed generation (unless cancelled by user)
      if (
        !err.name ||
        (err.name !== "AbortError" && !err.message.includes("cancelled"))
      ) {
        const generationEndTime = performance.now();
        autoLogger.logGeneration({
          prompt: prompt.trim(),
          apiProvider,
          model: selectedModel,
          duration: generationEndTime - generationStartTime,
          success: false,
          errorMessage: err.message,
          codeLength: 0,
        });
      }

      // Handle cancellation differently from other errors
      if (err.name === "AbortError" || err.message.includes("cancelled")) {
        setError("Generation cancelled by user");
      } else {
        setError(
          err.response?.data?.error?.message ||
            err.message ||
            "An unexpected error occurred. Please try again."
        );
      }

      setIsLoading(false);
      setGenerationPhase(null);
      setLoadingProgress(0);
      setLoadingStep("");
      setAbortController(null);
    }
  };

  /**
   * Clears all generated content and resets the form
   */
  const clearAll = () => {
    // Cancel any ongoing generation
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }

    setPrompt("");
    setGeneratedCode("");
    setCurrentCode("");
    setError(null);
    setPreviewError(null);
    setComponentData(null);
    setGenerationPhase(null);
    setLoadingProgress(0);
    setLoadingStep("");
    setIsLoading(false);
  };

  /**
   * Handles Enter key press in prompt input for better UX
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateComponent();
    }
  };

  /**
   * Saves the current component to user's collection
   */
  const saveCurrentComponent = async () => {
    if (!user) {
      setError("Please sign in to save components");
      return { success: false };
    }

    if (!componentData || !currentCode) {
      setError("No component to save");
      return { success: false };
    }

    try {
      const { data, error } = await saveComponent({
        name: componentData.name || "Generated Component",
        code: currentCode,
        type: componentData.type || "component",
        description: componentData.description || "",
        prompt: prompt || "",
      });

      if (error) {
        setError("Failed to save component: " + error.message);
        return { success: false };
      }

      return { success: true, data };
    } catch (err) {
      setError("Failed to save component: " + err.message);
      return { success: false };
    }
  };

  /**
   * Loads a saved component into the preview area
   */
  const loadSavedComponent = useCallback((savedComponent) => {
    // Clear any previous errors
    setError(null);
    setPreviewError(null);

    // Set the component data
    setGeneratedCode(savedComponent.code);
    setCurrentCode(savedComponent.code);
    setPrompt(savedComponent.prompt || "");

    // Reconstruct component data from saved component
    const componentData = {
      name: savedComponent.name,
      type: savedComponent.type,
      description: savedComponent.description,
      code: savedComponent.code,
    };

    setComponentData(componentData);

    // Detect if this should be a full page component based on the saved data
    const shouldBeFullPage = detectFullPageComponent(
      savedComponent.prompt || savedComponent.description || ""
    );
    setIsFullPage(shouldBeFullPage);
  }, []);

  return {
    // State
    prompt,
    generatedCode,
    currentCode: currentCode || generatedCode, // Use edited code if available
    isLoading,
    error,
    previewError,
    componentData,
    apiProvider,
    selectedModel,
    isFullPage,
    user,

    // Loading animation state
    generationPhase,
    loadingProgress,
    loadingStep,

    // Actions
    setPrompt,
    setApiProvider: handleApiProviderChange, // Use the enhanced version
    setSelectedModel,
    setIsFullPage,
    handleGenerateComponent,
    handleCodeChange,
    clearAll,
    handleKeyPress,
    saveCurrentComponent,
    loadSavedComponent,
    cancelGeneration,
  };
};
