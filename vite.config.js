import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    // Comm_Link's contact form calls fetch('/api/contact'); proxy that to
    // the mail API (see server/index.js, run via `npm run server`) so the
    // frontend never needs to know the backend's port or deal with CORS.
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
