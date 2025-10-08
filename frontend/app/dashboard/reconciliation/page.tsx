import { BankReconciliation } from "@/components/accounting/bank-reconciliation"
import { ReconciliationStats } from "@/components/accounting/reconciliation-stats"
import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"

export default function ReconciliationPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Bank Reconciliation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Match bank transactions with your recorded data for accurate financial reporting
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Bank Statement
            </Button>
          </div>
        </div>
      </div>

      <ReconciliationStats />
      <BankReconciliation />
    </div>
  )
}
