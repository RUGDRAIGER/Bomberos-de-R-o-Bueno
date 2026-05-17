import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getParte } from '../services/partes'
import type { Parte } from '../types/database'

export function ParteDetailPage() {
  const { id } = useParams()
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

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Detalle POF</h2>
        <span className={`badge badge-${parte.estado}`}>{parte.estado}</span>
      </div>
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
      {parte.estado === 'borrador' && (
        <Link to={`/parte/${parte.id}`} className="btn btn-primary" style={{ marginRight: '0.5rem' }}>
          Continuar edición
        </Link>
      )}
      <p style={{ marginTop: '1rem' }}>
        <Link to="/">← Volver al listado</Link>
      </p>
    </div>
  )
}
