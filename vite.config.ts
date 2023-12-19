import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import analyze from "rollup-plugin-analyzer";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
      eslintrc: {
        enabled: true
      },
      dts: path.resolve(__dirname, "./src/declarations/auto-imports.d.ts")
    }),
    Components({
      dirs: ["src/components"],
      dts: path.resolve(__dirname, "./src/declarations/components.d.ts")
    })
  ],
  root: path.resolve(__dirname, "."),
  resolve: {
    extensions: [".ts", ".js", ".vue", ".scss"],
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      plugins: [analyze()]
    }
  },
  server: {
    port: 3000
  }
});
