import { useEffect, useState } from "react"
import { Check, LoaderCircle, Search, UserRound, UserPlus } from "lucide-react"
import { getAllStudents, addStudentToGroup } from "../../lib/api"
import { Button } from "../ui/button"
import Modal from "./Modal"

export default function AddStudentModal({ open, onClose, groupId, memberIds, onAdded }) {
  if (!open) return null
  return <AddStudentModalContent onClose={onClose} groupId={groupId} memberIds={memberIds} onAdded={onAdded} />
}

function AddStudentModalContent({ onClose, groupId, memberIds, onAdded }) {
  const [students, setStudents] = useState([])
  const [query, setQuery] = useState("")
  const [addedIds, setAddedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    getAllStudents()
      .then((result) => {
        if (active) setStudents(result)
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Talabalarni yuklab bo'lmadi.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const normalizedQuery = query.trim().toLocaleLowerCase()
  const results = normalizedQuery.length < 2
    ? []
    : students.filter((student) => {
        const matches = `${student.name} ${student.email}`.toLocaleLowerCase().includes(normalizedQuery)
        return matches && !memberIds.includes(student.id) && !addedIds.includes(student.id)
      })
  const recentlyAdded = students.filter((student) => addedIds.includes(student.id))

  async function handleAdd(studentId) {
    setAddingId(studentId)
    setError("")
    try {
      await addStudentToGroup(studentId, groupId)
      setAddedIds((current) => [...current, studentId])
      await onAdded()
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "Talabani guruhga qo'shib bo'lmadi.")
    } finally {
      setAddingId("")
    }
  }

  return (
    <Modal open onClose={onClose} title="Guruhga talaba qo'shish">
      <div className="p-6">
        <label className="relative block">
          <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ism yoki email bo'yicha qidirish"
            className="w-full rounded-lg border border-slate-300 py-2.5 pr-3 pl-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
          />
        </label>
        <div className="mt-5 max-h-72 space-y-2 overflow-y-auto">
          {loading && <div className="flex justify-center py-8"><LoaderCircle className="animate-spin text-indigo-600" /></div>}
          {!loading && query.trim().length < 2 && (
            <p className="py-8 text-center text-sm text-slate-500">Kamida 2 ta harf kiriting.</p>
          )}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">Talaba topilmadi.</p>
          )}
          {results.map((student) => (
            <div key={student.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"><UserRound size={19} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{student.name}</p>
                <p className="truncate text-xs text-slate-500">{student.email}</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => handleAdd(student.id)} disabled={addingId !== ""}>
                {addingId === student.id ? <LoaderCircle className="animate-spin" size={15} /> : <UserPlus size={15} />}
                Qo'shish
              </Button>
            </div>
          ))}
          {recentlyAdded.map((student) => (
            <div key={student.id} className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-emerald-600"><Check size={19} /></span>
              <div>
                <p className="text-sm font-medium text-emerald-800">{student.name}</p>
                <p className="text-xs text-emerald-700">Guruhga qo'shildi</p>
              </div>
            </div>
          ))}
        </div>
        {error && <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Yopish</Button>
        </div>
      </div>
    </Modal>
  )
}
