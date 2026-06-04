import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/axios'

export default function Home() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data)).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-blue-900 text-white p-12 rounded-xl mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Échangez vos compétences,<br/>développez votre avenir.
        </h1>
        <p className="text-blue-200 mb-6 text-lg">
          SkillSwap connecte les apprenants et les formateurs pour un échange de savoirs gagnant-gagnant.
        </p>
        <div className="flex gap-4">
          <Link to="/courses"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold">
            Découvrir les cours
          </Link>
          <Link to="/courses/create"
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-blue-800 font-semibold">
            Proposer un cours
          </Link>
        </div>
      </div>

      {/* Cours disponibles */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cours disponibles</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">Voir tout →</Link>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {courses.slice(0, 6).map(course => (
            <Link to={`/courses/${course.id}`} key={course.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
              <div className="bg-blue-100 h-36 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <p className="text-blue-600 text-xs font-bold uppercase mb-1">Cours</p>
              <h3 className="font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-500 text-sm mb-3">{course.description?.slice(0, 60)}...</p>
              <div className="flex justify-between items-center">
                <span className="text-yellow-500">⭐ {course.rating || 0}</span>
                <span className="text-gray-400 text-sm">{course.credits_cost} crédits</span>
              </div>
            </Link>
          ))}
        </div>
        {courses.length === 0 && (
          <p className="text-center text-gray-500 py-12">Aucun cours disponible pour le moment</p>
        )}
      </div>
    </div>
  )
}