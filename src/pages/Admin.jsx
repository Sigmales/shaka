import { useState } from 'react'
import UserManagement from '../components/admin/UserManagement'
import PaymentValidation from '../components/admin/PaymentValidation'
import PredictionManagement from '../components/admin/PredictionManagement'

const tabs = [
  { id: 'payments', label: 'Paiements' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'predictions', label: 'Pronostics' }
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('payments')

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Panneau Administrateur</h1>
            <p className="text-gray-600">
              Gérez les abonnements, validez les paiements et publiez de nouveaux pronostics.
            </p>
          </div>
        </div>

        <div className="card mb-8">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'payments' && <PaymentValidation />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'predictions' && <PredictionManagement />}
        </div>
      </div>
    </div>
  )
}

