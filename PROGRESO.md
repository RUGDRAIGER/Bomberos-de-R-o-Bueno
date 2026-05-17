# Progreso POF — Bomberos Río Bueno

Marque `[x]` al completar cada módulo.

## Fase 0 — Arranque
- [x] Repositorio y estructura `web/` + `supabase/`
- [x] Stack React + Vite + TypeScript + Supabase
- [ ] CI básico (opcional)
- [x] `.env.example` documentado

## Fase 1 — Base de datos
- [x] Migración `001_initial_schema.sql`
- [x] Migración `002_seed_catalogos.sql`
- [x] Migraciones SQL aplicadas (`001` + `002`)
- [x] `supabase/.env` con DATABASE_URL (local, no en git)
- [x] `web/.env.local` con anon key

## Fase 2 — Seguridad
- [x] Auth email/password en app
- [x] Tabla `profiles` + trigger
- [x] RLS en `partes` y catálogos
- [ ] Configurar email en Supabase Dashboard

## Fase 3 — Núcleo Parte
- [x] CRUD borrador
- [x] Validaciones por paso
- [x] Rama oficial / bombero
- [x] Enviar (estado `enviado`)

## Fase 4 — UI
- [x] Wizard pasos 1–8
- [x] Listado dashboard
- [x] Detalle básico
- [ ] Mejorar vista detalle con catálogos resueltos

## Fase 5 — Informes
- [ ] Plantilla PDF
- [ ] Descarga desde detalle

## Fase 6 — Móvil
- [x] PWA (vite-plugin-pwa + iconos + registro SW)
- [x] Scripts `dev:host` / `preview:host`
- [ ] APK Capacitor

## Fase 7 — Cierre
- [ ] Piloto usuarios
- [ ] Despliegue producción (Vercel/Cloudflare)
