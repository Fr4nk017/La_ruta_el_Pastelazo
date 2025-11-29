/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuración para SPA
  base: '/',
  
  // Optimizaciones de rendimiento
  build: {
    // Reducir tamaño del bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en producción
        drop_debugger: true,
      },
    },
    
    // Code splitting manual para chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y ReactDOM en su propio chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separar Bootstrap en su propio chunk
          'bootstrap-vendor': ['react-bootstrap', 'bootstrap'],
        },
      },
    },
    
    // Optimizar assets
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline assets < 4kb como base64
  },
  
  // Optimizar servidor de desarrollo
  server: {
    host: true,
    port: 5173,
    // Proxy para redirigir llamadas API al backend
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  
  // Pre-bundling optimizado
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-bootstrap'],
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
