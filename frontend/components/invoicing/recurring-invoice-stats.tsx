"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Repeat, Calendar, DollarSign, Clock } from "lucide-react"
import { useClientContext } from "@/contexts/ClientContext"
import { API_BASE_URL } from "@/lib/config"

interface RecurringInvoice {
  _id: string
  everyDays: number
  nextRun: string
  status?: string
  template: {
    amount?: number
  }
}

export function RecurringInvoiceStats() {
  const [invoices, setInvoices] = useState<RecurringInvoice[]>([])
  const [loading, setLoading] = useState(true)
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

        if (response.ok) {
          const data = await response.json()
          setInvoices(data)
        }
      } catch (err) {
        console.error("Error fetching recurring invoices:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecurringInvoices()
  }, [selectedClient])

  // Calculate stats from real data
  const activeCount = invoices.filter(inv => inv.status !== 'paused').length
  const pausedCount = invoices.filter(inv => inv.status === 'paused').length
  const monthlyRevenue = invoices
    .filter(inv => inv.status !== 'paused' && inv.everyDays === 30)
    .reduce((sum, inv) => sum + (inv.template?.amount || 0), 0)
  
  // Calculate next generation (invoices due in next 7 days)
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const dueNextWeek = invoices.filter(inv => {
    const nextRun = new Date(inv.nextRun)
    return nextRun >= today && nextRun <= nextWeek && inv.status !== 'paused'
  }).length

  const stats = [
    {
      title: "Active Recurring",
      value: loading ? "..." : activeCount.toString(),
      change: loading ? "Loading..." : `${invoices.length} total templates`,
      icon: Repeat,
      color: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: loading ? "..." : `₹${monthlyRevenue.toLocaleString()}`,
      change: "From recurring invoices",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Next Generation",
      value: loading ? "..." : dueNextWeek.toString(),
      change: "Due in next 7 days",
      icon: Calendar,
      color: "text-yellow-600",
    },
    {
      title: "Paused Templates",
      value: loading ? "..." : pausedCount.toString(),
      change: "Temporarily inactive",
      icon: Clock,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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
