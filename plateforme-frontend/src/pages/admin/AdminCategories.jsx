import { useState, useEffect } from 'react'
import api from '../../lib/axios'
import Topbar from '../../components/Topbar'

export default function AdminCategories() {
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await api.get('/admin/skills')
      setSkills(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newSkill.trim()) return
    try {
      await api.post('/admin/skills', { name: newSkill })
      setNewSkill('')
      fetchSkills()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/skills/${id}`)
      fetchSkills()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p className="text-center mt-20">Chargement...</p>

  return (
    <div>
      <Topbar title="Gestion des catégories" />
      <div style={{ padding: '24px' }}>
        <form onSubmit={handleCreate} className="flex gap-2 mb-6">
          <input
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Nouvelle catégorie..."
            className="border rounded px-4 py-2 flex-1"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Ajouter
          </button>
        </form>

        <div className="grid grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <span>{skill.name}</span>
              <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:underline text-sm">
                Supprimer
              </button>
            </div>
          ))}
        </div>
        {skills.length === 0 && (
          <p className="text-center text-gray-400 py-8">Aucune catégorie</p>
        )}
      </div>
    </div>
  )
}