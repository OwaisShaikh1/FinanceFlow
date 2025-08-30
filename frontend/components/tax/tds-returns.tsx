"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react"

const tdsReturns = [
  {
    id: 1,
    type: "Form 24Q",
    quarter: "Q4 2023-24",
    dueDate: "2024-05-31",
    status: "pending",
    amount: 125000,
    deductees: 45,
  },
  {
    id: 2,
    type: "Form 26Q",
    quarter: "Q4 2023-24",
    dueDate: "2024-05-31",
    status: "pending",
    amount: 85000,
    deductees: 12,
  },
  {
    id: 3,
    type: "Form 24Q",
    quarter: "Q3 2023-24",
    dueDate: "2024-02-29",
    status: "filed",
    filedDate: "2024-02-25",
    amount: 110000,
    deductees: 42,
  },
  {
    id: 4,
    type: "Form 26Q",
    quarter: "Q3 2023-24",
    dueDate: "2024-02-29",
    status: "filed",
    filedDate: "2024-02-28",
    amount: 75000,
    deductees: 10,
  },
]

export function TDSReturns() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "filed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          TDS Returns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tdsReturns.map((returnItem) => (
            <div key={returnItem.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(returnItem.status)}
                <div>
                  <div className="font-medium">{returnItem.type}</div>
                  <div className="text-sm text-muted-foreground">{returnItem.quarter}</div>
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(returnItem.dueDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{returnItem.deductees} deductees</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">₹{returnItem.amount.toLocaleString()}</div>
                  <Badge className={getStatusColor(returnItem.status)}>{returnItem.status}</Badge>
                </div>
                <div className="flex gap-1">
                  {returnItem.status === "filed" ? (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
