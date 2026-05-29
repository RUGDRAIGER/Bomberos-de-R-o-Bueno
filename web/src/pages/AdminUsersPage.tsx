import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminUsersTable } from '../components/admin/AdminUsersTable'
import { useAuth } from '../context/AuthContext'
import { deleteUserAccount, listProfilesForAdmin, setProfileActivo } from '../services/adminUsers'
import type { AppRole, Profile } from '../types/database'

type FiltroRol = 'todos' | AppRole
type FiltroCuenta = 'todos' | 'activo' | 'bloqueado'

export function AdminUsersPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Profile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState<FiltroRol>('todos')
  const [filtroCuenta, setFiltroCuenta] = useState<FiltroCuenta>('todos')

  const load = useCallback(() => {
    setError(null)
    setLoading(true)
    listProfilesForAdmin()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar usuarios'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtrados = useMemo(() => {
    let list = rows
    if (filtroRol !== 'todos') list = list.filter((r) => r.rol === filtroRol)
    if (filtroCuenta === 'activo') list = list.filter((r) => r.activo)
    if (filtroCuenta === 'bloqueado') list = list.filter((r) => !r.activo)
    const q = busqueda.trim().toLowerCase()
    if (!q) return list
    return list.filter((r) => {
      const hay = [r.email, r.nombre_completo, r.rol, r.id]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [rows, filtroRol, filtroCuenta, busqueda])

  const stats = useMemo(() => {
    const activos = rows.filter((r) => r.activo).length
    const bomberos = rows.filter((r) => r.rol === 'bombero').length
    const admins = rows.filter((r) => r.rol === 'admin').length
    const consulta = rows.filter((r) => r.rol === 'consulta').length
    return {
      total: rows.length,
      activos,
      bloqueados: rows.length - activos,
      bomberos,
      admins,
      consulta,
    }
  }, [rows])

  async function handleToggle(id: string, activo: boolean) {
    setBusyId(id)
    setError(null)
    try {
      await setProfileActivo(id, activo)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar')
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        '¿Eliminar este usuario de forma permanente? Sus partes se conservan pero sin autor asociado.'
      )
    )
      return
    setBusyId(id)
    setError(null)
    try {
      await deleteUserAccount(id)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar (¿función Edge desplegada?)')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="card admin-panel">
      <h3 className="admin-section-title">Usuarios registrados en POF Río Bueno</h3>
      <p className="hint">
        Todos los usuarios creados o agregados al proyecto: registro propio, invitaciones de
        comandancia y cuentas administrativas. Podés buscar, filtrar, bloquear o eliminar.
      </p>

      <div className="stats-row admin-partes-stats">
        <div className="stat-card">
          <strong>{stats.total}</strong>
          <span>Total</span>
        </div>
        <div className="stat-card">
          <strong>{stats.activos}</strong>
          <span>Activos</span>
        </div>
        <div className="stat-card">
          <strong>{stats.bloqueados}</strong>
          <span>Bloqueados</span>
        </div>
        <div className="stat-card">
          <strong>{stats.bomberos}</strong>
          <span>Bomberos</span>
        </div>
        <div className="stat-card">
          <strong>{stats.admins + stats.consulta}</strong>
          <span>Admin / consulta</span>
        </div>
      </div>

      <div className="admin-partes-toolbar admin-usuarios-toolbar">
        <div className="field admin-partes-filtro">
          <label>Rol</label>
          <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value as FiltroRol)}>
            <option value="todos">Todos</option>
            <option value="bombero">Bombero</option>
            <option value="admin">Admin</option>
            <option value="consulta">Consulta</option>
          </select>
        </div>
        <div className="field admin-partes-filtro">
          <label>Cuenta</label>
          <select
            value={filtroCuenta}
            onChange={(e) => setFiltroCuenta(e.target.value as FiltroCuenta)}
          >
            <option value="todos">Todas</option>
            <option value="activo">Solo activas</option>
            <option value="bloqueado">Solo bloqueadas</option>
          </select>
        </div>
        <div className="field admin-partes-busqueda">
          <label>Buscar</label>
          <input
            type="search"
            placeholder="Correo, nombre, rol…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-secondary" onClick={load} disabled={loading}>
          Actualizar
        </button>
      </div>

      <p className="hint admin-users-tech-hint">
        Bloquear impide usar la app. Eliminar requiere la función Edge{' '}
        <code>admin-delete-user</code> en Supabase.
      </p>

      {error ? <div className="alert alert-error">{error}</div> : null}

      {loading ? (
        <p className="hint" style={{ textAlign: 'center', padding: '1.5rem' }}>
          Cargando usuarios…
        </p>
      ) : filtrados.length === 0 ? (
        <p>No hay usuarios que coincidan con el filtro, o no tenés permiso de administrador.</p>
      ) : (
        <>
          <AdminUsersTable
            rows={filtrados}
            currentUserId={user?.id}
            busyId={busyId}
            onToggleActivo={handleToggle}
            onDelete={handleDelete}
          />
          <p className="hint" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
            Mostrando {filtrados.length} de {rows.length} usuario(s) en el proyecto.
          </p>
        </>
      )}
    </div>
  )
}
