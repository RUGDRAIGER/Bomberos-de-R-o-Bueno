# Prueba en móvil (POF)

## 1. Misma red Wi‑Fi

En la PC:

```bash
cd web
npm run dev:host
```

En la consola de Vite aparece **Network:** `http://192.168.x.x:5173/`  
Abre esa URL en el celular (Chrome o Safari).

## 2. Supabase Auth desde IP local

Si el login falla, en Supabase → **Authentication → URL Configuration**:

- **Site URL:** puedes dejar `http://localhost:5173` para uso solo en PC.
- Añade en **Redirect URLs** algo como: `http://192.168.1.XXX:5173/**`  
  (sustituye por la IP que muestra Vite).

## 3. Instalar como app (PWA)

En el celular, con la página abierta:

- **Android (Chrome):** menú ⋮ → **Instalar aplicación** / **Agregar a pantalla de inicio**.
- **iPhone (Safari):** compartir → **Agregar a inicio**.

Usa **HTTPS** en producción; en desarrollo la PWA puede instalarse según el navegador.

## 4. Build de prueba

```bash
npm run build
npm run preview:host
```

Prueba la URL de red en el móvil (útil para validar service worker).

## 5. APK con Capacitor (Android)

Requisitos: **Android Studio**, **JDK 17+** (el que trae AS suele bastar).

Desde la carpeta `web`:

```bash
npm run cap:sync
npm run cap:open:android
```

`cap:sync` hace `npm run build` y copia `dist/` al proyecto nativo. Los artefactos copiados (`android/app/src/main/assets/public`) están en `.gitignore`; antes de un release hay que ejecutar sync en esa máquina o en CI.

En Android Studio: **Build → Build Bundle(s) / APK(s)** para depuración o release. Para publicar en Play Console necesitás firma de aplicación (keystore) y revisar [documentación de Capacitor Android](https://capacitorjs.com/docs/android).

**Live reload en el dispositivo:** podés poner en `capacitor.config.ts` (solo desarrollo, no subir IP fija a git):

```ts
server: { url: 'http://TU_IP_LAN:5173', cleartext: true },
```

Luego `npx cap sync` y ejecutar la app desde Android Studio; el WebView cargará Vite en red. Quitá `server` para builds empaquetados.
