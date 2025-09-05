import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FileText, AlertTriangle } from "lucide-react"

export default function DashboardStats() {
  const stats = [
    {
      title: "Total Income",
      value: "₹12,45,000",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Total Expenses",
      value: "₹8,75,000",
      change: "+8.2%",
      trend: "up",
      icon: TrendingDown,
    },
    {
      title: "Outstanding Invoices",
      value: "₹2,15,000",
      change: "-5.1%",
      trend: "down",
      icon: FileText,
    },
    {
      title: "Tax Due",
      value: "₹45,000",
      change: "Due in 15 days",
      trend: "neutral",
      icon: AlertTriangle,
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
            <p
              className={`text-xs ${
                stat.trend === "up"
                  ? "text-green-600"
                  : stat.trend === "down"
                    ? "text-red-600"
                    : "text-muted-foreground"
              }`}
            >
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
