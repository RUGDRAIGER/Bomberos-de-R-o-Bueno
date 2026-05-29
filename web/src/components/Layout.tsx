import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { PofBrandBanner } from './PofBrandBanner'
import { useAuth } from '../context/AuthContext'

export function Layout() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function close() {
    setMenuOpen(false)
  }

  async function handleSignOut() {
    close()
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div className="app-sticky-top">
      <div className="pof-brand-bar">
        <PofBrandBanner />
      </div>
      <header className="header-app">
        <p className="header-app-label">Navegación</p>
        <button
          type="button"
          className="btn-nav-hamburger"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="app-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <nav className={`header-nav${menuOpen ? ' open' : ''}`} id="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-active' : '')} onClick={close}>
            Mis partes
          </NavLink>
          <NavLink to="/nuevo" className={({ isActive }) => (isActive ? 'nav-active' : '')} onClick={close}>
            + Nuevo POF
          </NavLink>
          {profile?.rol === 'admin' && profile.activo ? (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-active' : '')} onClick={close}>
              Administración
            </NavLink>
          ) : null}
          <span className="nav-email" title={user?.email ?? undefined}>
            {user?.email}
          </span>
          <button type="button" className="btn-header-link" onClick={() => void handleSignOut()}>
            Salir
          </button>
        </nav>
      </header>
      </div>
      <main className="container app-main">
        <Outlet />
      </main>
    </>
  )
}
