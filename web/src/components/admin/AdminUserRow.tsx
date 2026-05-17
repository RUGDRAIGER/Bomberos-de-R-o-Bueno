import type { Profile } from '../../types/database'

type Props = {
  row: Profile
  currentUserId: string | undefined
  busyId: string | null
  onToggleActivo: (id: string, activo: boolean) => void
  onDelete: (id: string) => void
}

export function AdminUserRow({
  row,
  currentUserId,
  busyId,
  onToggleActivo,
  onDelete,
}: Props) {
  const self = row.id === currentUserId
  const busy = busyId === row.id

  return (
    <tr className={row.activo ? '' : 'admin-row-blocked'}>
      <td data-label="Correo">{row.email ?? '—'}</td>
      <td data-label="Nombre">{row.nombre_completo ?? '—'}</td>
      <td data-label="Rol">{row.rol}</td>
      <td data-label="Estado">{row.activo ? 'Activo' : 'Bloqueado'}</td>
      <td data-label="Acciones" className="admin-actions-cell">
        <button
          type="button"
          className="btn btn-secondary btn-admin-compact"
          disabled={busy || self}
          onClick={() => onToggleActivo(row.id, !row.activo)}
          title={self ? 'No puede bloquearse a sí mismo' : undefined}
        >
          {row.activo ? 'Bloquear' : 'Desbloquear'}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-admin-compact admin-btn-danger"
          disabled={busy || self}
          onClick={() => onDelete(row.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  )
}
