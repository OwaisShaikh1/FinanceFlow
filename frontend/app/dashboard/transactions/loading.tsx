import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton, StatTileSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>

      <Skeleton className="h-10 w-full" />
      <div className="rounded-lg border p-4">
        <TableSkeleton columns={["Id","Date","Description","Category","Type","Amount","Payment Method","Actions"]} rows={10} />
      </div>
    </div>
  )
}
