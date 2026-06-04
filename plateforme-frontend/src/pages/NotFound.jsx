import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f4f6f9',
    }}>
      <div style={{ textAlign: 'center' }}>
        <Logo size={48} />
        <h1 style={{
          fontSize: '64px', fontWeight: 600,
          color: '#1a56db', margin: '16px 0 8px',
        }}>
          404
        </h1>
        <p style={{ fontSize: '16px', color: '#111827', fontWeight: 500, marginBottom: '6px' }}>
          Page introuvable
        </p>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '28px' }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" style={{
          background: '#1a56db', color: '#fff',
          padding: '9px 24px', borderRadius: '6px',
          fontSize: '13px', fontWeight: 500, textDecoration: 'none',
        }}>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}