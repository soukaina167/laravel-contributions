import { useState, useEffect } from 'react'
import api from '../../lib/axios'

export default function Scheduler() {
  const [schedule, setSchedule]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage]     = useState({ text: '', type: '' })
  const [courses, setCourses]     = useState([])
  const [activeTab, setActiveTab] = useState('smart')
  const [accessibleCourses, setAccessibleCourses] = useState([])

  // Formulaire Smart unifié avec selected_courses
  const [smartForm, setSmartForm] = useState({
    hours_per_day:  2,
    start_date:     new Date().toISOString().split('T')[0],
    days_available: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    selected_courses: [], 
  })

  // Formulaire Manuel
  const [items, setItems] = useState([{
    course_id: '', planned_date: '', duration: ''
  }])

  const daysOptions = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

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
      const [allRes, accessibleRes] = await Promise.all([
        api.get('/courses'),
        api.get('/my-accessible-courses').catch(() => ({ data: [] }))
      ])
      setCourses(allRes.data)
      setAccessibleCourses(accessibleRes.data)
    } catch {}
  }

  const toggleDay = (day) => {
    const days = smartForm.days_available
    setSmartForm({
      ...smartForm,
      days_available: days.includes(day)
        ? days.filter(d => d !== day)
        : [...days, day]
    })
  }

  const handleSmartGenerate = async (e) => {
    e.preventDefault()
    if (!smartForm.selected_courses?.length) {
      setMessage({ text: "Vous devez sélectionner au moins un cours !", type: 'error' })
      return
    }
    setGenerating(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await api.post('/schedule/generate', smartForm)
      setMessage({ text: res.data.message, type: 'success' })
      fetchSchedule()
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Erreur', type: 'error' })
    } finally {
      setGenerating(false)
    }
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/schedule', { items })
      setMessage({ text: 'Planning créé avec succès !', type: 'success' })
      fetchSchedule()
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Erreur', type: 'error' })
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete('/schedule')
      setMessage({ text: 'Planning supprimé !', type: 'success' })
      setSchedule(null)
    } catch {}
  }

  const addItem = () => setItems([...items, { course_id: '', planned_date: '', duration: '' }])
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))
  const handleChange = (i, field, value) => {
    const newItems = [...items]
    newItems[i][field] = value
    setItems(newItems)
  }

  if (loading) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
        <i className="ti ti-calendar" /> Smart Scheduler
      </h1>
      <p className="text-gray-500 mb-6">Organisez vos sessions d'apprentissage et suivez votre progression.</p>

      {message.text && (
        <div className={`p-3 rounded mb-6 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.type === 'success' ? <i className="ti ti-check" /> : <i className="ti ti-x" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Planning actuel */}
      {schedule && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Planning actuel</h2>
            <button onClick={handleDelete}
              className="text-red-500 border border-red-200 px-4 py-2 rounded hover:bg-red-50 text-sm flex items-center gap-2">
              <i className="ti ti-trash" /> Supprimer le planning
            </button>
          </div>
          <div className="space-y-3">
            {schedule.items?.map(item => (
              <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                    <i className="ti ti-book" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {courses.find(c => c.id === item.course_id)?.title || `Cours #${item.course_id}`}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <i className="ti ti-calendar" /> {new Date(item.planned_date).toLocaleDateString('fr-FR')} &nbsp;•&nbsp; <i className="ti ti-clock" /> {item.duration} min
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                  item.status === 'done'    ? 'bg-green-100 text-green-700' :
                  item.status === 'skipped' ? 'bg-red-100 text-red-700' :
                                              'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status === 'done' ? (
                    <>
                      <i className="ti ti-check" /> Terminé
                    </>
                  ) : item.status === 'skipped' ? (
                    <>
                      <i className="ti ti-x" /> Ignoré
                    </>
                  ) : (
                    <>
                      <i className="ti ti-clock" /> En attente
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'smart',  label: <><i className="ti ti-robot" /> Génération IA</> },
          { key: 'manual', label: <>✏️ Manuel</> },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Smart Form */}
      {activeTab === 'smart' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <i className="ti ti-robot" /> Génération intelligente par IA
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Sélectionnez les cours à planifier, l'IA organisera automatiquement votre planning selon vos disponibilités.
          </p>

          <form onSubmit={handleSmartGenerate} className="space-y-6">
            {/* Sélection des cours avec Cases à cocher */}
            <div>
              <label className="block text-sm font-medium mb-3">
                <i className="ti ti-books" /> Choisissez les cours à planifier
              </label>
              {courses.length === 0 ? (
                <p className="text-yellow-600 text-sm bg-yellow-50 p-3 rounded">
                  Aucun cours disponible. Accédez d'abord à des cours depuis la page Cours.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                  {courses.map(c => {
                    const hasAccess = accessibleCourses.some(ac => ac.id === c.id)
                    const isSelected = smartForm.selected_courses?.includes(c.id)
                    return (
                      <div key={c.id}
                        onClick={() => {
                          const selected = smartForm.selected_courses || []
                          setSmartForm({
                            ...smartForm,
                            selected_courses: isSelected
                              ? selected.filter(id => id !== c.id)
                              : [...selected, c.id]
                          })
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                          background: isSelected ? '#eff5ff' : '#f9fafb',
                          border: `1px solid ${isSelected ? '#1a56db' : '#e5e7eb'}`,
                        }}>
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={() => {}}
                          style={{ accentColor: '#1a56db' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                            {c.title}
                          </p>
                          <p style={{ fontSize: '11px', color: '#6b7280' }}>
                            {c.skill?.name && (
                              <span style={{
                                background: '#eff5ff', color: '#1a56db',
                                padding: '1px 6px', borderRadius: '4px', marginRight: '6px',
                              }}>
                                {c.skill.name}
                              </span>
                            )}
                            {c.credits_cost} crédits
                            {hasAccess && (
                              <span style={{ color: '#16a34a', marginLeft: '6px' }}>
                                ✓ Accès débloqué
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                {(smartForm.selected_courses?.length || 0)} cours sélectionnés
              </p>
            </div>

            {/* Heures disponibles par jour */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <i className="ti ti-clock" /> Heures disponibles par jour
              </label>
              <input
                type="range" min="1" max="8"
                value={smartForm.hours_per_day}
                onChange={e => setSmartForm({...smartForm, hours_per_day: parseInt(e.target.value)})}
                className="w-full"
              />
              <p className="text-blue-600 font-semibold text-center mt-1">
                {smartForm.hours_per_day} heure{smartForm.hours_per_day > 1 ? 's' : ''} / jour
              </p>
            </div>

            {/* Date de début */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <i className="ti ti-calendar" /> Date de début
              </label>
              <input
                type="date"
                value={smartForm.start_date}
                onChange={e => setSmartForm({...smartForm, start_date: e.target.value})}
                className="border rounded px-3 py-2 text-sm"
                required
              />
            </div>

            {/* Jours disponibles */}
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <i className="ti ti-calendar-week" /> Jours disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOptions.map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      smartForm.days_available.includes(day)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton de Soumission Smart */}
            <button
              type="submit"
              disabled={generating || !smartForm.selected_courses?.length}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2">
              {generating ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" /> L'IA génère votre planning...
                </>
              ) : (
                <>
                  <i className="ti ti-wand" /> Générer le planning intelligent
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Manuel Form */}
      {activeTab === 'manual' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">✏️ Créer manuellement</h2>
          <form onSubmit={handleManualSubmit}>
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium text-gray-700 text-sm">Session {index + 1}</p>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)}
                      className="text-red-500 text-sm hover:underline">
                      Supprimer
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Cours</label>
                    <select
                      value={item.course_id}
                      onChange={e => handleChange(index, 'course_id', e.target.value)}
                      className="w-full border rounded px-3 py-2 bg-white text-sm"
                      required>
                      <option value="">Choisir un cours...</option>
                      {courses.map(c => {
                        const hasAccess = accessibleCourses.some(ac => ac.id === c.id)
                        return (
                          <option key={c.id} value={c.id}>
                            {c.title} {hasAccess ? '✓' : `(${c.credits_cost} crédits)`}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Date</label>
                    <input type="date"
                      value={item.planned_date}
                      onChange={e => handleChange(index, 'planned_date', e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                      required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Durée (min)</label>
                    <input type="number"
                      value={item.duration}
                      onChange={e => handleChange(index, 'duration', e.target.value)}
                      placeholder="60"
                      className="w-full border rounded px-3 py-2 text-sm"
                      min="1" required />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-4 mt-4">
              <button type="button" onClick={addItem}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm flex items-center gap-1">
                <i className="ti ti-plus" /> Ajouter une session
              </button>
              <button type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm flex items-center gap-1">
                <i className="ti ti-check" /> Créer le planning
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}