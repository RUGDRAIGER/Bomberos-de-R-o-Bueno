import type { AppRole } from '../types/database'

type PdfPermisoParte = {
  estado: 'borrador' | 'enviado'
  created_by: string | null
}

/** Solo partes enviados; admin/consulta cualquier enviado; bombero solo el propio. */
export function canDownloadPofPdf(
  rol: AppRole | undefined,
  userId: string | undefined,
  parte: PdfPermisoParte
): boolean {
  if (parte.estado !== 'enviado') return false
  if (!userId) return false
  if (rol === 'admin' || rol === 'consulta') return true
  return parte.created_by === userId
}
