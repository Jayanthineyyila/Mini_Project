export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 h-32 rounded-2xl bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
      <div className="mt-5 h-2 w-full rounded bg-muted" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-border px-4 py-3">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="h-3 w-32 rounded bg-muted" />
      <div className="h-3 w-20 rounded bg-muted" />
      <div className="ml-auto h-5 w-16 rounded-full bg-muted" />
    </div>
  );
}
