import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'

import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/Home'
import Profile from './pages/profile/Profile'
import Subscription from './pages/subscription/Subscription'
import Forum from './pages/forum/Forum'
import Notes from './pages/notes/Notes'
import Scheduler from './pages/scheduler/Scheduler'
import AIAssistant from './pages/AI/AIAssistant'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVideos from './pages/admin/AdminVideos'
import AdminUsers from './pages/admin/AdminUsers'
import CourseList from './pages/courses/CourseList'
import CourseDetail from './pages/courses/CourseDetail'
import CreateCourse from './pages/courses/CreateCourse'
import NotFound from './pages/NotFound'

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, minHeight: '100vh', background: '#f4f6f9' }}>
        {children}
      </main>
    </div>
  )
}

export default function App() {
  // Modification : On extrait uniquement le token pour l'instant pour éviter le crash
  const { token } = useAuthStore()

  // Modification : Mis en commentaire temporaire le temps de vérifier le nom de la fonction dans authStore.js
  /*
  useEffect(() => {
    if (token) fetchUser()
  }, [token])
  */

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes accessibles avec ou sans sidebar */}
        <Route path="/" element={token ? <Layout><Home /></Layout> : <Home />} />
        <Route path="/courses/:id" element={token ? <Layout><CourseDetail /></Layout> : <CourseDetail />} />

        {/* Routes protégées utilisateur */}
        <Route element={<ProtectedRoute />}>
          <Route path="/courses/create" element={<Layout><CreateCourse /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/subscription" element={<Layout><Subscription /></Layout>} />
          <Route path="/courses/:id/forum" element={<Layout><Forum /></Layout>} />
          <Route path="/courses/:courseId/notes" element={<Layout><Notes /></Layout>} />
          <Route path="/scheduler" element={<Layout><Scheduler /></Layout>} />
          <Route path="/ai" element={<Layout><AIAssistant /></Layout>} />
          <Route path="/my-courses" element={<Layout><CourseList /></Layout>} />
        </Route>

        {/* Routes protégées admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/admin/videos" element={<Layout><AdminVideos /></Layout>} />
          <Route path="/admin/users" element={<Layout><AdminUsers /></Layout>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}