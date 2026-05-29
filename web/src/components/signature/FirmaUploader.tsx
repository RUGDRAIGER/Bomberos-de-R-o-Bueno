import { useRef, useState } from 'react'
import { FirmaPanel, type FirmaPanelHandle } from './FirmaPanel'
import { uploadFirmaPng } from '../../services/firmaUpload'

export function FirmaUploader({
  parteId,
  tieneFirma,
  onSaved,
}: {
  parteId: string | null
  tieneFirma: boolean
  onSaved: (payload: { path: string; firmado_at: string }) => void
}) {
  const firmaRef = useRef<FirmaPanelHandle>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!parteId) {
    return <p className="hint">Avance con «Siguiente» para crear el borrador y poder firmar.</p>
  }

  async function guardar() {
    const pid = parteId
    if (!pid) return
    setMsg(null)
    const blob = await firmaRef.current?.toBlob()
    if (!blob) {
      setMsg('Dibuje la firma o suba un PNG.')
      return
    }
    setBusy(true)
    try {
      const out = await uploadFirmaPng(pid, blob)
      onSaved(out)
      firmaRef.current?.clear()
      setMsg('Firma guardada.')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'No se pudo guardar la firma')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="field">
      <label>Firma digital (opcional)</label>
      {tieneFirma && <p className="hint">Ya existe firma; guardar de nuevo la reemplaza.</p>}
      <FirmaPanel ref={firmaRef} />
      <div className="wizard-actions" style={{ marginTop: '0.75rem' }}>
        <button type="button" className="btn btn-secondary" onClick={() => firmaRef.current?.clear()}>
          Limpiar
        </button>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void guardar()}>
          {busy ? 'Guardando…' : 'Guardar firma'}
        </button>
      </div>
      {msg && <p className="hint">{msg}</p>}
    </div>
  )
}
