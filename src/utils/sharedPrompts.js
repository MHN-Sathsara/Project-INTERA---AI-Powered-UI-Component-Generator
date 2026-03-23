/**
 * Shared prompt templates for AI services
 * Reduces code duplication across different AI providers
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

export const COMPONENT_CAPABILITIES = `
COMPONENT CAPABILITIES:
✅ ALLOWED - Full-featured UI components:
- Complete forms (login, signup, contact, registration, checkout, user profiles)
- Authentication pages (login/signin, signup/register, forgot password, reset password)
- Dashboard layouts with sidebars, navigation, and content areas
- Complex navigation systems (multi-level menus, responsive navigation)
- Data tables with sorting, filtering, pagination, and search
- Modal dialogs, overlays, and popup components
- Card layouts, product displays, and e-commerce interfaces
- User management interfaces and admin panels
- Settings and configuration panels with tabs and sections
- Search interfaces with filters and advanced options
- Complex responsive layouts (multi-column, grid systems)
- Interactive components with comprehensive state management
- Form validation with real-time error handling
- Loading states, transitions, and smooth animations (CSS-based)

❌ RESTRICTED - Advanced technical features:
- 3D objects, WebGL, or complex graphics libraries
- External API integrations (fetch calls, axios)
- Complex third-party library integrations
- File upload functionality with backend integration
- Real-time features (WebSockets, real-time databases)
- Complex charting libraries (Chart.js, D3.js)
- Advanced animations libraries (Framer Motion, GSAP)
`;

export const GENERATION_STANDARDS = `
GENERATION STANDARDS:

1. **React Excellence:**
   - Modern functional components with proper hooks usage
   - Comprehensive state management (useState, useEffect, useCallback, useMemo)
   - Proper event handling and form management
   - Error boundaries and validation logic
   - Clean component architecture

2. **Styling & Design:**
   - Complete Tailwind CSS styling with professional appearance
   - Fully responsive design (mobile-first approach)
   - Interactive states (hover, focus, active, disabled)
   - Consistent spacing, typography, and color schemes
   - Modern, clean, and professional UI design

3. **Functionality:**
   - Complete feature implementation for the requested component
   - Form validation with comprehensive error handling
   - Loading states and user feedback mechanisms
   - Accessibility features (ARIA attributes, semantic HTML)
   - Keyboard navigation and screen reader support

4. **Code Quality:**
   - Clean, maintainable, and well-structured code
   - Meaningful variable and function names
   - Comprehensive prop handling with defaults
   - Proper JSX organization and readability
   - Comments for complex logic sections
`;

export const SANDBOX_REQUIREMENTS = `
**CRITICAL CODE FORMAT REQUIREMENTS:**
1. DO NOT use import/export statements - they cause sandbox errors
2. Define the component as: \`const Component = () => { ... }\` or \`function Component() { ... }\`
3. Use React hooks directly: \`const { useState, useEffect } = React;\`
4. NO import statements for React or React hooks
5. Return ONLY the component code without explanations or markdown

**SYNTAX REQUIREMENTS (CRITICAL FOR BABEL):**
- ALWAYS end statements with semicolons, especially after complex operations
- Example: \`setData(data.map(item => item.value));\` (note the semicolon)
- For array operations: \`setStatsData(statsData.map(n => Math.min(100, n + 10)));\`
- Proper function termination: Every function call and assignment must end with semicolon

**ERROR HANDLING REQUIREMENTS:**
- When setting error states, ALWAYS use error.message, not the error object directly
- Example: \`catch(err => setError(err.message))\` NOT \`catch(err => setError(err))\`
- When rendering errors: \`{error && <p>{error}</p>}\` (as string) NOT \`{errorObject}\`
- For API calls, use mock data patterns: \`Promise.resolve({data: []})\` instead of real APIs

**MOCK DATA PATTERNS (Important for Sandbox):**
- Replace real API calls with: \`Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })\`
- Use setTimeout for simulating async operations: \`setTimeout(() => setData(mockData), 1000)\`
- Never use real external APIs that cause CORS issues in sandbox environment
`;

export const COMPONENT_INSTRUCTIONS = `
COMPONENT INSTRUCTIONS:
- Generate COMPLETE, PRODUCTION-READY components
- Include ALL necessary state management and event handlers
- Add comprehensive form validation where applicable
- Implement responsive design patterns
- Use modern React patterns and best practices
- Ensure components are self-contained and fully functional
`;

/**
 * Generate system prompt for AI providers
 * @param {string} sanitizedPrompt - The user's sanitized prompt
 * @param {string} provider - The AI provider type ('puter', 'ollama', 'grok', 'openai')
 * @returns {string} - Complete system prompt
 */
export const generateSystemPrompt = (sanitizedPrompt, provider = "default") => {
  const basePrompt = `You are an expert React developer specializing in creating production-ready, feature-complete UI components with Tailwind CSS.

${COMPONENT_CAPABILITIES}

${GENERATION_STANDARDS}

${COMPONENT_INSTRUCTIONS}

${SANDBOX_REQUIREMENTS}

USER REQUEST: ${sanitizedPrompt}

Create a comprehensive, feature-complete React component that fully implements the requested functionality. Include all necessary state, validation, styling, and interactivity. Make it production-ready and professional.

IMPORTANT: Return ONLY the complete React component code starting with component definition. No explanations, markdown formatting, import statements, or additional text.`;

  return basePrompt;
};

/**
 * Generate enhanced prompt analysis for complex components
 * @returns {string} - Enhanced prompt analysis text
 */
export const getEnhancedPromptAnalysis = () => `
ENHANCED PROMPT ANALYSIS:
- For "form" or "login": Create complete, functional forms with validation
- For "dashboard": Include sidebar, navigation, and content areas
- For "table": Add sorting, filtering, and data manipulation features
- For "card": Create feature-rich card components with actions
- For "modal": Include overlay, animation, and proper state management
- For "navigation": Build complete nav systems with responsive behavior
- For "authentication": Include proper form validation and error states
- For "profile": Create comprehensive user profile interfaces
- For "search": Build advanced search with filters and results display
`;
