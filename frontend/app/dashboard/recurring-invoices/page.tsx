import { RecurringInvoicesList } from "@/components/invoicing/recurring-invoices-list"
import { RecurringInvoiceStats } from "@/components/invoicing/recurring-invoice-stats"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RecurringInvoicesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/invoices">
              <Button variant="outline" size="icon" className="border-blue-200 hover:bg-blue-100 text-blue-600">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Recurring Invoices
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Automate invoice generation for subscriptions and recurring services
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Recurring Invoice
          </Button>
        </div>
      </div>

      <RecurringInvoiceStats />
      <RecurringInvoicesList />
    </div>
  )
}
