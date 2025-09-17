"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Download, Send, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useInvoiceFilters } from "@/contexts/FilterContext"

const mockInvoices = [
  {
    id: "INV-001",
    date: "2024-12-15",
    dueDate: "2024-12-30",
    client: "ABC Corporation",
    amount: 25000,
    gstAmount: 4500,
    total: 29500,
    status: "paid",
  },
  {
    id: "INV-002",
    date: "2024-12-14",
    dueDate: "2024-12-29",
    client: "XYZ Limited",
    amount: 18000,
    gstAmount: 3240,
    total: 21240,
    status: "sent",
  },
  {
    id: "INV-003",
    date: "2024-12-13",
    dueDate: "2024-12-28",
    client: "DEF Industries",
    amount: 32000,
    gstAmount: 5760,
    total: 37760,
    status: "overdue",
  },
  {
    id: "INV-004",
    date: "2024-12-12",
    dueDate: "2024-12-27",
    client: "GHI Enterprises",
    amount: 15000,
    gstAmount: 2700,
    total: 17700,
    status: "draft",
  },
  {
    id: "INV-005",
    date: "2024-12-11",
    dueDate: "2024-12-26",
    client: "JKL Solutions",
    amount: 22000,
    gstAmount: 3960,
    total: 25960,
    status: "paid",
  },
]

export function InvoicesList() {
  const { filters } = useInvoiceFilters()

  // Apply filters
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch = filters.search
      ? invoice.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.client.toLowerCase().includes(filters.search.toLowerCase())
      : true
    const matchesStatus = filters.status === 'all' ? true : invoice.status === filters.status
    const matchesClient = filters.client === 'all' ? true : invoice.client.toLowerCase().includes(filters.client.toLowerCase())
    
    const invoiceDate = new Date(invoice.date)
    const matchesFrom = filters.dateFrom ? invoiceDate >= filters.dateFrom : true
    const matchesTo = filters.dateTo ? invoiceDate <= filters.dateTo : true
    
    return matchesSearch && matchesStatus && matchesClient && matchesFrom && matchesTo
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "sent":
        return "secondary"
      case "overdue":
        return "destructive"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid"
      case "sent":
        return "Sent"
      case "overdue":
        return "Overdue"
      case "draft":
        return "Draft"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                <TableCell>₹{invoice.gstAmount.toLocaleString()}</TableCell>
                <TableCell className="font-medium">₹{invoice.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
