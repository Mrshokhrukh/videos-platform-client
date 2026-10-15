import { AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import Modal from "./Modal"

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Amalni tasdiqlang",
  description,
  confirmLabel = "Tasdiqlash",
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="p-6">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle size={20} />
          </span>
          <p className="pt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Bekor qilish
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "Bajarilmoqda..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
