import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"
import StudentGroupCard from "../../../components/groups/StudentGroupCard"
import { Skeleton } from "../../../components/ui/skeleton"
import { getMyGroups } from "../../../lib/api"

function GroupCardSkeleton() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <Skeleton className="aspect-video rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-2 rounded-full" />
      </div>
    </div>
  )
}

export default function StudentHomePage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    getMyGroups()
      .then((result) => { if (active) setGroups(result) })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : "Kurslarni yuklab bo'lmadi.") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl bg-slate-50 px-5 py-10 text-slate-900 sm:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Salom, Behruz! 👋</h1>
        <h2 className="mt-8 text-xl font-semibold">Mening kurslarim ({loading ? "…" : groups.length})</h2>
      </header>

      {error && <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      {loading ? (
        <section aria-label="Kurslar yuklanmoqda" className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => <GroupCardSkeleton key={index} />)}
        </section>
      ) : groups.length ? (
        <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => <StudentGroupCard key={group.id} group={group} />)}
        </section>
      ) : !error ? (
        <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <BookOpen className="mx-auto text-indigo-400" size={38} strokeWidth={1.5} />
          <p className="mt-4 text-sm text-slate-600">Siz hali hech qanday kursga qo'shilmagansiz.</p>
          <p className="mt-1 text-sm font-medium text-slate-800">Administrator bilan bog'laning.</p>
        </section>
      ) : null}
    </main>
  )
}
