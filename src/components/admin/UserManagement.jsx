import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const subscriptionOptions = [
  { value: 'free', label: 'Gratuit' },
  { value: 'standard', label: 'Standard' },
  { value: 'vip', label: 'VIP' },
  { value: 'admin', label: 'Admin' }
]

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [subscriptionType, setSubscriptionType] = useState('free')
  const [expiresAt, setExpiresAt] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSelectUser(user) {
    setSelectedUser(user)
    setSubscriptionType(user.subscription_type)
    setExpiresAt(user.subscription_expires_at ? user.subscription_expires_at.slice(0, 16) : '')
  }

  async function handleUpdateUser(e) {
    e.preventDefault()
    if (!selectedUser) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_type: subscriptionType,
          subscription_expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
        })
        .eq('id', selectedUser.id)

      if (error) throw error

      alert('Utilisateur mis à jour !')
      setSelectedUser(null)
      loadUsers()
    } catch (error) {
      alert('Erreur : ' + error.message)
    }
  }

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase()
    return (
      user.email.toLowerCase().includes(term) ||
      (user.full_name && user.full_name.toLowerCase().includes(term))
    )
  })

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Utilisateurs</h3>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Abonnement</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiration</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap uppercase text-sm">
                      {user.subscription_type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.subscription_expires_at
                        ? new Date(user.subscription_expires_at).toLocaleDateString('fr-FR')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <button
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="text-primary hover:text-accent font-semibold"
                      >
                        Gérer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Modifier l'abonnement</h3>

        {selectedUser ? (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Utilisateur</p>
              <p className="text-lg font-semibold text-gray-800">{selectedUser.full_name}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Type d'abonnement</label>
              <select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {subscriptionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date d'expiration</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">Laisser vide pour un accès illimité (admin / gratuit).</p>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-600">
            Sélectionnez un utilisateur pour modifier son abonnement.
          </p>
        )}
      </div>
    </div>
  )
}

