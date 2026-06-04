import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ role }) {
  const { token, user } = useAuthStore()

  if (!token) return <Navigate to="/login" replace />
  if (role === 'admin' && user?.role?.name !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}