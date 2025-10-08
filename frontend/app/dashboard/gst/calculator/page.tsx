import { GSTCalculator } from "@/components/tax/gst-calculator"
import { ArrowLeft, Calculator } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GSTCalculatorPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/gst">
            <Button variant="outline" size="icon" className="border-green-200 hover:bg-green-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Calculator className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                GST Calculator
              </h1>
              <p className="text-lg text-gray-600">
                Calculate GST amounts, tax implications, and net values for your business transactions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Calculator Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <GSTCalculator />
      </div>
    </div>
  )
}
