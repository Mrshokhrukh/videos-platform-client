export default function ErrorState({ message = 'Ma’lumotni yuklab bo‘lmadi.', onRetry }) {
  return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center"><p className="mb-3 text-sm">{message}</p>{onRetry && <button className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground" onClick={onRetry}>Qayta urinish</button>}</div>
}
