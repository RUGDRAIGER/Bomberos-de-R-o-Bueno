import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Layout() {
  const { user, signOut } = useAuth()

  return (
    <>
      <header className="header-app">
        <h1>POF 2026 — Río Bueno</h1>
        <nav>
          <Link to="/">Mis partes</Link>
          <Link to="/nuevo">Nuevo POF</Link>
          <span style={{ opacity: 0.9, fontSize: '0.85rem' }}>{user?.email}</span>
          <button type="button" className="link" onClick={() => signOut()}>
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
