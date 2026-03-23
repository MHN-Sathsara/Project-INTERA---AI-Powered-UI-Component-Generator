/**
 * Main UI Component Generator Component (Refactored)
 * This is the core component that handles AI-powered React component generation
 * 
 * Features:
 * - Natural language prompt input
 * - AI API integration (with mock API fallback)
 * - Real-time component preview
 * - Code display with syntax highlighting
 * - Copy-to-clipboard functionality
 * - Error handling and loading states
 * - Hideable sidebar with navigation
 * - Smart Layout System: Automatically switches between side-by-side and stacked layouts
 *   based on component complexity (dashboards, landing pages, forms, etc.)
 * 
 * Layout Behavior:
 * - Simple components: Side-by-side layout (code left, preview right)
 * - Complex components: Stacked layout (code top, preview bottom)
 * - Automatic detection based on keywords, code length, and structure
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 * Timeline: January 2025 - November 2025
 */

import React, { useRef, useState } from 'react';

// Custom hook for component generation logic
import { useComponentGenerator } from '../hooks/useComponentGenerator.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

// UI Components
import Header from './ui/Header.jsx';
import Sidebar from './ui/SideBar.jsx';
import ConfigurationPanel from './ui/ConfigurationPanel.jsx';
import InputSection from './ui/InputSection.jsx';
import ErrorDisplay from './ui/ErrorDisplay.jsx';
import CodeDisplay from './ui/CodeDisplay.jsx';
import ComponentPreview from './ui/ComponentPreview.jsx';
import ComponentInfo from './ui/ComponentInfo.jsx';
import UsageInstructions from './ui/UsageInstructions.jsx';
import Footer from './ui/Footer.jsx';
import CodeGenerationLoader from './ui/CodeGenerationLoader.jsx';
import GenerationStats from './ui/GenerationStats.jsx';

const UIComponentGenerator = () => {
  // All hooks must be called at the top level in the same order every time
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Full page preview mode state
  const [isPreviewFullPage, setIsPreviewFullPage] = useState(false);
  // Sidebar refresh trigger state
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);
  
  // Refs for DOM manipulation - moved to top to ensure consistent hook order
  const codeRef = useRef(null);
  const promptRef = useRef(null);

  // Theme hook
  const { isDarkMode } = useTheme();

  // Custom hook for all component generation logic
  const {
    prompt,
    generatedCode,
    currentCode,
    isLoading,
    error,
    previewError,
    componentData,
    apiProvider,
    selectedModel,
    isFullPage,
    user,
    generationPhase,
    loadingProgress,
    loadingStep,
    setPrompt,
    setApiProvider,
    setSelectedModel,
    setIsFullPage,
    handleGenerateComponent,
    handleCodeChange,
    clearAll,
    handleKeyPress,
    saveCurrentComponent,
    loadSavedComponent,
    cancelGeneration
  } = useComponentGenerator();

  // Sidebar handlers
  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Handle full page mode change from ComponentPreview
  const handleFullPageModeChange = (isFullPage) => {
    setIsPreviewFullPage(isFullPage);
  };

  // Enhanced save function that triggers sidebar refresh
  const handleSaveComponent = async () => {
    const result = await saveCurrentComponent();
    if (result.success) {
      // Trigger sidebar refresh by incrementing the counter
      setSidebarRefreshTrigger(prev => prev + 1);
    }
    return result;
  };

  // Detect if component should use stacked layout (code top, preview bottom)
  // This provides better visibility for complex components like dashboards, 
  // landing pages, forms, and other large/full-page components
  const shouldUseStackedLayout = (code) => {
    if (!code) return false;
    const lowerCode = code.toLowerCase();
    
    // Check for full-page/complex component indicators
    const stackedLayoutIndicators = [
      'dashboard',
      'landing',
      'homepage',
      'full-page',
      'layout',
      'min-h-screen',
      'height: 100vh',
      'h-screen',
      'admin panel',
      'user profile',
      'settings page',
      'login page',
      'signup page',
      'checkout page',
      'portfolio',
      'contact page',
      'about page',
      'hero section',
      'viewport',
      'navigation',
      'navbar',
      'footer',
      'header'
    ];
    
    // Check for code complexity indicators
    const isLongCode = code.length > 2000;
    const hasMultipleSections = (code.match(/<section|<div.*section|<header|<footer|<nav|<main/gi) || []).length > 2;
    const hasMultipleComponents = (code.match(/const\s+\w+\s*=|function\s+\w+/g) || []).length > 1;
    const hasComplexStructure = code.includes('grid grid-cols') && code.includes('flex') && code.includes('space-y');
    const hasFormFields = (code.match(/input|textarea|select/gi) || []).length > 3;
    
    return stackedLayoutIndicators.some(indicator => lowerCode.includes(indicator)) || 
           isLongCode || 
           hasMultipleSections || 
           hasMultipleComponents ||
           hasComplexStructure ||
           hasFormFields ||
           isPreviewFullPage;
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-100 to-gray-200'
    }`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose} 
          onLoadComponent={loadSavedComponent}
          refreshTrigger={sidebarRefreshTrigger}
        />
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <Header onMenuClick={handleMenuClick} />

              {/* Configuration Panel */}
              <ConfigurationPanel 
                apiProvider={apiProvider}
                setApiProvider={setApiProvider}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />

              {/* Spacing between AI provider and prompt input */}
              <div className="mb-6"></div>

              {/* Main Input Section */}
              <InputSection 
                prompt={prompt}
                setPrompt={setPrompt}
                isLoading={isLoading}
                handleGenerateComponent={handleGenerateComponent}
                handleKeyPress={handleKeyPress}
                clearAll={clearAll}
                promptRef={promptRef}
              />

              {/* Error Display */}
              <ErrorDisplay error={error} />

              {/* Results Section */}
              {(generatedCode || componentData) && (
                <div className={
                  shouldUseStackedLayout(currentCode) 
                    ? 'stacked-layout' // Stacked layout: code top, preview bottom
                    : 'side-by-side-layout' // Side-by-side layout for simple components
                }>
                  {/* Generated Code Panel */}
                  <CodeDisplay 
                    generatedCode={currentCode}
                    codeRef={codeRef}
                    onCodeChange={handleCodeChange}
                    onSaveComponent={handleSaveComponent}
                    user={user}
                    isFullPageMode={isPreviewFullPage}
                    apiProvider={apiProvider}
                    selectedModel={selectedModel}
                  />

                  {/* Component Preview Panel */}
                  <ComponentPreview 
                    code={currentCode}
                    previewError={previewError}
                    componentData={componentData}
                    isFullPage={isFullPage}
                    onFullPageModeChange={handleFullPageModeChange}
                  />
                </div>
              )}

              {/* Component Information Panel */}
              <ComponentInfo componentData={componentData} />

              {/* Usage Instructions */}
              <UsageInstructions />

              {/* Footer */}
              <Footer />
            </div>
          </div>
        </div>
      </div>

      {/* Code Generation Loading Animation */}
      <CodeGenerationLoader 
        isVisible={isLoading}
        progress={loadingProgress}
        currentStep={loadingStep}
        generationPhase={generationPhase}
        onCancel={cancelGeneration}
        onComplete={() => {
          // Optional: Add any completion logic here
        }}
      />

      {/* Generation Stats (bottom-right corner) */}
      <GenerationStats />
    </div>
  );
};

export default UIComponentGenerator;
