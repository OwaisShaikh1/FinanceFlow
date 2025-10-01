import { ProfitLossReport } from "@/components/reporting/profit-loss-report"
import { ProfitLossChart } from "@/components/reporting/profit-loss-chart"
import { ReportHeader } from "@/components/reporting/report-header"

export default function ProfitLossPage() {
  const reportData = {
    revenue: 287000,
    otherIncome: 5000,
    totalRevenue: 292000,
    
    // Expenses in the format expected by Excel generator
    expenses: [
      { name: 'Cost of Goods Sold', value: 120000 },
      { name: 'Operating Expenses', value: 85000 },
      { name: 'Administrative Expenses', value: 36000 },
      { name: 'Marketing Expenses', value: 18000 }
    ],
    
    // Individual expense fields for backward compatibility
    cogs: 120000,
    operatingExpenses: 85000,
    adminExpenses: 36000,
    marketingExpenses: 18000,
    
    totalExpenses: 259000,
    netProfit: 33000
  }

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Profit & Loss Statement"
        description="Income and expenses for the selected period"
        reportType="profit-loss"
        reportData={reportData}
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
