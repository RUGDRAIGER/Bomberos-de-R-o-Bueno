# Promover un usuario a administrador

Los nuevos registros quedan con rol `bombero` en la tabla `profiles`. Para que tu cuenta pueda descargar PDF de todos los partes enviados y gestionar borradores de otros (según RLS), necesitás rol `admin`.

## Pasos (Supabase Dashboard)

1. Entrá a **Authentication → Users** y copiá el **UUID** de tu usuario (o usá el email en el SQL de abajo).
2. Abrí **SQL Editor** y ejecutá **una** de estas variantes:

Por **email** (reemplazá el correo):

```sql
UPDATE profiles
SET rol = 'admin'
WHERE email = 'tu_correo@ejemplo.com';
```

Por **UUID**:

```sql
UPDATE profiles
SET rol = 'admin'
WHERE id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

3. Cerrá sesión en la app POF y volvé a iniciar sesión para refrescar el perfil.

## Roles existentes

| Rol        | Uso típico                                      |
|------------|--------------------------------------------------|
| `bombero`  | Crea y envía sus POF; PDF solo de los propios enviados |
| `admin`    | Igual + puede descargar PDF de cualquier POF enviado (listado que ve por RLS) |
| `consulta` | Lectura amplia; también puede descargar PDF de enviados |

**Seguridad:** no compartas la **service role key**; los cambios de rol deben hacerse solo desde el Dashboard o con herramientas de administración confiables.
