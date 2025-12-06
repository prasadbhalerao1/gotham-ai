import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap'],
          'framer-motion-vendor': ['framer-motion'],
          'tanstack-query-vendor': ['@tanstack/react-query'],
          'image-gallery-vendor': ['react-image-gallery'],
        },
      },
    },
  },
})
