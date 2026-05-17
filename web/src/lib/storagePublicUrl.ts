const BUCKET = 'pof-assets'

export function storagePublicObjectUrl(relativePath: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '') ?? ''
  const path = relativePath.replace(/^\/+/, '')
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`
}
