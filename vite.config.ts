import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5180,
    strictPort: true,
    fs: {
      allow: [path.resolve(import.meta.dirname), path.resolve(import.meta.dirname, "..", "node_modules")],
    },
  },
});
