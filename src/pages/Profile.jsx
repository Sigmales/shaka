import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatDateTime } from '../utils/dateHelpers'

export default function Profile() {
  const { profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      if (!profile?.id) throw new Error('Profil utilisateur introuvable')
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone })
        .eq('id', profile.id)

      if (error) throw error

      await refreshProfile()
      setMessage('Profil mis à jour avec succès ✅')
    } catch (error) {
      setMessage(`Erreur : ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Mon Profil</h1>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${message.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Informations personnelles</h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={profile?.email}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+226 XX XX XX XX"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Abonnement</h3>
            <p className="text-gray-600 mb-2">
              Type : <strong className="uppercase">{profile?.subscription_type}</strong>
            </p>
            {profile?.subscription_expires_at ? (
              <p className="text-gray-600">
                Expire le : <strong>{formatDateTime(profile.subscription_expires_at, 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
              </p>
            ) : (
              <p className="text-gray-600">Abonnement gratuit illimité</p>
            )}
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Code promo</h3>
            {profile?.promo_code_used ? (
              <>
                <p className="text-gray-600 mb-2">
                  Code utilisé : <strong>{profile.promo_code_used}</strong>
                </p>
                {profile.vip_trial_used && (
                  <p className="text-green-600">Trial VIP de 7 jours activé ✅</p>
                )}
              </>
            ) : (
              <p className="text-gray-600">Aucun code promo utilisé pour l'instant.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

