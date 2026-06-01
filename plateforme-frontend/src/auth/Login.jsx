import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/login', form)
      setAuth(res.data.user, res.data.token)
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}