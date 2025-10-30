import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-48 bg-blue-100" />
      
      {/* Filters Skeleton */}
      <Skeleton className="h-10 w-full bg-blue-100 rounded-lg" />
      
      {/* Reconciliation Table */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-4">
        <TableSkeleton columns={["Date","Bank","Our Books","Difference","Status","Action"]} rows={8} />
      </div>
    </div>
  )
}
