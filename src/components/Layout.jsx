import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Layout() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                Shaka
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/predictions" className="text-gray-700 hover:text-blue-600">
                Predictions
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                Profile
              </Link>
              
              {profile?.subscription_type === 'admin' && (
                <Link to="/admin" className="text-red-600 hover:text-red-700 font-medium">
                  Admin
                </Link>
              )}
              
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-blue-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
