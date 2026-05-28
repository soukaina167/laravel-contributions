import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../lib/axios'

export default function Navbar() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await api.post('/logout')
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Plateforme Cours
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">Cours</Link>

        {token ? (
          <>
            {user?.role?.name === 'admin' && (
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
            )}
            <Link to="/courses/create" className="hover:underline">
              Créer cours
            </Link>
            <span>{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="hover:underline">Connexion</Link>
            <Link to="/register" className="hover:underline">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  )
}