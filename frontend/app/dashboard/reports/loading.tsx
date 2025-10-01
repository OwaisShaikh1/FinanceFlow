import { Skeleton } from "@/components/ui/skeleton"
import { ChartSkeleton, CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><ChartSkeleton /></div>
        <CardSkeleton lines={8} />
      </div>
      <CardSkeleton lines={10} />
    </div>
  )
}
