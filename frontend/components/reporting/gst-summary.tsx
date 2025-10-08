import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const gstData = [
  {
    month: "December 2024",
    sales: 287000,
    gstCollected: 51660,
    purchases: 125000,
    gstPaid: 22500,
    netGst: 29160,
    status: "pending",
  },
  {
    month: "November 2024",
    sales: 235000,
    gstCollected: 42300,
    purchases: 98000,
    gstPaid: 17640,
    netGst: 24660,
    status: "filed",
  },
  {
    month: "October 2024",
    sales: 220000,
    gstCollected: 39600,
    purchases: 105000,
    gstPaid: 18900,
    netGst: 20700,
    status: "filed",
  },
]

export function GSTSummary() {
  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-green-50">
      <CardHeader className="pb-4 border-b border-green-100">
        <CardTitle className="text-green-900">GST Summary Report</CardTitle>
        <p className="text-sm text-green-700">Monthly GST collections and payments</p>
      </CardHeader>
      <CardContent className="pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>GST Collected</TableHead>
              <TableHead>GST Paid</TableHead>
              <TableHead>Net GST</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gstData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.month}</TableCell>
                <TableCell>₹{row.sales.toLocaleString()}</TableCell>
                <TableCell>₹{row.gstCollected.toLocaleString()}</TableCell>
                <TableCell>₹{row.gstPaid.toLocaleString()}</TableCell>
                <TableCell className="font-medium">₹{row.netGst.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "filed" ? "default" : "secondary"}>
                    {row.status === "filed" ? "Filed" : "Pending"}
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
