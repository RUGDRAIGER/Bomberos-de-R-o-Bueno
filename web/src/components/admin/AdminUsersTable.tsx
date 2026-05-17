import type { Profile } from '../../types/database'
import { AdminUserRow } from './AdminUserRow'

type Props = {
  rows: Profile[]
  currentUserId: string | undefined
  busyId: string | null
  onToggleActivo: (id: string, activo: boolean) => void
  onDelete: (id: string) => void
}

export function AdminUsersTable({
  rows,
  currentUserId,
  busyId,
  onToggleActivo,
  onDelete,
}: Props) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Correo</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Cuenta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <AdminUserRow
              key={row.id}
              row={row}
              currentUserId={currentUserId}
              busyId={busyId}
              onToggleActivo={onToggleActivo}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
