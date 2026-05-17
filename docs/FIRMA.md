# Firma digital en el POF (opcional)

## 1. Migración

Ejecutá en Supabase **SQL Editor**, después de `003_pdf_branding.sql`:

`supabase/migrations/004_parte_firma.sql`

Añade en `partes` las columnas `firma_path` y `firmado_at`, y políticas de Storage para la carpeta **`firmas/`** dentro del bucket **`pof-assets`** (el mismo que logos PDF).

## 2. Reglas de Storage

- Solo el **creador** del parte puede subir/actualizar/borrar `firmas/<uuid-del-parte>.png`.
- Solo si el parte está en estado **`borrador`**.
- El nombre del objeto debe coincidir con el UUID del parte (`.png`).

No hace falta bucket nuevo: se reutiliza `pof-assets`.

## 3. En la app

En el **paso 8** del asistente: tras tener borrador (botón «Siguiente» hasta crear el parte), el usuario puede dibujar la firma con dedo o ratón y pulsar **Guardar firma**. El PNG queda en Storage y se actualizan `firma_path` y `firmado_at`.

La firma es **opcional**; el PDF la muestra cuando existe URL pública para `firma_path`.

## 4. PDF

El informe descargado desde **detalle** incluye la imagen de firma si está guardada (ver componentes en `web/src/pdf/`).
