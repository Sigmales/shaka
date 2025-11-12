import { useMemo } from 'react'
import { useAuth } from './useAuth'

export function useSubscription() {
  const { profile } = useAuth()

  const subscription = useMemo(() => {
    if (!profile) {
      return {
        type: 'free',
        isActive: false,
        expiresAt: null
      }
    }

    const expiresAt = profile.subscription_expires_at
      ? new Date(profile.subscription_expires_at)
      : null

    const isActive = profile.subscription_type === 'free'
      ? true
      : expiresAt
        ? expiresAt > new Date()
        : false

    return {
      type: profile.subscription_type || 'free',
      isActive,
      expiresAt,
      profile
    }
  }, [profile])

  const hasAccess = (level) => {
    const order = { free: 0, standard: 1, vip: 2, admin: 3 }
    return order[subscription.type] >= order[level]
  }

  return {
    ...subscription,
    hasAccess
  }
}

