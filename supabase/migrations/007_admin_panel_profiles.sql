-- Panel admin: listar perfiles, bloquear/desbloquear, índice único por correo,
-- y FK ON DELETE SET NULL para poder borrar usuarios en auth (Edge Function).

-- ------------------------------------------------------------
-- Función: miembro autenticado con cuenta activa (bloqueo efectivo en RLS)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.auth_profile_is_active()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT activo FROM profiles WHERE id = auth.uid()), false);
$$;

REVOKE ALL ON FUNCTION public.auth_profile_is_active() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_profile_is_active() TO authenticated;

-- ------------------------------------------------------------
-- Correo único en profiles (Supabase Auth ya evita duplicados en registro;
-- esto refuerza consistencia en la tabla pública).
-- ------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_lower_unique
  ON profiles (lower(trim(email)))
  WHERE email IS NOT NULL AND length(trim(email)) > 0;

-- ------------------------------------------------------------
-- Partes / parte_material: exigir cuenta activa
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "partes_select" ON partes;
CREATE POLICY "partes_select" ON partes FOR SELECT TO authenticated
  USING (
    public.auth_profile_is_active()
    AND (
      created_by = auth.uid()
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('admin', 'consulta'))
    )
  );

DROP POLICY IF EXISTS "partes_insert" ON partes;
CREATE POLICY "partes_insert" ON partes FOR INSERT TO authenticated
  WITH CHECK (
    public.auth_profile_is_active()
    AND created_by = auth.uid()
  );

DROP POLICY IF EXISTS "partes_update" ON partes;
CREATE POLICY "partes_update" ON partes FOR UPDATE TO authenticated
  USING (
    public.auth_profile_is_active()
    AND estado = 'borrador'
    AND (
      created_by = auth.uid()
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
    )
  )
  WITH CHECK (
    public.auth_profile_is_active()
    AND (
      created_by = auth.uid()
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
    )
  );

DROP POLICY IF EXISTS "partes_delete" ON partes;
CREATE POLICY "partes_delete" ON partes FOR DELETE TO authenticated
  USING (
    public.auth_profile_is_active()
    AND created_by = auth.uid()
    AND estado = 'borrador'
  );

DROP POLICY IF EXISTS "parte_material_select" ON parte_material;
CREATE POLICY "parte_material_select" ON parte_material FOR SELECT TO authenticated
  USING (
    public.auth_profile_is_active()
    AND EXISTS (
      SELECT 1 FROM partes p WHERE p.id = parte_id AND (
        p.created_by = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('admin', 'consulta'))
      )
    )
  );

DROP POLICY IF EXISTS "parte_material_insert" ON parte_material;
CREATE POLICY "parte_material_insert" ON parte_material FOR INSERT TO authenticated
  WITH CHECK (
    public.auth_profile_is_active()
    AND EXISTS (
      SELECT 1 FROM partes p
      WHERE p.id = parte_id
        AND p.estado = 'borrador'
        AND (
          p.created_by = auth.uid()
          OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
        )
    )
  );

DROP POLICY IF EXISTS "parte_material_delete" ON parte_material;
CREATE POLICY "parte_material_delete" ON parte_material FOR DELETE TO authenticated
  USING (
    public.auth_profile_is_active()
    AND EXISTS (
      SELECT 1 FROM partes p
      WHERE p.id = parte_id
        AND p.estado = 'borrador'
        AND (
          p.created_by = auth.uid()
          OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
        )
    )
  );

-- ------------------------------------------------------------
-- Perfiles: solo admin activo puede listar todos y editar bloqueo / datos de otros
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() AND public.auth_profile_is_active())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin' AND p.activo = true
    )
  );

CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin' AND p.activo = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.rol = 'admin' AND p.activo = true
    )
  );

-- ------------------------------------------------------------
-- FK: al borrar usuario en Auth, conservar partes (referencias nulas)
-- ------------------------------------------------------------
ALTER TABLE partes DROP CONSTRAINT IF EXISTS partes_created_by_fkey;
ALTER TABLE partes
  ADD CONSTRAINT partes_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE partes DROP CONSTRAINT IF EXISTS partes_updated_by_fkey;
ALTER TABLE partes
  ADD CONSTRAINT partes_updated_by_fkey
  FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL;
