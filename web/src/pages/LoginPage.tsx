import { FormEvent, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { PofBrandBanner } from '../components/PofBrandBanner'
import { MobileInstallHint } from '../components/MobileInstallHint'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { session, signIn, signUp, loading } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const notice = sessionStorage.getItem('auth_notice')
    if (notice === 'blocked') {
      setError('Su cuenta fue deshabilitada. Contacte a la comandancia.')
      sessionStorage.removeItem('auth_notice')
    }
  }, [])

  if (!loading && session) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    if (mode === 'login') {
      const { error: err } = await signIn(email, password)
      if (err) setError(err)
    } else {
      const { error: err } = await signUp(email, password, nombre)
      if (err) setError(err)
      else setInfo('Revise su correo para confirmar la cuenta (si está activada la verificación).')
    }
    setSubmitting(false)
  }

  return (
    <div className="login-page">
      <div className="login-brand-wrap">
        <PofBrandBanner />
      </div>
      <div className="card login-card">
        <p className="login-tagline">Acceso al registro digital y generación de PDF oficial</p>
        {error && <div className="alert alert-error">{error}</div>}
        {info && <div className="alert alert-info">{info}</div>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="field">
              <label>Nombre completo</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
          )}
          <div className="field">
            <label>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {mode === 'login' ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Crear cuenta' : 'Ya tengo cuenta'}
          </button>
        </p>
        <hr className="login-divider" />
        <MobileInstallHint />
      </div>
    </div>
  )
}
