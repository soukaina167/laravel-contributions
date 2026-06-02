import { useState } from 'react'
import api from '../../lib/axios'

export default function AIAssistant() {
  const [question, setQuestion]   = useState('')
  const [answer, setAnswer]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [history, setHistory]     = useState([])

  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    try {
      const res = await api.post('/ai/ask', { question })
      const newEntry = {
        question: question,
        answer: res.data.answer
      }
      setHistory([...history, newEntry])
      setAnswer(res.data.answer)
      setQuestion('')
    } catch (err) {
      setAnswer(err.response?.data?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Assistant IA 🤖</h1>

      {/* Historique */}
      <div className="space-y-4 mb-8">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Pose une question à l'assistant IA !
          </p>
        ) : (
          history.map((entry, index) => (
            <div key={index}>
              <div className="bg-blue-50 rounded-lg p-4 mb-2">
                <p className="font-medium text-blue-800">
                  🙋 {entry.question}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  🤖 {entry.answer}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Pose une question..."
          className="flex-1 border rounded px-4 py-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Envoyer'}
        </button>
      </form>
    </div>
  )
}