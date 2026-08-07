import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../lib/axios'
import Topbar from '../../components/Topbar'
import useAuthStore from '../../store/authStore'

export default function CourseList() {
  const [courses, setCourses]         = useState([])
  const [skills, setSkills]           = useState([])
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [loading, setLoading]         = useState(true)
  const { token }                     = useAuthStore()
  const [searchParams]                = useSearchParams()

  useEffect(() => {
    fetchSkills()
    const q = searchParams.get('q')
    q ? searchCourses(q) : fetchCourses()
  }, [searchParams])

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills')
      setSkills(res.data)
    } catch {}
  }

  const fetchCourses = async (skillId = null) => {
    try {
      const url = skillId ? `/courses/category/${skillId}` : '/courses'
      const res = await api.get(url)
      setCourses(res.data)
    } finally { setLoading(false) }
  }

  const searchCourses = async (q) => {
    try {
      const res = await api.get(`/search?q=${q}`)
      setCourses(res.data)
    } finally { setLoading(false) }
  }

  const handleSkillFilter = (skillId) => {
    setSelectedSkill(skillId)
    setLoading(true)
    fetchCourses(skillId)
  }

  return (
    <div>
      <Topbar />
      <div style={{ padding: '24px' }}>

        {/* Filtres catégories */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
              CATÉGORIES
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleSkillFilter(null)}
                style={{
                  padding: '6px 14px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                  background: !selectedSkill ? '#1a56db' : '#f3f4f6',
                  color: !selectedSkill ? '#fff' : '#374151',
                  border: 'none',
                }}>
                Tous
              </button>
              {skills.map(skill => (
                <button key={skill.id}
                  onClick={() => handleSkillFilter(skill.id)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    background: selectedSkill === skill.id ? '#1a56db' : '#f3f4f6',
                    color: selectedSkill === skill.id ? '#fff' : '#374151',
                    border: 'none',
                  }}>
                  {skill.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            {selectedSkill
              ? `Cours : ${skills.find(s => s.id === selectedSkill)?.name}`
              : 'Cours disponibles'}
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {courses.length} formation{courses.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Grille cours */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            Chargement...
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            Aucun cours dans cette catégorie.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            {courses.map(course => (
              <Link key={course.id}
                to={token ? `/courses/${course.id}` : '/login'}
                style={{
                  background: '#fff', border: '0.5px solid #e5e7eb',
                  borderRadius: '10px', overflow: 'hidden',
                  textDecoration: 'none', display: 'block',
                }}>
                <div style={{
                  height: '120px', background: '#e8edf5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: '#1a56db',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="ti ti-video" style={{ color: '#fff', fontSize: '20px' }} />
                  </div>
                </div>

                <div style={{ padding: '14px' }}>
                  {/* Catégorie badge */}
                  {course.skill && (
                    <span style={{
                      fontSize: '10px', fontWeight: 600,
                      color: '#1a56db', background: '#eff5ff',
                      padding: '2px 8px', borderRadius: '4px',
                      display: 'inline-block', marginBottom: '6px',
                    }}>
                      {course.skill.name}
                    </span>
                  )}

                  <div style={{
                    fontSize: '13px', fontWeight: 500, color: '#111827',
                    marginBottom: '10px', lineHeight: 1.4,
                  }}>
                    {course.title}
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', fontSize: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{
                          color: star <= Math.round(course.rating) ? '#f59e0b' : '#d1d5db',
                          fontSize: '11px'
                        }}>★</span>
                      ))}
                      <span style={{ color: '#9ca3af', fontSize: '11px' }}>
                        ({course.rating || 0})
                      </span>
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