/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Custom theme extensions for the UI component generator
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        gray: {
          850: "#1f2937", // Custom gray shade between 800 and 900
        },
      },
      fontFamily: {
        mono: [
          "Fira Code",
          "Monaco",
          "Cascadia Code",
          "Segoe UI Mono",
          "Roboto Mono",
          "Oxygen Mono",
          "Ubuntu Monospace",
          "Source Code Pro",
          "Fira Mono",
          "Droid Sans Mono",
          "Courier New",
          "monospace",
        ],
      },
      // Enhanced responsive breakpoints for mobile optimization
      screens: {
        xs: "475px",
        // => @media (min-width: 475px) { ... }
      },
      // Mobile-first spacing
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};
