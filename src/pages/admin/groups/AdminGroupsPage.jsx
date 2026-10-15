import { useCallback, useEffect, useMemo, useState } from "react"
import { FolderPlus, Plus, Search, Users } from "lucide-react"
import { Button } from "../../../components/ui/button"
import AdminGroupRow from "../../../components/groups/AdminGroupRow"
import ConfirmDialog from "../../../components/groups/ConfirmDialog"
import CreateGroupModal from "../../../components/groups/CreateGroupModal"
import EditGroupModal from "../../../components/groups/EditGroupModal"
import { createGroup, deleteGroup, getAllGroups, updateGroup } from "../../../lib/api"

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [deletingGroup, setDeletingGroup] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadGroups = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      setGroups(await getAllGroups())
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Guruhlarni yuklab bo'lmadi.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    getAllGroups()
      .then((result) => {
        if (active) setGroups(result)
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Guruhlarni yuklab bo'lmadi.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return groups
    return groups.filter((group) => `${group.name} ${group.description}`.toLocaleLowerCase().includes(normalizedQuery))
  }, [groups, query])

  async function handleDelete() {
    if (!deletingGroup) return
    setDeleting(true)
    setError("")
    try {
      await deleteGroup(deletingGroup.id)
      setDeletingGroup(null)
      await loadGroups()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Guruhni o'chirib bo'lmadi.")
    } finally {
      setDeleting(false)
    }
  }

  const activeCount = groups.filter((group) => group.status === "active").length

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Boshqaruv</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Guruhlar</h1>
          <p className="mt-1 text-sm text-slate-500">O'quv guruhlarini yarating va boshqaring.</p>
        </div>
        <Button type="button" size="lg" onClick={() => setCreateOpen(true)}>
          <Plus size={18} />
          Yangi guruh
        </Button>
      </div>

      <section aria-label="Guruhlar statistikasi" className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Jami guruhlar" value={groups.length} icon={<FolderPlus size={19} />} />
        <StatCard label="Aktiv guruhlar" value={activeCount} icon={<Users size={19} />} tone="emerald" />
        <StatCard label="Yopilgan guruhlar" value={groups.length - activeCount} icon={<FolderPlus size={19} />} tone="slate" />
      </section>

      <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold text-slate-900">Barcha guruhlar</h2>
            <p className="mt-1 text-sm text-slate-500">{loading ? "Yuklanmoqda..." : `${filteredGroups.length} ta guruh`}</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search size={17} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Guruhni qidirish..." className="w-full rounded-lg border border-slate-300 py-2.5 pr-3 pl-9 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" />
          </label>
        </div>
        {error && <p role="alert" className="m-5 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        {loading ? (
          <div className="space-y-4 p-6" aria-label="Guruhlar yuklanmoqda">
            {[0, 1, 2].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}
            <span className="sr-only">Yuklanmoqda</span>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><FolderPlus size={25} /></span>
            <h3 className="mt-4 font-semibold text-slate-900">{groups.length === 0 ? "Hali guruh yaratilmagan" : "Guruh topilmadi"}</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {groups.length === 0 ? "Yangi guruh yaratib, o'quv jarayonini boshlang." : "Boshqa nom bilan qidirib ko'ring."}
            </p>
            {groups.length === 0 && <Button type="button" className="mt-5" onClick={() => setCreateOpen(true)}><Plus size={17} />Yangi guruh</Button>}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredGroups.map((group) => (
              <AdminGroupRow key={group.id} group={group} onEdit={setEditingGroup} onDelete={setDeletingGroup} />
            ))}
          </div>
        )}
      </section>

      <CreateGroupModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={async (data) => { await createGroup(data); await loadGroups() }} />
      <EditGroupModal open={Boolean(editingGroup)} group={editingGroup} onClose={() => setEditingGroup(null)} onSubmit={async (data) => { await updateGroup(editingGroup.id, data); await loadGroups() }} />
      <ConfirmDialog
        open={Boolean(deletingGroup)}
        onClose={() => setDeletingGroup(null)}
        onConfirm={handleDelete}
        title="Guruhni o'chirish"
        confirmLabel="Ha, o'chirish"
        loading={deleting}
        description={deletingGroup ? `"${deletingGroup.name}" guruhini o'chirmoqchimisiz? Bu amal qaytarib bo'lmaydi. Guruh va unga tegishli barcha darslar o'chiriladi, ${deletingGroup.memberCount} ta talaba guruhdan chiqariladi.` : ""}
      />
    </>
  )
}

function StatCard({ label, value, icon, tone = "indigo" }) {
  const toneClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-500",
  }
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`flex size-11 items-center justify-center rounded-xl ${toneClasses[tone]}`}>{icon}</span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      </div>
    </div>
  )
}
