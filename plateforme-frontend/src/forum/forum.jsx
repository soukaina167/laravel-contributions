import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'

export default function Forum() {
  const { id }                = useParams()
  const [messages, setMessages] = useState([])
  const [content, setContent]   = useState('')
  const [reply, setReply]       = useState({ id: null, content: '' })
  const { user }              = useAuthStore()

  useEffect(() => {
    fetchMessages()
  }, [id])

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/courses/${id}/forum`)
      setMessages(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleQuestion = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/courses/${id}/forum`, { content })
      setContent('')
      fetchMessages()
    } catch (err) {
      console.error(err)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/forum/messages/${reply.id}/reply`, {
        content: reply.content
      })
      setReply({ id: null, content: '' })
      fetchMessages()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Forum du cours</h1>

      {/* Poser une question */}
      <form onSubmit={handleQuestion} className="mb-8">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Poser une question..."
          className="w-full border rounded px-3 py-2 h-24 mb-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Publier
        </button>
      </form>

      {/* Liste des messages */}
      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-white rounded-lg shadow p-4">
            <p className="font-medium mb-1">{msg.content}</p>
            <p className="text-gray-400 text-xs">
              Par {msg.receiver?.name}
            </p>

            {/* Répondre */}
            {reply.id === msg.id ? (
              <form onSubmit={handleReply} className="mt-3">
                <textarea
                  value={reply.content}
                  onChange={e => setReply({...reply, content: e.target.value})}
                  placeholder="Votre réponse..."
                  className="w-full border rounded px-3 py-2 h-20 mb-2"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Répondre
                  </button>
                  <button
                    type="button"
                    onClick={() => setReply({ id: null, content: '' })}
                    className="bg-gray-300 text-gray-700 px-4 py-1 rounded"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setReply({ id: msg.id, content: '' })}
                className="text-blue-500 text-sm mt-2 hover:underline"
              >
                Répondre
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}