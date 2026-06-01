import { useState, useEffect } from 'react'
import api from '../../lib/axios'

export default function Subscription() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading]           = useState(true)
  const [message, setMessage]           = useState('')

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await api.get('/subscription')
      setSubscription(res.data)
    } catch {
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (plan) => {
    try {
      const res = await api.post('/subscription', { plan })
      setMessage(res.data.message)
      fetchSubscription()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleCancel = async () => {
    try {
      const res = await api.delete('/subscription')
      setMessage(res.data.message)
      fetchSubscription()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  if (loading) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Abonnement Premium</h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {subscription ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            Abonnement {subscription.plan === 'monthly' ? 'Mensuel' : 'Annuel'}
          </h2>
          <p className="text-gray-500 mb-1">
            Statut : <span className="text-green-600 font-medium">{subscription.status}</span>
          </p>
          <p className="text-gray-500 mb-4">
            Expire le : {new Date(subscription.ends_at).toLocaleDateString()}
          </p>
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Annuler l'abonnement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Plan mensuel */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Mensuel</h2>
            <p className="text-3xl font-bold text-blue-600 mb-4">99 MAD<span className="text-sm text-gray-500">/mois</span></p>
            <ul className="text-gray-600 text-sm mb-6 space-y-2">
              <li>✅ Vidéos illimitées</li>
              <li>✅ Téléchargement ressources</li>
              <li>✅ Accès forum</li>
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Choisir
            </button>
          </div>

          {/* Plan annuel */}
          <div className="bg-blue-600 rounded-lg shadow p-6 text-center text-white">
            <h2 className="text-xl font-bold mb-2">Annuel</h2>
            <p className="text-3xl font-bold mb-4">799 MAD<span className="text-sm opacity-75">/an</span></p>
            <ul className="text-sm mb-6 space-y-2">
              <li>✅ Vidéos illimitées</li>
              <li>✅ Téléchargement ressources</li>
              <li>✅ Accès forum</li>
              <li>✅ 2 mois offerts</li>
            </ul>
            <button
              onClick={() => handleSubscribe('yearly')}
              className="w-full bg-white text-blue-600 py-2 rounded hover:bg-gray-100"
            >
              Choisir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}