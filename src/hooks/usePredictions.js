import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useSubscription } from './useSubscription'

export function usePredictions({ accessFilter = 'all', dateFilter = 'today' } = {}) {
  const { hasAccess } = useSubscription()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadPredictions = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('predictions')
        .select('*')
        .order('match_date', { ascending: true })

      if (dateFilter === 'today') {
        const start = new Date()
        start.setHours(0, 0, 0, 0)
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        query = query.gte('match_date', start.toISOString()).lte('match_date', end.toISOString())
      }

      if (accessFilter !== 'all') {
        query = query.eq('access_level', accessFilter)
      }

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError

      const filtered = (data || []).filter((prediction) => hasAccess(prediction.access_level))
      setPredictions(filtered)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [accessFilter, dateFilter, hasAccess])

  useEffect(() => {
    loadPredictions()
  }, [loadPredictions])

  return {
    predictions,
    loading,
    error,
    refresh: loadPredictions
  }
}

