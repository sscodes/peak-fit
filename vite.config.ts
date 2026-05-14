import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins:
          process.env.NODE_ENV === "development"
            ? [
                [
                  "@locator/babel-jsx/dist",
                  {
                    env: "development",
                  },
                ],
              ]
            : [],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-three": [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
            "@react-three/postprocessing",
            "postprocessing",
          ],
          "vendor-forms": ["formik", "yup"],
          "vendor-router": ["react-router"],
          "vendor-query": [
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
          ],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux", "redux"],
          "vendor-ui": [
            "react-toastify",
            "react-select",
            "react-day-picker",
            "date-fns",
          ],
        },
      },
    },
  },
});
