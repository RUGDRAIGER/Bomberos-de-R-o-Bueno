import { VitePWA } from 'vite-plugin-pwa'

function asset(base: string, file: string): string {
  if (base === '/') return `/${file}`
  return `${base.replace(/\/$/, '')}/${file}`
}

function navigateFallback(base: string): string {
  return asset(base, 'index.html')
}

export function pwaPlugin(base: string) {
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'pwa-192.png', 'pwa-512.png'],
    manifest: {
      name: 'POF Bomberos Río Bueno',
      short_name: 'POF Río Bueno',
      description: 'Parte de Operaciones Finales 2026',
      theme_color: '#cf2a27',
      background_color: '#f5f5f5',
      display: 'standalone',
      orientation: 'portrait',
      scope: base,
      start_url: base,
      lang: 'es',
      icons: [
        {
          src: asset(base, 'pwa-192.png'),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: asset(base, 'pwa-512.png'),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      navigateFallback: navigateFallback(base),
    },
    devOptions: {
      enabled: true,
    },
  })
}
