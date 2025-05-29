import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // rollupOptions: {
    //   input: {
    //     app: path.resolve(__dirname, "index.html"),
    //     background: path.resolve(__dirname, "./src/background.js"),
    //     content: path.resolve(__dirname, "src/contentScript.js"),
    //   },
    //   output: {
    //     entryFileNames: "[name].js",
    //   },
    // },
    emptyOutDir: false,
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  define: {
    global: {},
    "process.env": {},
  },
  resolve: {
    alias: {
      buffer: "buffer/",
      starknet: path.resolve(__dirname, "node_modules/starknet/dist/index.mjs"),
    },
  },
});
