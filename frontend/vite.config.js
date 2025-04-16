import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // Listens on all network interfaces (needed for Docker/EC2)
    port: 5173,
    open: false,
    allowedHosts: ['kstrom.in'], // 🔥 This allows your custom domain
  },
});

