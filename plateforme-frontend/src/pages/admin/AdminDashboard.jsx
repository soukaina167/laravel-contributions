import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/axios'
import Topbar from '../../components/Topbar'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/admin/statistics').then(res => setStats(res.data))
  }, [])

  const statCards = stats ? [
    { to: '/admin/videos', icon: 'ti-video',        label: 'Modérer les vidéos' },
{ to: '/admin/users',  icon: 'ti-users',         label: 'Gérer les utilisateurs' },
{ to: '/admin/categories', icon: 'ti-category',  label: 'Catégories' },
{ to: '/admin/subscriptions', icon: 'ti-crown',  label: 'Abonnements' },
  ] : []

  return (
    <div>
      <Topbar title="Tableau de bord" />
      <div style={{ padding: '24px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {statCards.map(card => (
            <div key={card.label} style={{
              background: '#fff', border: '0.5px solid #e5e7eb',
              borderRadius: '10px', padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
                    {card.label}
                  </div>
                  <div style={{
                    fontSize: '26px', fontWeight: 600,
                    color: card.alert ? '#dc2626' : '#111827',
                  }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px' }}>
                    {card.sub}
                  </div>
                </div>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: card.alert ? '#fef2f2' : '#eff5ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${card.icon}`} style={{
                    fontSize: '18px',
                    color: card.alert ? '#dc2626' : '#1a56db',
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Raccourcis */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px',
        }}>
          {[
            { to: '/admin/videos', icon: 'ti-video',  label: 'Modérer les vidéos', desc: 'Valider ou rejeter les soumissions' },
            { to: '/admin/users',  icon: 'ti-users',  label: 'Gérer les utilisateurs', desc: 'Bannir, débannir, consulter' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{
              background: '#fff', border: '0.5px solid #e5e7eb',
              borderRadius: '10px', padding: '20px',
              textDecoration: 'none', display: 'block',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px',
                background: '#eff5ff', marginBottom: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${item.icon}`} style={{ color: '#1a56db', fontSize: '20px' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{item.desc}</div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}