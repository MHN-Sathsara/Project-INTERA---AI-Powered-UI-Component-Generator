/**
 * Advanced syntax validation utilities for React components
 * Provides detailed syntax checking and error reporting
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

/**
 * Comprehensive syntax validation for React components
 * @param {string} code - Component code to validate
 * @returns {Object} - Detailed validation results
 */
export const validateReactSyntax = (code) => {
  const errors = [];
  const warnings = [];
  const suggestions = [];

  if (!code || !code.trim()) {
    errors.push("No code provided for validation");
    return { isValid: false, errors, warnings, suggestions };
  }

  // Check for balanced delimiters
  const delimiterChecks = [
    { open: "{", close: "}", name: "braces" },
    { open: "(", close: ")", name: "parentheses" },
    { open: "[", close: "]", name: "square brackets" },
  ];

  delimiterChecks.forEach(({ open, close, name }) => {
    const openCount = (code.match(new RegExp("\\" + open, "g")) || []).length;
    const closeCount = (code.match(new RegExp("\\" + close, "g")) || []).length;

    if (openCount !== closeCount) {
      const difference = Math.abs(openCount - closeCount);

      // Only treat as error if there's a significant mismatch (more than 2)
      if (difference > 2) {
        errors.push(
          `Mismatched ${name}: ${openCount} opening, ${closeCount} closing`
        );
      } else {
        // Minor mismatches are often due to string literals or comments, treat as warning
        warnings.push(
          `Minor ${name} mismatch: ${openCount} opening, ${closeCount} closing (might be in strings/comments)`
        );
      }
    }
  });

  // JSX validation
  if (code.includes("<") && code.includes(">")) {
    validateJSX(code, errors, warnings, suggestions);
  }

  // React hooks validation
  validateHooks(code, errors, warnings, suggestions);

  // Event handlers validation
  validateEventHandlers(code, errors, warnings, suggestions);

  // Common React patterns validation
  validateReactPatterns(code, errors, warnings, suggestions);

  return {
    isValid: errors.length === 0,
    hasWarnings: warnings.length > 0,
    errors,
    warnings,
    suggestions,
  };
};

/**
 * Validate JSX syntax and structure
 */
