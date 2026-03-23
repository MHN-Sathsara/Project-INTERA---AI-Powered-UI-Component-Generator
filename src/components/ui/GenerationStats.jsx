/**
 * Generation Stats Component
 * Shows simple statistics about automatic logging
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { useState, useEffect } from 'react';
import autoLogger from '../../services/autoLogger.js';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const GenerationStats = () => {
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Update stats initially and set up interval
    updateStats();
    const interval = setInterval(updateStats, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const updateStats = async () => {
    try {
      // Try to get Supabase stats first, fallback to local
      const currentStats = await autoLogger.getSupabaseStats();
      setStats(currentStats);
    } catch (error) {
      console.warn('Failed to fetch stats:', error);
      // Fallback to local stats
      const localStats = autoLogger.getStats();
      setStats(localStats);
    }
  };

  const handleDownloadLogs = () => {
    autoLogger.downloadLogsAsFile();
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all local logs? (Supabase data will remain)')) {
      autoLogger.clearLogs();
      updateStats();
    }
  };

  if (!stats) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-30 transition-all duration-300 ${
      isDarkMode ? 'text-white' : 'text-gray-800'
    }`}>
      <div className={`backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-600' 
          : 'bg-white/90 border-gray-200'
      }`}>
        {/* Compact View */}
        <div 
          className="p-3 cursor-pointer flex items-center space-x-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium">
            {stats.totalGenerations} Generated
          </span>
          {stats.source && (
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              stats.source === 'supabase' 
                ? isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                : isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {stats.source === 'supabase' ? 'DB' : 'Local'}
            </span>
          )}
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className={`border-t px-3 pb-3 ${
            isDarkMode ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className={`font-medium ${
                  stats.successRate > 80 ? 'text-green-500' : 
                  stats.successRate > 60 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {stats.successRate.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Avg Time:</span>
                <span className="font-medium">{stats.averageDuration}ms</span>
              </div>
              
              <div className="flex justify-between">
                <span>Success/Failed:</span>
                <span className="font-medium">
                  {stats.successfulGenerations}/{stats.failedGenerations}
                </span>
              </div>

              {stats.lastGeneration && (
                <div className="text-xs text-gray-500 pt-1">
                  Last: {new Date(stats.lastGeneration).toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleDownloadLogs}
                className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${
                  isDarkMode 
                    ? 'border-blue-600 text-blue-400 hover:bg-blue-600/20' 
                    : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
                title="Download logs as JSON file"
              >
                Download
              </button>
              
              <button
                onClick={handleClearLogs}
                className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${
                  isDarkMode 
                    ? 'border-red-600 text-red-400 hover:bg-red-600/20' 
                    : 'border-red-500 text-red-600 hover:bg-red-50'
                }`}
                title="Clear all logs"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationStats;