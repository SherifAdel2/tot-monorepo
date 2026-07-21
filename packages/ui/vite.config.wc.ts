import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: "src/web-components.tsx",
      formats: ["iife"],
      name: "TotUIWebComponents",
      fileName: () => "web-components.js",
    },
  },
}); 