const validateJSX = (code, errors, warnings, suggestions) => {
  // Check for self-closing tags that should be properly closed
  const selfClosingTags = ["input", "img", "br", "hr", "meta", "link"];
  selfClosingTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}[^>]*(?<!/)>`, "gi");
    if (regex.test(code)) {
      warnings.push(`<${tag}> should be self-closing: <${tag} />`);
    }
  });

  // Check for adjacent JSX elements without wrapper
  const jsxBlocks = code.match(/return\s*\(\s*\n[\s\S]*?\n\s*\)/g);
  if (jsxBlocks) {
    jsxBlocks.forEach((block) => {
      const lines = block.split("\n").slice(1, -1); // Remove return( and closing )
      const nonEmptyLines = lines.filter(
        (line) => line.trim() && !line.trim().startsWith("//")
      );
      if (nonEmptyLines.length > 1) {
        const firstLine = nonEmptyLines[0].trim();
        const secondLine = nonEmptyLines[1].trim();
        if (firstLine.startsWith("<") && secondLine.startsWith("<")) {
          errors.push(
            "Adjacent JSX elements must be wrapped in an enclosing tag or Fragment"
          );
          suggestions.push("Wrap elements in <div>, <Fragment>, or <>...</>");
        }
      }
    });
  }

  // Check for incorrect attribute names
  const attributeChecks = [
    {
      wrong: "class=",
      correct: "className=",
      message: "Use className instead of class in JSX",
    },
    {
      wrong: "for=",
      correct: "htmlFor=",
      message: "Use htmlFor instead of for in JSX",
    },
  ];

  attributeChecks.forEach(({ wrong, correct, message }) => {
    if (code.includes(wrong)) {
      errors.push(message);
      suggestions.push(`Replace ${wrong} with ${correct}`);
    }
  });

  // Check for unescaped JSX content
  if (code.includes("{/*") && code.includes("*/}")) {
    // This is fine - JSX comments
  } else if (code.includes("/*") && code.includes("*/")) {
    warnings.push(
      "Regular comments inside JSX may cause issues - use {/* comment */} instead"
    );
  }
};

/**
 * Validate React hooks usage
 */
const validateHooks = (code, errors, warnings, suggestions) => {
  const hooks = [
    "useState",
    "useEffect",
    "useCallback",
    "useMemo",
    "useRef",
    "useContext",
  ];

  hooks.forEach((hook) => {
    if (code.includes(hook)) {
      // Check if hooks are at the top level (simplified check)
      const hookUsages = [...code.matchAll(new RegExp(`\\b${hook}\\b`, "g"))];

      hookUsages.forEach((match) => {
        const beforeHook = code.substring(0, match.index);
        const lines = beforeHook.split("\n");
        const currentLine = lines[lines.length - 1];

        // Check if inside a condition, loop, or nested function
        if (
          beforeHook.includes("if (") ||
          beforeHook.includes("for (") ||
          beforeHook.includes("while (") ||
          currentLine.includes("function")
        ) {
          errors.push(
            `${hook} cannot be called inside loops, conditions, or nested functions`
          );
          suggestions.push(`Move ${hook} to the top level of your component`);
        }
      });

      // Specific hook validations
      if (hook === "useState") {
        if (code.includes("useState(") && !code.includes("const [")) {
          warnings.push(
            "useState should be destructured: const [state, setState] = useState()"
          );
          suggestions.push("Use array destructuring with useState");
        }
      }

      if (hook === "useEffect") {
        const effectPattern =
          /useEffect\s*\(\s*\(\s*\)\s*=>\s*{[\s\S]*?}\s*,\s*\[([^\]]*)\]\s*\)/g;
        const effects = [...code.matchAll(effectPattern)];

        effects.forEach((effect) => {
          const deps = effect[1].trim();
          if (!deps) {
            warnings.push(
              "useEffect with empty dependency array runs only once"
            );
          }
        });
      }
    }
  });
};

/**
 * Validate event handlers
 */
const validateEventHandlers = (code, errors, warnings, suggestions) => {
  const eventHandlers = [...code.matchAll(/on[A-Z]\w*\s*=\s*\{([^}]+)\}/g)];

  eventHandlers.forEach((handler) => {
    const handlerCode = handler[1].trim();

    // Check for function calls without parameters when they should have them
    if (
      handlerCode.includes("(") &&
      !handlerCode.includes("=>") &&
      !handlerCode.includes("function")
    ) {
      const functionName = handlerCode.split("(")[0].trim();
      if (
        !code.includes(`const ${functionName}`) &&
        !code.includes(`function ${functionName}`)
      ) {
        errors.push(`Function '${functionName}' is not defined`);
        suggestions.push(
          `Define the ${functionName} function or use an arrow function`
        );
      }
    }

    // Check for direct function calls that should be arrow functions
    if (
      !handlerCode.includes("=>") &&
      !handlerCode.includes("()") &&
      handlerCode.match(/^\w+$/)
    ) {
      // Only warn if it's actually a problem - check if it's a function reference
      const functionName = handlerCode.trim();
      if (
        !code.includes(`const ${functionName} = `) &&
        !code.includes(`function ${functionName}`) &&
        !code.includes(`const ${functionName}=(`) &&
        !code.includes(`const ${functionName} =()`) &&
        !functionName.startsWith("handle") && // Common function naming pattern
        !functionName.startsWith("on") // Another common pattern
      ) {
        warnings.push(
          `Event handler '${handlerCode}' should probably be a function call: {${handlerCode}()}`
        );
      }
    }
  });
};

/**
 * Validate common React patterns
 */
const validateReactPatterns = (code, errors, warnings, suggestions) => {
  // Check for component naming convention
  const componentMatch = code.match(
    /(?:const|function)\s+([A-Za-z][A-Za-z0-9]*)/
  );
  if (componentMatch) {
    const componentName = componentMatch[1];
    if (componentName[0] !== componentName[0].toUpperCase()) {
      warnings.push(
        `Component name '${componentName}' should start with uppercase`
      );
      suggestions.push(
        `Rename to '${componentName[0].toUpperCase() + componentName.slice(1)}'`
      );
    }
  }

  // Check for missing key prop in lists
  if (code.includes(".map(") && !code.includes("key=")) {
    warnings.push("Items in lists should have a unique key prop");
    suggestions.push(
      "Add key={unique-identifier} to each item in the map function"
    );
  }

  // Check for direct state mutations
  if (
    code.includes(".push(") ||
    code.includes(".pop(") ||
    code.includes(".splice(")
  ) {
    warnings.push("Avoid direct state mutations - use immutable updates");
    suggestions.push(
      "Use spread operator or Array methods that return new arrays"
    );
  }

  // Check for missing return statement
  if (code.includes("const ") && code.includes("=> {") && code.includes("<")) {
    if (!code.includes("return") && !code.includes("=> (")) {
      errors.push(
        "Component function should return JSX or have a return statement"
      );
      suggestions.push(
        'Add "return" statement before JSX or use arrow function shorthand'
      );
    }
  }
};

/**
 * Get suggestions for fixing common syntax issues
 * @param {Object} validationResult - Result from validateReactSyntax
 * @returns {Array} - Array of actionable suggestions
 */
export const getSyntaxFixSuggestions = (validationResult) => {
  const { errors, warnings } = validationResult;
  const suggestions = [];

  errors.forEach((error) => {
    if (error.includes("Mismatched braces")) {
      suggestions.push("Check for missing opening or closing braces { }");
    } else if (error.includes("Adjacent JSX elements")) {
      suggestions.push(
        "Wrap adjacent elements in <div> or React Fragment <></> "
      );
    } else if (error.includes("className")) {
      suggestions.push(
        "Replace all instances of class= with className= in JSX"
      );
    }
  });

  warnings.forEach((warning) => {
    if (warning.includes("useState")) {
      suggestions.push("Use const [state, setState] = useState(initialValue)");
    } else if (warning.includes("key prop")) {
      suggestions.push("Add key prop to list items: <li key={item.id}>");
    }
  });

  return [...new Set(suggestions)]; // Remove duplicates
};
