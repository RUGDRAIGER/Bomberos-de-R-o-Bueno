/** Mensajes más claros para registro / sesión (Supabase en inglés). */
export function mapSupabaseAuthMessage(msg: string | null): string | null {
  if (!msg) return null
  const lower = msg.toLowerCase()
  if (
    lower.includes('already registered') ||
    lower.includes('user already registered') ||
    lower.includes('already been registered')
  ) {
    return 'Ya existe una cuenta con ese correo. Use «Ya tengo cuenta» para ingresar.'
  }
  return msg
}
