import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: '/testing-lab/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'dev.html')
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false
  }
});
