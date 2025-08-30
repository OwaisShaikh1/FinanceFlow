import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileText, AlertTriangle, CheckCircle } from "lucide-react"

export function TDSDashboard() {
  const stats = [
    {
      title: "TDS Deducted",
      value: "₹22,500",
      change: "This quarter",
      icon: Calculator,
      color: "text-blue-600",
    },
    {
      title: "TDS Deposited",
      value: "₹22,500",
      change: "All deposited",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Returns",
      value: "1",
      change: "Due 7th Jan",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Certificates Issued",
      value: "15",
      change: "Form 16A issued",
      icon: FileText,
      color: "text-purple-600",
    },
  ]

  const recentDeductions = [
    {
      date: "2024-12-15",
      payee: "ABC Consultants",
      amount: 50000,
      tdsRate: 10,
      tdsAmount: 5000,
      section: "194C",
      status: "deposited",
    },
    {
      date: "2024-12-10",
      payee: "XYZ Services",
      amount: 25000,
      tdsRate: 10,
      tdsAmount: 2500,
      section: "194J",
      status: "deposited",
    },
    {
      date: "2024-12-05",
      payee: "DEF Solutions",
      amount: 75000,
      tdsRate: 2,
      tdsAmount: 1500,
      section: "194C",
      status: "pending",
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
          <CardTitle>Recent TDS Deductions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>TDS Rate</TableHead>
                <TableHead>TDS Amount</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeductions.map((deduction, index) => (
                <TableRow key={index}>
                  <TableCell>{deduction.date}</TableCell>
                  <TableCell>{deduction.payee}</TableCell>
                  <TableCell>₹{deduction.amount.toLocaleString()}</TableCell>
                  <TableCell>{deduction.tdsRate}%</TableCell>
                  <TableCell>₹{deduction.tdsAmount.toLocaleString()}</TableCell>
                  <TableCell>{deduction.section}</TableCell>
                  <TableCell>
                    <Badge variant={deduction.status === "deposited" ? "default" : "secondary"}>
                      {deduction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
