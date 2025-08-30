import { BalanceSheetReport } from "@/components/reporting/balance-sheet-report"
import { BalanceSheetChart } from "@/components/reporting/balance-sheet-chart"
import { ReportHeader } from "@/components/reporting/report-header"

export default function BalanceSheetPage() {
  return (
    <div className="space-y-6">
      <ReportHeader
        title="Balance Sheet"
        description="Assets, liabilities, and equity as of the selected date"
        reportType="balance-sheet"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceSheetReport />
        </div>
        <div>
          <BalanceSheetChart />
        </div>
      </div>
    </div>
  )
}
