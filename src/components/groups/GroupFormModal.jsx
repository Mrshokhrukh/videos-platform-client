import { useState } from "react"
import { ImagePlus, LoaderCircle } from "lucide-react"
import { Button } from "../ui/button"
import Modal from "./Modal"

const inputClassName = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"

export default function GroupFormModal({ open, onClose, onSubmit, group }) {
  const [name, setName] = useState(() => group?.name ?? "")
  const [description, setDescription] = useState(() => group?.description ?? "")
  const [coverImage, setCoverImage] = useState(() => group?.coverImage ?? "")
  const [status, setStatus] = useState(() => group?.status ?? "active")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Iltimos, rasm faylini tanlang.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result)
        setError("")
      }
    }
    reader.onerror = () => setError("Rasmni o'qishda xatolik yuz berdi.")
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError("Guruh nomini kiriting.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await onSubmit({ name, description, coverImage, status })
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Guruhni saqlashda xatolik yuz berdi.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={group ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}>
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <label className="block text-sm font-medium text-slate-700">
          Guruh nomi <span className="text-rose-500">*</span>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Masalan, React dasturlash"
            className={inputClassName}
            maxLength={80}
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Tavsif
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Guruh haqida qisqacha ma'lumot"
            className={`${inputClassName} min-h-24 resize-y`}
            rows={3}
            maxLength={500}
          />
        </label>
        <div>
          <span className="text-sm font-medium text-slate-700">Muqova rasm</span>
          <div className="mt-1.5 flex items-center gap-4">
            {coverImage ? (
              <img src={coverImage} alt="Guruh muqovasi ko'rinishi" className="size-16 rounded-xl object-cover" />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <ImagePlus size={22} />
              </span>
            )}
            <label className="cursor-pointer rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              {coverImage ? "Rasmni o'zgartirish" : "Rasm tanlash"}
              <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
            </label>
          </div>
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Holat</legend>
          <div className="mt-2 flex gap-5">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="group-status" value="active" checked={status === "active"} onChange={() => setStatus("active")} className="accent-indigo-600" />
              Aktiv
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="group-status" value="closed" checked={status === "closed"} onChange={() => setStatus("closed")} className="accent-indigo-600" />
              Yopiq
            </label>
          </div>
        </fieldset>
        {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Bekor qilish</Button>
          <Button type="submit" disabled={saving || !name.trim()}>
            {saving && <LoaderCircle className="animate-spin" size={16} />}
            {saving ? "Saqlanmoqda..." : group ? "Saqlash" : "Yaratish"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
