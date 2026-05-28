import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'

export default function CourseDetail() {
  const { id }              = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const { token }           = useAuthStore()

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`)
      setCourse(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccess = async () => {
    try {
      const res = await api.post(`/courses/${id}/access`)
      setMessage(res.data.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur')
    }
  }

  if (loading) return <p className="text-center mt-20">Chargement...</p>
  if (!course)  return <p className="text-center mt-20">Cours introuvable</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>

      <div className="flex gap-4 mb-6">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
          {course.credits_cost} crédits
        </span>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
          ⭐ {course.rating || 0}
        </span>
      </div>

      {/* Vidéo */}
      {course.video_url ? (
        <video
          controls
          className="w-full rounded-lg mb-6"
          src={course.video_url}
        />
      ) : (
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-6">
          <p className="text-gray-400">Aucune vidéo disponible</p>
        </div>
      )}

      {/* Bouton accès */}
      {token && (
        <button
          onClick={handleAccess}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mb-4"
        >
          Accéder au cours
        </button>
      )}

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* Instructeur */}
      <p className="text-gray-500">
        Instructeur : <strong>{course.instructor?.name}</strong>
      </p>
    </div>
  )
}