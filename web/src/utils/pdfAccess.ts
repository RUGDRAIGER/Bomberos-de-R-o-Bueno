import type { AppRole } from '../types/database'

type PdfPermisoParte = {
  estado: 'borrador' | 'enviado'
  created_by: string | null
}

/**
 * Admin puede descargar cualquier parte (incluido borrador, para revisar formato).
 * Consulta puede descargar cualquier enviado.
 * Bombero solo el suyo enviado.
 */
export function canDownloadPofPdf(
  rol: AppRole | undefined,
  userId: string | undefined,
  parte: PdfPermisoParte
): boolean {
  if (!userId) return false
  if (rol === 'admin') return true
  if (parte.estado !== 'enviado') return false
  if (rol === 'consulta') return true
  return parte.created_by === userId
}
