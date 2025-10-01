import { Skeleton } from "@/components/ui/skeleton"
import { ChartSkeleton, CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <ChartSkeleton />
      <CardSkeleton lines={12} />
    </div>
  )
}
