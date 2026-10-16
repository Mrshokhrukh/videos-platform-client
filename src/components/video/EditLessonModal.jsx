import { useEffect, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { LoaderCircle, X } from "lucide-react"
import { Button } from "../ui/button"
import { updateLesson } from "../../lib/api"

export default function EditLessonModal({ open, lesson, onClose, onUpdated }) {
  const [form, setForm] = useState({ title: "", description: "", order: 1, isPublished: true })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open || !lesson) return
    setForm({
      title: lesson.title || "",
      description: lesson.description || "",
      order: lesson.order ?? 1,
      isPublished: lesson.isPublished !== false,
    })
    setError("")
  }, [open, lesson])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!lesson?.id || saving) return
    setSaving(true)
    setError("")
    try {
      const updatedLesson = await updateLesson(lesson.id, {
        title: form.title,
        description: form.description,
        order: Number(form.order),
        isPublished: form.isPublished,
      })
      await onUpdated?.(updatedLesson)
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Darsni saqlab bo'lmadi.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !saving) onClose() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-slate-950/45 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <Dialog.Popup className="my-auto w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <Dialog.Title className="text-lg font-semibold tracking-tight">Darsni tahrirlash</Dialog.Title>
              <Dialog.Close type="button" disabled={saving} aria-label="Yopish" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"><X size={18} /></Dialog.Close>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <label className="block text-sm font-medium text-slate-700">
                Sarlavha <span className="text-rose-600">*</span>
                <input required maxLength={160} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Tavsif
                <textarea rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Tartib raqami
                <input type="number" min="1" step="1" required value={form.order} onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))} className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" />
              </label>
              <fieldset>
                <legend className="text-sm font-medium text-slate-700">Holat</legend>
                <div className="mt-3 flex flex-wrap gap-5">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="radio" name="lesson-status" checked={form.isPublished} onChange={() => setForm((current) => ({ ...current, isPublished: true }))} className="accent-indigo-600" />Nashr qilingan</label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="radio" name="lesson-status" checked={!form.isPublished} onChange={() => setForm((current) => ({ ...current, isPublished: false }))} className="accent-indigo-600" />Qoralama</label>
                </div>
              </fieldset>
              {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <Button type="button" variant="outline" disabled={saving} onClick={onClose}>Bekor qilish</Button>
                <Button type="submit" disabled={saving || !lesson}>{saving && <LoaderCircle className="animate-spin" />}Saqlash</Button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
