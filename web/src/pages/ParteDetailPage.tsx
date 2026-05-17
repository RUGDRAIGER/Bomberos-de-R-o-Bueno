import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PofPdfButton } from '../components/PofPdfButton'
import { useAuth } from '../context/AuthContext'
import { getParte } from '../services/partes'
import type { Parte } from '../types/database'
import { canDownloadPofPdf } from '../utils/pdfAccess'

export function ParteDetailPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [parte, setParte] = useState<Parte | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getParte(id)
      .then(setParte)
      .catch((e) => setError(e.message))
  }, [id])

  if (error) return <div className="alert alert-error">{error}</div>
  if (!parte) return <p>Cargando...</p>

  const pdfOk = canDownloadPofPdf(profile?.rol, user?.id, parte)

  return (
    <div className="card parte-detail-card">
      <div className="parte-detail-header">
        <div>
          <h2 style={{ margin: 0 }}>Detalle POF</h2>
          {parte.numero_oficial != null ? (
            <p className="parte-numero-oficial">Registro oficial N° {parte.numero_oficial}</p>
          ) : null}
        </div>
        <span className={`badge badge-${parte.estado}`}>{parte.estado}</span>
      </div>

      <section className="parte-pdf-panel" aria-labelledby="pdf-heading">
        <h3 id="pdf-heading" className="section-title" style={{ marginTop: '1.25rem' }}>
          Documento PDF
        </h3>
        <p className="hint" style={{ marginTop: 0 }}>
          El PDF se genera en tu dispositivo al pulsar el botón (no se guarda automáticamente en el servidor).
        </p>
        <PofPdfButton
          parteId={parte.id}
          canDownload={pdfOk}
          blockedHint={
            parte.estado === 'borrador'
              ? 'El PDF estará disponible cuando envíes el parte (no se puede descargar en borrador).'
              : 'No tenés permiso para descargar este parte.'
          }
        />
      </section>

      <dl style={{ marginTop: '1rem' }}>
        <dt>Bombero POF</dt>
        <dd>{parte.bombero_que_realiza_pof}</dd>
        <dt>Fecha</dt>
        <dd>{parte.fecha_emergencia}</dd>
        <dt>Dirección</dt>
        <dd>{parte.direccion_emergencia}</dd>
        <dt>Horas</dt>
        <dd>
          {parte.hora_inicio} → {parte.hora_llegada_primera_unidad} → {parte.hora_termino}
        </dd>
        <dt>Mando</dt>
        <dd>{parte.tipo_mando}</dd>
        <dt>Observaciones</dt>
        <dd>{parte.observaciones}</dd>
      </dl>

      <div className="parte-detail-actions">
        {parte.estado === 'borrador' ? (
          <Link to={`/parte/${parte.id}`} className="btn btn-primary btn-pdf-full">
            Continuar edición
          </Link>
        ) : null}
        <Link to="/" className="btn btn-ghost btn-pdf-full">
          ← Volver al listado
        </Link>
      </div>
    </div>
  )
}
