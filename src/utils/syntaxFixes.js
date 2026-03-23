/**
 * Consolidated syntax fixes utility
 * Centralizes all regex-based syntax transformations
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

/**
 * Fix common syntax issues that cause Babel parsing errors
 * @param {string} code - Code to fix
 * @returns {string} - Fixed code
 */
export const fixCommonSyntaxIssues = (code) => {
  let fixedCode = code;

  // First, fix malformed patterns that our replacements might have created
  fixedCode = fixedCode
    // Fix double semicolons
    .replace(/;;+/g, ";")
    // Fix comma followed by semicolon
    .replace(/,\s*;/g, ";")
    // Fix malformed Promise patterns
    .replace(/Promise\.resolve\(\[\]\)\s*;\s*\}\)/g, "Promise.resolve([])})")
    // Fix extra commas before closing braces/brackets
    .replace(/,\s*([}\]])/g, "$1")
    // Fix empty string followed by comma and semicolon pattern
    .replace(/""\s*,\s*;/g, '""');

  // Fix missing semicolons after common patterns (but avoid double semicolons)
  const semicolonPatterns = [
    // setState with complex operations (only if not already ending with semicolon)
    /(\bset\w+\([^)]*\))\s*(?=\n)(?![^;]*;)/g,
    // Variable assignments (only if not already ending with semicolon)
    /(\bconst\s+\w+\s*=\s*[^;]+)\s*(?=\n)(?![^;]*;)/g,
  ];

  semicolonPatterns.forEach((pattern) => {
    fixedCode = fixedCode.replace(pattern, "$1;");
  });

  // Fix specific problematic patterns
  fixedCode = fixedCode
    // Fix array map operations without proper termination (avoid double semicolons)
    .replace(/(setStatsData\([^)]+\.map\([^)]+\)[^)]*\))\s*(?!;)(?=\n)/g, "$1;")
    // Fix callback functions without proper semicolons (avoid double semicolons)
    .replace(/(\}, \[\w+\])\s*(?!;)(?=\n)/g, "$1;")
    // Fix invalid useState destructuring with boolean literals
    .replace(
      /const\s*\[\s*(true|false|null|undefined)\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\]\s*=\s*useState\s*\(/g,
      "const [is$2Value, $2] = useState("
    )
    // Fix useState destructuring where first element is invalid identifier
    .replace(
      /const\s*\[\s*([0-9]+|"[^"]*"|'[^']*')\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\]\s*=\s*useState\s*\(/g,
      "const [value, $2] = useState("
    )
    // Fix destructuring with non-identifier patterns
    .replace(
      /const\s*\[\s*([^a-zA-Z_$][^,]*)\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\]\s*=\s*useState\s*\(/g,
      "const [state, $2] = useState("
    );

  return fixedCode;
};

/**
 * Fix HTML attribute issues like non-boolean attributes receiving boolean values
 * @param {string} code - Code to fix
 * @returns {string} - Fixed code
 */
export const fixHtmlAttributeIssues = (code) => {
  let fixedCode = code;

  // First, remove jsx attributes completely since they're not valid HTML
  fixedCode = fixedCode.replace(/\s+jsx=\{[^}]*\}/g, "");
  fixedCode = fixedCode.replace(/\s+jsx=["'][^"']*["']/g, "");

  // Fix common non-boolean attributes that incorrectly receive boolean values
  const nonBooleanAttributes = [
    "class",
    "id",
    "title",
    "alt",
    "src",
    "href",
    "value",
    "placeholder",
    "name",
    "role",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "data-testid",
    "key",
    "ref",
    "width",
    "height",
    "size",
    "color",
    "border",
    "margin",
    "padding",
    // Note: jsx is handled separately above, style is handled separately below
  ];

  nonBooleanAttributes.forEach((attr) => {
    // Fix patterns like jsx={true} or jsx={false} to jsx="true" or jsx="false"
    fixedCode = fixedCode.replace(
      new RegExp(`\\b${attr}=\\{(true|false)\\}`, "g"),
      `${attr}="$1"`
    );

    // Fix patterns like jsx={someVariable} where someVariable might be boolean
    // This is more complex, so we'll handle common cases
    fixedCode = fixedCode.replace(
      new RegExp(`\\b${attr}=\\{([a-zA-Z_$][a-zA-Z0-9_$]*)\\}`, "g"),
      `${attr}={typeof $1 === 'boolean' ? $1.toString() : $1}`
    );
  });

  // Fix spread operators that might pass invalid props to HTML elements
  fixedCode = fixedCode.replace(
    /(<(?:div|span|p|h[1-6]|section|article|header|footer|nav|main|aside|button|input|textarea|select|option|label|form|fieldset|legend|table|thead|tbody|tfoot|tr|td|th|ul|ol|li|dl|dt|dd|figure|figcaption|img|video|audio|canvas|svg|iframe)[^>]*)\{\.\.\.([^}]+)\}/g,
    (match, elementStart, spreadVar) => {
      // Filter out problematic props for HTML elements
      return `${elementStart}{...Object.fromEntries(Object.entries(${spreadVar}).filter(([key, value]) => typeof value !== 'object' || key.startsWith('data-') || key.startsWith('aria-')))}`;
    }
  );

  // Fix specific jsx attribute pattern that commonly causes issues - remove it completely
  fixedCode = fixedCode.replace(/\s+jsx=\{[^}]*\}/g, "");

  // Also remove jsx attribute in string form
  fixedCode = fixedCode.replace(/\s+jsx=["'][^"']*["']/g, "");

  // Fix style prop issues - ensure style is an object, not a boolean
  fixedCode = fixedCode.replace(/style=\{(true|false)\}/g, "style={{}}");

  // Fix className being passed as boolean
  fixedCode = fixedCode.replace(
    /className=\{(true|false)\}/g,
    'className="$1"'
  );

  // Fix common patterns where variables might be undefined or boolean when they should be strings
  fixedCode = fixedCode.replace(
    /(title|alt|placeholder|value)=\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}/g,
    '$1={typeof $2 === "string" ? $2 : $2?.toString() || ""}'
  );

  // Fix common prop drilling issues where objects might be passed to HTML elements
  fixedCode = fixedCode.replace(
    /(<(?:div|span|p|h[1-6]|button|input|textarea|select|label)[^>]*)\s+([a-zA-Z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)*?)=\{([^}]+)\}/g,
    (match, elementStart, propName, propValue) => {
      // If it looks like a camelCase prop that shouldn't be on HTML elements, convert to data attribute
      if (
        /[A-Z]/.test(propName) &&
        !propName.startsWith("aria") &&
        !propName.startsWith("data")
      ) {
        return `${elementStart} data-${propName.toLowerCase()}={${propValue}}`;
      }
      return match;
    }
  );

  // Fix styled-components or CSS-in-JS patterns that might add jsx attributes
  fixedCode = fixedCode.replace(
    /jsx=\{([^}]*css[^}]*|[^}]*styled[^}]*|[^}]*emotion[^}]*)\}/g,
    'data-styled="true"'
  );

  // Remove or fix any remaining jsx attributes that aren't valid HTML
  fixedCode = fixedCode.replace(/\s+jsx=\{[^}]*\}/g, "");

  // Fix css prop being passed to HTML elements (common with styled-components/emotion)
  fixedCode = fixedCode.replace(
    /(<(?:div|span|p|h[1-6]|button|input|textarea|select|label)[^>]*)\s+css=\{([^}]+)\}/g,
    "$1 style={$2}"
  );

  // Fix common component props that get mistakenly passed to HTML elements
  const componentProps = [
    "responsive",
    "variant",
    "size",
    "theme",
    "loading",
    "disabled",
    "active",
    "selected",
  ];
  componentProps.forEach((prop) => {
    fixedCode = fixedCode.replace(
      new RegExp(
        `(<(?:div|span|p|h[1-6]|button|input|textarea|select|label)[^>]*)\\s+${prop}=\\{([^}]+)\\}`,
        "g"
      ),
      `$1 data-${prop}={$2}`
    );
  });

  return fixedCode;
};

