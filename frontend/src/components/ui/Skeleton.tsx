export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-cream-200/70 ${className}`} aria-hidden />;
}

export function ProductCardSkeleton() {
  return (
    <div className="paper p-3" aria-hidden>
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="space-y-2.5 p-2 pt-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-3">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function RowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-2xl" />
      ))}
    </div>
  );
}
