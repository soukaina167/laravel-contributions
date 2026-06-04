import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
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
import CourseList from './pages/courses/CourseList'
import CourseDetail from './pages/courses/CourseDetail'
import CreateCourse from './pages/courses/CreateCourse'

function Layout({ children }) {
  return (
    <div className="flex">
      <Navbar />
      <main className="ml-64 flex-1 p-6 min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/subscription" element={<Layout><Subscription /></Layout>} />
          <Route path="/courses" element={<Layout><CourseList /></Layout>} />
          <Route path="/courses/create" element={<Layout><CreateCourse /></Layout>} />
          <Route path="/courses/:id" element={<Layout><CourseDetail /></Layout>} />
          <Route path="/courses/:id/forum" element={<Layout><Forum /></Layout>} />
          <Route path="/courses/:courseId/notes" element={<Layout><Notes /></Layout>} />
          <Route path="/scheduler" element={<Layout><Scheduler /></Layout>} />
          <Route path="/ai" element={<Layout><AIAssistant /></Layout>} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App