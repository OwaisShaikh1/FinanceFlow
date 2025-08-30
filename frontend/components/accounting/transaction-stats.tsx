import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

export function TransactionStats() {
  const stats = [
    {
      title: "Total Income",
      value: "₹2,45,000",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      period: "This month",
    },
    {
      title: "Total Expenses",
      value: "₹1,85,000",
      change: "+8.2%",
      trend: "up",
      icon: TrendingDown,
      period: "This month",
    },
    {
      title: "Net Profit",
      value: "₹60,000",
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      period: "This month",
    },
    {
      title: "Transactions",
      value: "156",
      change: "+23",
      trend: "up",
      icon: PieChart,
      period: "This month",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span>
              <span className="ml-1">{stat.period}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
