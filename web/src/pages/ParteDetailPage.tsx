import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PofPdfButton } from '../components/PofPdfButton'
import { useAuth } from '../context/AuthContext'
import { getParte } from '../services/partes'
import type { Parte } from '../types/database'
import { canDownloadPofPdf } from '../utils/pdfAccess'

function DatoFila({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value ?? '—'}</dd>
    </div>
  )
}

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
  if (!parte) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gris-500)' }}>Cargando…</div>
  )

  const pdfOk = canDownloadPofPdf(profile?.rol, user?.id, parte)

  const horario = [parte.hora_inicio, parte.hora_llegada_primera_unidad, parte.hora_termino]
    .filter(Boolean).join(' → ')

  return (
    <div className="card parte-detail-card">
      {/* Cabecera */}
      <div className="parte-detail-hero">
        <div>
          <h2>Detalle POF</h2>
          {parte.numero_oficial != null ? (
            <p className="parte-numero-oficial">Registro oficial N°&nbsp;{parte.numero_oficial}</p>
          ) : null}
        </div>
        <span className={`badge badge-${parte.estado}`}>{parte.estado}</span>
      </div>

      {/* Panel PDF */}
      <div className="parte-pdf-panel">
        <div className="parte-pdf-panel-text">
          <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
            Documento PDF
          </strong>
          <p>
            {pdfOk
              ? 'Generado en tu dispositivo al pulsar el botón.'
              : parte.estado === 'borrador'
              ? 'Disponible al enviar el parte.'
              : 'Sin permiso para descargar.'}
          </p>
        </div>
        <PofPdfButton
          parteId={parte.id}
          canDownload={pdfOk}
          blockedHint={null}
        />
      </div>

      {/* Datos */}
      <div className="parte-detail-body">
        <p className="section-title">Datos del parte</p>
        <dl className="parte-detail-dl">
          <DatoFila label="Bombero POF" value={parte.bombero_que_realiza_pof} />
          <DatoFila label="Fecha emergencia" value={parte.fecha_emergencia} />
          <DatoFila label="Dirección" value={parte.direccion_emergencia} />
          <DatoFila label="Horario" value={horario || null} />
          <DatoFila label="Área" value={parte.area_intervencion} />
          <DatoFila label="Tipo mando" value={parte.tipo_mando} />
          <DatoFila label="Bombero a cargo" value={parte.bombero_nombre_a_cargo} />
          <DatoFila label="Empresas externas" value={parte.empresas_externas} />
        </dl>
        {parte.observaciones ? (
          <div style={{ marginTop: '1rem' }}>
            <p className="section-title">Observaciones</p>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.55 }}>
              {parte.observaciones}
            </p>
          </div>
        ) : null}
      </div>

      {/* Acciones */}
      <div className="parte-detail-actions">
        {parte.estado === 'borrador' ? (
          <Link to={`/parte/${parte.id}`} className="btn btn-primary">
            Continuar edición
          </Link>
        ) : null}
        <Link to="/" className="btn btn-ghost">← Volver</Link>
      </div>
    </div>
  )
}
