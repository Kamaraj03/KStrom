import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Ensures it works inside Docker
    port: 5173,
    open: false, // Prevents Vite from auto-opening browser
  },
});

