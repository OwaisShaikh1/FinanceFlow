import { Button } from "@/components/ui/button"
import { ClientStats } from "@/components/clients/client-stats"
import { ClientsList } from "@/components/clients/clients-list"
import { ClientFilters } from "@/components/clients/client-filters"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ClientsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Client Management</h1>
            <p className="text-blue-600 mt-1">Manage your client portfolio and compliance status</p>
          </div>
          <Link href="/dashboard/clients/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </Link>
        </div>
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
