import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      // Increase HMR timeout to prevent connection lost messages
      timeout: 60000,
    },
    // Configure WebSocket connection
    ws: {
      port: 24678, // Use a fixed port for WebSocket to avoid conflicts
    },
  },
});
