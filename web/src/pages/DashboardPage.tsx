import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listPartes } from '../services/partes'

interface ParteRow {
  id: string
  estado: string
  fecha_emergencia: string | null
  direccion_emergencia: string | null
  bombero_que_realiza_pof: string | null
  updated_at: string
}

export function DashboardPage() {
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
      {partes.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>No hay partes. Cree un nuevo POF.</p>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          {partes.map((p) => (
            <Link
              key={p.id}
              to={p.estado === 'borrador' ? `/parte/${p.id}` : `/ver/${p.id}`}
              className="list-item"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <strong>
                  {p.fecha_emergencia ?? 'Sin fecha'} — {p.direccion_emergencia ?? 'POF'}
                </strong>
                <span className={`badge badge-${p.estado}`}>{p.estado}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>
                {p.direccion_emergencia ?? 'Sin dirección'} · {p.bombero_que_realiza_pof}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
