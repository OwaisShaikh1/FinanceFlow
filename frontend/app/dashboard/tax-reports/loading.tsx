import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/ui/skeleton-presets"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <TableSkeleton columns={["Period","Type","Filed","Due Date","Status","Actions"]} rows={10} />
    </div>
  )
}
