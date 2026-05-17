# Despliegue en producción (POF)

La app es **solo frontend**: Vite empaqueta estáticos que hablan con **Supabase** (HTTPS). En el build hace falta `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (en local: `web/.env.local`; en el proveedor de hosting: variables de entorno).

## GitHub Pages

GitHub Pages sirve archivos estáticos. Después de `npm run build` en `web/`, publicá el contenido de `web/dist`.

- Si el sitio queda en una **subruta** (`https://usuario.github.io/nombre-repo/`), configurá en Vite `base: '/nombre-repo/'` y **React Router** con `basename` acorde (no viene preconfigurado en esta rama).
- Para rutas SPA suele hacer falta que **`404.html`** sea una copia de **`index.html`** (GitHub devuelve 404 para rutas profundas).

No hay workflow de deploy incluido en este repo; podés usar Actions propias o subir `dist` a una rama `gh-pages`.

## Vercel (recomendado, rápido)

1. Conectar el repo de GitHub a [Vercel](https://vercel.com/).
2. **Root directory:** `web`.
3. **Build command:** `npm run build` · **Output:** `dist`.
4. En **Environment Variables**, añadir `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para Production (y Preview si quieres).
5. En Supabase → **Authentication → URL Configuration**:
   - **Site URL:** URL de producción (`https://tu-proyecto.vercel.app`).
   - **Redirect URLs:** añadir esa misma URL y `https://tu-proyecto.vercel.app/**`.

Opcional: un `vercel.json` en `web/` con rewrite SPA (`/*` → `/index.html`) si lo necesitás.

## Cloudflare Pages

1. Proyecto → conectar repo.
2. **Build:** comando `npm run build`, directorio salida `dist`, **raíz del build:** `web`.
3. Variables `VITE_*` en **Settings → Environment variables**.
4. Misma configuración de **Site URL** y redirects en Supabase Auth.

## Netlify

1. Base directory `web`, build `npm run build`, publish `dist`.
2. Variables de entorno `VITE_SUPABASE_*`.
3. Reglas SPA (`/* /index.html 200`) si hace falta.

## APK Android

Seguir [docs/MOVIL.md](MOVIL.md): `npm run cap:sync`, firma en Android Studio y distribución (Play Console o APK lateral).

## Checklist post-deploy

- [ ] Migraciones `001`–`004` aplicadas en el proyecto Supabase de producción.
- [ ] Auth URLs actualizadas en Supabase.
- [ ] Bucket `pof-assets` y políticas si usás logos/firmas.
- [ ] Probar login, crear borrador, enviar y descargar PDF.
