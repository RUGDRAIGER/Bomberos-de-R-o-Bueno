import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pwaPlugin } from './vite/pwa'

export default defineConfig({
  plugins: [react(), pwaPlugin()],
  server: { port: 5173 },
})
