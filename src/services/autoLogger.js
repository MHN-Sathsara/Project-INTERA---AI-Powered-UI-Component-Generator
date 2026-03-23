/**
 * Simple Automatic Logging Service
 * Automatically logs generation data to Supabase when users generate components
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import { supabase } from "./supabaseClient.js";

class AutoLogger {
  constructor() {
    this.logs = [];
    this.loadExistingLogs();
  }

  /**
   * Load existing logs from localStorage
   */
  loadExistingLogs() {
    try {
      const stored = localStorage.getItem("auto_generation_logs");
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load existing logs:", error);
      this.logs = [];
    }
  }

  /**
   * Save logs to localStorage and Supabase
   */
  async saveLogs() {
    try {
      // Save to localStorage as backup
      localStorage.setItem("auto_generation_logs", JSON.stringify(this.logs));

      console.log("Logs saved to localStorage");
    } catch (error) {
      console.warn("Failed to save logs:", error);
    }
  }

  /**
   * Save a single log entry to Supabase
   */
  async saveToSupabase(logEntry) {
    try {
      // Clean data to ensure integers for numeric fields
      const cleanedData = {
        log_id: logEntry.id,
        timestamp: logEntry.timestamp,
        prompt: logEntry.prompt,
        api_provider: logEntry.apiProvider,
        model: logEntry.model,
        duration: Math.round(logEntry.duration || 0), // Convert to integer
        success: logEntry.success,
        error_message: logEntry.errorMessage,
        code_length: Math.round(logEntry.codeLength || 0), // Ensure integer
        component_type: logEntry.componentType,
        prompt_complexity: logEntry.promptComplexity,
        session_info: logEntry.sessionInfo,
      };

      const { data, error } = await supabase
        .from("generation_logs")
        .insert([cleanedData]);

      if (error) {
        console.error("Error saving to Supabase:", error);
        return false;
      }

      console.log("Log saved to Supabase:", logEntry.id);
      return true;
    } catch (error) {
      console.error("Failed to save to Supabase:", error);
      return false;
    }
  }

  /**
   * Download logs as JSON file
   */
  downloadLogsAsFile() {
    try {
      const logData = {
        generatedAt: new Date().toISOString(),
        totalGenerations: this.logs.length,
        logs: this.logs,
      };

      const blob = new Blob([JSON.stringify(logData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generation_logs_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn("Failed to download logs:", error);
    }
  }

  /**
   * Log a component generation
   */
  async logGeneration(generationData) {
    const logEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      prompt: generationData.prompt || "",
      apiProvider: generationData.apiProvider || "unknown",
      model: generationData.model || "unknown",
      duration: Math.round(generationData.duration || 0), // Ensure integer
      success: generationData.success || false,
      errorMessage: generationData.errorMessage || null,
      codeLength: Math.round(generationData.codeLength || 0), // Ensure integer
      componentType: this.detectComponentType(generationData.prompt),
      promptComplexity: this.detectComplexity(generationData.prompt),
      sessionInfo: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        url: window.location.href,
      },
    };

    // Add to logs array
    this.logs.push(logEntry);

    // Save to localStorage
    await this.saveLogs();

    // Try to save to Supabase
    try {
      await this.saveToSupabase(logEntry);
    } catch (error) {
      console.warn(
        "Failed to save to Supabase, continuing with local storage only:",
        error
      );
    }

    console.log("Generation logged:", logEntry.id);
    return logEntry.id;
  }

  /**
   * Detect component type from prompt
   */
  detectComponentType(prompt) {
    if (!prompt) return "unknown";

    const lowercasePrompt = prompt.toLowerCase();

    if (lowercasePrompt.includes("button")) return "button";
    if (lowercasePrompt.includes("form") || lowercasePrompt.includes("input"))
      return "form";
    if (lowercasePrompt.includes("card")) return "card";
    if (
      lowercasePrompt.includes("navigation") ||
      lowercasePrompt.includes("navbar") ||
      lowercasePrompt.includes("menu")
    )
      return "navigation";
    if (lowercasePrompt.includes("dashboard")) return "dashboard";
    if (
      lowercasePrompt.includes("landing") ||
      lowercasePrompt.includes("homepage")
    )
      return "landing-page";
    if (lowercasePrompt.includes("table") || lowercasePrompt.includes("list"))
      return "data-display";
    if (lowercasePrompt.includes("modal") || lowercasePrompt.includes("popup"))
      return "modal";
    if (
      lowercasePrompt.includes("sidebar") ||
      lowercasePrompt.includes("layout")
    )
      return "layout";

    return "component";
  }

  /**
   * Detect prompt complexity
   */
  detectComplexity(prompt) {
    if (!prompt) return "unknown";

    const length = prompt.length;
    const wordCount = prompt.split(" ").length;
    const hasMultipleRequirements =
      prompt.includes("and") || prompt.includes("with") || prompt.includes(",");

    if (length > 300 || wordCount > 50) return "very-complex";
    if (length > 150 || wordCount > 25 || hasMultipleRequirements)
      return "complex";
    if (length > 50 || wordCount > 10) return "medium";

    return "simple";
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get analytics from Supabase
   */
  async getSupabaseStats() {
    try {
      const { data, error } = await supabase
        .from("generation_logs")
        .select("success, duration, timestamp")
        .order("timestamp", { ascending: false })
        .limit(1000); // Get last 1000 entries

      if (error) {
        console.error("Error fetching Supabase stats:", error);
        return this.getStats(); // Fallback to local stats
      }

      const totalGenerations = data.length;
      const successfulGenerations = data.filter((log) => log.success).length;
      const failedGenerations = totalGenerations - successfulGenerations;
      const averageDuration =
        totalGenerations > 0
          ? data.reduce((sum, log) => sum + log.duration, 0) / totalGenerations
          : 0;

      return {
        totalGenerations,
        successfulGenerations,
        failedGenerations,
        successRate:
          totalGenerations > 0
            ? (successfulGenerations / totalGenerations) * 100
            : 0,
        averageDuration: Math.round(averageDuration),
        lastGeneration: totalGenerations > 0 ? data[0].timestamp : null,
        source: "supabase",
      };
    } catch (error) {
      console.error("Failed to fetch Supabase stats:", error);
      return this.getStats(); // Fallback to local stats
    }
  }

  /**
   * Get current statistics (local fallback)
   */
  getStats() {
    const totalGenerations = this.logs.length;
    const successfulGenerations = this.logs.filter((log) => log.success).length;
    const failedGenerations = totalGenerations - successfulGenerations;
    const averageDuration =
      totalGenerations > 0
        ? this.logs.reduce((sum, log) => sum + log.duration, 0) /
          totalGenerations
        : 0;

    return {
      totalGenerations,
      successfulGenerations,
      failedGenerations,
      successRate:
        totalGenerations > 0
          ? (successfulGenerations / totalGenerations) * 100
          : 0,
      averageDuration: Math.round(averageDuration),
      lastGeneration:
        totalGenerations > 0 ? this.logs[totalGenerations - 1].timestamp : null,
      source: "local",
    };
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    localStorage.removeItem("auto_generation_logs");
    console.log("All logs cleared");
  }
}

// Create singleton instance
const autoLogger = new AutoLogger();

export default autoLogger;
