import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'
import Logo from '../../components/Logo'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth }           = useAuthStore()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/login', form)
      setAuth(res.data.user, res.data.token)
      navigate(res.data.user.role?.name === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Panneau gauche */}
      <div style={{
        width: '45%',
        background: '#0f1f3d',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <Logo size={56} />
          <h1 style={{
            color: '#fff', fontSize: '24px', fontWeight: 600,
            marginTop: '20px', marginBottom: '8px', letterSpacing: '-0.5px',
          }}>
            SkillSwap
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.6 }}>
            Échangez vos compétences, développez votre avenir. Connectez apprenants et formateurs.
          </p>
        </div>
      </div>

      {/* Panneau droit */}
      <div style={{
        flex: 1,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{
            fontSize: '22px', fontWeight: 600,
            color: '#111827', marginBottom: '6px',
          }}>
            Connexion
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '32px' }}>
            Bienvenue. Connectez-vous pour accéder à vos cours.
          </p>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '0.5px solid #fca5a5',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Adresse email', key: 'email', type: 'email', placeholder: 'vous@exemple.com' },
              { label: 'Mot de passe',  key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block', fontSize: '13px',
                  fontWeight: 500, color: '#374151', marginBottom: '6px',
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  required
                  style={{
                    width: '100%', padding: '9px 14px',
                    border: '0.5px solid #d1d5db',
                    borderRadius: '8px', fontSize: '14px',
                    color: '#111827', background: '#f9fafb',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#93c5fd' : '#1a56db',
                color: '#fff',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6b7280' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#1a56db', fontWeight: 500, textDecoration: 'none' }}>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}