import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'

export default function CourseForum({ courseId }) {
  const [messages, setMessages] = useState([])
  const [content, setContent]   = useState('')
  const [reply, setReply]       = useState({ id: null, content: '' })
  const { user } = useAuthStore()

  useEffect(() => {
    fetchMessages()
  }, [courseId])

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/forum`)
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleQuestion = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/courses/${courseId}/forum`, { content })
      setContent('')
      fetchMessages()
    } catch (err) {
      console.error(err)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/forum/messages/${reply.id}/reply`, { content: reply.content })
      setReply({ id: null, content: '' })
      fetchMessages()
    } catch (err) {
      console.error(err)
    }
  }

  const isAI = (msg) => msg.user?.email === 'ai@skillswap.com'

  return (
    <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
      <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>
        <i className="ti ti-message-plus" />
 Forum du cours
      </h2>

      {/* Formulaire question */}
      <form onSubmit={handleQuestion} style={{ marginBottom: '20px' }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Poser une question... L'IA vous répondra automatiquement 🤖"
          rows={3}
          required
          style={{
            width: '100%', border: '0.5px solid #d1d5db',
            borderRadius: '6px', padding: '8px 12px',
            fontSize: '13px', resize: 'none', boxSizing: 'border-box',
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

      {/* Liste des messages */}
      {messages.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
          Aucune question pour ce cours. Soyez le premier à poser une question !
        </p>
      ) : messages.map(msg => (
        <div key={msg.id} style={{
          border: '0.5px solid #f3f4f6', borderRadius: '8px',
          padding: '12px', marginBottom: '12px',
        }}>

          {/* Question de l'utilisateur */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#dbeafe', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 600, color: '#1a56db',
            }}>
              {msg.user?.name?.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>
                  {msg.user?.name}
                </span>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                  {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>
                {msg.content}
              </p>
            </div>
          </div>

          {/* Réponses (incluant la réponse IA) */}
          {msg.replies && msg.replies.length > 0 && (
            <div style={{ marginLeft: '42px', marginTop: '8px' }}>
              {msg.replies.map(rep => (
                <div key={rep.id} style={{
                  background: isAI(rep) ? '#f5f3ff' : '#f9fafb',
                  border: `0.5px solid ${isAI(rep) ? '#c4b5fd' : '#e5e7eb'}`,
                  borderRadius: '8px', padding: '10px 12px', marginBottom: '6px',
                  display: 'flex', gap: '8px',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: isAI(rep) ? '#7c3aed' : '#e5e7eb',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px',
                  }}>
                    {isAI(rep) ? <i className="ti ti-robot" style={{ color: '#7c3aed' }} />
 : rep.user?.name?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      color: isAI(rep) ? '#7c3aed' : '#374151',
                      display: 'block', marginBottom: '4px',
                    }}>
                      {isAI(rep) ? ' Assistant IA' : rep.user?.name}
                    </span>
                    <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.5 }}>
                      {rep.content.replace(<i className="ti ti-robot" style={{ color: '#7c3aed' }} />, '')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bouton Répondre */}
          {reply.id === msg.id ? (
            <form onSubmit={handleReply} style={{ marginLeft: '42px', marginTop: '8px' }}>
              <textarea
                value={reply.content}
                onChange={e => setReply({...reply, content: e.target.value})}
                placeholder="Votre réponse..."
                rows={2}
                required
                style={{
                  width: '100%', border: '0.5px solid #d1d5db',
                  borderRadius: '6px', padding: '6px 10px',
                  fontSize: '12px', resize: 'none',
                  boxSizing: 'border-box', marginBottom: '6px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{
                  background: '#16a34a', color: '#fff', border: 'none',
                  padding: '5px 12px', borderRadius: '5px',
                  fontSize: '12px', cursor: 'pointer',
                }}>
                  Répondre
                </button>
                <button type="button"
                  onClick={() => setReply({ id: null, content: '' })}
                  style={{
                    background: '#e5e7eb', color: '#374151', border: 'none',
                    padding: '5px 12px', borderRadius: '5px',
                    fontSize: '12px', cursor: 'pointer',
                  }}>
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setReply({ id: msg.id, content: '' })}
              style={{
                background: 'none', border: 'none', color: '#1a56db',
                fontSize: '12px', cursor: 'pointer', padding: 0,
                marginLeft: '42px', marginTop: '6px',
              }}>
              <i className="ti ti-message-plus" />
 Répondre
            </button>
          )}
        </div>
      ))}
    </div>
  )
}