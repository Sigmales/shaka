import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-accent to-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="text-8xl">♞</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bienvenue sur SHAKA
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-secondary">
            Bet with the Knight of Virgo
          </p>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-200">
            Les meilleurs pronostics sportifs pour maximiser vos gains. 
            Rejoignez notre communauté de parieurs gagnants.
          </p>

          {user ? (
            <div className="space-x-4">
              <Link to="/predictions" className="btn-primary text-lg">
                Voir les Pronostics
              </Link>
              <Link to="/dashboard" className="btn-secondary text-lg bg-white">
                Mon Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/register" className="btn-primary text-lg">
                Commencer Gratuitement
              </Link>
              <Link to="/pricing" className="btn-secondary text-lg bg-white">
                Voir les Tarifs
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Pourquoi SHAKA ?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Pronostics Précis</h3>
              <p className="text-gray-600">
                Analyses détaillées et statistiques avancées pour chaque match
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🔥</div>
              <h3 className="text-xl font-bold mb-3">VIP Premium</h3>
              <p className="text-gray-600">
                Accès exclusif aux pronostics les plus rentables et analyses premium
              </p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">Support 24/7</h3>
              <p className="text-gray-600">
                Assistance WhatsApp prioritaire pour tous nos membres VIP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">🎁 Offre Spéciale de Bienvenue</h2>
          <p className="text-xl mb-6">
            Utilisez le code <strong className="text-yellow-300">Le226</strong> et obtenez 7 jours VIP GRATUIT !
          </p>
          <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 inline-block">
            Profiter de l'Offre →
          </Link>
        </div>
      </div>
    </div>
  )
}

