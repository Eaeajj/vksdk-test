import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { CLIENT_PORT } from "./constants/index.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: CLIENT_PORT,
  },
});
