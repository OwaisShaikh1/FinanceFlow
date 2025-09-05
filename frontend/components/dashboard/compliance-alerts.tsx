import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, FileText, Clock } from "lucide-react"

export default function ComplianceAlerts() {
  const alerts = [
    {
      id: 1,
      title: "GST Return Filing Due",
      description: "GSTR-3B for November 2024",
      dueDate: "20th December 2024",
      priority: "high",
      type: "gst",
      icon: AlertTriangle,
    },
    {
      id: 2,
      title: "TDS Return Due",
      description: "Quarterly TDS return filing",
      dueDate: "31st December 2024",
      priority: "medium",
      type: "tds",
      icon: FileText,
    },
    {
      id: 3,
      title: "Advance Tax Payment",
      description: "Q3 advance tax payment due",
      dueDate: "15th December 2024",
      priority: "high",
      type: "tax",
      icon: Calendar,
    },
    {
      id: 4,
      title: "Invoice Follow-up",
      description: "3 invoices overdue by 30+ days",
      dueDate: "Immediate action required",
      priority: "medium",
      type: "invoice",
      icon: Clock,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Compliance Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        alert.priority === "high" ? "bg-destructive/10" : "bg-secondary/10"
                      }`}
                    >
                      <alert.icon
                        className={`h-4 w-4 ${
                          alert.priority === "high" ? "text-destructive" : "text-secondary-foreground"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {alert.dueDate}</p>
                  </div>
                </div>
                <Badge variant={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
              </div>
              <div className="flex justify-end">
                <Button size="sm" variant="outline">
                  Take Action
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
