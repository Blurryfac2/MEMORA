import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function AdminRoute() {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  // Sin sesión → a login con redirect
  if (!session) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  // Con sesión pero sin rol admin → al home
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
