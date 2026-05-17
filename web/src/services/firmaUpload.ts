import { supabase } from '../lib/supabase'

export async function uploadFirmaPng(
  parteId: string,
  blob: Blob
): Promise<{ path: string; firmado_at: string }> {
  const path = `firmas/${parteId}.png`
  const { error: upErr } = await supabase.storage.from('pof-assets').upload(path, blob, {
    upsert: true,
    contentType: 'image/png',
  })
  if (upErr) throw upErr

  const firmado_at = new Date().toISOString()
  const { error: dbErr } = await supabase
    .from('partes')
    .update({ firma_path: path, firmado_at })
    .eq('id', parteId)

  if (dbErr) throw dbErr
  return { path, firmado_at }
}
