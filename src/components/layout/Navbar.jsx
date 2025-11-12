import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="text-3xl">♞</span>
            SHAKA
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-gray-700 hover:text-primary font-medium">
              Tarifs
            </Link>

            {user ? (
              <>
                <Link to="/predictions" className="text-gray-700 hover:text-primary font-medium">
                  Pronostics
                </Link>

                <Link to="/dashboard" className="text-gray-700 hover:text-primary font-medium">
                  Dashboard
                </Link>

                {profile?.subscription_type === 'admin' && (
                  <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-bold">
                    Admin
                  </Link>
                )}

                {profile?.subscription_type === 'vip' && (
                  <span className="badge-vip">VIP</span>
                )}

                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">
                  Connexion
                </Link>

                <Link to="/register" className="btn-primary">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

