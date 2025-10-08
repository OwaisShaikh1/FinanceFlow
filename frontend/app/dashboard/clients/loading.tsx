import { Skeleton } from "@/components/ui/skeleton"
import { ListItemSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-blue-100" />
        <Skeleton className="h-9 w-32 bg-blue-100 rounded-lg" />
      </div>
      
      {/* Client List */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-4">
            <ListItemSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}
