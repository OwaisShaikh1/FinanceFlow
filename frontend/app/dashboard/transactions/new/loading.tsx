import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-52" />
      <CardSkeleton lines={12} />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
