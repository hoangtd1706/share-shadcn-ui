import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path, { extname, relative, resolve } from "path";
import { glob } from "glob";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "share-shadcn-ui",
      formats: ["es"],
      fileName: "share-shadcn-ui",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob
          .sync("src/**/*.{ts,tsx}")
          .map((file) => [
            relative("src", file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: "[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
