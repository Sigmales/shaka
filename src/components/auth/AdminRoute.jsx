import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" />

  if (profile?.subscription_type !== 'admin') return <Navigate to="/dashboard" />

  return children
}

