import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatDateTime } from '../../utils/dateHelpers'

const statusBadges = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
}

export default function PaymentValidation() {
  const [proofs, setProofs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [note, setNote] = useState('')
  const [selectedProof, setSelectedProof] = useState(null)

  useEffect(() => {
    loadProofs()
  }, [filter])

  async function loadProofs() {
    setLoading(true)
    try {
      let query = supabase
        .from('payment_proofs')
        .select('*, user:profiles(full_name, email)')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      if (error) throw error

      setProofs(data || [])
    } catch (error) {
      console.error('Error loading payment proofs:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(proof, status) {
    try {
      const { error } = await supabase
        .from('payment_proofs')
        .update({
          status,
          admin_note: note || null,
          validated_at: new Date().toISOString()
        })
        .eq('id', proof.id)

      if (error) throw error

      if (status === 'approved') {
        // Activate subscription: set user's subscription_type to selection and set expiration based on period
        const durationDays = proof.billing_period === 'yearly' ? 365 : 30
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + durationDays)

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            subscription_type: proof.subscription_type,
            subscription_expires_at: expiresAt.toISOString()
          })
          .eq('id', proof.user_id)

        if (profileError) throw profileError
      }

      alert(`Paiement ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès`)
      setNote('')
      setSelectedProof(null)
      loadProofs()
    } catch (error) {
      alert('Erreur : ' + error.message)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-gray-800">Validation des paiements</h3>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
              }`}
            >
              {status === 'pending'
                ? 'En attente'
                : status === 'approved'
                ? 'Approuvés'
                : status === 'rejected'
                ? 'Rejetés'
                : 'Tous'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : proofs.length === 0 ? (
        <div className="card text-center text-gray-600">
          Aucun paiement à afficher pour le moment.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {proofs.map((proof) => (
            <div key={proof.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">
                    {proof.user?.full_name ?? 'Utilisateur inconnu'}
                  </h4>
                  <p className="text-sm text-gray-500">{proof.user?.email ?? '—'}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${statusBadges[proof.status]}`}>
                  {proof.status === 'pending'
                    ? 'En attente'
                    : proof.status === 'approved'
                    ? 'Approuvé'
                    : 'Rejeté'}
                </span>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 mb-4 space-y-2">
                <p className="text-gray-700">
                  Plan : <strong className="uppercase">{proof.subscription_type}</strong> ({proof.billing_period === 'yearly' ? 'Annuel' : 'Mensuel'})
                </p>
                <p className="text-gray-700">
                  Montant : <strong>{proof.amount} CFA</strong>
                </p>
                <p className="text-gray-700">
                  Méthode : <strong>{proof.payment_method === 'orange_money' ? 'Orange Money' : 'Moov Money'}</strong>
                </p>
                <p className="text-gray-500 text-sm">
                  Soumis le {formatDateTime(proof.created_at)}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Téléphone utilisé :</p>
                <p className="text-lg font-semibold text-gray-800">{proof.phone_number}</p>
              </div>

              <div className="mb-4">
                <a
                  href={proof.screenshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center inline-block"
                >
                  Voir la capture d'écran
                </a>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Note admin (optionnel)
                </label>
                <textarea
                  value={selectedProof?.id === proof.id ? note : ''}
                  onChange={(e) => {
                    setSelectedProof(proof)
                    setNote(e.target.value)
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Note sur la transaction..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateStatus(proof, 'approved')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  ✅ Approuver
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(proof, 'rejected')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  ❌ Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

