import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "neura.institutosiqueira.com.br",
      "www.neura.institutosiqueira.com.br",
      "localhost",
      "127.0.0.1",
    ],
    proxy: {
      "/api": {
        target: "http://api:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "neura.institutosiqueira.com.br",
      "www.neura.institutosiqueira.com.br",
      "localhost",
      "127.0.0.1",
    ],
  },
});
