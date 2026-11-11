import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // bundle CJS-only deps into the prerender (SSR) build so Node can import them
  ssr: { noExternal: ["react-helmet-async", "gsap"] },
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          output: {
            manualChunks: {
              "react-vendor": ["react", "react-dom", "react-router-dom"],
              "gsap-vendor": ["gsap"],
              "framer-motion-vendor": ["framer-motion"],
              "tanstack-query-vendor": ["@tanstack/react-query"],
            },
          },
        },
      },
}));
