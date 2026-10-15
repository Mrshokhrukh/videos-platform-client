/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../components/layout/admin/AdminLayout'
import StudentLayout from '../components/layout/student/StudentLayout'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import LoginPage from '../pages/auth/LoginPage'
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard'
import NotFoundPage from '../pages/NotFoundPage'

function RequireRole({ role }) {
  const { loading, isAuthenticated, isAdmin, isStudent } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  if (role === 'admin' && !isAdmin) return <Navigate to="/" replace />
  if (role === 'student' && !isStudent) return <Navigate to="/admin" replace />
  return <Outlet />
}

function RoutePlaceholder({ title }) {
  return <section className="rounded-2xl border bg-card p-6"><h1 className="text-xl font-semibold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">Bu sahifa tegishli task branchidan ulanadi.</p></section>
}

const routePage = (title) => <RoutePlaceholder title={title} />

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { element: <RequireRole role="admin" />, children: [{ path: '/admin', element: <AdminLayout />, children: [
    { index: true, element: <AdminDashboard /> },
    { path: 'groups', element: routePage('Guruhlar') },
    { path: 'groups/:id', element: routePage('Guruh tafsilotlari') },
    { path: 'groups/:id/upload', element: routePage('Dars yuklash') },
    { path: 'students', element: routePage('Talabalar') },
    { path: 'students/:id', element: routePage('Talaba tafsilotlari') },
  ] }] },
  { element: <RequireRole role="student" />, children: [{ path: '/', element: <StudentLayout />, children: [
    { index: true, element: routePage('Bosh sahifa') },
    { path: 'group/:id', element: routePage('Guruh darslari') },
    { path: 'lesson/:id', element: routePage('Dars') },
  ] }] },
  { path: '*', element: <NotFoundPage /> },
])
