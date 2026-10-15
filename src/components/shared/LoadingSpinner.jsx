export default function LoadingSpinner({ label = 'Yuklanmoqda…' }) {
  return <div className="grid min-h-40 place-items-center text-sm text-muted-foreground" role="status"><span className="flex items-center gap-3"><span className="size-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />{label}</span></div>
}
