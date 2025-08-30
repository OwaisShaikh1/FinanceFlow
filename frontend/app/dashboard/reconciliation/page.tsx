import { BankReconciliation } from "@/components/accounting/bank-reconciliation"
import { ReconciliationStats } from "@/components/accounting/reconciliation-stats"
import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"

export default function ReconciliationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bank Reconciliation</h1>
          <p className="text-muted-foreground">Match bank transactions with your recorded data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Bank Statement
          </Button>
        </div>
      </div>

      <ReconciliationStats />
      <BankReconciliation />
    </div>
  )
}
