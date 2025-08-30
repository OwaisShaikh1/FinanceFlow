import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, FileText, AlertTriangle, CheckCircle } from "lucide-react"

export function GSTDashboard() {
  const stats = [
    {
      title: "Current Month GST",
      value: "₹45,600",
      change: "Output GST collected",
      icon: Receipt,
      color: "text-green-600",
    },
    {
      title: "Input Tax Credit",
      value: "₹12,800",
      change: "Available for offset",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Net GST Payable",
      value: "₹32,800",
      change: "Due by 20th Dec",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Returns Filed",
      value: "11/12",
      change: "This financial year",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  const upcomingDeadlines = [
    {
      return: "GSTR-3B",
      period: "November 2024",
      dueDate: "20th December 2024",
      status: "pending",
      amount: "₹32,800",
    },
    {
      return: "GSTR-1",
      period: "November 2024",
      dueDate: "11th December 2024",
      status: "overdue",
      amount: "-",
    },
    {
      return: "GSTR-3B",
      period: "December 2024",
      dueDate: "20th January 2025",
      status: "upcoming",
      amount: "₹45,600",
    },
  ]

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Upcoming GST Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{deadline.return}</h4>
                    <p className="text-sm text-muted-foreground">Period: {deadline.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Due: {deadline.dueDate}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        deadline.status === "overdue"
                          ? "destructive"
                          : deadline.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {deadline.status}
                    </Badge>
                    {deadline.amount !== "-" && <span className="text-sm">{deadline.amount}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
