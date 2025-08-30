import { ProfitLossReport } from "@/components/reporting/profit-loss-report"
import { ProfitLossChart } from "@/components/reporting/profit-loss-chart"
import { ReportHeader } from "@/components/reporting/report-header"

export default function ProfitLossPage() {
  return (
    <div className="space-y-6">
      <ReportHeader
        title="Profit & Loss Statement"
        description="Income and expenses for the selected period"
        reportType="profit-loss"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfitLossReport />
        </div>
        <div>
          <ProfitLossChart />
        </div>
      </div>
    </div>
  )
}
