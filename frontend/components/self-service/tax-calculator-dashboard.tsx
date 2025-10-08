import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FileText, PiggyBank, TrendingUp } from "lucide-react"
import { IncomeTaxCalculator } from "./income-tax-calculator"
import { GSTCalculator } from "./gst-calculator"
import { TDSCalculator } from "./tds-calculator"
import { TaxSavingTips } from "./tax-saving-tips"

export function TaxCalculatorDashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-balance mb-4">
          Free <span className="text-primary">Tax Calculators</span>
        </h1>
        <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
          Calculate your taxes accurately with our smart calculators. Get instant results and tax-saving
          recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-blue-900">Income Tax</CardTitle>
            <CardDescription className="text-blue-700">Calculate your income tax liability</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-blue-900">GST Calculator</CardTitle>
            <CardDescription className="text-blue-700">Calculate GST on goods and services</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-blue-900">TDS Calculator</CardTitle>
            <CardDescription className="text-blue-700">Calculate TDS on various payments</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <PiggyBank className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-blue-900">Tax Saving</CardTitle>
            <CardDescription className="text-blue-700">Get personalized tax saving tips</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <IncomeTaxCalculator />
        <GSTCalculator />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TDSCalculator />
        <TaxSavingTips />
      </div>
    </div>
  )
}