/**
 * Fix error object rendering issues that cause "Objects are not valid as React child" errors
 * @param {string} code - Code to fix
 * @returns {string} - Fixed code
 */
export const fixErrorObjectRendering = (code) => {
  let processedCode = code;

  // 1. Fix Error object rendering - replace direct error rendering with error.message
  processedCode = processedCode.replace(
    /\{error\s*&&\s*<([^>]+)>\{error\}<\/\1>/g,
    "{error && <$1>{error.message || String(error)}</$1>}"
  );

  // 2. Fix patterns like {someErrorVariable} to {someErrorVariable?.message || String(someErrorVariable)}
  processedCode = processedCode.replace(
    /\{([a-zA-Z_$][a-zA-Z0-9_$]*(?:Error|error|err))\}/g,
    "{$1?.message || String($1)}"
  );

  // 3. Fix common state patterns where objects might be rendered
  processedCode = processedCode.replace(
    /const\s+\[([a-zA-Z_$][a-zA-Z0-9_$]*(?:Error|error|err)),\s*set[A-Z][a-zA-Z0-9_$]*\]\s*=\s*useState\(null\)/g,
    'const [$1, set$1] = useState("") // Fixed: String instead of null to prevent object rendering'
  );

  // 4. Add safety wrapper for any remaining error rendering patterns
  processedCode = processedCode.replace(
    /\{([a-zA-Z_$][a-zA-Z0-9_$]*)\s*&&\s*<([^>]+)>\{([a-zA-Z_$][a-zA-Z0-9_$]*)\}<\/\2>/g,
    '{$1 && <$2>{typeof $3 === "object" ? ($3?.message || JSON.stringify($3)) : String($3)}</$2>}'
  );

  return processedCode;
};

/**
 * Replace problematic API calls with mock data to prevent CORS issues
 * @param {string} code - Code to fix
 * @returns {string} - Fixed code
 */
export const fixApiCalls = (code) => {
  let processedCode = code;

  // Replace external fetch calls with mock data (whitelist safe CDNs)
  processedCode = processedCode.replace(
    /fetch\s*\(\s*['"`]https?:\/\/(?!unpkg\.com|cdn\.tailwindcss\.com)[^'"`]*['"`]/g,
    "Promise.resolve({ ok: true, json: () => Promise.resolve([]) })"
  );

  // Fix useEffect patterns that commonly cause issues
  processedCode = processedCode.replace(
    /catch\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\)\s*=>\s*set([A-Z][a-zA-Z0-9_$]*)\(\1\)/g,
    "catch($1 => set$2($1?.message || String($1)))"
  );

  return processedCode;
};

/**
 * Clean up import statements for sandbox compatibility
 * @param {string} code - Code to fix
 * @returns {string} - Fixed code
 */
export const cleanupImports = (code) => {
  let processedCode = code;

  // Remove React imports (React is available globally in sandbox)
  processedCode = processedCode.replace(
    /import\s+.*?from\s+['"]react['"];?\n?/g,
    ""
  );
  processedCode = processedCode.replace(
    /import\s+React.*?from\s+['"]react['"];?\n?/g,
    ""
  );

  // Remove React hook destructuring imports (hooks are available globally in sandbox)
  processedCode = processedCode.replace(
    /import\s*\{\s*[^}]*useState[^}]*\}\s*from\s*['"]react['"];?\n?/g,
    ""
  );

  // Remove React Router imports and replace Link with span or div
  processedCode = processedCode.replace(
    /import\s+.*?Link.*?from\s+['"]react-router-dom['"];?\n?/g,
    ""
  );
  processedCode = processedCode.replace(
    /import\s*\{\s*[^}]*Link[^}]*\}\s*from\s*['"]react-router-dom['"];?\n?/g,
    ""
  );

  // Remove other imports that won't work in sandbox (but keep a whitelist if needed)
  const safeImports = ["react", "react-dom"];
  processedCode = processedCode.replace(
    /import\s+.*?from\s+['"](?!(?:react|react-dom)$)[^'"]+['"];?\n?/g,
    ""
  );

  // Remove React destructuring declarations that might be in the code
  processedCode = processedCode.replace(
    /const\s*\{\s*[^}]*useState[^}]*\}\s*=\s*React;?\n?/g,
    ""
  );

  return processedCode;
};

/**
 * Add proper export/global assignment for sandbox compatibility
 * @param {string} code - Code to process
 * @returns {string} - Code with proper export
 */
export const addSandboxExport = (code) => {
  let processedCode = code;

  // Ensure code has an export default if it doesn't, but for sandbox use a different approach
  if (
    !processedCode.includes("export default") &&
    !processedCode.includes("module.exports")
  ) {
    // Try to find the component name and add export
    const componentMatch = processedCode.match(/(?:const|function)\s+(\w+)/);
    if (componentMatch) {
      const componentName = componentMatch[1];
      if (!processedCode.includes(`export default ${componentName}`)) {
        // Instead of ES6 export, assign to window for sandbox compatibility
        processedCode += `\n\n// Make component available globally for sandbox\nwindow.GeneratedComponent = ${componentName};`;
      }
    }
  } else {
    // If there's already an export, convert it to window assignment
    processedCode = processedCode.replace(
      /export\s+default\s+(\w+);?/,
      "window.GeneratedComponent = $1;"
    );
  }

  return processedCode;
};

/**
 * Fix React Router Link components and other missing dependencies
 * @param {string} code - Code to fix
 * @returns {string} - Fixed code
 */
export const fixMissingDependencies = (code) => {
  let processedCode = code;

  // Replace Link component with span that looks like a link
  processedCode = processedCode.replace(
    /<Link\s+to\s*=\s*{[^}]*}\s*([^>]*)>/g,
    '<span style={{color: "#3b82f6", cursor: "pointer", textDecoration: "underline"}} $1>'
  );
  processedCode = processedCode.replace(
    /<Link\s+to\s*=\s*"[^"]*"\s*([^>]*)>/g,
    '<span style={{color: "#3b82f6", cursor: "pointer", textDecoration: "underline"}} $1>'
  );
  processedCode = processedCode.replace(/<\/Link>/g, "</span>");

  // Fix basic Link usage without props
  processedCode = processedCode.replace(
    /<Link([^>]*)>/g,
    '<span style={{color: "#3b82f6", cursor: "pointer", textDecoration: "underline"}}$1>'
  );

  // Replace NavLink with span
  processedCode = processedCode.replace(
    /<NavLink\s+[^>]*>/g,
    '<span style={{color: "#3b82f6", cursor: "pointer", textDecoration: "underline"}}>'
  );
  processedCode = processedCode.replace(/<\/NavLink>/g, "</span>");

  return processedCode;
};

