import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const tdsData = [
  {
    quarter: "Q3 2024",
    totalPayments: 450000,
    tdsDeducted: 22500,
    tdsDeposited: 22500,
    status: "deposited",
    dueDate: "2025-01-07",
  },
  {
    quarter: "Q2 2024",
    totalPayments: 380000,
    tdsDeducted: 19000,
    tdsDeposited: 19000,
    status: "filed",
    dueDate: "2024-10-07",
  },
  {
    quarter: "Q1 2024",
    totalPayments: 320000,
    tdsDeducted: 16000,
    tdsDeposited: 16000,
    status: "filed",
    dueDate: "2024-07-07",
  },
]

export function TDSSummary() {
  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="pb-4 border-b border-purple-100">
        <CardTitle className="text-purple-900">TDS Summary Report</CardTitle>
        <p className="text-sm text-purple-700">Quarterly TDS deductions and deposits</p>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quarter</TableHead>
              <TableHead>Total Payments</TableHead>
              <TableHead>TDS Deducted</TableHead>
              <TableHead>TDS Deposited</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tdsData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.quarter}</TableCell>
                <TableCell>₹{row.totalPayments.toLocaleString()}</TableCell>
                <TableCell>₹{row.tdsDeducted.toLocaleString()}</TableCell>
                <TableCell>₹{row.tdsDeposited.toLocaleString()}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      row.status === "filed" ? "default" : row.status === "deposited" ? "secondary" : "destructive"
                    }
                  >
                    {row.status === "filed" ? "Filed" : row.status === "deposited" ? "Deposited" : "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
