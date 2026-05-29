import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PofPdfButton } from '../components/PofPdfButton'
import { listAllPartesForAdmin, type ParteAdminRow } from '../services/adminPartes'
import type { ParteEstado } from '../types/database'

type FiltroEstado = 'todos' | ParteEstado

function labelCreador(row: ParteAdminRow): string {
  const c = row.creador
  if (c?.nombre_completo) return c.nombre_completo
  if (c?.email) return c.email
  if (row.created_by) return `ID ${row.created_by.slice(0, 8)}…`
  return 'Sin autor'
}

export function AdminPartesPage() {
  const [partes, setPartes] = useState<ParteAdminRow[]>([])
  const [filtro, setFiltro] = useState<FiltroEstado>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    listAllPartesForAdmin(filtro)
      .then(setPartes)
      .catch((e) => {
        const msg = e instanceof Error ? e.message : 'Error al cargar partes'
        setError(msg)
        console.error('listAllPartesForAdmin:', e)
      })
      .finally(() => setLoading(false))
  }, [filtro])

  useEffect(() => {
    load()
  }, [load])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return partes
    return partes.filter((p) => {
      const hay = [
        p.bombero_que_realiza_pof,
        p.direccion_emergencia,
        p.fecha_emergencia,
        p.numero_oficial != null ? String(p.numero_oficial) : '',
        labelCreador(p),
        p.creador?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [partes, busqueda])

  const stats = useMemo(() => {
    const enviados = partes.filter((p) => p.estado === 'enviado').length
    const borradores = partes.filter((p) => p.estado === 'borrador').length
    return { total: partes.length, enviados, borradores }
  }, [partes])

  return (
    <div className="card admin-panel">
      <h3 className="admin-section-title">Todos los partes creados</h3>
      <p className="hint">
        Listado global: borradores y enviados de todos los bomberos. Podés abrir, editar borradores y
        descargar PDF.
      </p>

      <div className="stats-row admin-partes-stats">
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

      <div className="admin-partes-toolbar">
        <div className="field admin-partes-filtro">
          <label>Estado</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value as FiltroEstado)}>
            <option value="todos">Todos</option>
            <option value="borrador">Borrador</option>
            <option value="enviado">Enviado</option>
          </select>
        </div>
        <div className="field admin-partes-busqueda">
          <label>Buscar</label>
          <input
            type="search"
            placeholder="Bombero, dirección, N°, autor…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-secondary" onClick={load} disabled={loading}>
          Actualizar
        </button>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {loading ? (
        <p className="hint" style={{ textAlign: 'center', padding: '1.5rem' }}>
          Cargando partes…
        </p>
      ) : filtrados.length === 0 ? (
        <div className="parte-list-empty">
          <p style={{ margin: 0 }}>No hay partes que coincidan con el filtro.</p>
        </div>
      ) : (
        <div className="parte-list admin-partes-list">
          {filtrados.map((p) => {
            const dest = p.estado === 'borrador' ? `/parte/${p.id}` : `/ver/${p.id}`
            return (
              <div key={p.id} className="parte-list-row">
                <Link to={dest} className="parte-list-row-main">
                  <div className="parte-list-title">
                    <strong>
                      {p.numero_oficial != null ? `N°\u00a0${p.numero_oficial} · ` : null}
                      {p.fecha_emergencia ?? 'Sin fecha'}
                    </strong>
                    <span className={`badge badge-${p.estado}`}>{p.estado}</span>
                  </div>
                  <div className="parte-list-sub">
                    {p.direccion_emergencia ?? 'Sin dirección'} ·{' '}
                    {p.bombero_que_realiza_pof ?? 'Sin nombre POF'}
                  </div>
                  <div className="parte-list-meta">
                    Autor: {labelCreador(p)}
                    {p.creador?.email && p.creador?.nombre_completo ? ` (${p.creador.email})` : null}
                    {' · '}
                    Actualizado: {new Date(p.updated_at).toLocaleString('es-CL')}
                  </div>
                </Link>
                <div className="parte-list-row-pdf">
                  <PofPdfButton parteId={p.id} canDownload compact />
                </div>
              </div>
            )
          })}
        </div>
      )}
      {!loading && filtrados.length > 0 ? (
        <p className="hint" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          Mostrando {filtrados.length} de {partes.length} parte(s).
        </p>
      ) : null}
    </div>
  )
}
