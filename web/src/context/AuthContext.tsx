import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { fetchProfileByUserId } from '../services/auth-profile'
import type { Profile } from '../types/database'
import { mapSupabaseAuthMessage } from '../utils/authErrors'

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
    nombre: string
  ) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

async function loadProfileOrRejectBlocked(userId: string): Promise<Profile | null> {
  const prof = await fetchProfileByUserId(userId)
  if (prof && prof.activo === false) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('auth_notice', 'blocked')
    }
    await supabase.auth.signOut()
    return null
  }
  return prof
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function syncAuth(sess: Session | null) {
      setSession(sess)
      setUser(sess?.user ?? null)
      if (!sess?.user) {
        setProfile(null)
        return
      }
      const prof = await loadProfileOrRejectBlocked(sess.user.id)
      if (!mounted) return
      setProfile(prof)
    }

    async function init() {
      const {
        data: { session: s },
      } = await supabase.auth.getSession()
      await syncAuth(s)
      if (mounted) setLoading(false)
    }

    void init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      void (async () => {
        await syncAuth(newSession)
        if (mounted) setLoading(false)
      })()
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message ?? null }
    const u = data.user
    if (!u) return { error: null }
    const prof = await fetchProfileByUserId(u.id)
    if (prof && prof.activo === false) {
      sessionStorage.setItem('auth_notice', 'blocked')
      await supabase.auth.signOut()
      return { error: 'Su cuenta está deshabilitada. Contacte a la comandancia.' }
    }
    return { error: null }
  }

  async function signUp(email: string, password: string, nombre: string) {
    const emailRedirectTo =
      typeof window !== 'undefined'
        ? new URL(import.meta.env.BASE_URL, window.location.origin).href
        : undefined
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre_completo: nombre },
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    })
    return { error: mapSupabaseAuthMessage(error?.message ?? null) }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
