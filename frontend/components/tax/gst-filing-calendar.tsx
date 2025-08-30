"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle } from "lucide-react"

const filingDates = [
  {
    date: "2024-04-11",
    type: "GSTR-1",
    description: "Monthly return for March 2024",
    status: "upcoming",
    daysLeft: 5,
  },
  {
    date: "2024-04-20",
    type: "GSTR-3B",
    description: "Monthly return for March 2024",
    status: "upcoming",
    daysLeft: 14,
  },
  {
    date: "2024-05-11",
    type: "GSTR-1",
    description: "Monthly return for April 2024",
    status: "future",
    daysLeft: 35,
  },
  {
    date: "2024-05-20",
    type: "GSTR-3B",
    description: "Monthly return for April 2024",
    status: "future",
    daysLeft: 44,
  },
  {
    date: "2024-03-20",
    type: "GSTR-3B",
    description: "Monthly return for February 2024",
    status: "overdue",
    daysLeft: -17,
  },
]

export function GSTFilingCalendar() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "future":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Calendar className="h-4 w-4 text-blue-600" />
    }
  }

  const sortedDates = filingDates.sort((a, b) => {
    if (a.status === "overdue" && b.status !== "overdue") return -1
    if (b.status === "overdue" && a.status !== "overdue") return 1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Filing Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedDates.map((filing, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(filing.status)}
                <div>
                  <div className="font-medium">{filing.type}</div>
                  <div className="text-sm text-muted-foreground">{filing.description}</div>
                  <div className="text-sm font-medium">{new Date(filing.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(filing.status)}>
                  {filing.status === "overdue"
                    ? `${Math.abs(filing.daysLeft)} days overdue`
                    : filing.status === "upcoming"
                      ? `${filing.daysLeft} days left`
                      : `${filing.daysLeft} days`}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
