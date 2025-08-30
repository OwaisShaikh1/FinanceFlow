import { ReportCards } from "@/components/reporting/report-cards"
import { ReportFilters } from "@/components/reporting/report-filters"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-muted-foreground">Generate comprehensive financial statements and analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Reports
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <ReportFilters />
      <ReportCards />
    </div>
  )
}
