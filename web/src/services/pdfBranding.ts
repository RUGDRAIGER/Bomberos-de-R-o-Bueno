import { supabase } from '../lib/supabase'
import { storagePublicObjectUrl } from '../lib/storagePublicUrl'
import type { PdfBrandingVm } from '../types/parte-informe'

function num(v: unknown, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const FALLBACK: PdfBrandingVm = {
  comandanciaLogoUrl: null,
  companiaLogoUrl: null,
  cmdTop: 28,
  cmdRight: 32,
  cmdWidth: 88,
  ciaBottom: 40,
  ciaLeft: 32,
  ciaWidth: 76,
}

export async function fetchPdfBrandingVm(companiaId: number | null): Promise<PdfBrandingVm> {
  try {
    const { data: row, error: e1 } = await supabase.from('pdf_branding').select('*').eq('id', 1).maybeSingle()
    if (e1 || !row) return { ...FALLBACK }

    const cmdPath = row.comandancia_logo_path as string | null
    const comandanciaLogoUrl = cmdPath ? storagePublicObjectUrl(cmdPath) : null

    let companiaLogoUrl: string | null = null
    if (companiaId) {
      const { data: cia } = await supabase
        .from('compania_pdf_logo')
        .select('logo_path')
        .eq('compania_id', companiaId)
        .maybeSingle()
      const p = cia?.logo_path as string | undefined
      if (p) companiaLogoUrl = storagePublicObjectUrl(p)
    }

    return {
      comandanciaLogoUrl,
      companiaLogoUrl,
      cmdTop: num(row.comandancia_top_pt, FALLBACK.cmdTop),
      cmdRight: num(row.comandancia_right_pt, FALLBACK.cmdRight),
      cmdWidth: num(row.comandancia_width_pt, FALLBACK.cmdWidth),
      ciaBottom: num(row.compania_bottom_pt, FALLBACK.ciaBottom),
      ciaLeft: num(row.compania_left_pt, FALLBACK.ciaLeft),
      ciaWidth: num(row.compania_width_pt, FALLBACK.ciaWidth),
    }
  } catch {
    return { ...FALLBACK }
  }
}
