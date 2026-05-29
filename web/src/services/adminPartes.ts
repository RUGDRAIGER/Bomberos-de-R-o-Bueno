import { supabase } from '../lib/supabase'
import type { Parte, ParteEstado } from '../types/database'

export type ParteAdminRow = Parte & {
  creador: { nombre_completo: string | null; email: string | null } | null
}

/**
 * Lista todos los partes (admin/consulta vía RLS).
 * No usa embed a profiles: created_by referencia auth.users, no public.profiles.
 */
export async function listAllPartesForAdmin(estado?: ParteEstado | 'todos'): Promise<ParteAdminRow[]> {
  let q = supabase.from('partes').select('*').order('updated_at', { ascending: false })

  if (estado && estado !== 'todos') {
    q = q.eq('estado', estado)
  }

  const { data: partes, error } = await q
  if (error) throw error
  const rows = (partes ?? []) as Parte[]

  const authorIds = [...new Set(rows.map((p) => p.created_by).filter((id): id is string => Boolean(id)))]
  const creadorById = new Map<string, { nombre_completo: string | null; email: string | null }>()

  if (authorIds.length > 0) {
    const { data: profiles, error: profErr } = await supabase
      .from('profiles')
      .select('id, nombre_completo, email')
      .in('id', authorIds)

    if (profErr) {
      console.warn('No se pudieron cargar perfiles de autores:', profErr.message)
    } else {
      for (const pr of profiles ?? []) {
        creadorById.set(pr.id as string, {
          nombre_completo: pr.nombre_completo as string | null,
          email: pr.email as string | null,
        })
      }
    }
  }

  return rows.map((p) => ({
    ...p,
    creador: p.created_by ? creadorById.get(p.created_by) ?? null : null,
  }))
}
