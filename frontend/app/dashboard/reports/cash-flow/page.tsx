import { CashFlowReport } from "@/components/reporting/cash-flow-report"
import { CashFlowChart } from "@/components/reporting/cash-flow-chart"
import { ReportHeader } from "@/components/reporting/report-header"

export default function CashFlowPage() {
  const cashFlowData = {
    // Operating Activities
    netIncome: 33000,
    depreciation: 15000,
    workingCapitalChange: -5000,
    operatingCashFlow: 43000,
    
    // Investing Activities
    capex: -25000,
    investingCashFlow: -25000,
    
    // Financing Activities
    loansReceived: 50000,
    loanRepayments: -15000,
    financingCashFlow: 35000,
    
    // Net Cash Flow
    netCashFlow: 53000
  }

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Cash Flow Statement"
        description="Cash inflows and outflows for the selected period"
        reportType="cash-flow"
        reportData={cashFlowData}
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
