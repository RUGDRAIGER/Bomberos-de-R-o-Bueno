-- Firma digital: metadatos en partes + políticas Storage carpeta firmas/

ALTER TABLE partes ADD COLUMN IF NOT EXISTS firma_path TEXT;
ALTER TABLE partes ADD COLUMN IF NOT EXISTS firmado_at TIMESTAMPTZ;

CREATE POLICY "firmas_insert_own_borrador"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'pof-assets'
    AND split_part(name, '/', 1) = 'firmas'
    AND split_part(name, '/', 2) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.png$'
    AND EXISTS (
      SELECT 1 FROM partes p
      WHERE p.id::text = replace(split_part(name, '/', 2), '.png', '')
        AND p.created_by = auth.uid()
        AND p.estado = 'borrador'
    )
  );

CREATE POLICY "firmas_update_own_borrador"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'pof-assets'
    AND split_part(name, '/', 1) = 'firmas'
    AND EXISTS (
      SELECT 1 FROM partes p
      WHERE p.id::text = replace(split_part(name, '/', 2), '.png', '')
        AND p.created_by = auth.uid()
        AND p.estado = 'borrador'
    )
  )
  WITH CHECK (
    bucket_id = 'pof-assets'
    AND split_part(name, '/', 1) = 'firmas'
    AND EXISTS (
      SELECT 1 FROM partes p
      WHERE p.id::text = replace(split_part(name, '/', 2), '.png', '')
        AND p.created_by = auth.uid()
        AND p.estado = 'borrador'
    )
  );

CREATE POLICY "firmas_delete_own_borrador"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'pof-assets'
    AND split_part(name, '/', 1) = 'firmas'
    AND EXISTS (
      SELECT 1 FROM partes p
      WHERE p.id::text = replace(split_part(name, '/', 2), '.png', '')
        AND p.created_by = auth.uid()
        AND p.estado = 'borrador'
    )
  );
