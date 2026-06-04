import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../lib/axios'
import Logo from './Logo'

const userLinks = [
  { path: '/',             icon: 'ti-home',           label: 'Accueil' },
  { path: '/my-courses',   icon: 'ti-book',           label: 'Mes cours' },
  { path: '/scheduler',    icon: 'ti-calendar',       label: 'Planning' },
  { path: '/forum',        icon: 'ti-message-circle', label: 'Forum' },
  { path: '/subscription', icon: 'ti-star',           label: 'Premium' },
  { path: '/profile',      icon: 'ti-user',           label: 'Mon profil' },
  { path: '/courses/create', icon: 'ti-plus',         label: 'Proposer un cours' },
]

const adminLinks = [
  { path: '/admin',              icon: 'ti-chart-bar', label: 'Tableau de bord' },
  { path: '/admin/videos',       icon: 'ti-video',     label: 'Modération vidéos' },
  { path: '/admin/users',        icon: 'ti-users',     label: 'Utilisateurs' },
  { path: '/admin/categories',   icon: 'ti-folder',    label: 'Catégories' },
  { path: '/admin/subscriptions',icon: 'ti-star',      label: 'Abonnements' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate         = useNavigate()
  const location         = useLocation()

  const isAdmin = user?.role?.name === 'admin'
  const links   = isAdmin ? adminLinks : userLinks

  const handleLogout = async () => {
    try { await api.post('/logout') } catch {}
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <aside style={{
      width: '220px',
      background: '#0f1f3d',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      height: '100vh',
      zIndex: 50,
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <Logo size={32} />
        <div>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.3px' }}>
            SkillSwap
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
            Apprenez. Partagez. Évoluez.
          </div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: '16px 16px 4px' }}>
        <span style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
        }}>
          {isAdmin ? 'Administration' : 'Navigation'}
        </span>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '4px 8px', overflowY: 'auto' }}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 10px',
              borderRadius: '6px',
              color: isActive(link.path) ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive(link.path) ? '#1a3a6e' : 'transparent',
              fontSize: '13px',
              fontWeight: isActive(link.path) ? 500 : 400,
              textDecoration: 'none',
              marginBottom: '2px',
              transition: 'all 0.15s',
            }}
          >
            <i className={`ti ${link.icon}`} style={{ fontSize: '15px', width: '16px' }} />
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div style={{
        padding: '12px 8px',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 10px',
          borderRadius: '6px',
          marginBottom: '8px',
        }}>
          <div style={{
            width: '30px', height: '30px',
            borderRadius: '50%',
            background: '#1a3a6e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#7aa4e0', fontSize: '12px', fontWeight: 600,
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{user?.role?.name}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            background: 'rgba(220,38,38,0.15)',
            border: '0.5px solid rgba(220,38,38,0.3)',
            color: '#f87171',
            fontSize: '12px',
            fontWeight: 500,
            padding: '7px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <i className="ti ti-logout" style={{ fontSize: '14px' }} />
          Déconnexion
        </button>
      </div>

    </aside>
  )
}