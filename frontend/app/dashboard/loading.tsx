import { Skeleton } from "@/components/ui/skeleton"
import { ChartSkeleton, StatTileSkeleton, CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40 bg-blue-200" />
        <Skeleton className="h-4 w-80 bg-blue-100" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 bg-blue-200" />
                <Skeleton className="h-4 w-4 bg-blue-200 rounded" />
              </div>
              <Skeleton className="h-8 w-16 bg-blue-200" />
              <Skeleton className="h-3 w-20 bg-blue-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 bg-blue-200" />
              <div className="h-64 space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full bg-blue-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 bg-blue-200" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full bg-blue-100" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardSkeleton lines={5} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton lines={8} />
        <CardSkeleton lines={8} />
      </div>
    </div>
  )
}
