import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, AlertTriangle, Calendar } from "lucide-react"

export function TaskStats() {
  const stats = [
    {
      title: "Total Tasks",
      value: "32",
      change: "+5 this week",
      icon: CheckSquare,
      color: "text-blue-600",
    },
    {
      title: "Due Today",
      value: "3",
      change: "Needs attention",
      icon: Calendar,
      color: "text-amber-600",
    },
    {
      title: "In Progress",
      value: "12",
      change: "37.5% of total",
      icon: Clock,
      color: "text-emerald-600",
    },
    {
      title: "Overdue",
      value: "2",
      change: "Urgent action",
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
