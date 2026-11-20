import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // las peticiones a /api las reenvía al backend, así no hace falta configurar CORS
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
