import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id/forum" element={<Forum />} />
          <Route path="/courses/:courseId/notes" element={<Notes />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/ai" element={<AIAssistant />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App