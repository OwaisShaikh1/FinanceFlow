import { GSTDashboard } from "@/components/tax/gst-dashboard"
import { GSTFilingCalendar } from "@/components/tax/gst-filing-calendar"
import { GSTReturns } from "@/components/tax/gst-returns"
import { Button } from "@/components/ui/button"
import { Calculator, Upload } from "lucide-react"
import Link from "next/link"

export default function GSTPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">GST Management</h1>
          <p className="text-muted-foreground">Manage GST returns, calculations, and compliance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/gst/calculator">
            <Button variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              GST Calculator
            </Button>
          </Link>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            File Return
          </Button>
        </div>
      </div>

      <GSTDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GSTReturns />
        <GSTFilingCalendar />
      </div>
    </div>
  )
}
