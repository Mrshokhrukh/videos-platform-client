import { AlertDialog } from '@base-ui/react/alert-dialog'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Tasdiqlash',
  description,
  confirmText = 'Tasdiqlash',
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.() }}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-xl outline-none">
          <AlertDialog.Title className="text-lg font-semibold">{title}</AlertDialog.Title>
          {description && <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">{description}</AlertDialog.Description>}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Bekor qilish</button>
            <button type="button" className="rounded-lg bg-destructive px-4 py-2 text-sm text-white" onClick={onConfirm}>{confirmText}</button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
