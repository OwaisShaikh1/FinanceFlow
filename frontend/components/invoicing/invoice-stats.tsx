import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function InvoiceStats() {
  const stats = [
    {
      title: "Total Invoices",
      value: "45",
      change: "+5 this month",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Paid Invoices",
      value: "38",
      change: "84% payment rate",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Invoices",
      value: "5",
      change: "₹1,25,000 pending",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Overdue Invoices",
      value: "2",
      change: "₹45,000 overdue",
      icon: AlertCircle,
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
