import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import Topbar from '../../components/Topbar'

export default function AdminUsers() {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } finally { setLoading(false) }
  }

  const toggleBan = async (user) => {
    if (user.is_banned) {
      await api.post(`/admin/unban-user/${user.id}`)
    } else {
      await api.post(`/admin/ban-user/${user.id}`)
    }
    fetchUsers()
  }

  const roleColor = (role) => {
    const map = {
      admin:    { bg: '#eff5ff', color: '#1a56db' },
      premium:  { bg: '#fef3c7', color: '#92400e' },
      standard: { bg: '#f3f4f6', color: '#374151' },
    }
    return map[role] || map.standard
  }

  return (
    <div>
      <Topbar title="Gestion des utilisateurs" />
      <div style={{ padding: '24px' }}>
        <div style={{
          background: '#fff', border: '0.5px solid #e5e7eb',
          borderRadius: '10px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
            padding: '10px 20px', background: '#f8fafc',
            borderBottom: '0.5px solid #e5e7eb',
          }}>
            {['Nom', 'Email', 'Rôle', 'Statut', 'Action'].map(h => (
              <span key={h} style={{
                fontSize: '11px', fontWeight: 600,
                color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
              Chargement...
            </div>
          ) : users.map(user => {
            const rc = roleColor(user.role?.name)
            return (
              <div key={user.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                padding: '12px 20px', borderBottom: '0.5px solid #f3f4f6',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#dbeafe', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 600, color: '#1a56db',
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                    {user.name}
                  </span>
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</span>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                  fontSize: '11px', fontWeight: 600,
                  background: rc.bg, color: rc.color,
                }}>
                  {user.role?.name}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: user.is_banned ? '#dc2626' : '#16a34a',
                }}>
                  {user.is_banned ? 'Banni' : 'Actif'}
                </span>
                {user.role?.name !== 'admin' ? (
                  <button
                    onClick={() => toggleBan(user)}
                    style={{
                      padding: '4px 12px', borderRadius: '5px',
                      border: `0.5px solid ${user.is_banned ? '#16a34a' : '#dc2626'}`,
                      color: user.is_banned ? '#16a34a' : '#dc2626',
                      background: 'none', fontSize: '12px',
                      fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    {user.is_banned ? 'Débannir' : 'Bannir'}
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>—</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}