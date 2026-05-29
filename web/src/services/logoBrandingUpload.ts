import { supabase } from '../lib/supabase'

async function uploadLogo(path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from('pof-assets').upload(path, file, {
    upsert: true,
    contentType: 'image/png',
  })
  if (error) throw error
  return path
}

export async function saveComandanciaLogoDefault(file: File): Promise<string> {
  const path = 'comandancia/logo.png'
  await uploadLogo(path, file)
  const { error } = await supabase
    .from('pdf_branding')
    .update({ comandancia_logo_path: path })
    .eq('id', 1)
  if (error) throw error
  return path
}

export async function saveCompaniaLogoDefault(companiaId: number, file: File): Promise<string> {
  const path = `companias/${companiaId}.png`
  await uploadLogo(path, file)
  const { error } = await supabase.from('compania_pdf_logo').upsert(
    { compania_id: companiaId, logo_path: path },
    { onConflict: 'compania_id' }
  )
  if (error) throw error
  return path
}
