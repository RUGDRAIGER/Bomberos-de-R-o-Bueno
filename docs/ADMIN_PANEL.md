# Panel de administración (usuarios)

Tras aplicar la migración `007_admin_panel_profiles.sql`, un usuario con rol **`admin`** y cuenta **activa** puede:

- Ver todos los perfiles en **Administración** (`/admin`).
- **Bloquear / desbloquear** (`profiles.activo`).
- **Eliminar** una cuenta de Auth (y su fila en `profiles` en cascada).

Los **bomberos bloqueados** no pueden usar tablas de partes (RLS) y la app cierra sesión al detectar `activo = false`.

## Eliminar usuario: Edge Function `admin-delete-user`

El cliente web **no** puede usar la *service role key*. La eliminación en `auth.users` se hace con una función Edge que ya tiene acceso seguro al servicio.

### 1. Desplegar desde Supabase Dashboard

1. Proyecto → **Edge Functions** → **Deploy a new function**.
2. Nombre: `admin-delete-user`.
3. Pegá el código de `supabase/functions/admin-delete-user/index.ts` (repo).

O con CLI (si la tenés configurada), desde la raíz del proyecto:

```bash
supabase functions deploy admin-delete-user
```

### 2. Secretos

En **Edge Functions → Secrets**, deben existir (en hosted Supabase suelen inyectarse solos):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

Si falta alguno, agregalo desde **Settings → API**.

### 3. Probar

Con sesión de admin, en la app: **Administración** → **Eliminar** en un usuario de prueba (no te elimines a vos mismo).

Si aparece error de red o CORS, revisá que la función esté desplegada y el nombre coincida exactamente con `admin-delete-user`.

## Correo duplicado

- **Registro:** Supabase Auth ya impide dos cuentas con el mismo correo.
- **Base:** el índice `profiles_email_lower_unique` evita duplicados en `profiles` por si hubiera inconsistencias.

## Promover administradores

Ver [PROMOVER_ADMIN.md](./PROMOVER_ADMIN.md).
