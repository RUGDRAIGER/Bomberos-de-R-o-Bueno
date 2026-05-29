import { useState } from 'react'
import { PdfPrepararModal } from './pdf/PdfPrepararModal'
import { useAuth } from '../context/AuthContext'
import { getParte } from '../services/partes'

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
  const { profile, user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [puedeGuardarFirma, setPuedeGuardarFirma] = useState(false)

  async function abrirModal() {
    try {
      const p = await getParte(parteId)
      setPuedeGuardarFirma(p.estado === 'borrador' && p.created_by === user?.id)
    } catch {
      setPuedeGuardarFirma(false)
    }
    setModalOpen(true)
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
    <>
      <div className={compact ? 'pof-pdf-stack pof-pdf-stack--compact' : 'pof-pdf-stack'}>
        <button
          type="button"
          className={`btn ${compact ? 'btn-pdf-compact btn-primary' : 'btn-primary btn-pdf-full'}`}
          onClick={() => void abrirModal()}
        >
          {compact ? '📄 PDF' : '📄 Preparar y descargar PDF'}
        </button>
        {!compact ? (
          <p className="hint" style={{ margin: 0 }}>
            Logos, firma y documento final en un solo paso.
          </p>
        ) : null}
      </div>

      {modalOpen ? (
        <PdfPrepararModal
          parteId={parteId}
          isAdmin={profile?.rol === 'admin'}
          puedeGuardarFirma={puedeGuardarFirma}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </>
  )
}
