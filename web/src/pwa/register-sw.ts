import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker() {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('[POF] App lista sin conexión (activos en caché)')
    },
  })
}
