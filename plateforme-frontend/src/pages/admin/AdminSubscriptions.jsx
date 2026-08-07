import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import Topbar from '../../components/Topbar'

export default function AdminSubscriptions() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const premiumUsers = users.filter(u => u.role?.name === 'premium')

  if (loading) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div>
      <Topbar title="Gestion des abonnements" />
      <div style={{ padding: '24px' }}>
        <h2 className="text-xl font-semibold mb-4">
          Utilisateurs Premium ({premiumUsers.length})
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-sm text-gray-600">Nom</th>
                <th className="p-3 text-sm text-gray-600">Email</th>
                <th className="p-3 text-sm text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {premiumUsers.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-gray-500">{u.email}</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      ⭐ Premium
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {premiumUsers.length === 0 && (
            <p className="text-center text-gray-400 py-8">Aucun abonné premium</p>
          )}
        </div>
      </div>
    </div>
  )
}