/**
 * Component code analyzer for identifying and fixing structural issues
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

/**
 * Analyze component code for potential issues and provide fixes
 * @param {string} code - Component code to analyze
 * @returns {Object} - Analysis result with fixes
 */
export const analyzeComponentCode = (code) => {
  const analysis = {
    issues: [],
    fixes: [],
    structureType: "unknown",
    requiredFunctions: [],
    hasReactHooks: false,
    isComplete: false,
  };

  if (!code || !code.trim()) {
    analysis.issues.push("Empty code provided");
    return analysis;
  }

  // Analyze component structure
  analysis.structureType = detectComponentStructure(code);

  // Find referenced functions in JSX
  analysis.requiredFunctions = findReferencedFunctions(code);

  // Check for React hooks usage
  analysis.hasReactHooks = detectReactHooks(code);

  // Check if all referenced functions are defined
  const undefinedFunctions = findUndefinedFunctions(
    code,
    analysis.requiredFunctions
  );

  if (undefinedFunctions.length > 0) {
    analysis.issues.push(
      `Undefined functions: ${undefinedFunctions.join(", ")}`
    );
    analysis.fixes.push(
      `Create stub implementations for: ${undefinedFunctions.join(", ")}`
    );
  }

  // Check component completeness
  analysis.isComplete = isComponentComplete(code);

  return analysis;
};

/**
 * Detect the type of component structure
 */
const detectComponentStructure = (code) => {
  if (/const\s+\w+\s*=\s*\([^)]*\)\s*=>/.test(code)) {
    return "arrow-function";
  }
  if (/function\s+\w+\s*\([^)]*\)/.test(code)) {
    return "function-declaration";
  }
  if (code.includes("<") && code.includes(">")) {
    return "jsx-only";
  }
  return "unknown";
};

/**
 * Find functions referenced in JSX event handlers
 */
const findReferencedFunctions = (code) => {
  const functions = new Set();

  // Match event handlers like onClick={handleClick}, onSubmit={handleSubmit}
  const eventHandlerRegex = /\s(on[A-Z]\w*)\s*=\s*\{\s*(\w+)\s*\}/g;
  let match;

  while ((match = eventHandlerRegex.exec(code)) !== null) {
    functions.add(match[2]);
  }

  // Match function calls in JSX like {handleFunction()}
  const functionCallRegex = /\{\s*(\w+)\s*\(\s*\)\s*\}/g;

  while ((match = functionCallRegex.exec(code)) !== null) {
    // Skip common JSX expressions
    if (
      ![
        "map",
        "filter",
        "forEach",
        "toString",
        "toLowerCase",
        "toUpperCase",
      ].includes(match[1])
    ) {
      functions.add(match[1]);
    }
  }

  return Array.from(functions);
};

/**
 * Check if React hooks are used
 */
const detectReactHooks = (code) => {
  const hookPatterns = [
    /useState/,
    /useEffect/,
    /useCallback/,
    /useMemo/,
    /useRef/,
    /useContext/,
  ];

  return hookPatterns.some((pattern) => pattern.test(code));
};

/**
 * Find functions that are referenced but not defined
 */
const findUndefinedFunctions = (code, referencedFunctions) => {
  const undefinedFunctions = [];

  for (const funcName of referencedFunctions) {
    // Check if function is defined in various patterns
    const patterns = [
      new RegExp(`const\\s+${funcName}\\s*=`),
      new RegExp(`function\\s+${funcName}\\s*\\(`),
      new RegExp(`${funcName}\\s*:\\s*\\(`), // Object method
      new RegExp(`${funcName}\\s*\\(.*?\\)\\s*{`), // Function expression
    ];

    const isDefined = patterns.some((pattern) => pattern.test(code));

    if (!isDefined) {
      undefinedFunctions.push(funcName);
    }
  }

  return undefinedFunctions;
};

/**
 * Check if component structure is complete
 */
const isComponentComplete = (code) => {
  // Must have component definition
  const hasComponent = /const\s+\w+\s*=|function\s+\w+/.test(code);

  // Must have return statement if it's a function
  const hasReturn = /return\s*[\(\<]/.test(code);

  // Basic JSX structure
  const hasJSX = /<\w+/.test(code);

  return hasComponent && (hasReturn || hasJSX);
};

/**
 * Generate stub implementations for missing functions
 * @param {Array} functionNames - Names of functions to create stubs for
 * @returns {string} - Stub implementations
 */
export const generateFunctionStubs = (functionNames) => {
  if (!functionNames || functionNames.length === 0) return "";

  const stubs = functionNames.map((funcName) => {
    // Determine likely function purpose based on name
    let stubBody = `console.log('${funcName} called');`;

    if (funcName.includes("submit") || funcName.includes("Submit")) {
      stubBody = `
    e?.preventDefault();
    console.log('Form submitted:', e);
    // TODO: Implement form submission logic`;
    } else if (funcName.includes("click") || funcName.includes("Click")) {
      stubBody = `
    console.log('${funcName} clicked');
    // TODO: Implement click handler`;
    } else if (funcName.includes("change") || funcName.includes("Change")) {
      stubBody = `
    console.log('${funcName} changed:', e?.target?.value);
    // TODO: Implement change handler`;
    }

    return `  const ${funcName} = (e) => {${stubBody}
  };`;
  });

  return "\n  // Auto-generated function stubs:\n" + stubs.join("\n") + "\n";
};

/**
 * Fix component code by adding missing functions and fixing structure
 * @param {string} code - Original component code
 * @returns {string} - Fixed component code
 */
export const fixComponentCode = (code) => {
  const analysis = analyzeComponentCode(code);
  let fixedCode = code;

  // Fix common JSX attribute issues
  fixedCode = fixedCode.replace(/\sclass=/g, " className=");
  fixedCode = fixedCode.replace(/\sfor=/g, " htmlFor=");

  // Fix event handlers that might be missing proper function calls
  fixedCode = fixedCode.replace(/onClick=(\w+)/g, "onClick={$1}");
  fixedCode = fixedCode.replace(/onSubmit=(\w+)/g, "onSubmit={$1}");
  fixedCode = fixedCode.replace(/onChange=(\w+)/g, "onChange={$1}");

  // Fix string concatenation in JSX
  fixedCode = fixedCode.replace(
    /\{"([^"]*)" \+ (\w+) \+ "([^"]*)"\}/g,
    "{`$1$${$2}$3`}"
  );

  // If there are undefined functions, add stubs
  const undefinedFunctions = findUndefinedFunctions(
    code,
    analysis.requiredFunctions
  );
  if (undefinedFunctions.length > 0) {
    const stubs = generateFunctionStubs(undefinedFunctions);

    // Insert stubs at the beginning of the component function body
    const componentMatch = fixedCode.match(
      /(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{|function\s+\w+\s*\([^)]*\)\s*{)/
    );
    if (componentMatch) {
      const insertPoint = componentMatch.index + componentMatch[0].length;
      fixedCode =
        fixedCode.slice(0, insertPoint) + stubs + fixedCode.slice(insertPoint);
    }
  }

  // Fix common state usage issues
  if (fixedCode.includes("useState") && !fixedCode.includes("const [")) {
    console.log("Detected useState without proper destructuring");
    // This would need more sophisticated parsing to fix automatically
  }

  return fixedCode;
};
