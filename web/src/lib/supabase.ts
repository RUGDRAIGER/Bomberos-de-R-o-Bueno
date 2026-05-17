import { createClient } from '@supabase/supabase-js'

function normalize(raw: unknown): string {
  if (raw == null) return ''
  const s = String(raw)
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim()
  if (s === 'undefined' || s === 'null') return ''
  return s
}

function isValidHttpUrl(url: string): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const rawUrl = normalize(import.meta.env.VITE_SUPABASE_URL)
const rawKey = normalize(import.meta.env.VITE_SUPABASE_ANON_KEY)

/** False si el build no trajo URL/key válidos (Pages sin secrets, comillas en el secret, etc.). */
export const supabaseReady =
  isValidHttpUrl(rawUrl) && rawKey.length >= 20

const safeUrl = supabaseReady ? rawUrl.replace(/\/$/, '') : 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co'
const safeKey = supabaseReady
  ? rawKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder-no-build-env'

if (!supabaseReady) {
  console.warn(
    '[POF] VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no son válidos en este build. GitHub → Settings → Secrets → Actions: valores sin comillas, URL https://….supabase.co'
  )
}

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: supabaseReady,
    autoRefreshToken: supabaseReady,
    detectSessionInUrl: supabaseReady,
  },
})
