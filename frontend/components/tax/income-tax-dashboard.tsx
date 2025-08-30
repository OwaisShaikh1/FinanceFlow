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
      color: "text-green-600",
    },
    {
      title: "Advance Tax Paid",
      value: "₹75,000",
      change: "60% of estimated tax",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Next Due Date",
      value: "15th Mar",
      change: "Q4 advance tax",
      icon: Calendar,
      color: "text-red-600",
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
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Saving Progress</CardTitle>
          <p className="text-sm text-muted-foreground">Track your investments under various tax-saving sections</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {taxSavingProgress.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Section {item.section}:   {item.description}</span>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.invested.toLocaleString()} / ₹{item.limit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">₹{item.saved.toLocaleString()} saved</span>
                  </div>
                </div>
                <Progress value={(item.invested / item.limit) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
