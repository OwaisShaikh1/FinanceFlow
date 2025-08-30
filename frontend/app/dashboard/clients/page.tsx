import { Button } from "@/components/ui/button"
import { ClientStats } from "@/components/clients/client-stats"
import { ClientsList } from "@/components/clients/clients-list"
import { ClientFilters } from "@/components/clients/client-filters"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600 mt-1">Manage your client portfolio and compliance status</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      <ClientStats />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ClientFilters />
        </div>
        <div className="lg:col-span-3">
          <ClientsList />
        </div>
      </div>
    </div>
  )
}
