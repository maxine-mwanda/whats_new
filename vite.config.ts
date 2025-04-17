import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, allowedHosts: ["whats-new-cx9e.onrender.com"],
    strictPort: true,
    port: 9000,
    }, 
})
