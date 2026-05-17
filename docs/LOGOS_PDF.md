# Logos en el PDF (Comandancia + compañía)

## 1. Migración

Ejecutá en Supabase **SQL Editor**: `supabase/migrations/003_pdf_branding.sql`

Crea el bucket **`pof-assets`** (público para lectura) y tablas `pdf_branding` / `compania_pdf_logo`.

## 2. Subir archivos (admin)

En **Storage → pof-assets**, subí PNG con fondo transparente, por ejemplo:

- `comandancia/logo.png` — logo institucional  
- `companias/1.png` … `companias/6.png` — logo por compañía (según `cat_compania.id`)

**Solo usuarios con `profiles.rol = 'admin'`** pueden subir/borrar objetos en ese bucket.

## 3. Enlazar rutas en la BD

**Logo comandancia** (una fila `pdf_branding`, id = 1):

```sql
UPDATE pdf_branding
SET comandancia_logo_path = 'comandancia/logo.png'
WHERE id = 1;
```

**Logo por compañía** (`compania_id` = id en `cat_compania`, suele ser 1–6):

```sql
INSERT INTO compania_pdf_logo (compania_id, logo_path)
VALUES (1, 'companias/1.png')
ON CONFLICT (compania_id) DO UPDATE SET logo_path = EXCLUDED.logo_path;
```

El PDF usa el logo de compañía cuando el parte tiene **`bombero_compania_id`** definido (rama bombero a cargo).

## 4. Posición en el PDF (pt)

Columnas en `pdf_branding`:

| Columna | Uso |
|---------|-----|
| `comandancia_*` | Esquina superior derecha en **ambas** páginas |
| `compania_*` | Esquina inferior izquierda solo en **página 2** |

Ajustá valores con `UPDATE pdf_branding SET ...` hasta que imprima bien.
