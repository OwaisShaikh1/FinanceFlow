import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton lines={10} />
        <CardSkeleton lines={10} />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
