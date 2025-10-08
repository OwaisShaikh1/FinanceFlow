import { Skeleton } from "@/components/ui/skeleton"
import { ChartSkeleton, CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
        <Skeleton className="h-8 w-40 bg-blue-200" />
      </div>
      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
        <ChartSkeleton />
      </div>
      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
        <CardSkeleton lines={12} />
      </div>
    </div>
  )
}
