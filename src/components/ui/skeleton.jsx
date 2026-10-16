import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }) {
  return <div data-slot="skeleton" aria-hidden="true" className={cn("animate-pulse rounded-md bg-slate-100", className)} {...props} />
}

export { Skeleton }
