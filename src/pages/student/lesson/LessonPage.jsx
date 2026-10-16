import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, LoaderCircle, Play } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import VideoPlayer from "../../../components/video/VideoPlayer"
import { getLessonById, getMyGroups } from "../../../lib/api"
import { formatDuration } from "../../../lib/utils"

function readWatchedLessons() {
  try {
    const value = JSON.parse(localStorage.getItem("watched_lessons") || "[]")
    return Array.isArray(value) ? value.map(String) : []
  } catch {
    return []
  }
}

function LessonLinks({ lessons, currentId, watched, onSelect }) {
  return (
    <ol className="divide-y divide-slate-100">
      {lessons.map((item, index) => {
        const current = String(item.id) === String(currentId)
        const completed = watched.includes(String(item.id))
        return (
          <li key={item.id}>
            <button type="button" onClick={() => onSelect(item.id)} aria-current={current ? "step" : undefined} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${current ? "bg-indigo-50 text-indigo-800" : completed ? "text-slate-500 hover:bg-slate-50" : "text-slate-700 hover:bg-slate-50"}`}>
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${current ? "bg-indigo-600 text-white" : completed ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-500"}`}>
                {current ? <Play size={12} fill="currentColor" /> : completed ? <Check size={14} /> : item.order ?? index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title}</span>
              <span className="shrink-0 text-xs text-slate-400">{formatDuration(item.duration)}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default function LessonPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [watched, setWatched] = useState(readWatchedLessons)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    Promise.all([getLessonById(id), getMyGroups()])
      .then(([result, groups]) => {
        if (!groups.some((group) => String(group.id) === String(result.groupId))) {
          throw new Error("Bu darsga kirish huquqingiz yo'q.")
        }
        if (active) setLesson(result)
      })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : "Darsni yuklab bo'lmadi.") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  useEffect(() => {
    if (!lesson?.id) return
    const nextWatched = [...new Set([...readWatchedLessons(), String(lesson.id)])]
    localStorage.setItem("watched_lessons", JSON.stringify(nextWatched))
    localStorage.setItem("current_lesson_id", String(lesson.id))
    setWatched(nextWatched)
  }, [lesson?.id])

  const lessons = useMemo(() => (lesson?.lessons || [])
    .filter((item) => item.isPublished)
    .sort((first, second) => (first.order ?? 0) - (second.order ?? 0)), [lesson?.lessons])
  const currentIndex = lessons.findIndex((item) => String(item.id) === String(id))
  const current = currentIndex >= 0 ? lessons[currentIndex] : lesson
  const previous = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const next = currentIndex >= 0 ? lessons[currentIndex + 1] : null
  const selectLesson = (lessonId) => navigate(`/lesson/${lessonId}`)

  if (loading) return <main className="flex min-h-screen items-center justify-center gap-3 text-sm text-slate-500"><LoaderCircle className="animate-spin text-indigo-600" />Dars yuklanmoqda...</main>
  if (error || !lesson) return <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 text-center"><p role="alert" className="text-sm text-rose-700">{error || "Dars topilmadi."}</p><Button variant="outline" className="mt-5" onClick={() => navigate(-1)}><ArrowLeft />Orqaga</Button></main>

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 px-4 py-5 text-slate-900 sm:px-7 sm:py-8">
      <Link to={`/group/${lesson.groupId}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-700">
        <ArrowLeft size={17} />{lesson.groupName} kursiga qaytish
      </Link>

      <details className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white min-[601px]:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold">
          <span>Darslar ro'yxati <span className="ml-1 text-sm font-normal text-slate-500">({lessons.length})</span></span><ChevronDown size={18} />
        </summary>
        <div className="max-h-64 overflow-y-auto border-t border-slate-100">
          <LessonLinks lessons={lessons} currentId={id} watched={watched} onSelect={selectLesson} />
        </div>
      </details>

      <div className="mt-5 grid gap-5 min-[769px]:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <VideoPlayer lesson={lesson} />
          <div className="p-5 sm:p-7">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{lesson.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><span>Darsi {current?.order ?? Math.max(currentIndex + 1, 1)}</span><span aria-hidden="true">·</span><Clock3 size={15} />{formatDuration(lesson.duration)}</p>
            <div className="mt-6"><h2 className="text-sm font-semibold">Tavsif:</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{lesson.description || "Bu dars uchun tavsif kiritilmagan."}</p></div>
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Izohlar</h2>
              {/* <CommentsSection lessonId={id} /> */}
              <div className="mt-3 rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">Izohlar bo'limi shu yerda ko'rinadi.</div>
            </div>
          </div>
        </section>

        <aside className="hidden min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm min-[601px]:block">
          <div className="border-b border-slate-100 px-4 py-4">
            <h2 className="font-semibold">Darslar ro'yxati</h2>
            <p className="mt-1 text-xs text-slate-500">{lessons.length} ta dars</p>
          </div>
          <div className="max-h-[min(65vh,42rem)] overflow-y-auto">
            <LessonLinks lessons={lessons} currentId={id} watched={watched} onSelect={selectLesson} />
          </div>
          <div className="hidden space-y-2 border-t border-slate-100 p-4 min-[769px]:block">
            {previous && <Button type="button" variant="outline" className="w-full justify-start" onClick={() => selectLesson(previous.id)}><ChevronLeft />Oldingi dars</Button>}
            {next ? <Button type="button" className="w-full justify-between" onClick={() => selectLesson(next.id)}>Keyingi dars<ChevronRight /></Button> : <p className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">Bu kursning oxirgi darsi</p>}
          </div>
        </aside>
      </div>

      <nav aria-label="Dars navigatsiyasi" className="mt-4 grid grid-cols-2 gap-3 min-[769px]:hidden">
        {previous ? <Button type="button" variant="outline" className="w-full" onClick={() => selectLesson(previous.id)}><ChevronLeft />Oldingi dars</Button> : <span />}
        {next ? <Button type="button" className="w-full" onClick={() => selectLesson(next.id)}>Keyingi dars<ChevronRight /></Button> : <p className="col-span-2 self-center text-right text-sm text-slate-500">Bu kursning oxirgi darsi</p>}
      </nav>
    </main>
  )
}
