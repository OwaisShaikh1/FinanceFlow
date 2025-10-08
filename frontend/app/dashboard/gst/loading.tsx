import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="space-y-4 flex-1">
            <Skeleton className="h-10 w-80 bg-blue-200" />
            <Skeleton className="h-5 w-96 bg-blue-100" />
            <div className="flex items-center gap-4 mt-4">
              <Skeleton className="h-6 w-40 bg-blue-100 rounded-full" />
              <Skeleton className="h-6 w-36 bg-blue-100 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-32 bg-blue-200 rounded-md" />
            <Skeleton className="h-9 w-28 bg-blue-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* Dashboard Section Skeleton */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="space-y-6">
          <Skeleton className="h-7 w-48 bg-blue-200" />
          
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 bg-blue-100" />
                  <Skeleton className="h-8 w-8 bg-blue-200 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-20 bg-blue-200" />
                <Skeleton className="h-3 w-16 bg-blue-100" />
              </div>
            ))}
          </div>

          {/* Additional Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-32 bg-blue-200" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full bg-blue-100" />
                    <Skeleton className="h-2 w-full bg-blue-200 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-40 bg-blue-200" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full bg-blue-100 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}