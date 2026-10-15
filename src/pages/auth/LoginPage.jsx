import { BookOpen, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated, role, loading: authLoading } = useAuth()
  const navigate = useNavigate(); const location = useLocation()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  if (authLoading) return <div className="grid min-h-screen place-items-center">Yuklanmoqda…</div>
  if (isAuthenticated) return <Navigate to={role === 'admin' ? '/admin' : '/'} replace />
  async function submit(event) {
    event.preventDefault(); setError('')
    if (!email.trim() || !password) { setError('Email va parolni kiriting'); return }
    setBusy(true)
    try { const result = await login(email, password); navigate(location.state?.from?.pathname || (result.role === 'admin' ? '/admin' : '/'), { replace: true }) }
    catch { setError('Email yoki parol noto‘g‘ri') }
    finally { setBusy(false) }
  }
  return <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background p-4">
    <section className="w-full max-w-md rounded-3xl border bg-card p-7 shadow-xl shadow-primary/5 sm:p-9"><div className="mb-8 text-center"><span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><BookOpen className="size-7" /></span><h1 className="text-2xl font-bold tracking-tight">EduPlatform</h1><p className="mt-1 text-sm text-muted-foreground">Ta’lim boshqaruv tizimi</p></div>
      <form className="space-y-5" onSubmit={submit} noValidate><label className="block space-y-2 text-sm font-medium">Email<span className="relative block"><Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input autoComplete="username" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@platform.uz" className="h-11 w-full rounded-xl border bg-background pl-10 pr-3 outline-none focus:ring-2 focus:ring-ring" /></span></label>
        <label className="block space-y-2 text-sm font-medium">Parol<span className="relative block"><LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Parolingizni kiriting" className="h-11 w-full rounded-xl border bg-background pl-10 pr-12 outline-none focus:ring-2 focus:ring-ring" /><button type="button" aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>
        {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <button disabled={busy} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground disabled:cursor-wait disabled:opacity-60">{busy && <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />}{busy ? 'Kirilmoqda…' : 'Tizimga kirish'}</button>
      </form><p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">⚠️ Akkauntingiz yo‘qmi? Admin bilan bog‘laning.<br />O‘z-o‘zidan ro‘yxatdan o‘tish mumkin emas.</p><p className="mt-5 text-center text-xs text-muted-foreground">Demo: admin@platform.uz / admin123</p></section>
  </main>
}
