import { createElement, useEffect, useState } from 'react'
import { BookOpen, CheckCircle2, Users, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import * as api from '../../../lib/api'
import { formatDate } from '../../../lib/utils'
import LoadingSpinner from '../../../components/shared/LoadingSpinner'
import ErrorState from '../../../components/shared/ErrorState'

const metrics = [
  ['Jami talabalar', 'totalStudents', Users], ['Jami guruhlar', 'totalGroups', UsersRound],
  ['Jami darslar', 'totalLessons', BookOpen], ['Faol talabalar', 'activeStudents', CheckCircle2],
]
export default function AdminDashboard() {
  const { user } = useAuth(); const [stats, setStats] = useState(null); const [students, setStudents] = useState(null); const [error, setError] = useState(false)
  async function load() { setError(false); try { const [newStats, newStudents] = await Promise.all([api.getAdminStats(), api.getAllStudents()]); setStats(newStats); setStudents(newStudents.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)) } catch { setError(true) } }
  useEffect(() => {
    let active = true
    Promise.all([api.getAdminStats(), api.getAllStudents()]).then(([newStats, newStudents]) => {
      if (!active) return
      setStats(newStats)
      setStudents(newStudents.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5))
    }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [])
  if (error) return <ErrorState onRetry={load} />
  if (!stats || !students) return <LoadingSpinner />
  return <div className="mx-auto max-w-6xl space-y-8"><div><p className="text-sm text-muted-foreground">Boshqaruv paneli</p><h1 className="mt-1 text-2xl font-bold tracking-tight">Assalomu alaykum, {user?.fullName || 'Administrator'}! 👋</h1><p className="mt-1 text-muted-foreground">Platformadagi umumiy holat.</p></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, key, Icon]) => <article key={key} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">{createElement(Icon, { className: 'size-5' })}</span></div><p className="mt-4 text-3xl font-bold tabular-nums">{stats[key]}</p><p className="mt-1 text-xs text-muted-foreground">Platforma bo‘yicha</p></article>)}</section>
    <section className="overflow-hidden rounded-2xl border bg-card"><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-semibold">Yaqinda qo‘shilgan talabalar</h2><p className="mt-1 text-sm text-muted-foreground">Oxirgi ro‘yxatdan o‘tganlar</p></div><Link to="/admin/students" className="text-sm font-medium text-primary hover:underline">Barcha talabalar →</Link></div>{students.length ? <div className="divide-y">{students.map((student) => <div className="flex items-center gap-3 px-5 py-3.5" key={student.id}><img src={student.avatar} alt="" className="size-10 rounded-full bg-muted object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{student.fullName}</p><p className="truncate text-xs text-muted-foreground">{student.email}</p></div><span className="hidden text-xs text-muted-foreground sm:block">{student.groupIds.length} ta guruh</span><time className="text-xs text-muted-foreground">{formatDate(student.createdAt)}</time></div>)}</div> : <p className="p-6 text-sm text-muted-foreground">Talabalar topilmadi.</p>}</section>
  </div>
}
