import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    preview: {
      host: "0.0.0.0",
      port: 8080,
      allowedHosts: [
        "neura.institutosiqueira.com.br",
        "www.neura.institutosiqueira.com.br"
      ],
    },
    server: {
      allowedHosts: [
        "neura.institutosiqueira.com.br"
      ],
    },
  },
});