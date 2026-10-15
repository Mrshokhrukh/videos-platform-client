import { BookOpen, LayoutDashboard, LogOut, Users, UsersRound } from 'lucide-react'
import { createElement } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/groups', label: 'Guruhlar', icon: UsersRound },
  { to: '/admin/students', label: 'Talabalar', icon: Users },
]
export default function AdminLayout() {
  const { user, logout } = useAuth(); const navigate = useNavigate()
  const exit = () => { logout(); navigate('/login', { replace: true }) }
  return <div className="min-h-screen bg-muted/30 text-foreground">
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-5 md:px-8"><NavLink to="/admin" className="flex items-center gap-2 font-bold"><BookOpen className="size-5 text-primary" />EduPlatform</NavLink><div className="flex items-center gap-4 text-sm"><span className="hidden text-muted-foreground sm:inline">Administrator</span><span className="font-medium">{user?.fullName}</span><button onClick={exit} className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted"><LogOut className="size-4" /><span className="hidden sm:inline">Chiqish</span></button></div></header>
    <div className="mx-auto flex max-w-[1440px]"><aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r bg-background p-4 md:flex"><nav className="space-y-1">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{createElement(Icon, { className: 'size-4' })}{label}</NavLink>)}</nav></aside><main className="min-w-0 flex-1 p-5 md:p-8"><Outlet /></main></div>
  </div>
}
