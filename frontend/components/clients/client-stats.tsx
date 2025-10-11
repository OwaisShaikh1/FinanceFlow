"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react"

interface ClientStatsData {
  totalClients: number
  activeClients: number  
  pendingTasks: number
  overdueItems: number
  activePercentage: string
}

export function ClientStats() {
  const [statsData, setStatsData] = useState<ClientStatsData>({
    totalClients: 0,
    activeClients: 0,
    pendingTasks: 0,
    overdueItems: 0,
    activePercentage: '0'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch('http://localhost:5000/api/clients/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setStatsData(data.stats)
          }
        }
      } catch (error) {
        console.error('Error fetching client stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const stats = [
    {
      title: "Total Clients",
      value: loading ? "..." : statsData.totalClients.toString(),
      change: loading ? "Loading..." : "Registered users",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Clients", 
      value: loading ? "..." : statsData.activeClients.toString(),
      change: loading ? "Loading..." : `${statsData.activePercentage}% active`,
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      title: "Pending Tasks",
      value: loading ? "..." : statsData.pendingTasks.toString(),
      change: loading ? "Loading..." : "Setup incomplete",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      title: "Overdue Items",
      value: loading ? "..." : statsData.overdueItems.toString(),
      change: loading ? "Loading..." : "Needs attention",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:border-blue-200 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
            <p className="text-xs text-blue-600 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
