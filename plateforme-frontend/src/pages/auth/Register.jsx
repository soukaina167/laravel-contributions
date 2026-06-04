import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'
import Logo from '../../components/Logo'

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: ''
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth }           = useAuthStore()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/register', form)
      setAuth(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: 'Nom complet',           key: 'name',                  type: 'text',     placeholder: 'Votre nom' },
    { label: 'Adresse email',          key: 'email',                 type: 'email',    placeholder: 'vous@exemple.com' },
    { label: 'Mot de passe',           key: 'password',              type: 'password', placeholder: '••••••••' },
    { label: 'Confirmer mot de passe', key: 'password_confirmation', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      <div style={{
        width: '45%', background: '#0f1f3d',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '48px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <Logo size={56} />
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>
            SkillSwap
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.6 }}>
            Rejoignez notre communauté d'apprenants et de formateurs.
          </p>
        </div>
      </div>

      <div style={{
        flex: 1, background: '#fff',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '48px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
            Créer un compte
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '32px' }}>
            Rejoignez SkillSwap gratuitement.
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '0.5px solid #fca5a5',
              color: '#b91c1c', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map(field => (
              <div key={field.key} style={{ marginBottom: '14px' }}>
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
                color: '#fff', border: 'none',
                padding: '10px', borderRadius: '8px',
                fontSize: '14px', fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
              }}
            >
              {loading ? 'Inscription...' : "Créer mon compte"}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6b7280' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#1a56db', fontWeight: 500, textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}