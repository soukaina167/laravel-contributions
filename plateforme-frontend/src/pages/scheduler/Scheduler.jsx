import { useState, useEffect } from 'react'
import api from '../../lib/axios'

export default function Scheduler() {
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [message, setMessage]   = useState('')
  const [courses, setCourses]   = useState([])
  const [items, setItems]       = useState([{
    course_id: '',
    planned_date: '',
    duration: ''
  }])

  useEffect(() => {
    fetchSchedule()
    fetchCourses()
  }, [])

  const fetchSchedule = async () => {
    try {
      const res = await api.get('/schedule')
      setSchedule(res.data)
    } catch {
      setSchedule(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const res = await api.get('/my-accessible-courses')
      setCourses(res.data)
    } catch {}
  }

  const addItem = () => {
    setItems([...items, { course_id: '', planned_date: '', duration: '' }])
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/schedule', { items })
      setMessage('✅ Planning créé avec succès !')
      fetchSchedule()
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Erreur'))
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete('/schedule')
      setMessage('Planning supprimé !')
      setSchedule(null)
    } catch {}
  }

  if (loading) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">📅 Smart Scheduler</h1>
      <p className="text-gray-500 mb-6">Planifiez vos sessions d'apprentissage</p>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-6">
          {message}
        </div>
      )}

      {/* Planning existant */}
      {schedule && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mon Planning actuel</h2>
            <button onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">
              🗑️ Supprimer
            </button>
          </div>
          <div className="space-y-3">
            {schedule.items?.map(item => (
              <div key={item.id}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-medium">
                    {courses.find(c => c.id === item.course_id)?.title || `Cours #${item.course_id}`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    📅 {new Date(item.planned_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-medium">{item.duration} min</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'done' ? 'bg-green-100 text-green-700' :
                    item.status === 'skipped' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'done' ? '✅ Terminé' :
                     item.status === 'skipped' ? '⏭️ Ignoré' : '⏳ En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire nouveau planning */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">
          {schedule ? '🔄 Modifier le planning' : '➕ Créer un planning'}
        </h2>
        <form onSubmit={handleSubmit}>
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium text-gray-700">Session {index + 1}</p>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)}
                    className="text-red-500 text-sm hover:underline">
                    Supprimer
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cours</label>
                  <select
                    value={item.course_id}
                    onChange={e => handleChange(index, 'course_id', e.target.value)}
                    className="w-full border rounded px-3 py-2 bg-white"
                    required>
                    <option value="">Choisir un cours</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                    <option value="4">Cours de test</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date planifiée</label>
                  <input type="date"
                    value={item.planned_date}
                    onChange={e => handleChange(index, 'planned_date', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                  <input type="number"
                    value={item.duration}
                    onChange={e => handleChange(index, 'duration', e.target.value)}
                    placeholder="Ex: 60"
                    className="w-full border rounded px-3 py-2"
                    min="1"
                    required />
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button type="button" onClick={addItem}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
              + Ajouter une session
            </button>
            <button type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              {schedule ? '🔄 Mettre à jour' : '✅ Créer le planning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}