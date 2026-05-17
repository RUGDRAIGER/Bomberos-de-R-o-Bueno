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
5. Supabase Auth: tabla **[Supabase y URLs de Auth](#supabase-y-urls-de-auth)** más abajo.

Si **renombrás el repo**, cambiá `VITE_SITE_BASE` en el workflow para que coincida con `/nombre-repo/`.

### Supabase y URLs de Auth

En el [Dashboard de Supabase](https://supabase.com/dashboard) → tu proyecto → **Authentication** → **URL Configuration**:

| Campo | Valor recomendado |
|--------|-------------------|
| **Site URL** | `https://rugdraiger.github.io/Bomberos-de-R-o-Bueno/` |
| **Redirect URLs** | `https://rugdraiger.github.io/Bomberos-de-R-o-Bueno/**` y `http://localhost:5173/**` |

Los **secrets** del repo en GitHub (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) deben ser la **misma** URL y anon key que ves en **Project Settings → API** de ese proyecto.

- Pegá el valor **sin comillas** (`"` `'`) ni espacios antes/después.
- La URL debe ser tipo `https://xxxxxxxx.supabase.co` (https obligatorio en producción).
- Si ves pantalla en blanco y en consola `Invalid supabaseUrl`, el build entró sin URL válida: corregí los secrets y volvé a ejecutar **Deploy GitHub Pages**.

La integración **Supabase ↔ GitHub** (migraciones automáticas, etc.) es aparte: no sustituye estos URLs ni los secrets del workflow de Pages.

Si cambiás usuario u organización en GitHub, ajustá la **Site URL** y redirects al nuevo dominio `*.github.io`.

### Manual (sin Actions)

`npm run build` en `web` con `VITE_SITE_BASE=/tu-repo/` y subir `dist`; copiar `index.html` → `404.html`; añadir `.nojekyll` en la raíz del sitio publicado.

### “No despliega” / sigo viendo lo mismo

1. **URL correcta:** tiene que ser exactamente la del **repositorio**, con la ruta del proyecto:  
   `https://<usuario>.github.io/<nombre-repo>/`  
   Ejemplo: `https://rugdraiger.github.io/Bomberos-de-R-o-Bueno/` — **no** solo `https://<usuario>.github.io/`.

2. **Comprobar Actions:** en **Actions → Deploy GitHub Pages**, el último run debe estar en **verde** (jobs `build` y `deploy`). Si cambiaste secrets, hacé **Run workflow** de nuevo: el sitio **no** usa valores nuevos hasta ese build.

3. **Caché del navegador / PWA:** la app registra service worker. Abrí DevTools (F12) → pestaña **Application** (o **Aplicación**) → **Storage → Clear site data** / borrar **Service Workers**, luego **Ctrl+Shift+R**.

4. **Settings → Pages:** **Source** debe ser **GitHub Actions**. Si sigue **Deploy from a branch**, GitHub puede mostrar el README en lugar del `dist` del workflow.

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
