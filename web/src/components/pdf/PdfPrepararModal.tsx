import { useEffect, useRef, useState } from 'react'
import { FirmaPanel, type FirmaPanelHandle } from '../signature/FirmaPanel'
import { fetchParteInformeVm } from '../../services/parteInforme'
import { uploadFirmaPng } from '../../services/firmaUpload'
import {
  saveComandanciaLogoDefault,
  saveCompaniaLogoDefault,
} from '../../services/logoBrandingUpload'
import { applyPdfPrepOverrides } from '../../utils/pdfVmOverrides'
import { readFileAsDataUrl } from '../../utils/imageFile'
import type { ParteInformeVm } from '../../types/parte-informe'
import { ImageUploadZone } from './ImageUploadZone'

type Props = {
  parteId: string
  isAdmin: boolean
  puedeGuardarFirma: boolean
  onClose: () => void
}

export function PdfPrepararModal({
  parteId,
  isAdmin,
  puedeGuardarFirma,
  onClose,
}: Props) {
  const firmaRef = useRef<FirmaPanelHandle>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [vm, setVm] = useState<ParteInformeVm | null>(null)

  const [logoCuerpo, setLogoCuerpo] = useState<string | null>(null)
  const [logoCompania, setLogoCompania] = useState<string | null>(null)
  const [firmaPreview, setFirmaPreview] = useState<string | null>(null)
  const [guardarLogosDefault, setGuardarLogosDefault] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchParteInformeVm(parteId)
      .then((data) => {
        if (cancelled) return
        setVm(data)
        setLogoCuerpo(data.branding.comandanciaLogoUrl)
        setLogoCompania(data.branding.companiaLogoUrl)
        setFirmaPreview(data.firmaUrl)
      })
      .catch((e) => {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Error al cargar datos')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [parteId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onClose])

  async function resolverFirmaUrl(): Promise<string | null> {
    const blob = await firmaRef.current?.toBlob()
    if (!blob) return firmaPreview
    if (puedeGuardarFirma) await uploadFirmaPng(parteId, blob)
    return readFileAsDataUrl(blob)
  }

  async function generarPdf() {
    if (!vm) return
    setErr(null)
    setBusy(true)
    try {
      const companiaId = vm.parte.bombero_compania_id
      if (isAdmin && guardarLogosDefault) {
        if (logoCuerpo?.startsWith('data:')) {
          const blob = await (await fetch(logoCuerpo)).blob()
          await saveComandanciaLogoDefault(new File([blob], 'logo.png', { type: 'image/png' }))
        }
        if (companiaId && logoCompania?.startsWith('data:')) {
          const blob = await (await fetch(logoCompania)).blob()
          await saveCompaniaLogoDefault(
            companiaId,
            new File([blob], 'logo.png', { type: 'image/png' })
          )
        }
      }

      const firmaUrl = await resolverFirmaUrl()
      const finalVm = applyPdfPrepOverrides(vm, {
        comandanciaLogoUrl: logoCuerpo,
        companiaLogoUrl: logoCompania,
        firmaUrl: firmaUrl ?? firmaPreview,
      })

      const { downloadPofPdf } = await import('../../pdf/downloadPofPdf')
      await downloadPofPdf(finalVm)
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'No se pudo generar el PDF')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pdf-prep-title">
      <div className="modal-sheet pdf-prep-modal">
        <header className="pdf-prep-header">
          <div>
            <h2 id="pdf-prep-title">Preparar documento PDF</h2>
            <p className="pdf-prep-lead">
              Subí los logos y configurá la firma antes de generar el PDF final.
            </p>
          </div>
          <button
            type="button"
            className="modal-close"
            aria-label="Cerrar"
            disabled={busy}
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        {loading ? (
          <div className="pdf-prep-loading">Cargando datos del parte…</div>
        ) : err && !vm ? (
          <div className="alert alert-error">{err}</div>
        ) : vm ? (
          <div className="pdf-prep-body">
            <section className="pdf-prep-section">
              <h3 className="pdf-prep-section-title">Logos del documento</h3>
              <div className="pdf-prep-grid">
                <ImageUploadZone
                  label="Logo del Cuerpo de Bomberos"
                  hint="PNG transparente. Esquina superior del PDF."
                  previewUrl={logoCuerpo}
                  onChange={setLogoCuerpo}
                  emptyIcon="🚒"
                />
                <ImageUploadZone
                  label={
                    vm.companiaNombre
                      ? `Logo compañía — ${vm.companiaNombre}`
                      : 'Logo de la compañía de bomberos'
                  }
                  hint="PNG transparente. Página 2 del PDF."
                  previewUrl={logoCompania}
                  onChange={setLogoCompania}
                  emptyIcon="🔥"
                />
              </div>
              {isAdmin ? (
                <label className="pdf-prep-check">
                  <input
                    type="checkbox"
                    checked={guardarLogosDefault}
                    onChange={(e) => setGuardarLogosDefault(e.target.checked)}
                  />
                  Guardar logos subidos como predeterminados del sistema
                </label>
              ) : null}
            </section>

            <section className="pdf-prep-section">
              <h3 className="pdf-prep-section-title">Firma del responsable</h3>
              <FirmaPanel
                ref={firmaRef}
                initialPreview={firmaPreview}
                onPreviewChange={setFirmaPreview}
              />
              {!puedeGuardarFirma ? (
                <p className="hint">
                  El parte ya fue enviado: la firma se usará solo en este PDF (no se modifica el
                  registro guardado).
                </p>
              ) : (
                <p className="hint">
                  Al generar el PDF, la firma se guardará en el parte si dibujó o subió una nueva.
                </p>
              )}
            </section>

            {err ? <div className="alert alert-error">{err}</div> : null}
          </div>
        ) : null}

        <footer className="pdf-prep-footer">
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-success btn-lg"
            disabled={busy || loading || !vm}
            onClick={() => void generarPdf()}
          >
            {busy ? 'Generando PDF…' : '📄 Generar y descargar PDF'}
          </button>
        </footer>
      </div>
    </div>
  )
}
