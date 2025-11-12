import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export default function PredictionManagement() {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPrediction, setEditingPrediction] = useState(null)

  const [formData, setFormData] = useState({
    sport: 'Football',
    league: '',
    home_team: '',
    away_team: '',
    match_date: '',
    prediction: '',
    odds: '',
    confidence: 'medium',
    access_level: 'free',
    status: 'pending'
  })

  useEffect(() => {
    loadPredictions()
  }, [])

  async function loadPredictions() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('match_date', { ascending: false })

      if (error) throw error
      setPredictions(data || [])
    } catch (error) {
      console.error('Error loading predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      sport: 'Football',
      league: '',
      home_team: '',
      away_team: '',
      match_date: '',
      prediction: '',
      odds: '',
      confidence: 'medium',
      access_level: 'free',
      status: 'pending'
    })
    setEditingPrediction(null)
    setShowForm(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const predictionData = {
        ...formData,
        odds: parseFloat(formData.odds),
        match_date: new Date(formData.match_date).toISOString(),
        created_by: user.id
      }

      if (editingPrediction) {
        const { error } = await supabase
          .from('predictions')
          .update(predictionData)
          .eq('id', editingPrediction.id)

        if (error) throw error
        alert('Pronostic mis à jour !')
      } else {
        const { error } = await supabase
          .from('predictions')
          .insert([predictionData])

        if (error) throw error
        alert('Pronostic créé avec succès !')
      }

      resetForm()
      loadPredictions()
    } catch (error) {
      alert('Erreur : ' + error.message)
    }
  }

  function editPrediction(pred) {
    setFormData({
      sport: pred.sport,
      league: pred.league,
      home_team: pred.home_team,
      away_team: pred.away_team,
      match_date: pred.match_date ? pred.match_date.slice(0, 16) : '',
      prediction: pred.prediction,
      odds: pred.odds.toString(),
      confidence: pred.confidence ?? 'medium',
      access_level: pred.access_level,
      status: pred.status
    })
    setEditingPrediction(pred)
    setShowForm(true)
  }

  async function deletePrediction(id) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce pronostic ?')) return

    try {
      const { error } = await supabase
        .from('predictions')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Pronostic supprimé !')
      loadPredictions()
    } catch (error) {
      alert('Erreur : ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          type="button"
        >
          {showForm ? '✕ Annuler' : '+ Ajouter un Pronostic'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-8">
          <h3 className="text-xl font-bold mb-4">
            {editingPrediction ? 'Modifier le Pronostic' : 'Nouveau Pronostic'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Sport */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Sport</label>
                <select
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Rugby">Rugby</option>
                </select>
              </div>

              {/* League */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Ligue/Compétition</label>
                <input
                  type="text"
                  value={formData.league}
                  onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Ligue 1, Champions League"
                  required
                />
              </div>

              {/* Home Team */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Équipe Domicile</label>
                <input
                  type="text"
                  value={formData.home_team}
                  onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: PSG"
                  required
                />
              </div>

              {/* Away Team */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Équipe Extérieur</label>
                <input
                  type="text"
                  value={formData.away_team}
                  onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: Lyon"
                  required
                />
              </div>

              {/* Match Date */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date et Heure du Match</label>
                <input
                  type="datetime-local"
                  value={formData.match_date}
                  onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Odds */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cote</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.odds}
                  onChange={(e) => setFormData({ ...formData, odds: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: 1.85"
                  required
                />
              </div>

              {/* Confidence */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Niveau de Confiance</label>
                <select
                  value={formData.confidence}
                  onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="low">🔵 Faible</option>
                  <option value="medium">🟢 Moyen</option>
                  <option value="high">🟠 Élevé</option>
                  <option value="premium">⭐ Premium</option>
                </select>
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Niveau d'Accès</label>
                <select
                  value={formData.access_level}
                  onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="free">🆓 Gratuit</option>
                  <option value="standard">📊 Standard</option>
                  <option value="vip">⭐ VIP</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="pending">⏳ En cours</option>
                  <option value="won">✅ Gagné</option>
                  <option value="lost">❌ Perdu</option>
                  <option value="void">🚫 Annulé</option>
                </select>
              </div>
            </div>

            {/* Prediction */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pronostic</label>
              <textarea
                value={formData.prediction}
                onChange={(e) => setFormData({ ...formData, prediction: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: 1X (Victoire domicile ou Match nul)"
                rows="3"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                {editingPrediction ? '💾 Mettre à Jour' : '✓ Créer le Pronostic'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Predictions List */}
      <div className="space-y-4">
        {predictions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">Aucun pronostic pour le moment</p>
          </div>
        ) : (
          predictions.map((pred) => (
            <div key={pred.id} className="card">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 font-semibold">
                      {pred.sport}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded text-white font-semibold ${
                      pred.access_level === 'vip'
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500'
                        : pred.access_level === 'standard'
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                    }`}>
                      {pred.access_level === 'vip'
                        ? '⭐ VIP'
                        : pred.access_level === 'standard'
                        ? '📊 STANDARD'
                        : '🆓 GRATUIT'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded text-white font-semibold ${
                      pred.status === 'won'
                        ? 'bg-green-500'
                        : pred.status === 'lost'
                        ? 'bg-red-500'
                        : pred.status === 'void'
                        ? 'bg-gray-500'
                        : 'bg-yellow-500'
                    }`}>
                      {pred.status === 'won'
                        ? '✅ Gagné'
                        : pred.status === 'lost'
                        ? '❌ Perdu'
                        : pred.status === 'void'
                        ? '🚫 Annulé'
                        : '⏳ En cours'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-1">{pred.league}</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>{pred.home_team}</strong> vs <strong>{pred.away_team}</strong>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    📅 {new Date(pred.match_date).toLocaleString('fr-FR')}
                  </p>
                  <p className="bg-primary/10 p-3 rounded-lg">
                    <span className="text-sm text-gray-600">Pronostic : </span>
                    <strong className="text-primary">{pred.prediction}</strong>
                    <span className="text-sm text-gray-600 ml-3">Cote : </span>
                    <strong>{pred.odds}</strong>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => editPrediction(pred)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
                    type="button"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => deletePrediction(pred.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
                    type="button"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

