import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <CardSkeleton lines={10} />
    </div>
  )
}
