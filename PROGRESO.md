# Progreso POF — Bomberos Río Bueno

Marque `[x]` al completar cada módulo.

## Fase 0 — Arranque
- [x] Repositorio y estructura `web/` + `supabase/`
- [x] Stack React + Vite + TypeScript + Supabase
- [ ] CI básico (opcional)
- [x] Plantilla `web/.env.example`; secretos solo en `.env.local` (repo público)

## Fase 1 — Base de datos
- [x] Migración `001_initial_schema.sql`
- [x] Migración `002_seed_catalogos.sql`
- [x] Migraciones SQL aplicadas (`001` + `002`; aplicar `003`/`004` según logos/firma)
- [x] `supabase/.env` solo local (ignorado) + `config.env.example` como referencia
- [x] `web/.env.local` para anon key en desarrollo (ignorado)

## Fase 2 — Seguridad
- [x] Auth email/password en app
- [x] Tabla `profiles` + trigger
- [x] RLS en `partes` y catálogos
- [ ] Configurar email en Supabase Dashboard *(solo si querés confirmación por correo)*

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
- [x] Plantilla PDF (A4, @react-pdf/renderer)
- [x] Descarga desde detalle (`Descargar PDF`)
- [x] Logos PDF (bucket `pof-assets`, tablas `pdf_branding` / `compania_pdf_logo`)
- [x] Firma opcional (migración `004_parte_firma.sql`, paso 8, firma en PDF)

## Fase 6 — Móvil
- [x] PWA (vite-plugin-pwa + iconos + registro SW)
- [x] Scripts `dev:host` / `preview:host`
- [x] Capacitor 8 + carpeta `web/android` (`cap:sync`, `cap:open:android`)
- [ ] APK firmado / tienda *(guía en docs/MOVIL.md)*

## Fase 7 — Cierre
- [ ] Piloto usuarios *(operativo)*
- [x] Guía despliegue ([docs/DEPLOY.md](docs/DEPLOY.md))

**Estado:** núcleo listo para piloto; pendientes opcionales según checklist.
