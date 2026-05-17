import { useState } from 'react'
import { fetchParteInformeVm } from '../services/parteInforme'

export function PofPdfButton({ parteId }: { parteId: string }) {
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

  return (
    <div>
      <button type="button" className="btn btn-secondary" onClick={handleClick} disabled={busy}>
        {busy ? 'Generando PDF…' : 'Descargar PDF'}
      </button>
      {err && <div className="alert alert-error">{err}</div>}
    </div>
  )
}
