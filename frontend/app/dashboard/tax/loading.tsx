import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-40 bg-blue-100" />
      
      {/* Tax Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-6">
          <CardSkeleton lines={8} />
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-6">
          <CardSkeleton lines={8} />
        </div>
      </div>
      
      {/* Filters Skeleton */}
      <Skeleton className="h-10 w-full bg-blue-100 rounded-lg" />
    </div>
  )
}
