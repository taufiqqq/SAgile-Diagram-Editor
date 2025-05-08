import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      external: ['express', 'cors', 'dotenv', 'path', 'fs', 'http', 'url', 'events']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Exclude server-side code from the frontend bundle
  optimizeDeps: {
    exclude: ['express', 'cors', 'dotenv', 'path', 'fs', 'http', 'url', 'events']
  }
})
