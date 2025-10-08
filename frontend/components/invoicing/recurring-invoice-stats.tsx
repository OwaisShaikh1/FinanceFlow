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
        <Card key={index} className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
            <p className="text-xs text-blue-600">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
