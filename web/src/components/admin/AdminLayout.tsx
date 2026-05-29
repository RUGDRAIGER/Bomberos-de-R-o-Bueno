import { NavLink, Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <div className="page-hero">
        <h2>Administración</h2>
        <p>Gestión de usuarios y visión global de todos los partes del sistema.</p>
      </div>
      <nav className="admin-tabs" aria-label="Secciones de administración">
        <NavLink to="/admin" end className={({ isActive }) => `admin-tab${isActive ? ' admin-tab--active' : ''}`}>
          Usuarios del POF
        </NavLink>
        <NavLink
          to="/admin/partes"
          className={({ isActive }) => `admin-tab${isActive ? ' admin-tab--active' : ''}`}
        >
          Todos los partes
        </NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
