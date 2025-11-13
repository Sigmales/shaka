import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminRoute } from './components/auth/AdminRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Predictions from './pages/Predictions'
import Pricing from './pages/Pricing'
import Payment from './pages/Payment'
import Profile from './pages/Profile'
import Layout from './components/layout/Layout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Protected user routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/predictions" element={
            <ProtectedRoute>
              <Layout>
                <Predictions />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <Layout>
                <Payment />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <Layout>
                <Admin />
              </Layout>
            </AdminRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
