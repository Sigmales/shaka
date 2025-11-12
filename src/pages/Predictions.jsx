import { PredictionsList } from '../components/predictions/PredictionsList'
import { useSubscription } from '../hooks/useSubscription'

export default function Predictions() {
  const subscription = useSubscription()

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Pronostics</h1>
            <p className="text-gray-600">
              Accédez aux meilleurs pronostics selon votre abonnement.
            </p>
          </div>
          <div className="card md:w-auto flex items-center gap-4 bg-white">
            <div>
              <p className="text-sm text-gray-500">Votre plan</p>
              <p className="text-lg font-semibold text-primary uppercase">
                {subscription.type}
              </p>
            </div>
            {subscription.expiresAt && (
              <div>
                <p className="text-sm text-gray-500">Expire le</p>
                <p className="text-lg font-semibold text-gray-800">
                  {subscription.expiresAt.toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </div>

        <PredictionsList />
      </div>
    </div>
  )
}

