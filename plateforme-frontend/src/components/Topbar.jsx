import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ title = '' }) {
  const [search, setSearch] = useState('')
  const navigate            = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/?q=${search}`)
  }

  return (
    <header style={{
      background: '#fff',
      borderBottom: '0.5px solid #e5e7eb',
      padding: '0 24px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>

      {title && (
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
          {title}
        </span>
      )}

      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '380px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#f4f6f9',
          border: '0.5px solid #e5e7eb',
          borderRadius: '8px',
          padding: '0 12px',
          height: '34px',
        }}>
          <i className="ti ti-search" style={{ color: '#9ca3af', fontSize: '15px' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un cours, une compétence..."
            style={{
              background: 'none', border: 'none', outline: 'none',
              fontSize: '13px', color: '#111827', width: '100%',
            }}
          />
        </div>
      </form>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {[
          { icon: 'ti-bell' },
          { icon: 'ti-settings' },
        ].map(({ icon }) => (
          <div key={icon} style={{
            width: '32px', height: '32px',
            borderRadius: '6px',
            border: '0.5px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6b7280', fontSize: '16px', cursor: 'pointer',
          }}>
            <i className={`ti ${icon}`} />
          </div>
        ))}
      </div>

    </header>
  )
}