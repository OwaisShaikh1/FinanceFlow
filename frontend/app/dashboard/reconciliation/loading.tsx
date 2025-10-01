import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <TableSkeleton columns={["Date","Bank","Our Books","Difference","Status","Action"]} rows={8} />
    </div>
  )
}
