<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'

import Login        from './pages/auth/Login'
import Register     from './pages/auth/Register'
import CourseList   from './pages/courses/CourseList'
import CourseDetail from './pages/courses/CourseDetail'
import CreateCourse from './pages/courses/CreateCourse'
import Profile      from './pages/profile/Profile'
import Subscription from './pages/subscription/Subscription'
import Forum        from './pages/forum/Forum'
import NotFound     from './pages/NotFound'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVideos    from './pages/admin/AdminVideos'
import AdminUsers     from './pages/admin/AdminUsers'

import Sidebar        from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

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
  const { token, fetchUser } = useAuthStore()

  useEffect(() => {
    if (token) fetchUser()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Publiques sans sidebar */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Publiques avec sidebar */}
        <Route path="/" element={
          token ? <Layout><CourseList /></Layout> : <CourseList />
        }/>
        <Route path="/courses/:id" element={
          token ? <Layout><CourseDetail /></Layout> : <CourseDetail />
        }/>

        {/* Protégées user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/courses/create" element={<Layout><CreateCourse /></Layout>} />
          <Route path="/profile"        element={<Layout><Profile /></Layout>} />
          <Route path="/subscription"   element={<Layout><Subscription /></Layout>} />
          <Route path="/courses/:id/forum" element={<Layout><Forum /></Layout>} />
        </Route>

        {/* Protégées admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin"              element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/admin/videos"       element={<Layout><AdminVideos /></Layout>} />
          <Route path="/admin/users"        element={<Layout><AdminUsers /></Layout>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}