-- Migración 005: Corregir políticas RLS de UPDATE para partes y parte_material
--
-- Problema: Al hacer UPDATE de estado 'borrador' → 'enviado', la cláusula USING
-- (usada también como WITH CHECK por defecto) falla sobre la fila nueva porque
-- ya no cumple estado = 'borrador'. Se separa USING de WITH CHECK.

-- ============================================================
-- partes: UPDATE
-- ============================================================
DROP POLICY IF EXISTS "partes_update" ON partes;

CREATE POLICY "partes_update" ON partes FOR UPDATE TO authenticated
  USING (
    -- Permite tocar la fila si soy el dueño y está en borrador, o soy admin
    (created_by = auth.uid() AND estado = 'borrador')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
  )
  WITH CHECK (
    -- La fila resultante debe seguir siendo mía (o ser admin)
    -- No restringimos el estado nuevo para permitir borrador→enviado
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- ============================================================
-- parte_material: INSERT
-- ============================================================
-- También puede fallar si la inserción de materiales ocurre justo antes del
-- cambio de estado. Se mantiene la restricción en el USING correcto.
DROP POLICY IF EXISTS "parte_material_insert" ON parte_material;

CREATE POLICY "parte_material_insert" ON parte_material FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partes p
      WHERE p.id = parte_id
        AND p.created_by = auth.uid()
        AND p.estado = 'borrador'
    )
  );
