# POF Bomberos Río Bueno

Sistema web para **Parte de Operaciones Finales 2026** — Cuerpo de Bomberos de Río Bueno.

- **Supabase:** creá el proyecto en [supabase.com](https://supabase.com); URL y anon key en **Project Settings → API**.
- **Formulario original:** [Google Forms](https://docs.google.com/forms/d/e/1FAIpQLSes-dAKxJKzcwLq6Lut4K4tQ7BBUiaD_MCql6m1vF2i5BWUlg/viewform)

## Inicio rápido

### 1. Base de datos en Supabase

En **SQL Editor**, ejecutar en orden:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_seed_catalogos.sql`
3. `supabase/migrations/003_pdf_branding.sql`
4. `supabase/migrations/004_parte_firma.sql` (firma opcional en Storage)

Logos PDF: [docs/LOGOS_PDF.md](docs/LOGOS_PDF.md). Firma: [docs/FIRMA.md](docs/FIRMA.md).

En **Authentication → Providers**, habilitar **Email** (y desactivar confirmación de email en desarrollo si lo desea).

### 2. Variables de entorno (**no** van en git)

El repo está pensado para ser **público**: los `.env` con datos reales están **ignorados**.

| Qué necesitás | Acción |
|---------------|--------|
| App (`npm run dev` / build local) | Copiá `web/.env.example` → `web/.env.local` y completá URL + anon key (**Settings → API**). |
| Scripts Postgres locales | Creá `supabase/.env` con `DATABASE_URL` (ver `supabase/config.env.example`). Ese archivo **no se sube**. |

Nombres en Dashboard (**API**): `Project URL` → `VITE_SUPABASE_URL`, anon **public** → `VITE_SUPABASE_ANON_KEY`.

**Si alguna vez subiste una clave real a git:** regenerá la anon key en Supabase y, si hace falta, limpiá historial (`git filter-repo`).

Conexión Postgres: **Settings → Database** (pooler para scripts). Referencia en `supabase/config.env.example`.

### 3. Frontend

```bash
cd web
npm install
npm run dev
```

**APK (Android):** con [Capacitor](https://capacitorjs.com/) (`web/android`). Tras cambios en la app: `npm run cap:sync`; abrir en Android Studio: `npm run cap:open:android`. Detalle en [docs/MOVIL.md](docs/MOVIL.md).

Abrir `http://localhost:5173`

**Probar en el celular:** `npm run dev:host` y seguir [docs/MOVIL.md](docs/MOVIL.md).

## Estructura

```
PROYECTO BOMBERO/
├── supabase/migrations/   # Esquema SQL + catálogos
└── web/                   # React + Vite + TypeScript + Capacitor (android/)
```

## PDF del POF

En la pantalla **detalle** del parte: botón **Descargar PDF** (informe A4 con datos y catálogos resueltos).

## Módulos implementados

- [x] Esquema BD (partes, catálogos, RLS, perfiles)
- [x] Datos semilla (tipos 10-x, cargos, compañías, material)
- [x] Auth email/contraseña
- [x] Wizard 8 pasos con ramas oficial/bombero
- [x] Listado y borrador/enviado
- [x] PDF informe (descarga desde detalle)
- [x] Firma digital opcional (paso 8, PNG en `pof-assets/firmas/`)
- [x] PWA (instalable)
- [x] Capacitor + proyecto Android (generar APK en Android Studio)

## Primer admin

Tras registrarse, en SQL Editor:

```sql
UPDATE profiles SET rol = 'admin' WHERE email = 'tu@correo.com';
```

## Producción

Guía de despliegue (Vercel, Cloudflare, Netlify, notas GitHub Pages): [docs/DEPLOY.md](docs/DEPLOY.md).

## Checklist del plan

Estado del desarrollo: [PROGRESO.md](PROGRESO.md).
