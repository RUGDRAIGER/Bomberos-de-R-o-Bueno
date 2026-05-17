import { useState } from 'react'
import { fetchParteInformeVm } from '../services/parteInforme'

type Props = {
  parteId: string
  canDownload: boolean
  compact?: boolean
  blockedHint?: string | null
}

export function PofPdfButton({
  parteId,
  canDownload,
  compact,
  blockedHint,
}: Props) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleClick() {
    setErr(null)
    setBusy(true)
    try {
      const vm = await fetchParteInformeVm(parteId)
      const { downloadPofPdf } = await import('../pdf/downloadPofPdf')
      await downloadPofPdf(vm)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'No se pudo generar el PDF')
    } finally {
      setBusy(false)
    }
  }

  if (!canDownload) {
    if (!blockedHint) return null
    return (
      <p className={`hint ${compact ? 'hint-compact' : ''}`} role="note">
        {blockedHint}
      </p>
    )
  }

  return (
    <div className={compact ? 'pof-pdf-stack pof-pdf-stack--compact' : 'pof-pdf-stack'}>
      <button
        type="button"
        className={`btn btn-secondary ${compact ? 'btn-pdf-compact' : 'btn-pdf-full'}`}
        onClick={() => void handleClick()}
        disabled={busy}
      >
        {busy ? 'Generando PDF…' : 'Descargar PDF'}
      </button>
      {err ? <div className="alert alert-error">{err}</div> : null}
    </div>
  )
}
