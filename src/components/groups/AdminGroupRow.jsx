import { Link } from "react-router-dom"
import { BookOpen, Pencil, Trash2, Users } from "lucide-react"

export default function AdminGroupRow({ group, onEdit, onDelete }) {
  return (
    <article className="group relative flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6">
      <Link
        to={`/admin/groups/${group.id}`}
        aria-label={`${group.name} guruhini ochish`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-[-3px]"
      />
      {group.coverImage ? (
        <img src={group.coverImage} alt="" className="relative size-14 shrink-0 rounded-xl object-cover" />
      ) : (
        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <BookOpen size={22} />
        </span>
      )}
      <div className="relative min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate font-semibold text-slate-900">{group.name}</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${group.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
            {group.status === "active" ? "Aktiv" : "Yopiq"}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-slate-500">{group.description || "Tavsif kiritilmagan"}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5"><BookOpen size={14} />{group.lessonCount} dars</span>
          <span className="inline-flex items-center gap-1.5"><Users size={14} />{group.memberCount} talaba</span>
        </div>
      </div>
      <div className="relative z-20 flex shrink-0 items-center gap-1">
        <button type="button" onClick={() => onEdit(group)} aria-label={`${group.name} guruhini tahrirlash`} className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700">
          <Pencil size={17} />
        </button>
        <button type="button" onClick={() => onDelete(group)} aria-label={`${group.name} guruhini o'chirish`} className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600">
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  )
}
