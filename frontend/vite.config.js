import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,   // exposes on local network so phone can connect via IP
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
