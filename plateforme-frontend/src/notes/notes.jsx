import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../lib/axios'

export default function Notes() {
  const { courseId }        = useParams()
  const [notes, setNotes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [file, setFile]     = useState(null)
  const [type, setType]     = useState('pdf')

  useEffect(() => {
    fetchNotes()
  }, [courseId])

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/notes`)
      setNotes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      await api.post(`/courses/${courseId}/notes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Note ajoutée avec succès !')
      setFile(null)
      fetchNotes()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  const handleDownload = async (noteId) => {
    try {
      const res = await api.get(`/notes/${noteId}/download`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `note-${noteId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`)
      setMessage('Note supprimée !')
      fetchNotes()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notes du cours</h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* Upload */}
      <form onSubmit={handleUpload} className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Ajouter une note</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="pdf">PDF</option>
            <option value="video">Vidéo</option>
            <option value="image">Image</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fichier</label>
          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Uploader
        </button>
      </form>

      {/* Liste des notes */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune note pour ce cours</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Note #{note.id}</p>
                <p className="text-gray-500 text-sm">Type : {note.type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(note.id)}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
                >
                  Télécharger
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}