# Despliegue en producción (POF)

La app es **solo frontend**: Vite empaqueta estáticos que hablan con **Supabase** (HTTPS). En el build hace falta `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (en local: `web/.env.local`; en el proveedor de hosting: variables de entorno).

## GitHub Pages (recomendado con Actions)

El repo incluye [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml): construye `web/` con `base` `/Bomberos-de-R-o-Bueno/` y sube `dist` a Pages.

### Por qué antes veías solo el README

Si en **Settings → Pages** tenés **Source: Deploy from a branch**, GitHub publica el repo (Markdown/README), **no** la app React. Tenés que usar **GitHub Actions**.

### Pasos

1. Repo → **Settings** → **Pages** → **Source:** **GitHub Actions** (no una rama).
2. **Secrets** (`Settings` → `Secrets and variables` → `Actions`): `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Push a `main` o **Re-run** del workflow **Deploy GitHub Pages**.
4. Primera vez: puede pedir aprobar el entorno **github-pages**.
5. Supabase Auth → **Site URL** y **Redirect URLs**: `https://rugdraiger.github.io/Bomberos-de-R-o-Bueno/` y `.../**`.

Si **renombrás el repo**, cambiá `VITE_SITE_BASE` en el workflow para que coincida con `/nombre-repo/`.

### Manual (sin Actions)

`npm run build` en `web` con `VITE_SITE_BASE=/tu-repo/` y subir `dist`; copiar `index.html` → `404.html`; añadir `.nojekyll` en la raíz del sitio publicado.

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
