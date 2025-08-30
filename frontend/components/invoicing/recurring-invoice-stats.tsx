import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Repeat, Calendar, DollarSign, Clock } from "lucide-react"

export function RecurringInvoiceStats() {
  const stats = [
    {
      title: "Active Recurring",
      value: "12",
      change: "+2 this month",
      icon: Repeat,
      color: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: "₹2,45,000",
      change: "From recurring invoices",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Next Generation",
      value: "5",
      change: "Due in 3 days",
      icon: Calendar,
      color: "text-yellow-600",
    },
    {
      title: "Paused Templates",
      value: "2",
      change: "Temporarily inactive",
      icon: Clock,
      color: "text-red-600",
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
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
