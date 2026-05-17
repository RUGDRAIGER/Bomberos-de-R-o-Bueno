import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Layout() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function close() { setMenuOpen(false) }

  async function handleSignOut() {
    close()
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="header-app">
        <div className="header-logo">
          <span className="header-logo-icon">🚒</span>
          <span>POF 2026 — Río Bueno</span>
        </div>

        <button
          type="button"
          className="btn-nav-hamburger"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`header-nav${menuOpen ? ' open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={close}>
            Mis partes
          </NavLink>
          <NavLink to="/nuevo" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={close}>
            + Nuevo POF
          </NavLink>
          {profile?.rol === 'admin' && profile.activo ? (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-active' : ''} onClick={close}>
              Administración
            </NavLink>
          ) : null}
          <span className="nav-email" title={user?.email ?? undefined}>{user?.email}</span>
          <button type="button" className="btn-header-link" onClick={handleSignOut}>
            Salir
          </button>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}
