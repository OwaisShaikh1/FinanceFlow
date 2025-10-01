import { Skeleton } from "@/components/ui/skeleton"

// Simple card skeleton (title + lines)
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-40" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  )
}

// Small stat tile skeleton
export function StatTileSkeleton() {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-7 w-28" />
    </div>
  )
}

// Chart area skeleton
export function ChartSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

// Generic table skeleton
export function TableSkeleton({ columns, rows = 6 }: { columns: Array<string> | number; rows?: number }) {
  const colCount = typeof columns === "number" ? columns : columns.length
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Header */}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${colCount}, minmax(120px, 1fr))` }}>
          {typeof columns === "number"
            ? Array.from({ length: columns }).map((_, i) => <Skeleton key={i} className="h-5 m-2" />)
            : columns.map((c, i) => <Skeleton key={i} className="h-5 m-2" />)}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid border-t"
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(120px, 1fr))` }}
          >
            {Array.from({ length: colCount }).map((_, c) => (
              <div key={c} className="p-2">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// List item skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}
