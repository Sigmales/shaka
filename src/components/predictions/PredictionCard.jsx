import { formatDateTime } from '../../utils/dateHelpers'

const accessLevelStyles = {
  free: 'bg-gray-100 text-gray-700',
  standard: 'bg-blue-100 text-blue-700',
  vip: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
  void: 'bg-gray-200 text-gray-700'
}

export function PredictionCard({ prediction }) {
  return (
    <div className="card">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
          {prediction.sport}
        </span>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${accessLevelStyles[prediction.access_level]}`}>
          {prediction.access_level === 'vip'
            ? '⭐ VIP'
            : prediction.access_level === 'standard'
            ? '📊 Standard'
            : '🆓 Gratuit'}
        </span>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusStyles[prediction.status]}`}>
          {prediction.status === 'won'
            ? '✅ Gagné'
            : prediction.status === 'lost'
            ? '❌ Perdu'
            : prediction.status === 'void'
            ? '🚫 Annulé'
            : '⏳ En cours'}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">{prediction.league}</h3>
      <p className="text-gray-600 mb-2">
        <strong>{prediction.home_team}</strong> vs <strong>{prediction.away_team}</strong>
      </p>
      <p className="text-sm text-gray-500 mb-4">
        📅 {formatDateTime(prediction.match_date)}
      </p>

      <div className="bg-primary/10 rounded-lg p-4 mb-4">
        <p className="text-gray-600 text-sm mb-1">Pronostic</p>
        <p className="text-lg font-semibold text-primary">{prediction.prediction}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="text-sm text-gray-500">Cote</p>
          <p className="text-xl font-bold text-gray-800">{prediction.odds}</p>
        </div>
        {prediction.confidence && (
          <div>
            <p className="text-sm text-gray-500">Confiance</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">{prediction.confidence}</p>
          </div>
        )}
      </div>
    </div>
  )
}

