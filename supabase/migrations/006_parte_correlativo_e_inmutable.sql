-- Número correlativo oficial (asignado solo al pasar a enviado) e inmutabilidad tras envío.
-- Ejecutar en Supabase SQL Editor si no usás migraciones CLI.

-- ------------------------------------------------------------
-- Correlativo único para fiscalía / archivo
-- ------------------------------------------------------------
ALTER TABLE partes ADD COLUMN IF NOT EXISTS numero_oficial INTEGER UNIQUE;

CREATE SEQUENCE IF NOT EXISTS partes_numero_oficial_seq START WITH 1;

CREATE OR REPLACE FUNCTION partes_assign_numero_oficial()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND OLD.estado = 'borrador'
     AND NEW.estado = 'enviado'
     AND NEW.numero_oficial IS NULL
  THEN
    NEW.numero_oficial := nextval('partes_numero_oficial_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_partes_assign_numero ON partes;
CREATE TRIGGER tr_partes_assign_numero
  BEFORE UPDATE ON partes
  FOR EACH ROW
  EXECUTE FUNCTION partes_assign_numero_oficial();

COMMENT ON COLUMN partes.numero_oficial IS 'Correlativo único asignado al confirmar envío (estado enviado)';

CREATE INDEX IF NOT EXISTS idx_partes_numero_oficial ON partes(numero_oficial);

-- Partes ya enviados antes de esta migración: asignar correlativo respetando orden cronológico
DO $$
DECLARE
  max_n BIGINT;
  r RECORD;
BEGIN
  SELECT COALESCE(MAX(numero_oficial), 0) INTO max_n FROM partes;
  FOR r IN
    SELECT id FROM partes
    WHERE estado = 'enviado' AND numero_oficial IS NULL
    ORDER BY enviado_at NULLS LAST, created_at
  LOOP
    max_n := max_n + 1;
    UPDATE partes SET numero_oficial = max_n WHERE id = r.id;
  END LOOP;
  PERFORM setval(
    'partes_numero_oficial_seq',
    GREATEST((SELECT COALESCE(MAX(numero_oficial), 1) FROM partes), 1)
  );
END $$;

-- ------------------------------------------------------------
-- Solo filas en borrador se pueden editar (nadie edita enviado)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "partes_update" ON partes;

CREATE POLICY "partes_update" ON partes FOR UPDATE TO authenticated
  USING (
    estado = 'borrador'
    AND (
      created_by = auth.uid()
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- ------------------------------------------------------------
-- Admin puede gestionar materiales en borradores ajenos
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "parte_material_insert" ON parte_material;

CREATE POLICY "parte_material_insert" ON parte_material FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
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
    EXISTS (
      SELECT 1 FROM partes p
      WHERE p.id = parte_id
        AND p.estado = 'borrador'
        AND (
          p.created_by = auth.uid()
          OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
        )
    )
  );