/**
 * Fix undefined variables that are commonly generated by AI
 * @param {string} code - Code to fix
 * @returns {string} - Fixed code
 */
export const fixUndefinedVariables = (code) => {
  let processedCode = code;

  // Fix common undefined variables with reasonable defaults
  const commonUndefinedVars = [
    { pattern: /\bactiveLink\b/g, replacement: '"home"' },
    {
      pattern: /\bcurrentUser\b/g,
      replacement: '{ name: "User", avatar: "/default-avatar.png" }',
    },
    {
      pattern: /\buser\b(?=\?\.)/g,
      replacement: '{ name: "User", email: "user@example.com" }',
    },
    { pattern: /\btheme\b(?=\s*===)/g, replacement: '"light"' },
    { pattern: /\bisLoggedIn\b/g, replacement: "true" },
    { pattern: /\bisLoading\b/g, replacement: "false" },
    { pattern: /\berror\b(?=\s*&&)/g, replacement: "null" },
  ];

  commonUndefinedVars.forEach(({ pattern, replacement }) => {
    // Only replace if the variable isn't already defined in the component
    const hasDefinition = new RegExp(
      `(?:const|let|var)\\s+${pattern.source
        .replace(/\\b/g, "")
        .replace(/\?/g, "\\?")}`
    ).test(processedCode);
    if (!hasDefinition) {
      processedCode = processedCode.replace(pattern, replacement);
    }
  });

  // Fix useState hooks that reference undefined variables
  processedCode = processedCode.replace(
    /const\s+\[([^,]+),\s*set[A-Z][a-zA-Z0-9]*\]\s*=\s*useState\(([^)]*)\)/g,
    (match, varName, defaultValue) => {
      // If the default value seems undefined, provide a reasonable default
      if (defaultValue.trim() === "" || defaultValue === "undefined") {
        if (varName.toLowerCase().includes("loading")) {
          return match.replace(defaultValue, "false");
        } else if (varName.toLowerCase().includes("error")) {
          return match.replace(defaultValue, "null");
        } else if (
          varName.toLowerCase().includes("data") ||
          varName.toLowerCase().includes("items")
        ) {
          return match.replace(defaultValue, "[]");
        } else {
          return match.replace(defaultValue, '""');
        }
      }
      return match;
    }
  );

  return processedCode;
};

