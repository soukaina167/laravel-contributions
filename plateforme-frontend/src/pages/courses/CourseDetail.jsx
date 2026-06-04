import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'
import Topbar from '../../components/Topbar'

const tabs = [
  { key: 'video',   label: 'Vidéo' },
  { key: 'notes',   label: 'Notes & PDF' },
  { key: 'forum',   label: 'Forum' },
  { key: 'reviews', label: 'Avis' },
]

export default function CourseDetail() {
  const { id }                    = useParams()
  const [course, setCourse]       = useState(null)
  const [notes, setNotes]         = useState([])
  const [reviews, setReviews]     = useState([])
  const [activeTab, setActiveTab] = useState('video')
  const [message, setMessage]     = useState('')
  const [loading, setLoading]     = useState(true)
  const [review, setReview]       = useState({ rating: 5, comment: '' })
  const { token, user }           = useAuthStore()

  useEffect(() => {
    fetchCourse()
    if (token) { fetchNotes(); fetchReviews() }
  }, [id])

  const fetchCourse  = async () => {
    try { const res = await api.get(`/courses/${id}`); setCourse(res.data) }
    finally { setLoading(false) }
  }
  const fetchNotes   = async () => {
    try { const res = await api.get(`/courses/${id}/notes`); setNotes(res.data) }
    catch { setNotes([]) }
  }
  const fetchReviews = async () => {
    try { const res = await api.get(`/courses/${id}/reviews`); setReviews(res.data) }
    catch { setReviews([]) }
  }
  const handleAccess = async () => {
    try { const res = await api.post(`/courses/${id}/access`); setMessage(res.data.message) }
    catch (err) { setMessage(err.response?.data?.message || 'Erreur') }
  }
  const handleReview = async (e) => {
    e.preventDefault()
    try { await api.post(`/courses/${id}/reviews`, review); setReview({ rating: 5, comment: '' }); fetchReviews() }
    catch {}
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontSize: '13px' }}>
      Chargement...
    </div>
  )
  if (!course) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontSize: '13px' }}>
      Cours introuvable.
    </div>
  )

  return (
    <div>
      <Topbar title={course.title} />
      <div style={{ padding: '24px', display: 'flex', gap: '20px' }}>

        {/* Contenu principal */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div style={{
            background: '#fff', border: '0.5px solid #e5e7eb',
            borderRadius: '10px', padding: '20px 24px', marginBottom: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div>
              <div style={{
                fontSize: '10px', fontWeight: 600, color: '#1a56db',
                letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px',
              }}>
                Formation
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                {course.title}
              </h1>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px', lineHeight: 1.5 }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="ti ti-star" style={{ color: '#f59e0b', fontSize: '13px' }} />
                  {course.rating || 0}
                </span>
                <span>Par <strong style={{ color: '#111827' }}>{course.instructor?.name}</strong></span>
                <span style={{ color: '#1a56db', fontWeight: 500 }}>{course.credits_cost} crédits</span>
              </div>
            </div>

            {token && (
              <button
                onClick={handleAccess}
                style={{
                  background: '#1a56db', color: '#fff', border: 'none',
                  padding: '9px 20px', borderRadius: '6px',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', flexShrink: 0,
                }}
              >
                Accéder au cours
              </button>
            )}
          </div>

          {message && (
            <div style={{
              background: '#f0fdf4', border: '0.5px solid #86efac',
              color: '#166534', padding: '10px 14px', borderRadius: '8px',
              fontSize: '13px', marginBottom: '16px',
            }}>
              {message}
            </div>
          )}

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '2px',
            background: '#f4f6f9', borderRadius: '8px',
            padding: '3px', marginBottom: '16px', width: 'fit-content',
          }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '6px 16px', borderRadius: '6px',
                  fontSize: '13px', fontWeight: activeTab === tab.key ? 500 : 400,
                  color: activeTab === tab.key ? '#111827' : '#6b7280',
                  background: activeTab === tab.key ? '#fff' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab — Vidéo */}
          {activeTab === 'video' && (
            <div style={{
              background: '#0f1f3d', borderRadius: '10px',
              height: '360px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {course.video_url ? (
                <video controls style={{ width: '100%', height: '100%', borderRadius: '10px' }} src={course.video_url} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <i className="ti ti-video-off" style={{ fontSize: '36px', color: 'rgba(255,255,255,0.2)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '8px' }}>
                    Aucune vidéo disponible
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab — Notes & PDF */}
          {activeTab === 'notes' && (
            <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                Ressources du cours
              </h2>
              {notes.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '32px' }}>
                  Aucune ressource disponible.
                </p>
              ) : notes.map(note => (
                <div key={note.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px', border: '0.5px solid #f3f4f6',
                  borderRadius: '8px', marginBottom: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: '#eff5ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="ti ti-file" style={{ color: '#1a56db', fontSize: '16px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                        {note.type.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        {note.url.substring(0, 40)}...
                      </div>
                    </div>
                  </div>
                  {user?.role?.name === 'premium' ? (
                    <a href={note.url} target="_blank" rel="noreferrer" style={{
                      background: '#1a56db', color: '#fff',
                      padding: '6px 14px', borderRadius: '6px',
                      fontSize: '12px', textDecoration: 'none', fontWeight: 500,
                    }}>
                      Télécharger
                    </a>
                  ) : (
                    <Link to="/subscription" style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '6px 14px', borderRadius: '6px',
                      fontSize: '12px', textDecoration: 'none', fontWeight: 500,
                      border: '0.5px solid #fcd34d',
                    }}>
                      Premium requis
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab — Forum */}
          {activeTab === 'forum' && (
            <div style={{
              background: '#fff', border: '0.5px solid #e5e7eb',
              borderRadius: '10px', padding: '32px',
              textAlign: 'center',
            }}>
              <i className="ti ti-message-circle" style={{ fontSize: '32px', color: '#d1d5db' }} />
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '10px 0 20px' }}>
                Posez vos questions et échangez avec la communauté.
              </p>
              <Link to={`/courses/${id}/forum`} style={{
                background: '#1a56db', color: '#fff',
                padding: '9px 20px', borderRadius: '6px',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              }}>
                Accéder au forum
              </Link>
            </div>
          )}

          {/* Tab — Avis */}
          {activeTab === 'reviews' && (
            <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
                Avis des étudiants
              </h2>

              {token && (
                <form onSubmit={handleReview} style={{
                  background: '#f9fafb', border: '0.5px solid #e5e7eb',
                  borderRadius: '8px', padding: '16px', marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
                    <label style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>Note</label>
                    <select
                      value={review.rating}
                      onChange={e => setReview({ ...review, rating: e.target.value })}
                      style={{
                        border: '0.5px solid #d1d5db', borderRadius: '6px',
                        padding: '5px 10px', fontSize: '13px', background: '#fff',
                      }}
                    >
                      {[5,4,3,2,1].map(n => (
                        <option key={n} value={n}>{n} / 5</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={review.comment}
                    onChange={e => setReview({ ...review, comment: e.target.value })}
                    placeholder="Partagez votre expérience avec ce cours..."
                    rows={3}
                    style={{
                      width: '100%', border: '0.5px solid #d1d5db',
                      borderRadius: '6px', padding: '8px 12px',
                      fontSize: '13px', resize: 'none', background: '#fff',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button type="submit" style={{
                    marginTop: '10px', background: '#1a56db', color: '#fff',
                    border: 'none', padding: '7px 16px', borderRadius: '6px',
                    fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  }}>
                    Publier
                  </button>
                </form>
              )}

              {reviews.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
                  Aucun avis pour l'instant.
                </p>
              ) : reviews.map(r => (
                <div key={r.id} style={{
                  display: 'flex', gap: '12px', padding: '14px 0',
                  borderBottom: '0.5px solid #f3f4f6',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: '#dbeafe', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 600, color: '#1a56db',
                  }}>
                    {r.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>{r.user?.name}</span>
                      <span style={{ fontSize: '12px', color: '#f59e0b' }}>
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Playlist sidebar */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          <div style={{
            background: '#fff', border: '0.5px solid #e5e7eb',
            borderRadius: '10px', padding: '16px',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 600, color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px',
            }}>
              Playlist
            </div>

            {[
              { num: 1, title: 'Introduction', dur: '12 min', active: true },
              { num: 2, title: 'Concepts de base', dur: '18 min', active: false },
              { num: 3, title: 'Pratique guidée', dur: '24 min', active: false },
              { num: 4, title: 'Projet final', dur: '31 min', active: false },
            ].map(item => (
              <div key={item.num} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 10px', borderRadius: '6px',
                border: `0.5px solid ${item.active ? '#1a56db' : '#e5e7eb'}`,
                background: item.active ? '#eff5ff' : '#fff',
                marginBottom: '6px', cursor: 'pointer',
              }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', width: '14px' }}>
                  {item.num}
                </span>
                <div>
                  <div style={{
                    fontSize: '12px', fontWeight: item.active ? 500 : 400,
                    color: item.active ? '#1a56db' : '#111827',
                  }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>{item.dur}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}