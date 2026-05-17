import { VitePWA } from 'vite-plugin-pwa'

export function pwaPlugin() {
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
      scope: '/',
      start_url: '/',
      lang: 'es',
      icons: [
        {
          src: '/pwa-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      navigateFallback: '/index.html',
    },
    devOptions: {
      enabled: true,
    },
  })
}
