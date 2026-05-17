import { supabase } from '../lib/supabase'

export async function fetchTiposEmergencia() {
  const { data, error } = await supabase
    .from('cat_tipo_emergencia')
    .select('id, codigo, descripcion')
    .eq('activo', true)
    .order('orden')
  if (error) throw error
  return data ?? []
}

export async function fetchCargosOficial() {
  const { data, error } = await supabase
    .from('cat_cargo_oficial')
    .select('id, nombre')
    .eq('activo', true)
    .order('orden')
  if (error) throw error
  return data ?? []
}

export async function fetchCompanias() {
  const { data, error } = await supabase
    .from('cat_compania')
    .select('id, nombre')
    .eq('activo', true)
    .order('orden')
  if (error) throw error
  return data ?? []
}

export async function fetchMaterialMayor() {
  const { data, error } = await supabase
    .from('cat_material_mayor')
    .select('id, codigo, descripcion')
    .eq('activo', true)
    .order('orden')
  if (error) throw error
  return data ?? []
}
