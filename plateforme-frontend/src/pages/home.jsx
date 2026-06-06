import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import useAuthStore from '../store/authStore'
import Topbar from '../components/Topbar'

export default function Home() {
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const { user }                = useAuthStore()

  useEffect(() => {
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <Topbar />
      <div style={{ padding: '24px', maxWidth: '1100px' }}>

        {/* Bienvenue */}
        <div style={{
          background: '#0f1f3d', borderRadius: '10px',
          padding: '28px 32px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '4px' }}>
              Bon retour,
            </p>
            <h1 style={{
              color: '#fff', fontSize: '22px',
              fontWeight: 600, marginBottom: '8px',
            }}>
              {user?.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6 }}>
              Continuez votre apprentissage là où vous vous êtes arrêté.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/my-courses" style={{
              background: '#1a56db', color: '#fff',
              padding: '9px 20px', borderRadius: '6px',
              fontSize: '13px', fontWeight: 500, textDecoration: 'none',
            }}>
              Mes cours
            </Link>
            <Link to="/scheduler" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.8)',
              padding: '9px 20px', borderRadius: '6px',
              fontSize: '13px', textDecoration: 'none',
            }}>
              Mon planning
            </Link>
          </div>
        </div>

        {/* Stats rapides */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px', marginBottom: '28px',
        }}>
          {[
            { icon: 'ti-book',     label: 'Cours accessibles', value: user?.accessible_courses_count || 0 },
            { icon: 'ti-coin',     label: 'Crédits disponibles', value: user?.credits || 0 },
            { icon: 'ti-star',     label: 'Abonnement', value: user?.role?.name === 'premium' ? 'Premium' : 'Standard' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff', border: '0.5px solid #e5e7eb',
              borderRadius: '10px', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px',
                background: '#eff5ff', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`ti ${stat.icon}`} style={{ color: '#1a56db', fontSize: '18px' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '3px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cours recommandés */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '14px',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
              Cours recommandés
            </h2>
            <Link to="/my-courses" style={{
              fontSize: '12px', color: '#1a56db', textDecoration: 'none',
            }}>
              Voir tous les cours
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '13px' }}>
              Chargement...
            </div>
          ) : courses.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px',
              color: '#9ca3af', fontSize: '13px',
              background: '#fff', borderRadius: '10px',
              border: '0.5px solid #e5e7eb',
            }}>
              Aucun cours disponible pour le moment.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '14px',
            }}>
              {courses.slice(0, 3).map(course => (
                <Link key={course.id} to={`/courses/${course.id}`} style={{
                  background: '#fff', border: '0.5px solid #e5e7eb',
                  borderRadius: '10px', overflow: 'hidden',
                  textDecoration: 'none', display: 'block',
                }}>
                  <div style={{
                    height: '100px', background: '#e8edf5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: '#1a56db',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="ti ti-video" style={{ color: '#fff', fontSize: '18px' }} />
                    </div>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{
                      fontSize: '10px', fontWeight: 600, color: '#1a56db',
                      letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px',
                    }}>
                      Formation
                    </div>
                    <div style={{
                      fontSize: '13px', fontWeight: 500, color: '#111827',
                      lineHeight: 1.4, marginBottom: '8px',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Raccourcis */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '14px' }}>
            Accès rapide
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { to: '/scheduler',    icon: 'ti-calendar',       label: 'Mon planning' },
              { to: '/ai',           icon: 'ti-robot',          label: 'Assistant IA' },
              { to: '/subscription', icon: 'ti-star',           label: 'Premium' },
              { to: '/courses/create', icon: 'ti-circle-plus',  label: 'Proposer un cours' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{
                background: '#fff', border: '0.5px solid #e5e7eb',
                borderRadius: '10px', padding: '16px',
                textDecoration: 'none', display: 'flex',
                alignItems: 'center', gap: '10px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#eff5ff', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`ti ${item.icon}`} style={{ color: '#1a56db', fontSize: '16px' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}