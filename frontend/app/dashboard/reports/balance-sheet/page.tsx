import { BalanceSheetReport } from "@/components/reporting/balance-sheet-report"
import { BalanceSheetChart } from "@/components/reporting/balance-sheet-chart"
import { ReportHeader } from "@/components/reporting/report-header"

export default function BalanceSheetPage() {
  const balanceSheetData = {
    // Current Assets
    cashInHand: 50000,
    bankAccount: 285000,
    receivables: 125000,
    inventory: 85000,
    
    // Fixed Assets
    officeEquipment: 150000,
    furniture: 75000,
    computerSystems: 120000,
    
    // Current Liabilities
    accountsPayable: 85000,
    accruedExpenses: 25000,
    shortTermLoans: 50000,
    
    // Long-term Liabilities
    longTermDebt: 200000,
    equipmentLoan: 75000,
    
    // Equity
    ownersCapital: 400000,
    retainedEarnings: 150000
  }

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Balance Sheet"
        description="Assets, liabilities, and equity as of the selected date"
        reportType="balance-sheet"
        reportData={balanceSheetData}
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
