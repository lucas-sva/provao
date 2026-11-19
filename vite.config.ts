import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/provao/',
  publicDir: false,
  build: {
    emptyOutDir: false,
  },
  server: {
    port: 3000,
  },
});
