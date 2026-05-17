import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

export async function fetchProfileByUserId(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data as Profile | null
}
