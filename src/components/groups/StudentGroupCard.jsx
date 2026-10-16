import { ArrowRight, BookOpen, PlayCircle } from "lucide-react"
import { Link } from "react-router-dom"

function getWatchedLessons() {
  try {
    const stored = JSON.parse(localStorage.getItem("watched_lessons") || "[]")
    return new Set(Array.isArray(stored) ? stored.map(String) : [])
  } catch {
    return new Set()
  }
}

export default function StudentGroupCard({ group }) {
  const lessons = Array.isArray(group.lessons) ? group.lessons : []
  const watched = getWatchedLessons()
  const watchedCount = lessons.filter((lesson) => watched.has(String(lesson.id))).length
  const progress = lessons.length ? Math.round((watchedCount / lessons.length) * 100) : 0
  const nextLesson = lessons.find((lesson) => !watched.has(String(lesson.id)))
  const groupUrl = `/group/${group.id}`
  const actionUrl = watchedCount > 0 && nextLesson ? `/lesson/${nextLesson.id}` : groupUrl

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={groupUrl} aria-label={`${group.name} kursini ochish`} className="block aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 via-violet-50 to-slate-100">
        {group.coverImage ? (
          <img src={group.coverImage} alt={`${group.name} kursi muqovasi`} className="size-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <span className="flex size-full items-center justify-center text-indigo-300"><BookOpen size={42} strokeWidth={1.4} /></span>
        )}
      </Link>
      <div className="p-5">
        <h2 className="line-clamp-2 min-h-12 text-lg font-semibold leading-6 text-slate-900">
          <Link to={groupUrl} className="transition hover:text-indigo-700">{group.name}</Link>
        </h2>
        <p className="mt-2 text-sm text-slate-500">{watchedCount} / {lessons.length} ta dars ko'rildi</p>
        <div className="mt-3 flex items-center gap-3" aria-label={`Kurs ${progress}% bajarilgan`}>
          <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="shrink-0 text-xs font-medium text-slate-500">{progress}%</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Link to={actionUrl} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {watchedCount > 0 && nextLesson ? <><PlayCircle size={16} />Davom etish</> : <>Darslarni ko'rish<ArrowRight size={16} /></>}
          </Link>
        </div>
      </div>
    </article>
  )
}
