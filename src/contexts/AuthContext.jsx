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
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    if (session?.user) {
      await loadProfile(session.user)
    }
    setLoading(false)
  }

  async function loadProfile(currentUser) {
    if (!currentUser?.id) {
      setProfile(null)
      setLoading(false)
      return
    }

    const { data, error, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single()

    if (error) {
      // If the profile row does not exist yet, create a default one on the fly
      const noRowError = error.code === 'PGRST116' || status === 406
      if (noRowError) {
        const defaultFullName =
          currentUser.user_metadata?.full_name ||
          currentUser.email?.split('@')[0] ||
          'Utilisateur'

        const defaultProfile = {
          id: currentUser.id,
          email: currentUser.email,
          full_name: defaultFullName,
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
        } else {
          const normalizedEmail = (createdProfile.email || '').toLowerCase()
          if (normalizedEmail === normalizedAdminEmail && createdProfile.subscription_type !== 'admin') {
            const { data: adminProfile, error: promoteError } = await supabase
              .from('profiles')
              .update({ subscription_type: 'admin', subscription_expires_at: null })
              .eq('id', createdProfile.id)
              .select()
              .single()

            if (promoteError) {
              console.error('Error promoting default profile to admin:', promoteError)
              setProfile(createdProfile)
            } else {
              setProfile(adminProfile)
            }
          } else if (normalizedEmail !== normalizedAdminEmail && createdProfile.subscription_type === 'admin') {
            const { data: downgradedProfile, error: demoteError } = await supabase
              .from('profiles')
              .update({ subscription_type: 'free' })
              .eq('id', createdProfile.id)
              .select()
              .single()

            if (demoteError) {
              console.error('Error demoting profile:', demoteError)
              setProfile(createdProfile)
            } else {
              setProfile(downgradedProfile)
            }
          } else {
            setProfile(createdProfile)
          }
        }
        setLoading(false)
        return
      }

      console.error('Error loading profile:', error)
    } else {
      const normalizedEmail = (data.email || '').toLowerCase()
      if (normalizedEmail === normalizedAdminEmail && data.subscription_type !== 'admin') {
        const { data: adminProfile, error: promoteError } = await supabase
          .from('profiles')
          .update({ subscription_type: 'admin', subscription_expires_at: null })
          .eq('id', data.id)
          .select()
          .single()

        if (promoteError) {
          console.error('Error promoting profile to admin:', promoteError)
          setProfile(data)
        } else {
          setProfile(adminProfile)
        }
      } else if (normalizedEmail !== normalizedAdminEmail && data.subscription_type === 'admin') {
        const { data: downgradedProfile, error: demoteError } = await supabase
          .from('profiles')
          .update({ subscription_type: 'free' })
          .eq('id', data.id)
          .select()
          .single()

        if (demoteError) {
          console.error('Error demoting profile:', demoteError)
          setProfile(data)
        } else {
          setProfile(downgradedProfile)
        }
      } else {
        setProfile(data)
      }
    }
    setLoading(false)
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

      if ((email || '').toLowerCase() === normalizedAdminEmail) {
        await supabase
          .from('profiles')
          .update({ subscription_type: 'admin', subscription_expires_at: null })
          .eq('id', data.user.id)
      } else if ((email || '').toLowerCase() !== normalizedAdminEmail) {
        await supabase
          .from('profiles')
          .update({ subscription_type: promoCode === 'Le226' ? 'vip' : 'free' })
          .eq('id', data.user.id)
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
    refreshProfile: () => (user ? loadProfile(user) : null)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

