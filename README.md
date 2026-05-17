# POF Bomberos Río Bueno

Sistema web para **Parte de Operaciones Finales 2026** — Cuerpo de Bomberos de Río Bueno.

- **Supabase:** [Dashboard](https://supabase.com/dashboard/project/hlbwpwojmydpkdjbeluv) · API: `https://hlbwpwojmydpkdjbeluv.supabase.co`
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

### 2. Claves de la app

En Supabase: **Project Settings → API**

- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` → `VITE_SUPABASE_ANON_KEY`

Crear archivo `web/.env.local` (no subir a git):

```env
VITE_SUPABASE_URL=https://hlbwpwojmydpkdjbeluv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...tu_clave_anon
```

Conexión Postgres (solo scripts locales): ver `supabase/config.env.example` y `supabase/.env`.

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

## Checklist del plan

Ver conversación / Gantt: Fase 0–3 en progreso; Fase 5–7 pendientes.
