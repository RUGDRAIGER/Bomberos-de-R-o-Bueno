import { storagePublicObjectUrl } from '../lib/storagePublicUrl'
import { supabase } from '../lib/supabase'
import type { Parte } from '../types/database'
import type { ParteInformeVm } from '../types/parte-informe'
import { getParteMaterial } from './partes'
import { fetchPdfBrandingVm } from './pdfBranding'

async function fetchTipoLabel(id: number | null): Promise<string | null> {
  if (!id) return null
  const { data } = await supabase
    .from('cat_tipo_emergencia')
    .select('codigo, descripcion')
    .eq('id', id)
    .maybeSingle()
  if (!data) return null
  return `${data.codigo} — ${data.descripcion}`
}

async function fetchCargoNombre(id: number | null): Promise<string | null> {
  if (!id) return null
  const { data } = await supabase.from('cat_cargo_oficial').select('nombre').eq('id', id).maybeSingle()
  return data?.nombre ?? null
}

async function fetchCompaniaNombre(id: number | null): Promise<string | null> {
  if (!id) return null
  const { data } = await supabase.from('cat_compania').select('nombre').eq('id', id).maybeSingle()
  return data?.nombre ?? null
}

async function fetchMaterialesLabels(parteId: string): Promise<string[]> {
  const ids = await getParteMaterial(parteId)
  if (ids.length === 0) return []
  const { data, error } = await supabase
    .from('cat_material_mayor')
    .select('codigo, descripcion')
    .in('id', ids)
  if (error) throw error
  return (data ?? []).map((m) => `${m.codigo} (${m.descripcion})`)
}

export async function fetchParteInformeVm(parteId: string): Promise<ParteInformeVm> {
  const { data: row, error } = await supabase.from('partes').select('*').eq('id', parteId).single()
  if (error) throw error
  const parte = row as Parte

  const [tipoEmergenciaLabel, oficialCargoNombre, companiaNombre, materialesLabels, branding] =
    await Promise.all([
      fetchTipoLabel(parte.tipo_emergencia_id),
      fetchCargoNombre(parte.oficial_cargo_id),
      fetchCompaniaNombre(parte.bombero_compania_id),
      fetchMaterialesLabels(parteId),
      fetchPdfBrandingVm(parte.bombero_compania_id),
    ])

  return {
    parte,
    tipoEmergenciaLabel,
    oficialCargoNombre,
    companiaNombre,
    materialesLabels,
    branding,
    firmaUrl: parte.firma_path ? storagePublicObjectUrl(parte.firma_path) : null,
  }
}
