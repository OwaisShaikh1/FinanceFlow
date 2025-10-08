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
import { InvoiceEditModal } from "./invoice-edit-modal"
import { Invoice, InvoiceItem } from "@/types/invoice"

export function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null)
  const { filters } = useInvoiceFilters()
  const skeletonPreview = useSkeletonPreview()

  useEffect(() => {
    if (skeletonPreview) {
      const t = setTimeout(() => setLoading(false), 2000)
      return () => clearTimeout(t)
    }
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const res = await fetch(`http://localhost:5000/api/invoice`, {
          method: "GET",
          headers,
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

  // Update invoice status
  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    try {
      setUpdatingStatus(invoiceId)
      
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`http://localhost:5000/api/invoice/${invoiceId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      const result = await response.json()
      console.log('Status updated:', result)

      // Refresh the invoice list
      const updatedInvoices = invoices.map(inv => 
        inv._id === invoiceId ? { ...inv, status: newStatus } : inv
      )
      setInvoices(updatedInvoices)
      
    } catch (error: any) {
      console.error('Error updating status:', error)
      setError(`Failed to update status: ${error.message}`)
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Handle invoice editing
  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsEditModalOpen(true)
  }

  const handleInvoiceUpdated = (updatedInvoice: Invoice) => {
    const updatedInvoices = invoices.map(inv => 
      inv._id === updatedInvoice._id ? updatedInvoice : inv
    )
    setInvoices(updatedInvoices)
  }

  // Handle PDF download
  const handleDownloadPdf = async (invoiceId: string) => {
    try {
      setDownloadingPdf(invoiceId)
      
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = {}
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`http://localhost:5000/api/invoice/${invoiceId}/pdf`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('content-disposition')
      let filename = `Invoice-${invoiceId}.pdf`
      
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '')
        }
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
    } catch (error: any) {
      console.error('Error downloading PDF:', error)
      alert(`Failed to download PDF: ${error.message}`)
    } finally {
      setDownloadingPdf(null)
    }
  }

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
    switch (status.toLowerCase()) {
      case "draft": return "outline"      // Gray outline
      case "final": return "secondary"    // Blue/Gray solid
      case "sent": return "default"       // Blue solid  
      case "paid": return "default"       // Green-like
      case "overdue": return "destructive" // Red
      default: return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft": return "Draft"
      case "final": return "Final"  
      case "sent": return "Sent"
      case "paid": return "Paid"
      case "overdue": return "Overdue"
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
    <>
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
                  <Badge 
                    variant={getStatusColor(invoice.status)}
                    className={`
                      ${invoice.status === 'DRAFT' ? 'bg-gray-100 text-gray-800 border-gray-300' : ''}
                      ${invoice.status === 'FINAL' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
                      ${invoice.status === 'SENT' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                      ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                    `}
                  >
                    {getStatusText(invoice.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* Status Action Buttons */}
                    {invoice.status === 'DRAFT' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={() => updateInvoiceStatus(invoice._id, 'FINAL')}
                        disabled={updatingStatus === invoice._id}
                      >
                        {updatingStatus === invoice._id ? 'Updating...' : 'Finalize'}
                      </Button>
                    )}
                    {invoice.status === 'FINAL' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                        onClick={() => updateInvoiceStatus(invoice._id, 'SENT')}
                        disabled={updatingStatus === invoice._id}
                      >
                        {updatingStatus === invoice._id ? 'Updating...' : 'Send'}
                      </Button>
                    )}
                    {invoice.status === 'SENT' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-green-300 text-green-600 hover:bg-green-50"
                        onClick={() => updateInvoiceStatus(invoice._id, 'PAID')}
                        disabled={updatingStatus === invoice._id}
                      >
                        {updatingStatus === invoice._id ? 'Updating...' : 'Mark Paid'}
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownloadPdf(invoice._id)}
                      disabled={downloadingPdf === invoice._id}
                    >
                      {downloadingPdf === invoice._id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPdf(invoice._id)}>
                          <Download className="mr-2 h-4 w-4" /> Download Tax Pro PDF
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

    {/* Edit Modal */}
    <InvoiceEditModal 
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      invoice={editingInvoice}
      onUpdate={handleInvoiceUpdated}
    />
  </>
  )
}
