import { SelfServiceHeader } from "@/components/self-service/self-service-header"
import { TaxCalculatorDashboard } from "@/components/self-service/tax-calculator-dashboard"

export default function SelfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <SelfServiceHeader />
      <main className="container mx-auto px-4 py-8">
        <TaxCalculatorDashboard />
      </main>
    </div>
  )
}
