import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative assets allow the app to run from any GitHub Pages repository path.
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
