import { useState, useEffect } from 'react'
import api from '../../lib/axios'

export default function Scheduler() {
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [message, setMessage]   = useState('')
  const [items, setItems]       = useState([{
    course_id: '',
    planned_date: '',
    duration: ''
  }])

  useEffect(() => {
    fetchSchedule()
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
      const res = await api.post('/schedule', { items })
      setMessage('Planning créé avec succès !')
      fetchSchedule()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete('/schedule')
      setMessage('Planning supprimé !')
      setSchedule(null)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  if (loading) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Smart Scheduler</h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Créer un planning</h2>

        {items.map((item, index) => (
          <div key={index} className="border rounded p-4 mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course ID</label>
                <input
                  type="number"
                  value={item.course_id}
                  onChange={e => handleChange(index, 'course_id', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={item.planned_date}
                  onChange={e => handleChange(index, 'planned_date', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Durée (min)</label>
                <input
                  type="number"
                  value={item.duration}
                  onChange={e => handleChange(index, 'duration', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 text-sm mt-2 hover:underline"
              >
                Supprimer
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addItem}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            + Ajouter un cours
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Créer le planning
          </button>
        </div>
      </form>

      {/* Afficher le planning */}
      {schedule && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mon Planning</h2>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Supprimer
            </button>
          </div>
          <p className="text-gray-500 mb-4">
            Généré le : {new Date(schedule.generated_date).toLocaleDateString()}
          </p>
          <div className="space-y-3">
            {schedule.items?.map(item => (
              <div key={item.id} className="border rounded p-3 flex justify-between">
                <div>
                  <p className="font-medium">Cours #{item.course_id}</p>
                  <p className="text-gray-500 text-sm">
                    Date : {new Date(item.planned_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600">{item.duration} min</p>
                  <p className="text-gray-500 text-sm">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}