-- Branding PDF: bucket público de logos + layout editable (solo admin escribe tablas)

INSERT INTO storage.buckets (id, name, public)
VALUES ('pof-assets', 'pof-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE pdf_branding (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  comandancia_logo_path TEXT,
  comandancia_top_pt NUMERIC NOT NULL DEFAULT 28,
  comandancia_right_pt NUMERIC NOT NULL DEFAULT 32,
  comandancia_width_pt NUMERIC NOT NULL DEFAULT 88,
  compania_bottom_pt NUMERIC NOT NULL DEFAULT 40,
  compania_left_pt NUMERIC NOT NULL DEFAULT 32,
  compania_width_pt NUMERIC NOT NULL DEFAULT 76,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE compania_pdf_logo (
  compania_id INT PRIMARY KEY REFERENCES cat_compania(id) ON DELETE CASCADE,
  logo_path TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO pdf_branding (id)
SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM pdf_branding WHERE id = 1);

ALTER TABLE pdf_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE compania_pdf_logo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pdf_branding_select_auth"
  ON pdf_branding FOR SELECT TO authenticated USING (true);

CREATE POLICY "pdf_branding_write_admin"
  ON pdf_branding FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

CREATE POLICY "compania_logo_select_auth"
  ON compania_pdf_logo FOR SELECT TO authenticated USING (true);

CREATE POLICY "compania_logo_write_admin"
  ON compania_pdf_logo FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

CREATE POLICY "compania_logo_update_admin"
  ON compania_pdf_logo FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

CREATE POLICY "compania_logo_delete_admin"
  ON compania_pdf_logo FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin'));

CREATE POLICY "pof_assets_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pof-assets');

CREATE POLICY "pof_assets_admin_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'pof-assets'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "pof_assets_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'pof-assets'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
  )
  WITH CHECK (
    bucket_id = 'pof-assets'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "pof_assets_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'pof-assets'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE TRIGGER tr_pdf_branding_updated
  BEFORE UPDATE ON pdf_branding
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tr_compania_pdf_logo_updated
  BEFORE UPDATE ON compania_pdf_logo
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
