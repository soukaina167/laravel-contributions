import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/axios'

export default function CreateCourse() {
  const [form, setForm] = useState({
    title: '', description: '', credits_cost: 0, skill_id: ''
  })
  const [video, setVideo]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [skills, setSkills]   = useState([])
  const navigate              = useNavigate()

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills') // 👈 change ici
      setSkills(res.data)
    } catch {
      setSkills([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('title',        form.title)
    formData.append('description',  form.description)
    formData.append('credits_cost', form.credits_cost)
    formData.append('video',        video)
    if (form.skill_id) {
      formData.append('skill_id', form.skill_id)
    }

    try {
      await api.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur création cours')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Créer un cours</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full border rounded px-3 py-2 h-32"
            required
          />
        </div>

        {/* 👇 Nouveau champ catégorie */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Catégorie
          </label>
          {skills.length > 0 ? (
            <select
              value={form.skill_id}
              onChange={e => setForm({...form, skill_id: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Choisir une catégorie --</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Aucune catégorie disponible — demandez à l'admin d'en créer.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Coût en crédits</label>
          <input
            type="number"
            value={form.credits_cost}
            onChange={e => setForm({...form, credits_cost: e.target.value})}
            className="w-full border rounded px-3 py-2"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vidéo</label>
          <input
            type="file"
            accept="video/*"
            onChange={e => setVideo(e.target.files[0])}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Créer le cours'}
        </button>
      </form>
    </div>
  )
}