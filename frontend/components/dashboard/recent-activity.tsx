import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CreditCard, Receipt, Users } from "lucide-react"

export function RecentActivity() {
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <Badge variant={activity.status === "pending" ? "secondary" : "default"} className="mb-1">
                  {activity.status}
                </Badge>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
