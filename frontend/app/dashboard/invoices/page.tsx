import { InvoicesList } from "@/components/invoicing/invoices-list"
import { InvoiceStats } from "@/components/invoicing/invoice-stats"
import { InvoiceFilters } from "@/components/invoicing/invoice-filters"
import { Button } from "@/components/ui/button"
import { Plus, Repeat } from "lucide-react"
import Link from "next/link"

export default function InvoicesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Invoices
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage GST-compliant invoices and track payments with automated workflows
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/recurring-invoices">
              <Button variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
                <Repeat className="h-4 w-4 mr-2" />
                Recurring Invoices
              </Button>
            </Link>
            <Link href="/dashboard/invoices/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <InvoiceStats />
      <InvoiceFilters />
      <InvoicesList />
    </div>
  )
}
