import { useState, useEffect } from 'react'
import api from '../../lib/axios'

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [pending, setPending] = useState([])
  const [users, setUsers]     = useState([])
  const [tab, setTab]         = useState('stats')

  useEffect(() => {
    fetchStats()
    fetchPending()
    fetchUsers()
  }, [])

  const fetchStats   = async () => {
    const res = await api.get('/admin/statistics')
    setStats(res.data)
  }

  const fetchPending = async () => {
    const res = await api.get('/admin/pending-videos')
    setPending(res.data)
  }

  const fetchUsers   = async () => {
    const res = await api.get('/admin/users')
    setUsers(res.data)
  }

  const validateVideo = async (id) => {
    await api.post(`/admin/validate-video/${id}`)
    fetchPending()
  }

  const rejectVideo   = async (id) => {
    await api.post(`/admin/reject-video/${id}`)
    fetchPending()
  }

  const banUser       = async (id) => {
    await api.post(`/admin/ban-user/${id}`)
    fetchUsers()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {['stats', 'videos', 'users'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${
              tab === t
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {t === 'stats' ? 'Statistiques'
             : t === 'videos' ? 'Vidéos en attente'
             : 'Utilisateurs'}
          </button>
        ))}
      </div>

      {/* Statistiques */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Utilisateurs',     value: stats.total_users },
            { label: 'Cours',            value: stats.total_courses },
            { label: 'En attente',       value: stats.pending_videos },
            { label: 'Premium',          value: stats.premium_users },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{s.value}</p>
              <p className="text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Vidéos en attente */}
      {tab === 'videos' && (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <p className="text-gray-500">Aucune vidéo en attente</p>
          ) : pending.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-gray-500 text-sm">Par {course.instructor?.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => validateVideo(course.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Valider
                </button>
                <button
                  onClick={() => rejectVideo(course.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Utilisateurs */}
      {tab === 'users' && (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  user.role?.name === 'admin'
                    ? 'bg-red-100 text-red-600'
                    : user.role?.name === 'premium'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.role?.name}
                </span>
              </div>
              {user.role?.name !== 'admin' && (
                <button
                  onClick={() => banUser(user.id)}
                  className={`px-4 py-2 rounded text-white ${
                    user.is_banned
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {user.is_banned ? 'Débannir' : 'Bannir'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}