import { Skeleton } from "@/components/ui/skeleton"
import { ChartSkeleton, CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-40 bg-blue-100" />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-6">
            <ChartSkeleton />
          </div>
        </div>
        
        {/* Stats Card */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-6">
          <CardSkeleton lines={8} />
        </div>
      </div>
      
      {/* Reports Table */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-6">
        <CardSkeleton lines={10} />
      </div>
    </div>
  )
}
