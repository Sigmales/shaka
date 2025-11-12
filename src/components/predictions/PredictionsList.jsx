import { useState } from 'react'
import { PredictionCard } from './PredictionCard'
import { usePredictions } from '../../hooks/usePredictions'

const tabs = [
  { id: 'today', label: "Matchs du jour" },
  { id: 'all', label: 'Tous les matchs' }
]

const accessFilters = [
  { id: 'all', label: 'Tous' },
  { id: 'free', label: 'Gratuit' },
  { id: 'standard', label: 'Standard' },
  { id: 'vip', label: 'VIP' }
]

export function PredictionsList() {
  const [dateFilter, setDateFilter] = useState('today')
  const [accessFilter, setAccessFilter] = useState('all')

  const { predictions, loading, error, refresh } = usePredictions({
    accessFilter,
    dateFilter
  })

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDateFilter(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                dateFilter === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {accessFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setAccessFilter(filter.id)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                accessFilter === filter.id
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-accent'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={refresh}
          className="btn-secondary text-sm"
        >
          Rafraîchir
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
          Erreur lors du chargement des pronostics : {error.message}
        </div>
      )}

      {!loading && predictions.length === 0 && (
        <div className="card text-center text-gray-600">
          Aucun pronostic disponible pour le moment.
        </div>
      )}

      <div className="grid gap-6">
        {predictions.map((prediction) => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
      </div>
    </div>
  )
}

