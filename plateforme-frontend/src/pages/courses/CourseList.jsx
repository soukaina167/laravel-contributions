import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/axios'

export default function CourseList() {
  const [courses, setCourses]   = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses')
      setCourses(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search) return fetchCourses()

    try {
      const res = await api.get(`/search?q=${search}`)
      setCourses(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="flex justify-center mt-20">
      <p className="text-gray-500">Chargement...</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tous les cours</h1>

      {/* Recherche */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un cours..."
          className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Rechercher
        </button>
      </form>

      {/* Liste des cours */}
      {courses.length === 0 ? (
        <p className="text-gray-500 text-center">Aucun cours disponible</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
            >
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                {course.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">
                  {course.credits_cost} crédits
                </span>
                <span className="text-yellow-500">
                  ⭐ {course.rating || 0}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                Par {course.instructor?.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}