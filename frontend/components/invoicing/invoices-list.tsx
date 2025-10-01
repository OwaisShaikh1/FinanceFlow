"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Download, Send, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useInvoiceFilters } from "@/contexts/FilterContext"
import { TableSkeleton } from "@/components/ui/skeleton-presets"
import { useSkeletonPreview } from "@/hooks/use-skeleton-preview"
import { API_BASE_URL } from "@/lib/config"

interface Invoice {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  clientName: string
  subtotal: number
  totalGst: number
  grandTotal: number
  status: string
}

export function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { filters } = useInvoiceFilters()
  const skeletonPreview = useSkeletonPreview()

  useEffect(() => {
    if (skeletonPreview) {
      const t = setTimeout(() => setLoading(false), 2000)
      return () => clearTimeout(t)
    }
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/invoice`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) throw new Error(`Error: ${res.status}`)

        const data = await res.json()
        setInvoices(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch invoices")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [skeletonPreview])

  // Apply filters
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = filters.search
      ? invoice.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(filters.search.toLowerCase())
      : true
    const matchesStatus = filters.status === "all" ? true : invoice.status === filters.status
    const matchesClient = filters.client === "all" ? true : invoice.clientName.toLowerCase().includes(filters.client.toLowerCase())

    const invoiceDate = new Date(invoice.invoiceDate)
    const matchesFrom = filters.dateFrom ? invoiceDate >= filters.dateFrom : true
    const matchesTo = filters.dateTo ? invoiceDate <= filters.dateTo : true

    return matchesSearch && matchesStatus && matchesClient && matchesFrom && matchesTo
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "default"
      case "sent": return "secondary"
      case "overdue": return "destructive"
      case "draft": return "outline"
      default: return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "Paid"
      case "sent": return "Sent"
      case "overdue": return "Overdue"
      case "draft": return "Draft"
      default: return status
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton
            columns={["Invoice #","Date","Due Date","Client","Amount","GST","Total","Status","Actions"]}
            rows={8}
          />
        </CardContent>
      </Card>
    )
  }
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!filteredInvoices || filteredInvoices.length === 0) {
    return <p className="p-4">No invoices found.</p>
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
            {filteredInvoices.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN") : "-"}</TableCell>
                <TableCell>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-IN") : "-"}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>₹{Number(invoice.subtotal ?? 0).toLocaleString("en-IN")}</TableCell>
                <TableCell>₹{Number(invoice.totalGst ?? 0).toLocaleString("en-IN")}</TableCell>
                <TableCell className="font-medium">₹{Number(invoice.grandTotal ?? 0).toLocaleString("en-IN")}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(invoice.status)}>
                    {getStatusText(invoice.status)}
                  </Badge>
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
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" /> Send
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" /> Download PDF
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
