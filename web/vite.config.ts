import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pwaPlugin } from './vite/pwa'

/** GitHub Pages (sitio de proyecto): `/nombre-repo/`. Localmente sin variable → `/`. */
function siteBase(): string {
  const raw = process.env.VITE_SITE_BASE?.trim()
  if (!raw || raw === '/') return '/'
  return raw.endsWith('/') ? raw : `${raw}/`
}

const base = siteBase()

export default defineConfig({
  base,
  plugins: [react(), pwaPlugin(base)],
  server: { port: 5173 },
})
