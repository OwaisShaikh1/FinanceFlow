import { RecurringInvoicesList } from "@/components/invoicing/recurring-invoices-list"
import { RecurringInvoiceStats } from "@/components/invoicing/recurring-invoice-stats"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RecurringInvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recurring Invoices</h1>
            <p className="text-muted-foreground">
              Automate invoice generation for subscriptions and recurring services
            </p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Recurring Invoice
        </Button>
      </div>

      <RecurringInvoiceStats />
      <RecurringInvoicesList />
    </div>
  )
}
