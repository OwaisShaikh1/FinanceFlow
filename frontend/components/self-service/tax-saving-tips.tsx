import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBank, Lightbulb } from "lucide-react"

export function TaxSavingTips() {
  const tips = [
    {
      section: "Section 80C",
      limit: "₹1.5 Lakh",
      options: ["PPF", "ELSS Mutual Funds", "Life Insurance Premium", "Home Loan Principal"],
    },
    {
      section: "Section 80D",
      limit: "₹25,000-₹50,000",
      options: ["Health Insurance Premium", "Preventive Health Check-up"],
    },
    {
      section: "Section 24",
      limit: "₹2 Lakh",
      options: ["Home Loan Interest", "Self-occupied Property"],
    },
    {
      section: "NPS (80CCD)",
      limit: "₹50,000",
      options: ["Additional deduction over 80C", "Long-term retirement planning"],
    },
  ]

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="pb-4 border-b border-blue-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PiggyBank className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-blue-900">Tax Saving Tips</CardTitle>
            <CardDescription className="text-blue-700">Maximize your tax savings with these deductions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {tips.map((tip, index) => (
          <div key={index} className="p-4 border border-blue-200 rounded-lg space-y-2 bg-white hover:bg-blue-50 transition-colors">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center text-blue-900">
                <Lightbulb className="h-4 w-4 mr-2 text-blue-600" />
                {tip.section}
              </h4>
              <span className="text-sm font-medium text-blue-700">{tip.limit}</span>
            </div>
            <div className="text-sm text-blue-600">
              <ul className="list-disc list-inside space-y-1">
                {tip.options.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <h4 className="font-semibold text-primary mb-2">💡 Pro Tip</h4>
          <p className="text-sm text-muted-foreground">
            Start investing early in the financial year to maximize returns and spread out your investments. Consider
            ELSS funds for tax saving with potential for higher returns compared to traditional options.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
