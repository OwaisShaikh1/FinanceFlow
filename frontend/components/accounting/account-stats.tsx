import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Building } from "lucide-react"

export function AccountStats() {
  const stats = [
    {
      title: "Total Assets",
      value: "₹4,60,000",
      change: "+5.2%",
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Total Liabilities",
      value: "₹85,000",
      change: "-2.1%",
      icon: TrendingDown,
      color: "text-red-600",
    },
    {
      title: "Owner's Equity",
      value: "₹3,75,000",
      change: "+8.5%",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Active Accounts",
      value: "24",
      change: "+2",
      icon: DollarSign,
      color: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
            <p className={`text-xs ${stat.color}`}>{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
