import { processComponentCode } from "./src/utils/codeProcessor.js";

const testCode = `const MovieDashboard = () => {
  return (
    <div jsx={true} style={true} className={false} responsive={true} variant="primary">
      <style jsx={true}>
        .container { color: red; }
      </style>
      <span loading={true} size={42}>Test</span>
    </div>
  );
};`;

console.log("=== JSX ATTRIBUTE FIX TEST ===\n");
console.log("Original code:");
console.log(testCode);
console.log("\n" + "=".repeat(60) + "\n");

const fixedCode = processComponentCode(testCode);
console.log("Fixed code:");
console.log(fixedCode);

console.log("\n" + "=".repeat(60) + "\n");
console.log("✅ jsx attributes should be removed");
console.log("✅ style={true} should be converted to style={{}} or removed");
console.log('✅ className={false} should be converted to className="false"');
console.log(
  "✅ responsive, loading, size should be converted to data-* attributes"
);
