import { supabase } from '../lib/supabase'
import type { Parte, ParteEstado } from '../types/database'

export type ParteAdminRow = Parte & {
  creador: { nombre_completo: string | null; email: string | null } | null
}

export async function listAllPartesForAdmin(estado?: ParteEstado | 'todos'): Promise<ParteAdminRow[]> {
  let q = supabase
    .from('partes')
    .select(
      `
      *,
      creador:profiles!partes_created_by_fkey ( nombre_completo, email )
    `
    )
    .order('updated_at', { ascending: false })

  if (estado && estado !== 'todos') {
    q = q.eq('estado', estado)
  }

  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as ParteAdminRow[]
}
