import { BookOpen, Home, LogOut } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export default function StudentLayout() {
  const { user, logout } = useAuth(); const navigate = useNavigate()
  const exit = () => { logout(); navigate('/login', { replace: true }) }
  return <div className="min-h-screen bg-muted/30"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-5 md:px-8"><NavLink to="/" className="flex items-center gap-2 font-bold"><BookOpen className="size-5 text-primary" />EduPlatform</NavLink><div className="flex items-center gap-4 text-sm"><span className="hidden sm:inline">{user?.fullName}</span><button onClick={exit} className="flex items-center gap-2 rounded-lg border px-3 py-2"><LogOut className="size-4" /><span className="hidden sm:inline">Chiqish</span></button></div></header><div className="mx-auto flex max-w-[1440px]"><aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r bg-background p-4 md:block"><nav className="space-y-1"><NavLink to="/" end className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><Home className="size-4" />Bosh sahifa</NavLink><NavLink to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"><BookOpen className="size-4" />Mening kurslarim</NavLink></nav></aside><main className="min-w-0 flex-1 p-5 md:p-8"><Outlet /></main></div></div>
}
