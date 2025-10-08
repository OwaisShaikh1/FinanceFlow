import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Header Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 bg-blue-200 rounded-md" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-10 w-56 bg-blue-200" />
              <Skeleton className="h-5 w-96 bg-blue-100" />
            </div>
          </div>
          <Skeleton className="h-9 w-48 bg-blue-200 rounded-md" />
        </div>
      </div>

      {/* Stats Skeleton */}
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

      {/* Table Skeleton */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg border border-blue-100 p-4">
        <TableSkeleton columns={["Template","Client","Amount","Frequency","Next Run","Status","Actions"]} rows={10} />
      </div>
    </div>
  )
}
