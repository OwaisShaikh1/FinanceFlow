import { Skeleton } from "@/components/ui/skeleton"
import { ChartSkeleton, StatTileSkeleton, CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><ChartSkeleton /></div>
        <CardSkeleton lines={6} />
      </div>

      <CardSkeleton lines={5} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton lines={8} />
        <CardSkeleton lines={8} />
      </div>
    </div>
  )
}