/**
 * Fix external image URLs to use placeholder images
 * @param {string} code - Code to fix
 * @returns {string} - Fixed code
 */
export const fixExternalImages = (code) => {
  let processedCode = code;

  // Replace via.placeholder.com with data URIs (since via.placeholder.com is blocked)
  processedCode = processedCode.replace(
    /https?:\/\/via\.placeholder\.com\/([^"'&\s]+)/g,
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=="
  );

  // Replace other common placeholder services with safe alternatives
  processedCode = processedCode.replace(
    /https?:\/\/picsum\.photos\/([^"'&\s]+)/g,
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=="
  );

  // Replace external URLs with safe placeholder
  processedCode = processedCode.replace(
    /src\s*=\s*["']https?:\/\/[^"']+["']/g,
    'src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=="'
  );

  return processedCode;
};

/**
 * Final cleanup of common syntax issues
 * @param {string} code - Code to clean up
 * @returns {string} - Cleaned code
 */
export const finalCleanup = (code) => {
  return (
    code
      // Remove double semicolons
      .replace(/;;+/g, ";")
      // Fix malformed patterns like "",;
      .replace(/["']\s*,\s*;/g, '""')
      // Fix patterns like } ;})
      .replace(/\}\s*;\s*\}/g, "}}")
      // Clean up any trailing spaces before semicolons
      .replace(/\s+;/g, ";")
      // Remove excessive whitespace
      .replace(/\n\s*\n\s*\n/g, "\n\n")
  );
};
