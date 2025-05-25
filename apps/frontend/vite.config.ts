import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Optional: Cleaner imports
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Ensures old build is cleaned
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:8787',
        target: "https://backend-me.vanshkumarkathpalia.workers.dev",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Enable this for client-side routing (e.g., React Router)
  preview: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
});
