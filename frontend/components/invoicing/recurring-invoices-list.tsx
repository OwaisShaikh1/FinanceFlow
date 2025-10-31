"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pause, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useClientContext } from "@/contexts/ClientContext"
import { API_BASE_URL } from "@/lib/config"

interface RecurringInvoice {
  _id: string
  business: {
    _id: string
    name: string
  }
  template: {
    clientName?: string
    templateName?: string
    amount?: number
  }
  everyDays: number
  nextRun: string
  status?: string
  totalGenerated?: number
  createdAt: string
}

export function RecurringInvoicesList() {
  const [invoices, setInvoices] = useState<RecurringInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { selectedClient } = useClientContext()

  useEffect(() => {
    const fetchRecurringInvoices = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        // Build query params for client filtering (using clientId for consistency)
        const queryParams = selectedClient?.id 
          ? `?clientId=${selectedClient.id}` 
          : ''
        
        const response = await fetch(`${API_BASE_URL}/api/invoice/recurring${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch recurring invoices: ${response.status}`)
        }

        const data = await response.json()
        setInvoices(data)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching recurring invoices:", err)
        setError(err.message)
        setInvoices([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecurringInvoices()
  }, [selectedClient]) // Re-fetch when client changes

  const getFrequencyFromDays = (days: number) => {
    if (days === 7) return "Weekly"
    if (days === 30) return "Monthly"
    if (days === 90) return "Quarterly"
    if (days === 365) return "Yearly"
    return `Every ${days} days`
  }
  
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-blue-600">Loading recurring invoices...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No recurring invoices found</p>
            <p className="text-sm text-gray-500 mt-2">Create your first recurring invoice template</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template ID</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Template Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const frequency = getFrequencyFromDays(invoice.everyDays)
                const nextDate = new Date(invoice.nextRun).toLocaleDateString('en-IN')
                const templateId = `REC-${invoice._id.slice(-6).toUpperCase()}`
                
                return (
                  <TableRow key={invoice._id}>
                    <TableCell className="font-medium">{templateId}</TableCell>
                    <TableCell>{invoice.business?.name || 'N/A'}</TableCell>
                    <TableCell>{invoice.template?.templateName || invoice.template?.clientName || 'Unnamed Template'}</TableCell>
                    <TableCell>₹{(invoice.template?.amount || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getFrequencyColor(frequency)}>{frequency}</Badge>
                    </TableCell>
                    <TableCell>{nextDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status || "active")}>
                        {invoice.status === "paused" ? "Paused" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title={invoice.status === "paused" ? "Resume" : "Pause"}>
                          {invoice.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
