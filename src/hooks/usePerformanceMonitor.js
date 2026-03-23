/**
 * Performance monitoring hook for React components
 * Tracks render times and performance metrics
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import { useEffect, useRef, useState } from "react";

/**
 * Hook to monitor component performance
 * @param {string} componentName - Name of the component being monitored
 * @returns {Object} Performance metrics and utilities
 */
export const usePerformanceMonitor = (componentName) => {
  const renderStartTime = useRef(performance.now());
  const renderCount = useRef(0);
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    renderCount: 0,
    averageRenderTime: 0,
    totalTime: 0,
  });

  useEffect(() => {
    renderCount.current += 1;
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    const totalTime =
      renderCount.current === 1 ? renderTime : metrics.totalTime + renderTime;
    const averageRenderTime = totalTime / renderCount.current;

    // Update metrics
    setMetrics({
      renderTime,
      renderCount: renderCount.current,
      averageRenderTime,
      totalTime,
    });

    // Log performance warnings in development
    if (process.env.NODE_ENV === "development") {
      if (renderTime > 16) {
        // More than one frame (60fps)
        console.warn(
          `🐌 ${componentName} slow render: ${renderTime.toFixed(
            2
          )}ms (render #${renderCount.current})`
        );
      }

      if (renderCount.current % 10 === 0 && averageRenderTime > 10) {
        console.warn(
          `⚠️ ${componentName} average render time: ${averageRenderTime.toFixed(
            2
          )}ms over ${renderCount.current} renders`
        );
      }

      // Log performance data periodically
      if (renderCount.current <= 5 || renderCount.current % 25 === 0) {
        console.log(
          `📊 ${componentName} performance:`,
          `Render #${renderCount.current}:`,
          `${renderTime.toFixed(2)}ms`,
          `(avg: ${averageRenderTime.toFixed(2)}ms)`
        );
      }
    }

    renderStartTime.current = performance.now();
  });

  // Performance utilities
  const markSlowComponent = () => {
    console.warn(`🔴 ${componentName} marked as slow component`);
  };

  const trackCustomMetric = (metricName, value) => {
    console.log(`📈 ${componentName} custom metric - ${metricName}: ${value}`);
  };

  return {
    metrics,
    markSlowComponent,
    trackCustomMetric,
  };
};

/**
 * Hook to measure code execution time
 * @param {Function} fn - Function to measure
 * @param {Array} deps - Dependencies array
 * @returns {Object} Execution metrics
 */
export const useExecutionTime = (fn, deps = []) => {
  const [executionTime, setExecutionTime] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const measureExecution = async () => {
      setIsExecuting(true);
      const startTime = performance.now();

      try {
        if (typeof fn === "function") {
          await fn();
        }
      } catch (error) {
        console.error("Execution measurement error:", error);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      setExecutionTime(duration);
      setIsExecuting(false);

      if (process.env.NODE_ENV === "development" && duration > 100) {
        console.warn(
          `⏱️ Long execution time detected: ${duration.toFixed(2)}ms`
        );
      }
    };

    measureExecution();
  }, deps);

  return {
    executionTime,
    isExecuting,
    executionTimeFormatted: `${executionTime.toFixed(2)}ms`,
  };
};

/**
 * Hook to track memory usage (if available)
 * @returns {Object} Memory metrics
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if (performance.memory) {
        setMemoryInfo({
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

/**
 * Hook to debounce function calls for performance
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies
 * @returns {Function} Debounced function
 */
export const useDebounce = (callback, delay, deps) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};

export default {
  usePerformanceMonitor,
  useExecutionTime,
  useMemoryMonitor,
  useDebounce,
};
