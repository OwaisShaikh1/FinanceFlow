import { CashFlowReport } from "@/components/reporting/cash-flow-report"
import { CashFlowChart } from "@/components/reporting/cash-flow-chart"
import { ReportHeader } from "@/components/reporting/report-header"

export default function CashFlowPage() {
  return (
    <div className="space-y-6">
      <ReportHeader
        title="Cash Flow Statement"
        description="Cash inflows and outflows for the selected period"
        reportType="cash-flow"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowReport />
        </div>
        <div>
          <CashFlowChart />
        </div>
      </div>
    </div>
  )
}
