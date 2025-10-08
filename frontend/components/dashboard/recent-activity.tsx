import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CreditCard, Receipt, Users } from "lucide-react"

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "invoice",
      title: "Invoice #INV-001 created",
      description: "Invoice for ABC Corp - ₹25,000",
      time: "2 hours ago",
      icon: FileText,
      status: "pending",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment received",
      description: "From XYZ Ltd - ₹15,000",
      time: "4 hours ago",
      icon: CreditCard,
      status: "completed",
    },
    {
      id: 3,
      type: "expense",
      title: "Expense recorded",
      description: "Office supplies - ₹2,500",
      time: "1 day ago",
      icon: Receipt,
      status: "completed",
    },
    {
      id: 4,
      type: "client",
      title: "New client added",
      description: "DEF Industries",
      time: "2 days ago",
      icon: Users,
      status: "completed",
    },
  ]

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="text-blue-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900">{activity.title}</p>
                <p className="text-sm text-blue-600">{activity.description}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <Badge variant={activity.status === "pending" ? "secondary" : "default"} className="mb-1">
                  {activity.status}
                </Badge>
                <p className="text-xs text-blue-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
