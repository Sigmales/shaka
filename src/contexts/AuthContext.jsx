import React, { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const ADMIN_EMAIL = 'yantoubri@gmail.com'
  const normalizedAdminEmail = ADMIN_EMAIL.toLowerCase()

  useEffect(() => {
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error checking session:', error)
      setLoading(false)
    }
  }

  async function loadProfile(currentUser) {
    if (!currentUser?.id) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          await createDefaultProfile(currentUser)
        } else {
          console.error('Error loading profile:', error)
          setLoading(false)
        }
      } else {
        await validateAdminRole(data, currentUser)
      }
    } catch (error) {
      console.error('Error in loadProfile:', error)
      setLoading(false)
    }
  }

  async function createDefaultProfile(currentUser) {
    try {
      const defaultProfile = {
        id: currentUser.id,
        email: currentUser.email,
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Utilisateur',
        subscription_type: 'free',
        subscription_expires_at: null,
        promo_code_used: null,
        vip_trial_used: false
      }

      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([defaultProfile])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating default profile:', insertError)
        setLoading(false)
      } else {
        await validateAdminRole(createdProfile, currentUser)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      setLoading(false)
    }
  }

  async function validateAdminRole(profileData, currentUser) {
    const normalizedEmail = (profileData.email || '').toLowerCase()
    const shouldBeAdmin = normalizedEmail === normalizedAdminEmail
    
    if (shouldBeAdmin && profileData.subscription_type !== 'admin') {
      // Promote to admin
      const { data: adminProfile, error } = await supabase
        .from('profiles')
        .update({ subscription_type: 'admin', subscription_expires_at: null })
        .eq('id', profileData.id)
        .select()
        .single()

      if (error) {
        console.error('Error promoting to admin:', error)
        setProfile(profileData)
      } else {
        setProfile(adminProfile)
      }
    } else if (!shouldBeAdmin && profileData.subscription_type === 'admin') {
      // Demote from admin
      const { data: downgradedProfile, error } = await supabase
        .from('profiles')
        .update({ subscription_type: 'free' })
        .eq('id', profileData.id)
        .select()
        .single()

      if (error) {
        console.error('Error demoting from admin:', error)
        setProfile(profileData)
      } else {
        setProfile(downgradedProfile)
      }
    } else {
      setProfile(profileData)
    }
    setLoading(false)
  }

  async function signUp(email, password, fullName, promoCode = null) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      if (data.user) {
        let subscriptionType = 'free'
        let expiresAt = null
        let vipTrialUsed = false

        if (promoCode === 'Le226') {
          vipTrialUsed = true
          expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + 7)
          subscriptionType = 'vip'
        }

        const profileData = {
          id: data.user.id,
          email,
          full_name: fullName,
          subscription_type: subscriptionType,
          subscription_expires_at: expiresAt,
          promo_code_used: promoCode,
          vip_trial_used: vipTrialUsed
        }

        await supabase.from('profiles').insert([profileData])

        if (promoCode) {
          await supabase.rpc('increment_promo_usage', { promo_code: promoCode })
        }

        // Handle admin role if needed
        if ((email || '').toLowerCase() === normalizedAdminEmail) {
          await supabase
            .from('profiles')
            .update({ subscription_type: 'admin', subscription_expires_at: null })
            .eq('id', data.user.id)
        }
      }

      return data
    } catch (error) {
      console.error('Error in signUp:', error)
      throw error
    }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: () => (user ? loadProfile(user) : null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
