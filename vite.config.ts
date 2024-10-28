import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  resolve: {
    alias: {
      '@': '/src',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: { 
        bigint: true 
      }
    }
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});