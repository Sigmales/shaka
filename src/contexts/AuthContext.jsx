import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    if (session?.user) {
      await loadProfile(session.user.id)
    }
    setLoading(false)
  }

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
    } else {
      setProfile(data)
    }
  }

  async function signUp(email, password, fullName, promoCode = null) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    if (data.user) {
      // Vérifier le code promo
      let vipTrialUsed = false
      let expiresAt = null

      if (promoCode === 'Le226') {
        vipTrialUsed = true
        expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // 7 jours gratuits
      }

      await supabase.from('profiles').insert([{
        id: data.user.id,
        email,
        full_name: fullName,
        subscription_type: promoCode === 'Le226' ? 'vip' : 'free',
        subscription_expires_at: expiresAt,
        promo_code_used: promoCode,
        vip_trial_used: vipTrialUsed
      }])

      // Mettre à jour le compteur du code promo
      if (promoCode) {
        await supabase.rpc('increment_promo_usage', { promo_code: promoCode })
      }
    }

    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: () => user ? loadProfile(user.id) : null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

