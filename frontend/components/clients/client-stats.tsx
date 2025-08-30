import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function ClientStats() {
  const stats = [
    {
      title: "Total Clients",
      value: "24",
      change: "+2 this month",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Clients",
      value: "22",
      change: "91.7% active",
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      title: "Pending Tasks",
      value: "8",
      change: "3 due today",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      title: "Overdue Items",
      value: "2",
      change: "Needs attention",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
