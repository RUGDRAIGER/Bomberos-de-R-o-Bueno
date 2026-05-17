import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!url || !key) {
  console.warn(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Copiá web/.env.example a web/.env.local y completá los valores.'
  )
}

/** Sin fallback a proyecto real: en repo público solo lectura desde variables de entorno. */
export const supabase = createClient(
  url || 'https://configure-env.invalid',
  key || 'configure-env-anon-key'
)
