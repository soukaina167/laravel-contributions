
import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm]       = useState({ name: '', email: '' })
  const [message, setMessage] = useState('')
  const [quota, setQuota]     = useState(null)
  const { setAuth, token }    = useAuthStore()

  useEffect(() => {
    fetchProfile()
    fetchQuota()
  }, [])

  const fetchProfile = async () => {
    const res = await api.get('/profile')
    setProfile(res.data)
    setForm({ name: res.data.name, email: res.data.email })
  }

  const fetchQuota = async () => {
    const res = await api.get('/profile/quota')
    setQuota(res.data)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.put('/profile', form)
      setMessage('Profil mis à jour avec succès !')
      setProfile(res.data.user)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  if (!profile) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

    
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sauvegarder
        </button>
      </form>
    </div>
  )
}