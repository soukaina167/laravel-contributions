import { useState, useEffect } from 'react'
import api from '../lib/axios'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen]                   = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Rafraîchit toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch {}
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const markRead = async (id) => {
    await api.post(`/notifications/${id}/read`)
    fetchNotifications()
  }

  const markAllRead = async () => {
    await api.post('/notifications/read-all')
    fetchNotifications()
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Icône cloche */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: 'none',
          cursor: 'pointer', position: 'relative',
          padding: '4px',
        }}>
        <span style={{ fontSize: '20px' }}>🔔</span>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: '#dc2626', color: '#fff',
            borderRadius: '50%', width: '16px', height: '16px',
            fontSize: '10px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '36px',
          width: '320px', background: '#fff',
          border: '0.5px solid #e5e7eb', borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          zIndex: 100,
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '0.5px solid #e5e7eb',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{
                fontSize: '11px', color: '#1a56db',
                background: 'none', border: 'none', cursor: 'pointer',
              }}>
                Tout marquer lu
              </button>
            )}
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p style={{
                textAlign: 'center', color: '#9ca3af',
                fontSize: '13px', padding: '24px',
              }}>
                Aucune notification
              </p>
            ) : notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '0.5px solid #f3f4f6',
                  background: n.is_read ? '#fff' : '#eff5ff',
                  cursor: 'pointer',
                }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>
                  {n.title}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>
                  {n.message}
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                  {new Date(n.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}