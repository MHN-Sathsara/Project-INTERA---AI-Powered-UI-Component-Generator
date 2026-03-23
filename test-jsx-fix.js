// Test file to verify jsx attribute fixes
import { processComponentCode } from "./src/utils/codeProcessor.js";

// Test code that would cause jsx attribute warnings
const problemCode = `
const MovieDashboard = () => {
  return (
    <div jsx={true} style={true} className={false}>
      <style jsx>{true}</style>
      <div responsive={true} variant="primary" loading={true}>
        <span size={42} theme="dark">
          Content here
        </span>
      </div>
    </div>
  );
};
`;

console.log("Original problematic code:");
console.log(problemCode);
console.log("\n" + "=".repeat(50) + "\n");

console.log("Processed code:");
const fixedCode = processComponentCode(problemCode);
console.log(fixedCode);

console.log("\n" + "=".repeat(50) + "\n");
console.log("Fixes applied:");
console.log("- jsx={true} should be removed or converted to data-jsx");
console.log("- style={true} should be converted to style={{}}");
console.log('- className={false} should be converted to className="false"');
console.log(
  "- responsive, variant, loading, size, theme should be converted to data-* attributes"
);
