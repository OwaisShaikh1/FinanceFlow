import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pause, Edit, Trash2, Eye } from "lucide-react"

const mockRecurringInvoices = [
  {
    id: "REC-001",
    client: "ABC Corporation",
    template: "Monthly Retainer",
    amount: 25000,
    frequency: "Monthly",
    nextDate: "2024-12-20",
    status: "active",
    totalGenerated: 12,
  },
  {
    id: "REC-002",
    client: "XYZ Limited",
    template: "Quarterly Consulting",
    amount: 75000,
    frequency: "Quarterly",
    nextDate: "2025-01-15",
    status: "active",
    totalGenerated: 4,
  },
  {
    id: "REC-003",
    client: "DEF Industries",
    template: "Annual Maintenance",
    amount: 120000,
    frequency: "Yearly",
    nextDate: "2025-03-01",
    status: "paused",
    totalGenerated: 2,
  },
  {
    id: "REC-004",
    client: "GHI Enterprises",
    template: "Weekly Support",
    amount: 8000,
    frequency: "Weekly",
    nextDate: "2024-12-18",
    status: "active",
    totalGenerated: 48,
  },
]

export function RecurringInvoicesList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "expired":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "Weekly":
        return "bg-blue-100 text-blue-800"
      case "Monthly":
        return "bg-green-100 text-green-800"
      case "Quarterly":
        return "bg-yellow-100 text-yellow-800"
      case "Yearly":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="text-blue-900">Recurring Invoice Templates</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Template Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Date</TableHead>
              <TableHead>Generated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRecurringInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{invoice.template}</TableCell>
                <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getFrequencyColor(invoice.frequency)}>{invoice.frequency}</Badge>
                </TableCell>
                <TableCell>{invoice.nextDate}</TableCell>
                <TableCell>{invoice.totalGenerated} invoices</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(invoice.status)}>
                    {invoice.status === "active" ? "Active" : "Paused"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      {invoice.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
