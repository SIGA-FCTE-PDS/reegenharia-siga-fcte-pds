import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toda requisição que começar com /api será mandada para o Spring Boot
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})