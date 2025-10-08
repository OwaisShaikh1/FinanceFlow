import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Receipt, Calculator, AlertTriangle } from "lucide-react"

export function TaxReportCards() {
  const stats = [
    {
      title: "GST Collected",
      value: "₹45,600",
      change: "This month",
      icon: Receipt,
      color: "text-blue-600",
    },
    {
      title: "GST Paid",
      value: "₹12,800",
      change: "Input tax credit",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "TDS Deducted",
      value: "₹8,500",
      change: "This quarter",
      icon: Calculator,
      color: "text-blue-600",
    },
    {
      title: "Pending Returns",
      value: "2",
      change: "Due this month",
      icon: AlertTriangle,
      color: "text-blue-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50 border-l-4 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">{stat.title}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
            <p className="text-xs text-blue-600">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
