import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { profile } = useAuth()

  const subscriptionStatus = () => {
    if (!profile) return null

    const isActive = profile.subscription_expires_at
      ? new Date(profile.subscription_expires_at) > new Date()
      : profile.subscription_type === 'free'

    return { isActive, expiresAt: profile.subscription_expires_at }
  }

  const status = subscriptionStatus()

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Bienvenue, {profile?.full_name} !
        </h1>

        {/* Subscription Card */}
        <div className="card mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre Abonnement</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
            <div>
              <span
                className={`px-4 py-2 rounded-full text-white font-bold ${
                  profile?.subscription_type === 'admin'
                    ? 'bg-purple-600'
                    : profile?.subscription_type === 'vip'
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500'
                    : profile?.subscription_type === 'standard'
                    ? 'bg-blue-600'
                    : 'bg-gray-600'
                }`}
              >
                {profile?.subscription_type?.toUpperCase()}
              </span>
            </div>
          </div>

          {status?.expiresAt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                {status.isActive ? (
                  <>
                    ✓ Abonnement actif jusqu'au{' '}
                    <strong>{new Date(status.expiresAt).toLocaleDateString('fr-FR')}</strong>
                  </>
                ) : (
                  <>
                    ⚠️ Votre abonnement a expiré le{' '}
                    <strong>{new Date(status.expiresAt).toLocaleDateString('fr-FR')}</strong>
                  </>
                )}
              </p>
            </div>
          )}

          {profile?.vip_trial_used && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800">
                ✓ Code promo <strong>{profile.promo_code_used}</strong> utilisé
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/predictions" className="btn-primary text-center">
              Voir les Pronostics
            </Link>

            {profile?.subscription_type === 'free' && (
              <Link to="/pricing" className="btn-secondary text-center">
                Passer à VIP
              </Link>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold mb-1">Pronostics</h3>
            <p className="text-gray-600">
              {profile?.subscription_type === 'vip'
                ? 'Accès illimité'
                : profile?.subscription_type === 'standard'
                ? '5-7 par jour'
                : '1-2 par jour'}
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-xl font-bold mb-1">Statistiques</h3>
            <p className="text-gray-600">
              {profile?.subscription_type === 'vip'
                ? 'Avancées'
                : profile?.subscription_type === 'standard'
                ? 'De base'
                : 'Limitées'}
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-2">💬</div>
            <h3 className="text-xl font-bold mb-1">Support</h3>
            <p className="text-gray-600">
              {profile?.subscription_type === 'vip' ? 'Prioritaire' : 'Standard'}
            </p>
          </div>
        </div>

        {/* Admin Panel Link */}
        {profile?.subscription_type === 'admin' && (
          <div className="card bg-purple-50 border-2 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">
                  🔑 Panneau Administrateur
                </h3>
                <p className="text-purple-600">
                  Gérer les utilisateurs, valider les paiements et publier des pronostics
                </p>
              </div>
              <Link
                to="/admin"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700"
              >
                Accéder →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

