import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Predictions from './pages/Predictions'
import Payment from './pages/Payment'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route
                path="/dashboard"
                element={(
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/predictions"
                element={(
                  <ProtectedRoute>
                    <Predictions />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/payment"
                element={(
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/profile"
                element={(
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/admin"
                element={(
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                )}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
