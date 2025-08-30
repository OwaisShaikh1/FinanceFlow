import { IncomeTaxDashboard } from "@/components/tax/income-tax-dashboard"
import { TaxSavingCalculator } from "@/components/tax/tax-saving-calculator"
import { AdvanceTaxCalculator } from "@/components/tax/advance-tax-calculator"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, Download } from "lucide-react"

export default function IncomeTaxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Income Tax Management</h1>
          <p className="text-muted-foreground">Calculate advance tax, plan tax savings, and prepare ITR</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Tax Calculator
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate ITR
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <IncomeTaxDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdvanceTaxCalculator />
        <TaxSavingCalculator />
      </div>
    </div>
  )
}
