import { useEffect, useMemo, useState } from 'react'
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

  const stats = useMemo(() => {
    const enviados = partes.filter((p) => p.estado === 'enviado').length
    const borradores = partes.filter((p) => p.estado === 'borrador').length
    return { total: partes.length, enviados, borradores }
  }, [partes])

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--gris-500)' }}>
        Cargando partes…
      </div>
    )
  }
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <>
      <div className="page-hero">
        <h2>Mis partes de operaciones</h2>
        <p>Parte de Operaciones Finales 2026 — Cuerpo de Bomberos de Río Bueno</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <strong>{stats.total}</strong>
          <span>Total</span>
        </div>
        <div className="stat-card">
          <strong>{stats.enviados}</strong>
          <span>Enviados</span>
        </div>
        <div className="stat-card">
          <strong>{stats.borradores}</strong>
          <span>Borradores</span>
        </div>
      </div>

      <div className="card">
        <div className="dashboard-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Listado</h2>
          <Link to="/nuevo" className="btn btn-primary">+ Nuevo POF</Link>
        </div>

        {profile?.rol === 'admin' ? (
          <div className="alert alert-info" style={{ marginBottom: '0.75rem' }}>
            Modo administrador: podés preparar y descargar el PDF de cualquier parte.
          </div>
        ) : null}

        {partes.length === 0 ? (
          <div className="parte-list-empty">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
            <p style={{ margin: 0 }}>No hay partes aún. Creá tu primer POF.</p>
            <Link to="/nuevo" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Crear primer POF
            </Link>
          </div>
        ) : (
          <div className="parte-list">
            {partes.map((p) => {
              const dest = p.estado === 'borrador' ? `/parte/${p.id}` : `/ver/${p.id}`
              const pdfPermite = canDownloadPofPdf(profile?.rol, user?.id, p)
              return (
                <div key={p.id} className="parte-list-row">
                  <Link to={dest} className="parte-list-row-main">
                    <div className="parte-list-title">
                      <strong>
                        {p.numero_oficial != null
                          ? `N°\u00a0${p.numero_oficial} · `
                          : null}
                        {p.fecha_emergencia ?? 'Sin fecha'}
                      </strong>
                      <span className={`badge badge-${p.estado}`}>{p.estado}</span>
                    </div>
                    <div className="parte-list-sub">
                      {p.direccion_emergencia ?? 'Sin dirección'} · {p.bombero_que_realiza_pof}
                    </div>
                  </Link>
                  <div className="parte-list-row-pdf">
                    {pdfPermite ? (
                      <PofPdfButton parteId={p.id} canDownload compact />
                    ) : (
                      <span className="hint hint-compact">
                        {p.estado === 'borrador' ? 'PDF al enviar' : 'Sin permiso'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
