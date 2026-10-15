export default function EmptyState({ icon: Icon, title, description, action }) {
  return <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-dashed p-10 text-center">
    {Icon && <Icon className="size-10 text-muted-foreground" aria-hidden="true" />}
    <h2 className="text-lg font-semibold">{title}</h2><p className="text-sm text-muted-foreground">{description}</p>{action}
  </div>
}
