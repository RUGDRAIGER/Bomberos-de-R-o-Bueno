import { useCallback, useEffect, useState } from 'react'
import { AdminUsersTable } from '../components/admin/AdminUsersTable'
import { useAuth } from '../context/AuthContext'
import { deleteUserAccount, listProfilesForAdmin, setProfileActivo } from '../services/adminUsers'
import type { Profile } from '../types/database'

export function AdminUsersPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Profile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(() => {
    setError(null)
    listProfilesForAdmin()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar usuarios'))
  }, [])

  useEffect(() => {
    load()
  }, [load])

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
      <h2 style={{ marginTop: 0 }}>Panel de administración — usuarios</h2>
      <p className="hint">
        Bloquear impide usar la app y las APIs de partes. Eliminar requiere la función Edge{' '}
        <code>admin-delete-user</code> en Supabase (ver docs).
      </p>
      <p className="hint">
        El registro con correo duplicado ya lo rechaza Supabase Auth; el índice en{' '}
        <code>profiles</code> refuerza la unicidad del correo guardado.
      </p>
      {error ? <div className="alert alert-error">{error}</div> : null}
      {rows.length === 0 && !error ? (
        <p>No hay usuarios o no tenés permiso de administrador.</p>
      ) : (
        <AdminUsersTable
          rows={rows}
          currentUserId={user?.id}
          busyId={busyId}
          onToggleActivo={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
