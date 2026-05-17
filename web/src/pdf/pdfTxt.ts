export function pdfTxt(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return '—'
  const s = String(v).trim()
  return s === '' ? '—' : s
}
