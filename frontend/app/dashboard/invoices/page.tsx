import { InvoicesList } from "@/components/invoicing/invoices-list"
import { InvoiceStats } from "@/components/invoicing/invoice-stats"
import { InvoiceFilters } from "@/components/invoicing/invoice-filters"
import { Button } from "@/components/ui/button"
import { Plus, Repeat } from "lucide-react"
import Link from "next/link"

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">Manage GST-compliant invoices and track payments</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/recurring-invoices">
            <Button variant="outline">
              <Repeat className="h-4 w-4 mr-2" />
              Recurring Invoices
            </Button>
          </Link>
          <Link href="/dashboard/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      <InvoiceStats />
      <InvoiceFilters />
      <InvoicesList />
    </div>
  )
}
