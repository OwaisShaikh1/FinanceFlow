import { TaxReportCards } from "@/components/reporting/tax-report-cards"
import { GSTSummary } from "@/components/reporting/gst-summary"
import { TDSSummary } from "@/components/reporting/tds-summary"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

export default function TaxReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tax Reports</h1>
          <p className="text-muted-foreground">GST, TDS, and tax compliance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Tax Audit Trail
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      <TaxReportCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GSTSummary />
        <TDSSummary />
      </div>
    </div>
  )
}
