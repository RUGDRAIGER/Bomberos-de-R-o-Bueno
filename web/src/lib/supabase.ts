import { createClient } from '@supabase/supabase-js'

/**
 * Limpia el valor de una variable de entorno y lo normaliza.
 * Acepta valores con o sin https://, con o sin el sufijo .supabase.co.
 */
function normalizeUrl(raw: unknown): string {
  if (raw == null) return ''
  let s = String(raw).trim().replace(/^["'`]+|["'`]+$/g, '').trim()
  if (!s || s === 'undefined' || s === 'null' || s === 'configure-env.invalid') return ''

  // Si parece solo el ref del proyecto (solo letras/números, sin puntos ni slash)
  if (/^[a-z0-9]{10,30}$/.test(s)) {
    s = `https://${s}.supabase.co`
  }
  // Si tiene dominio pero le falta el protocolo
  if (!s.startsWith('http')) {
    s = `https://${s}`
  }
  // Quitar slash final
  return s.replace(/\/+$/, '')
}

function normalizeKey(raw: unknown): string {
  if (raw == null) return ''
  const s = String(raw).trim().replace(/^["'`]+|["'`]+$/g, '').trim()
  if (!s || s === 'undefined' || s === 'null') return ''
  return s
}

function isValidHttpUrl(url: string): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

const rawUrl = normalizeUrl(import.meta.env.VITE_SUPABASE_URL)
const rawKey = normalizeKey(import.meta.env.VITE_SUPABASE_ANON_KEY)

/** true solo cuando ambos valores son válidos */
export const supabaseReady = isValidHttpUrl(rawUrl) && rawKey.length >= 20

const safeUrl = supabaseReady
  ? rawUrl
  : 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co'

const safeKey = supabaseReady
  ? rawKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder-no-build-env'

if (!supabaseReady) {
  console.warn(
    '[POF] Supabase no configurado. Revisá los secrets en GitHub Actions: ' +
    'VITE_SUPABASE_URL debe ser https://xxx.supabase.co y VITE_SUPABASE_ANON_KEY la clave anon.'
  )
}

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: supabaseReady,
    autoRefreshToken: supabaseReady,
    detectSessionInUrl: supabaseReady,
  },
})
