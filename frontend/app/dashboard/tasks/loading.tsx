import { Skeleton } from "@/components/ui/skeleton"
import { ListItemSkeleton, CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-40 bg-blue-100" />
      
      {/* Task Stats Card */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-4">
        <CardSkeleton lines={4} />
      </div>
      
      {/* Task List */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-4">
            <ListItemSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}
