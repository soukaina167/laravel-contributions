import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../lib/axios'
import Topbar from '../../components/Topbar'
import useAuthStore from '../../store/authStore'

export default function CourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { token }             = useAuthStore()
  const [searchParams]        = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('q')
    q ? searchCourses(q) : fetchCourses()
  }, [searchParams])

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses')
      setCourses(res.data)
    } finally { setLoading(false) }
  }

  const searchCourses = async (q) => {
    try {
      const res = await api.get(`/search?q=${q}`)
      setCourses(res.data)
    } finally { setLoading(false) }
  }

  const cardStyle = {
    background: '#fff',
    border: '0.5px solid #e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
    textDecoration: 'none',
    display: 'block',
    transition: 'box-shadow 0.15s',
  }

  return (
    <div>
      <Topbar />
      <div style={{ padding: '24px' }}>

        {/* Hero — visible uniquement si non connecté */}
        {!token && (
          <div style={{
            background: '#0f1f3d',
            borderRadius: '10px',
            padding: '36px 40px',
            marginBottom: '24px',
          }}>
            <h1 style={{
              color: '#fff', fontSize: '22px',
              fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.3px',
            }}>
              Échangez vos compétences, développez votre avenir.
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.45)', fontSize: '13px',
              lineHeight: 1.6, maxWidth: '420px', marginBottom: '20px',
            }}>
              SkillSwap connecte les apprenants et les formateurs pour un échange de savoirs gagnant-gagnant.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" style={{
                background: '#1a56db', color: '#fff',
                padding: '9px 20px', borderRadius: '6px',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              }}>
                Découvrir les cours
              </Link>
              <Link to="/login" style={{
                background: 'rgba(255,255,255,0.08)',
                border: '0.5px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
                padding: '9px 20px', borderRadius: '6px',
                fontSize: '13px', textDecoration: 'none',
              }}>
                Se connecter
              </Link>
            </div>
          </div>
        )}

        {/* Section header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            Cours disponibles
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {courses.length} formation{courses.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Grille */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '13px' }}>
            Chargement...
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '13px' }}>
            Aucun cours disponible.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            {courses.map(course => (
              <Link key={course.id} to={token ? `/courses/${course.id}` : '/login'} style={cardStyle}>
                <div style={{
                  height: '120px',
                  background: '#e8edf5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '10px', background: '#1a56db',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="ti ti-video" style={{ color: '#fff', fontSize: '20px' }} />
                  </div>
                </div>

                <div style={{ padding: '14px' }}>
                  <div style={{
                    fontSize: '10px', fontWeight: 600,
                    color: '#1a56db', letterSpacing: '0.5px',
                    textTransform: 'uppercase', marginBottom: '4px',
                  }}>
                    Formation
                  </div>
                  <div style={{
                    fontSize: '13px', fontWeight: 500,
                    color: '#111827', lineHeight: 1.4,
                    marginBottom: '10px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {course.title}
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', fontSize: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280' }}>
                      <i className="ti ti-star" style={{ color: '#f59e0b', fontSize: '12px' }} />
                      {course.rating || 0}
                    </div>
                    <span style={{ color: '#1a56db', fontWeight: 500 }}>
                      {course.credits_cost} crédits
                    </span>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginTop: '10px', paddingTop: '10px',
                    borderTop: '0.5px solid #f3f4f6',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: '#dbeafe',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 600, color: '#1a56db',
                    }}>
                      {course.instructor?.name?.charAt(0)}
                    </div>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {course.instructor?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}