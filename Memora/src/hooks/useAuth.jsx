// src/hooks/useAuth.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthCtx = createContext({
  session: null,
  profile: null,
  loading: true,
  setProfile: () => {}
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sesión inicial + listener
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setLoading(false))

    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      setSession(_session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Cargar profile cuando haya sesión
  useEffect(() => {
    let cancelled = false
    async function fetchProfile() {
      if (!session?.user?.id) {
        setProfile(null)
        return
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, nombre_completo, role')
        .eq('user_id', session.user.id)
        .single()
      if (!cancelled) {
        if (error) console.error(error)
        setProfile(data || null)
      }
    }
    fetchProfile()
    return () => { cancelled = true }
  }, [session])

  const value = useMemo(
    () => ({ session, profile, setProfile, loading }),
    [session, profile, loading]
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
