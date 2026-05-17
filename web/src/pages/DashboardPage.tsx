import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PofPdfButton } from '../components/PofPdfButton'
import { useAuth } from '../context/AuthContext'
import { listPartes } from '../services/partes'
import type { Parte } from '../types/database'
import { canDownloadPofPdf } from '../utils/pdfAccess'

type ParteRow = Pick<
  Parte,
  | 'id'
  | 'estado'
  | 'numero_oficial'
  | 'fecha_emergencia'
  | 'direccion_emergencia'
  | 'bombero_que_realiza_pof'
  | 'updated_at'
  | 'created_by'
>

export function DashboardPage() {
  const { user, profile } = useAuth()
  const [partes, setPartes] = useState<ParteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listPartes()
      .then((data) => setPartes((data ?? []) as ParteRow[]))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando partes...</p>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Mis partes</h2>
        <Link to="/nuevo" className="btn btn-primary">
          + Nuevo POF
        </Link>
      </div>
      {profile?.rol === 'admin' || profile?.rol === 'consulta' ? (
        <p className="hint" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          Como {profile.rol === 'admin' ? 'administrador' : 'consulta'} podés descargar el PDF de cualquier parte ya
          enviado.
        </p>
      ) : null}
      {partes.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>No hay partes. Cree un nuevo POF.</p>
      ) : (
        <div className="parte-list" style={{ marginTop: '1rem' }}>
          {partes.map((p) => {
            const dest = p.estado === 'borrador' ? `/parte/${p.id}` : `/ver/${p.id}`
            const pdfPermite = canDownloadPofPdf(profile?.rol, user?.id, p)
            return (
              <div key={p.id} className="parte-list-row">
                <Link to={dest} className="list-item parte-list-row-main">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong>
                      {p.numero_oficial != null ? <>N° {p.numero_oficial} · </> : null}
                      {p.fecha_emergencia ?? 'Sin fecha'} — {p.direccion_emergencia ?? 'POF'}
                    </strong>
                    <span className={`badge badge-${p.estado}`}>{p.estado}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#555' }}>
                    {p.direccion_emergencia ?? 'Sin dirección'} · {p.bombero_que_realiza_pof}
                  </div>
                </Link>
                <div className="parte-list-row-pdf">
                  {p.estado === 'enviado' ? (
                    <PofPdfButton
                      parteId={p.id}
                      canDownload={pdfPermite}
                      compact
                      blockedHint={pdfPermite ? null : 'Sin permiso'}
                    />
                  ) : (
                    <span className="hint hint-compact">PDF al enviar</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
