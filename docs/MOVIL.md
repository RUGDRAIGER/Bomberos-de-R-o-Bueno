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
