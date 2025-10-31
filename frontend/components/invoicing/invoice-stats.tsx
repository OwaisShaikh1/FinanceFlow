"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useClientContext } from "@/contexts/ClientContext"
import { API_BASE_URL } from "@/lib/config"

interface InvoiceStats {
  total: number
  paid: number
  pending: number
  overdue: number
  pendingAmount: number
  overdueAmount: number
  paymentRate: number
  monthlyGrowth: number
}

export function InvoiceStats() {
  const [stats, setStats] = useState<InvoiceStats>({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    paymentRate: 0,
    monthlyGrowth: 0
  })
  const [loading, setLoading] = useState(true)
  const { selectedClient } = useClientContext()

  useEffect(() => {
    const fetchInvoiceStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        // Build query params for client filtering (using clientId for consistency)
        const queryParams = selectedClient?.id 
          ? `?clientId=${selectedClient.id}` 
          : ''

        const response = await fetch(`${API_BASE_URL}/api/invoice/stats${queryParams}`, {
          method: "GET",
          headers,
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching invoice stats:", error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    fetchInvoiceStats()
  }, [selectedClient]) // Re-fetch when client changes

  const statsCards = [
    {
      title: "Total Invoices",
      value: loading ? "..." : stats.total.toString(),
      change: loading ? "Loading..." : `${stats.monthlyGrowth >= 0 ? '+' : ''}${stats.monthlyGrowth} this month`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Paid Invoices",
      value: loading ? "..." : stats.paid.toString(),
      change: loading ? "Loading..." : `${Math.round(stats.paymentRate)}% payment rate`,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Invoices",
      value: loading ? "..." : stats.pending.toString(),
      change: loading ? "Loading..." : `₹${stats.pendingAmount.toLocaleString()} pending`,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Overdue Invoices",
      value: loading ? "..." : stats.overdue.toString(),
      change: loading ? "Loading..." : `₹${stats.overdueAmount.toLocaleString()} overdue`,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50 transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
            <p className="text-xs text-blue-600">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
