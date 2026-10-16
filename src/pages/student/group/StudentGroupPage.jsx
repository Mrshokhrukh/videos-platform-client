import { useEffect, useState } from "react"
import { ArrowLeft, BookOpen, Check, Clock3, LoaderCircle, Play } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { getGroupById, getGroupLessons, getMyGroups } from "../../../lib/api"
import { formatDate, formatDuration } from "../../../lib/utils"

function getWatchedLessons() {
  try {
    const stored = JSON.parse(localStorage.getItem("watched_lessons") || "[]")
    return new Set(Array.isArray(stored) ? stored.map(String) : [])
  } catch {
    return new Set()
  }
}

function getCurrentLessonId() {
  return localStorage.getItem("current_lesson_id") || ""
}

export default function StudentGroupPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [lessons, setLessons] = useState([])
  const [watched, setWatched] = useState(getWatchedLessons)
  const [currentLessonId, setCurrentLessonId] = useState(getCurrentLessonId)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    getMyGroups()
      .then((myGroups) => {
        if (!myGroups.some((item) => String(item.id) === String(id))) {
          throw new Error("Bu guruhga kirish huquqingiz yo'q.")
        }
        return Promise.all([getGroupById(id), getGroupLessons(id)])
      })
      .then(([groupData, lessonData]) => {
        if (!active) return
        setGroup(groupData)
        setLessons(lessonData.filter((lesson) => lesson.isPublished))
        setWatched(getWatchedLessons())
        setCurrentLessonId(getCurrentLessonId())
      })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : "Guruh darslarini yuklab bo'lmadi.") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-sm text-slate-500"><LoaderCircle className="animate-spin text-indigo-600" />Darslar yuklanmoqda...</main>
  }

  if (error || !group) {
    return <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 text-center"><p role="alert" className="text-sm text-rose-700">{error || "Guruh topilmadi."}</p><Button variant="outline" className="mt-5" onClick={() => navigate(-1)}><ArrowLeft />Orqaga</Button></main>
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-slate-50 px-5 py-8 text-slate-900 sm:px-8 sm:py-10">
      <header className="flex items-start gap-5">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex shrink-0 items-center gap-2 pt-1 text-sm font-medium text-slate-500 transition hover:text-indigo-700">
          <ArrowLeft size={17} />Orqaga
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{group.name}</h1>
          <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-500"><BookOpen size={16} />{lessons.length} ta dars</p>
        </div>
      </header>

      <section aria-label="Guruh darslari" className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {lessons.length ? (
          <ol className="divide-y divide-slate-100">
            {lessons.map((lesson, index) => {
              const isWatched = watched.has(String(lesson.id))
              const isCurrent = currentLessonId === String(lesson.id)
              return (
                <li key={lesson.id}>
                  <Link to={`/lesson/${lesson.id}`} aria-current={isCurrent ? "step" : undefined} className={`flex items-center gap-4 px-4 py-4 transition-colors hover:bg-indigo-50/70 sm:px-6 ${isCurrent ? "bg-indigo-50/70 text-indigo-800" : isWatched ? "text-slate-500" : "text-slate-800"}`}>
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${isCurrent ? "bg-indigo-600 text-white" : isWatched ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-700"}`}>
                      {isCurrent ? <Play size={15} fill="currentColor" /> : isWatched ? <Check size={18} /> : lesson.order ?? index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm font-medium ${isCurrent ? "text-indigo-900" : isWatched ? "text-slate-500" : "text-slate-900"}`}>
                        {lesson.order ?? index + 1}. {lesson.title}
                      </span>
                      {lesson.createdAt && <span className="mt-1 block text-xs text-slate-400">Qo'shilgan: {formatDate(lesson.createdAt)}</span>}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:text-sm"><Clock3 size={15} />{formatDuration(lesson.duration)}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        ) : (
          <div className="px-6 py-14 text-center">
            <BookOpen className="mx-auto text-slate-300" size={34} />
            <p className="mt-3 text-sm text-slate-500">Hozircha nashr qilingan darslar yo'q.</p>
          </div>
        )}
      </section>
    </main>
  )
}
