import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import Topbar from '../../components/Topbar'

export default function AdminVideos() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPending() }, [])

  const fetchPending = async () => {
    try {
      const res = await api.get('/admin/pending-videos')
      setPending(res.data)
    } finally { setLoading(false) }
  }

  const validate = async (id) => {
    await api.post(`/admin/validate-video/${id}`)
    fetchPending()
  }

  const reject = async (id) => {
    await api.post(`/admin/reject-video/${id}`)
    fetchPending()
  }

  const badge = (status) => {
    const map = {
      pending:  { bg: '#fef3c7', color: '#92400e', label: 'En attente' },
      approved: { bg: '#dcfce7', color: '#166534', label: 'Validé' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejeté' },
    }
    const s = map[status] || map.pending
    return (
      <span style={{
        background: s.bg, color: s.color,
        padding: '2px 8px', borderRadius: '4px',
        fontSize: '11px', fontWeight: 600,
      }}>
        {s.label}
      </span>
    )
  }

  return (
    <div>
      <Topbar title="Modération des vidéos" />
      <div style={{ padding: '24px' }}>
        <div style={{
          background: '#fff', border: '0.5px solid #e5e7eb',
          borderRadius: '10px', overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '10px 20px',
            background: '#f8fafc',
            borderBottom: '0.5px solid #e5e7eb',
          }}>
            {['Titre', 'Instructeur', 'Statut', 'Actions'].map(h => (
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
          ) : pending.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
              Aucune vidéo en attente.
            </div>
          ) : pending.map(course => (
            <div key={course.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
              padding: '12px 20px', borderBottom: '0.5px solid #f3f4f6',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                {course.title}
              </span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                {course.instructor?.name}
              </span>
              <span>{badge(course.status)}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => validate(course.id)}
                  style={{
                    padding: '4px 12px', borderRadius: '5px',
                    border: '0.5px solid #16a34a', color: '#16a34a',
                    background: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Valider
                </button>
                <button
                  onClick={() => reject(course.id)}
                  style={{
                    padding: '4px 12px', borderRadius: '5px',
                    border: '0.5px solid #dc2626', color: '#dc2626',
                    background: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}