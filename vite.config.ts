import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { CLIENT_PORT } from "./constants/index.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "localhost",
    port: CLIENT_PORT,
  },
});
