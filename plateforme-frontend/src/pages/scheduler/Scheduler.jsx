import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import Topbar from '../../components/Topbar'

export default function Scheduler() {
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [message, setMessage]   = useState('')
  const [courses, setCourses]   = useState([])
  const [items, setItems]       = useState([{
    course_id: '', planned_date: '', duration: ''
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
      setMessage('Planning créé avec succès.')
      fetchSchedule()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la création.')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete('/schedule')
      setMessage('Planning supprimé.')
      setSchedule(null)
    } catch {}
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontSize: '13px' }}>
      Chargement...
    </div>
  )

  const statusStyle = (status) => {
    const map = {
      done:    { bg: '#dcfce7', color: '#166534', label: 'Terminé' },
      skipped: { bg: '#fee2e2', color: '#991b1b', label: 'Ignoré' },
      pending: { bg: '#fef3c7', color: '#92400e', label: 'En attente' },
    }
    return map[status] || map.pending
  }

  return (
    <div>
      <Topbar title="Smart Scheduler" />
      <div style={{ padding: '24px', maxWidth: '860px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
            Planification des sessions
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            Organisez vos sessions d'apprentissage et suivez votre progression.
          </p>
        </div>

        {message && (
          <div style={{
            background: '#f0fdf4', border: '0.5px solid #86efac',
            color: '#166534', padding: '10px 14px',
            borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
          }}>
            {message}
          </div>
        )}

        {/* Planning existant */}
        {schedule && (
          <div style={{
            background: '#fff', border: '0.5px solid #e5e7eb',
            borderRadius: '10px', padding: '20px', marginBottom: '20px',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '16px',
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                Planning actuel
              </h2>
              <button
                onClick={handleDelete}
                style={{
                  background: 'none', border: '0.5px solid #fca5a5',
                  color: '#dc2626', cursor: 'pointer',
                  padding: '5px 12px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <i className="ti ti-trash" style={{ fontSize: '14px' }} />
                Supprimer le planning
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {schedule.items?.map(item => {
                const s = statusStyle(item.status)
                return (
                  <div key={item.id} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '12px 14px',
                    border: '0.5px solid #e5e7eb', borderRadius: '8px',
                    background: '#fafafa',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: '#eff5ff', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className="ti ti-book" style={{ color: '#1a56db', fontSize: '16px' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                          {courses.find(c => c.id === item.course_id)?.title || `Cours #${item.course_id}`}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="ti ti-calendar" style={{ fontSize: '11px' }} />
                          {new Date(item.planned_date).toLocaleDateString('fr-FR')}
                          <span style={{ marginLeft: '6px' }}>
                            <i className="ti ti-clock" style={{ fontSize: '11px' }} />
                            {' '}{item.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <span style={{
                      background: s.bg, color: s.color,
                      padding: '3px 10px', borderRadius: '4px',
                      fontSize: '11px', fontWeight: 600,
                    }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Formulaire */}
        <div style={{
          background: '#fff', border: '0.5px solid #e5e7eb',
          borderRadius: '10px', padding: '20px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>
            {schedule ? 'Modifier le planning' : 'Créer un planning'}
          </h2>

          <form onSubmit={handleSubmit}>
            {items.map((item, index) => (
              <div key={index} style={{
                border: '0.5px solid #e5e7eb', borderRadius: '8px',
                padding: '16px', marginBottom: '12px', background: '#fafafa',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '14px',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                    Session {index + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      style={{
                        background: 'none', border: 'none',
                        cursor: 'pointer', color: '#dc2626',
                        display: 'flex', alignItems: 'center',
                        padding: '4px',
                      }}
                      title="Supprimer cette session"
                    >
                      <i className="ti ti-trash" style={{ fontSize: '16px' }} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '12px',
                      fontWeight: 500, color: '#374151', marginBottom: '6px',
                    }}>
                      Cours
                    </label>
                    <select
                      value={item.course_id}
                      onChange={e => handleChange(index, 'course_id', e.target.value)}
                      required
                      style={{
                        width: '100%', border: '0.5px solid #d1d5db',
                        borderRadius: '6px', padding: '7px 10px',
                        fontSize: '13px', background: '#fff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Choisir un cours</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block', fontSize: '12px',
                      fontWeight: 500, color: '#374151', marginBottom: '6px',
                    }}>
                      Date planifiée
                    </label>
                    <input
                      type="date"
                      value={item.planned_date}
                      onChange={e => handleChange(index, 'planned_date', e.target.value)}
                      required
                      style={{
                        width: '100%', border: '0.5px solid #d1d5db',
                        borderRadius: '6px', padding: '7px 10px',
                        fontSize: '13px', background: '#fff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block', fontSize: '12px',
                      fontWeight: 500, color: '#374151', marginBottom: '6px',
                    }}>
                      Durée (minutes)
                    </label>
                    <input
                      type="number"
                      value={item.duration}
                      onChange={e => handleChange(index, 'duration', e.target.value)}
                      placeholder="Ex: 60"
                      min="1"
                      required
                      style={{
                        width: '100%', border: '0.5px solid #d1d5db',
                        borderRadius: '6px', padding: '7px 10px',
                        fontSize: '13px', background: '#fff',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={addItem}
                style={{
                  background: '#f4f6f9', color: '#374151',
                  border: '0.5px solid #e5e7eb',
                  padding: '8px 16px', borderRadius: '6px',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <i className="ti ti-plus" style={{ fontSize: '14px' }} />
                Ajouter une session
              </button>

              <button
                type="submit"
                style={{
                  background: '#1a56db', color: '#fff',
                  border: 'none', padding: '8px 20px',
                  borderRadius: '6px', fontSize: '13px',
                  fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <i className="ti ti-check" style={{ fontSize: '14px' }} />
                {schedule ? 'Mettre à jour' : 'Créer le planning'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}