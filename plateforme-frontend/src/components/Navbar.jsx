import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../lib/axios'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try { await api.post('/logout') } catch {}
    logout()
    navigate('/login')
  }

  const links = [
    { path: '/', label: '🏠 Accueil' },
    { path: '/courses', label: '📚 Cours' },
    { path: '/profile', label: '👤 Mon Profil' },
    { path: '/subscription', label: '⭐ Abonnement' },
    { path: '/scheduler', label: '📅 Planning' },
    { path: '/ai', label: '🤖 Assistant IA' },
  ]

  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white flex flex-col p-4 fixed left-0 top-0">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
          ↔
        </div>
        <div>
          <h1 className="text-xl font-bold">SkillSwap</h1>
          <p className="text-blue-300 text-xs">Apprenez. Partagez. Évoluez.</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {links.map(link => (
          <Link key={link.path} to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition ${
              location.pathname === link.path ? 'bg-blue-700 font-semibold' : ''
            }`}>
            {link.label}
          </Link>
        ))}
        {user?.role?.name === 'admin' && (
          <Link to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800">
            ⚙️ Administration
          </Link>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-blue-700 pt-4 mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-blue-300 text-xs">{user?.role?.name}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm">
          Déconnexion
        </button>
      </div>
    </div>
  )
}