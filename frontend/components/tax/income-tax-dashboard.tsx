import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calculator, PiggyBank, FileText, Calendar } from "lucide-react"

export function IncomeTaxDashboard() {
  const stats = [
    {
      title: "Estimated Annual Tax",
      value: "₹1,25,000",
      change: "Based on current income",
      icon: Calculator,
      color: "text-blue-600",
    },
    {
      title: "Tax Saved (80C)",
      value: "₹46,800",
      change: "₹1,50,000 invested",
      icon: PiggyBank,
      color: "text-blue-600",
    },
    {
      title: "Advance Tax Paid",
      value: "₹75,000",
      change: "60% of estimated tax",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Next Due Date",
      value: "15th Mar",
      change: "Q4 advance tax",
      icon: Calendar,
      color: "text-blue-600",
    },
  ]

  const taxSavingProgress = [
  { 
    section: "80C", 
    invested: 150000, 
    limit: 150000, 
    saved: 46800, 
    description: "Investments in ELSS, PPF, LIC, etc." 
  },
  { 
    section: "80D", 
    invested: 25000, 
    limit: 25000, 
    saved: 7800, 
    description: "Health insurance premium for self/family" 
  },
  { 
    section: "80G", 
    invested: 10000, 
    limit: 50000, 
    saved: 3120, 
    description: "Donations to charitable institutions" 
  },
  { 
    section: "80E", 
    invested: 0, 
    limit: 0, 
    saved: 0, 
    description: "Education loan interest repayment" 
  },
]


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
              <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
              <p className="text-xs text-blue-600">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PiggyBank className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Tax Saving Progress</CardTitle>
              <p className="text-sm text-blue-700">Track your investments under various tax-saving sections</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {taxSavingProgress.map((item, index) => (
              <div key={index} className="space-y-3 p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-blue-900">Section {item.section}</span>
                    <p className="text-xs text-blue-600 mt-1">{item.description}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      ₹{item.invested.toLocaleString()} / ₹{item.limit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">₹{item.saved.toLocaleString()} saved</span>
                  </div>
                </div>
                <Progress 
                  value={(item.invested / item.limit) * 100} 
                  className="h-3 bg-blue-100 [&_div]:bg-blue-600" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
