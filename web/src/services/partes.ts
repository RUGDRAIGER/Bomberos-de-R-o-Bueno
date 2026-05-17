import { supabase } from '../lib/supabase'
import type { Parte, ParteFormData } from '../types/database'

export async function listPartes() {
  const { data, error } = await supabase
    .from('partes')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getParte(id: string) {
  const { data, error } = await supabase.from('partes').select('*').eq('id', id).single()
  if (error) throw error
  return data as Parte
}

export async function getParteMaterial(parteId: string) {
  const { data, error } = await supabase
    .from('parte_material')
    .select('material_id')
    .eq('parte_id', parteId)
  if (error) throw error
  return (data ?? []).map((r) => r.material_id as number)
}

export async function createParte(userId: string) {
  const { data, error } = await supabase
    .from('partes')
    .insert({
      created_by: userId,
      updated_by: userId,
      estado: 'borrador',
      paso_actual: 1,
    })
    .select()
    .single()
  if (error) throw error
  return data as Parte
}

export async function updateParte(id: string, payload: ParteFormData, userId: string) {
  const { material_ids, ...rest } = payload
  const { error } = await supabase
    .from('partes')
    .update({ ...rest, updated_by: userId })
    .eq('id', id)
  if (error) throw error

  if (material_ids !== undefined) {
    await supabase.from('parte_material').delete().eq('parte_id', id)
    if (material_ids.length > 0) {
      const rows = material_ids.map((material_id) => ({ parte_id: id, material_id }))
      const { error: matErr } = await supabase.from('parte_material').insert(rows)
      if (matErr) throw matErr
    }
  }
}

export async function enviarParte(id: string, userId: string) {
  const { error } = await supabase
    .from('partes')
    .update({
      estado: 'enviado',
      enviado_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq('id', id)
    .eq('estado', 'borrador')
  if (error) throw error
}

export async function deleteParte(id: string) {
  const { error } = await supabase.from('partes').delete().eq('id', id).eq('estado', 'borrador')
  if (error) throw error
}
