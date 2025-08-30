import { GSTCalculator } from "@/components/tax/gst-calculator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GSTCalculatorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/gst">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">GST Calculator</h1>
          <p className="text-muted-foreground">Calculate GST amounts for your transactions</p>
        </div>
      </div>

      <GSTCalculator />
    </div>
  )
}
