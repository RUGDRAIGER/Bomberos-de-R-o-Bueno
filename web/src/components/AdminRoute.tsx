import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function AdminRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        Cargando...
      </div>
    )
  }

  if (profile?.rol !== 'admin' || !profile.activo) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
