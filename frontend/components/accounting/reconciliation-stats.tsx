import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, DollarSign, Calendar } from "lucide-react"

export function ReconciliationStats() {
  const stats = [
    {
      title: "Matched Transactions",
      value: "23",
      total: "25",
      percentage: "92%",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Unmatched Items",
      value: "2",
      total: "25",
      percentage: "8%",
      icon: AlertCircle,
      color: "text-yellow-600",
    },
    {
      title: "Reconciliation Difference",
      value: "₹2,200",
      total: "",
      percentage: "",
      icon: DollarSign,
      color: "text-red-600",
    },
    {
      title: "Last Reconciled",
      value: "Dec 10",
      total: "2024",
      percentage: "5 days ago",
      icon: Calendar,
      color: "text-blue-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.total && `of ${stat.total}`} {stat.percentage}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
