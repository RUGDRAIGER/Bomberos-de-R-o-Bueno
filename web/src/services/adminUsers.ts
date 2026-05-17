import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

export async function listProfilesForAdmin(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Profile[]
}

export async function setProfileActivo(userId: string, activo: boolean): Promise<void> {
  const { error } = await supabase.from('profiles').update({ activo }).eq('id', userId)
  if (error) throw error
}

export async function deleteUserAccount(targetUserId: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke<{ ok?: boolean; error?: string }>(
    'admin-delete-user',
    { body: { userId: targetUserId } }
  )
  if (error) throw new Error(error.message)
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String(data.error))
  }
}
