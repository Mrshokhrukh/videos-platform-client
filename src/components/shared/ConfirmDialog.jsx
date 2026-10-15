export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Tasdiqlash', description, confirmText = 'Tasdiqlash' }) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.() }}>
    <section className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      <h2 className="text-lg font-semibold" id="confirm-title">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex justify-end gap-2"><button className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Bekor qilish</button><button className="rounded-lg bg-destructive px-4 py-2 text-sm text-white" onClick={onConfirm}>{confirmText}</button></div>
    </section>
  </div>
}
