import { IncomeTaxDashboard } from "@/components/tax/income-tax-dashboard"
import { TaxSavingCalculator } from "@/components/tax/tax-saving-calculator"
import { AdvanceTaxCalculator } from "@/components/tax/advance-tax-calculator"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, Download } from "lucide-react"

export default function IncomeTaxPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Income Tax Management</h1>
            <p className="text-blue-700">Calculate advance tax, plan tax savings, and prepare ITR</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-blue-300 hover:bg-blue-50 text-blue-700">
              <Calculator className="h-4 w-4 mr-2" />
              Tax Calculator
            </Button>
            <Button variant="outline" className="border-blue-300 hover:bg-blue-50 text-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Generate ITR
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
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
    </div>
  )
}
