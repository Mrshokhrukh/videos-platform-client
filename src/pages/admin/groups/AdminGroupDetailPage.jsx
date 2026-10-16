import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, BookOpen, Clock3, LoaderCircle, MoreVertical, Pencil, Plus, Trash2, UserPlus, Users, Video } from "lucide-react"
import { Button } from "../../../components/ui/button"
import AddStudentModal from "../../../components/groups/AddStudentModal"
import ConfirmDialog from "../../../components/groups/ConfirmDialog"
import EditGroupModal from "../../../components/groups/EditGroupModal"
import EditLessonModal from "../../../components/video/EditLessonModal"
import { deleteGroup, getGroupById, getGroupLessons, getGroupMembers, removeStudentFromGroup, updateGroup } from "../../../lib/api"
import { formatDuration, getInitials } from "../../../lib/utils"

export default function AdminGroupDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [lessons, setLessons] = useState([])
  const [members, setMembers] = useState([])
  const [tab, setTab] = useState("lessons")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addStudentOpen, setAddStudentOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [lessonMenuId, setLessonMenuId] = useState(null)

  const loadDetails = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError("")
    try {
      const [groupData, lessonData, memberData] = await Promise.all([
        getGroupById(id),
        getGroupLessons(id, { includeUnpublished: true }),
        getGroupMembers(id),
      ])
      setGroup(groupData)
      setLessons(lessonData)
      setMembers(memberData)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Guruh ma'lumotlarini yuklab bo'lmadi.")
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let active = true
    Promise.all([getGroupById(id), getGroupLessons(id, { includeUnpublished: true }), getGroupMembers(id)])
      .then(([groupData, lessonData, memberData]) => {
        if (!active) return
        setGroup(groupData)
        setLessons(lessonData)
        setMembers(memberData)
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Guruh ma'lumotlarini yuklab bo'lmadi.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  async function handleConfirm() {
    if (!confirm) return
    setActionLoading(true)
    setError("")
    try {
      if (confirm.type === "delete-group") {
        await deleteGroup(id)
        navigate("/admin/groups", { replace: true })
      } else {
        await removeStudentFromGroup(confirm.student.id, id)
        setConfirm(null)
        await loadDetails(false)
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Amalni bajarib bo'lmadi.")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500"><LoaderCircle className="animate-spin text-indigo-600" />Guruh ma'lumotlari yuklanmoqda...</div>
  }

  if (error && !group) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center">
        <p role="alert" className="text-sm text-rose-700">{error}</p>
        <Button type="button" variant="outline" className="mt-5" onClick={() => navigate("/admin/groups")}>
          <ArrowLeft size={16} />Guruhlar sahifasiga qaytish
        </Button>
      </div>
    )
  }

  if (!group) return null

  return (
    <>
      <Link to="/admin/groups" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-700">
        <ArrowLeft size={17} /> Guruhlar
      </Link>
      {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-36 bg-gradient-to-br from-indigo-100 via-violet-50 to-slate-100 sm:h-48">
          {group.coverImage && <img src={group.coverImage} alt="" className="size-full object-cover" />}
        </div>
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{group.name}</h1>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${group.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {group.status === "active" ? "Aktiv" : "Yopiq"}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{group.description || "Guruh tavsifi mavjud emas."}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2"><BookOpen size={16} />{lessons.length} ta dars</span>
              <span className="inline-flex items-center gap-2"><Users size={16} />{members.length} ta talaba</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setEditing(true)}><Pencil size={16} />Tahrirlash</Button>
            <Button type="button" variant="destructive" onClick={() => setConfirm({ type: "delete-group" })}><Trash2 size={16} /><span className="hidden sm:inline">O'chirish</span></Button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex border-b border-slate-200 px-5 sm:px-7">
          <button type="button" onClick={() => setTab("lessons")} aria-selected={tab === "lessons"} role="tab" className={`border-b-2 px-1 py-4 text-sm font-medium transition ${tab === "lessons" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
            Darslar <span className="ml-1 text-slate-400">({lessons.length})</span>
          </button>
          <button type="button" onClick={() => setTab("members")} aria-selected={tab === "members"} role="tab" className={`ml-6 border-b-2 px-1 py-4 text-sm font-medium transition ${tab === "members" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
            Talabalar <span className="ml-1 text-slate-400">({members.length})</span>
          </button>
        </div>

        {tab === "lessons" ? (
          <div className="p-5 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Guruh darslari</h2>
                <p className="mt-1 text-sm text-slate-500">Kursdagi video darslar ro'yxati.</p>
              </div>
              <Button type="button" onClick={() => navigate(`/admin/groups/${id}/upload`)}>
                <Plus size={17} />Dars qo'shish
              </Button>
            </div>
            {lessons.length ? (
              <div className="divide-y divide-slate-100">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center gap-4 py-4 first:pt-1 last:pb-1">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-semibold text-indigo-700">{lesson.order ?? index + 1}</span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><Video size={18} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{lesson.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{lesson.isPublished === false ? "Qoralama" : "Nashr qilingan"}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-500"><Clock3 size={15} />{formatDuration(lesson.duration)}</span>
                    <div className="relative">
                      <button type="button" aria-label={`${lesson.title} amallari`} aria-expanded={lessonMenuId === lesson.id} onClick={() => setLessonMenuId((current) => current === lesson.id ? null : lesson.id)} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                        <MoreVertical size={18} />
                      </button>
                      {lessonMenuId === lesson.id && (
                        <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                          <button type="button" role="menuitem" onClick={() => { setEditingLesson(lesson); setLessonMenuId(null) }} className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                            Tahrirlash
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                <Video className="mx-auto text-slate-400" size={26} />
                <p className="mt-3 text-sm font-medium text-slate-700">Hali darslar qo'shilmagan</p>
                <p className="mt-1 text-sm text-slate-500">Birinchi darsni yuklashni boshlang.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Guruh talabalari</h2>
                <p className="mt-1 text-sm text-slate-500">Guruhga biriktirilgan talabalar.</p>
              </div>
              <Button type="button" onClick={() => setAddStudentOpen(true)}><UserPlus size={17} />Talaba qo'shish</Button>
            </div>
            {members.length ? (
              <div className="divide-y divide-slate-100">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 py-4 first:pt-1 last:pb-1">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">{getInitials(member.name)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="truncate text-xs text-slate-500">{member.email}</p>
                    </div>
                    <button type="button" onClick={() => setConfirm({ type: "remove-student", student: member })} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                      <Trash2 size={15} /><span className="hidden sm:inline">Guruhdan chiqarish</span><span className="sm:hidden">Chiqarish</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                <Users className="mx-auto text-slate-400" size={26} />
                <p className="mt-3 text-sm font-medium text-slate-700">Guruhda hozircha talaba yo'q</p>
              </div>
            )}
          </div>
        )}
      </section>

      <EditGroupModal
        open={editing}
        group={group}
        onClose={() => setEditing(false)}
        onSubmit={async (data) => { await updateGroup(id, data); await loadDetails(false) }}
      />
      <EditLessonModal
        open={Boolean(editingLesson)}
        lesson={editingLesson}
        onClose={() => setEditingLesson(null)}
        onUpdated={() => loadDetails(false)}
      />
      <AddStudentModal
        open={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        groupId={id}
        memberIds={members.map((member) => member.id)}
        onAdded={() => loadDetails(false)}
      />
      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
        loading={actionLoading}
        title={confirm?.type === "delete-group" ? "Guruhni o'chirish" : "Talabani guruhdan chiqarish"}
        confirmLabel={confirm?.type === "delete-group" ? "Ha, o'chirish" : "Guruhdan chiqarish"}
        description={confirm?.type === "delete-group"
          ? `"${group.name}" guruhini o'chirmoqchimisiz? Bu amal qaytarib bo'lmaydi. Guruh va unga tegishli barcha darslar o'chiriladi. ${members.length} ta talaba guruhdan chiqariladi.`
          : `${confirm?.student.name ?? ""} ismli talabani "${group.name}" guruhidan chiqarmoqchimisiz?`}
      />
    </>
  )
}
