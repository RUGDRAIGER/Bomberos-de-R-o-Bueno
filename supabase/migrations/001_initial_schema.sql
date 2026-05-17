-- POF Bomberos Río Bueno - Esquema inicial
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles de aplicación
CREATE TYPE app_role AS ENUM ('bombero', 'admin', 'consulta');
CREATE TYPE parte_estado AS ENUM ('borrador', 'enviado');
CREATE TYPE tipo_mando AS ENUM ('OFICIAL', 'BOMBERO');
CREATE TYPE si_no AS ENUM ('SI', 'NO');

-- Perfiles (extiende auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nombre_completo TEXT,
  rol app_role NOT NULL DEFAULT 'bombero',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Catálogos
CREATE TABLE cat_tipo_emergencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE cat_cargo_oficial (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE cat_compania (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE cat_material_mayor (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true
);

-- Parte principal (POF)
CREATE TABLE partes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estado parte_estado NOT NULL DEFAULT 'borrador',
  paso_actual INT NOT NULL DEFAULT 1,

  -- Paso 1
  bombero_que_realiza_pof TEXT,

  -- Paso 2 - Emergencias
  fecha_emergencia DATE,
  tipo_emergencia_id INT REFERENCES cat_tipo_emergencia(id),
  hora_inicio TIME,
  hora_llegada_primera_unidad TIME,
  hora_termino TIME,
  area_intervencion TEXT CHECK (area_intervencion IN ('URBANO', 'RURAL', 'Otra Comuna')),
  direccion_emergencia TEXT,
  origen_emergencia TEXT,
  causa_emergencia TEXT,
  descripcion_trabajo TEXT,

  -- Paso 3-5 - Mando
  tipo_mando tipo_mando,
  oficial_cargo_id INT REFERENCES cat_cargo_oficial(id),
  bombero_compania_id INT REFERENCES cat_compania(id),
  bombero_nombre_a_cargo TEXT,

  -- Paso 6 - Instituciones
  samu si_no,
  carabineros si_no,
  conaf si_no,
  otros_cb si_no,
  otros_cb_nombre TEXT,
  senapred si_no,
  empresas_externas TEXT,

  -- Paso 7
  observaciones TEXT,
  emergencia_especialidad TEXT,
  bomberos_1ra INT CHECK (bomberos_1ra IS NULL OR (bomberos_1ra BETWEEN 0 AND 99)),
  bomberos_2da INT CHECK (bomberos_2da IS NULL OR (bomberos_2da BETWEEN 0 AND 99)),
  bomberos_3ra INT CHECK (bomberos_3ra IS NULL OR (bomberos_3ra BETWEEN 0 AND 99)),
  bomberos_4ta INT CHECK (bomberos_4ta IS NULL OR (bomberos_4ta BETWEEN 0 AND 99)),
  bomberos_5ta INT CHECK (bomberos_5ta IS NULL OR (bomberos_5ta BETWEEN 0 AND 99)),
  bomberos_6ta INT CHECK (bomberos_6ta IS NULL OR (bomberos_6ta BETWEEN 0 AND 99)),

  -- Paso 8
  material_otro TEXT,
  moviles_otros_cb TEXT,

  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  enviado_at TIMESTAMPTZ
);

CREATE TABLE parte_material (
  parte_id UUID NOT NULL REFERENCES partes(id) ON DELETE CASCADE,
  material_id INT NOT NULL REFERENCES cat_material_mayor(id),
  PRIMARY KEY (parte_id, material_id)
);

-- Índices
CREATE INDEX idx_partes_estado ON partes(estado);
CREATE INDEX idx_partes_fecha ON partes(fecha_emergencia DESC);
CREATE INDEX idx_partes_created_by ON partes(created_by);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_partes_updated BEFORE UPDATE ON partes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-crear profile al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre_completo)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nombre_completo', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partes ENABLE ROW LEVEL SECURITY;
ALTER TABLE parte_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE cat_tipo_emergencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE cat_cargo_oficial ENABLE ROW LEVEL SECURITY;
ALTER TABLE cat_compania ENABLE ROW LEVEL SECURITY;
ALTER TABLE cat_material_mayor ENABLE ROW LEVEL SECURITY;

-- Catálogos: lectura para autenticados
CREATE POLICY "cat_tipo_emergencia_select" ON cat_tipo_emergencia FOR SELECT TO authenticated USING (activo = true);
CREATE POLICY "cat_cargo_oficial_select" ON cat_cargo_oficial FOR SELECT TO authenticated USING (activo = true);
CREATE POLICY "cat_compania_select" ON cat_compania FOR SELECT TO authenticated USING (activo = true);
CREATE POLICY "cat_material_mayor_select" ON cat_material_mayor FOR SELECT TO authenticated USING (activo = true);

-- Profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Partes: ver propios + admins ven todo
CREATE POLICY "partes_select" ON partes FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('admin', 'consulta'))
  );

CREATE POLICY "partes_insert" ON partes FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "partes_update" ON partes FOR UPDATE TO authenticated
  USING (
    (created_by = auth.uid() AND estado = 'borrador')
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "partes_delete" ON partes FOR DELETE TO authenticated
  USING (
    created_by = auth.uid() AND estado = 'borrador'
  );

-- Parte material
CREATE POLICY "parte_material_select" ON parte_material FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM partes p WHERE p.id = parte_id AND (
    p.created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND rol IN ('admin', 'consulta'))
  )));

CREATE POLICY "parte_material_insert" ON parte_material FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM partes p WHERE p.id = parte_id AND p.created_by = auth.uid() AND p.estado = 'borrador'));

CREATE POLICY "parte_material_delete" ON parte_material FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM partes p WHERE p.id = parte_id AND p.created_by = auth.uid() AND p.estado = 'borrador'));
