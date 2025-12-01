"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, AlertTriangle, Calendar } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

interface TaskStatsData {
  totalTasks: number
  tasksThisWeek: number
  dueToday: number
  inProgress: number
  inProgressPercentage: string
  overdue: number
}

export function TaskStats() {
  const [stats, setStats] = useState<TaskStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("No authentication token found")
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/tasks/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`)
        }

        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (err: any) {
        console.error("Error fetching task stats:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        Error loading task statistics. Please try again.
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks.toString(),
      change: `+${stats.tasksThisWeek} this week`,
      icon: CheckSquare,
      color: "text-blue-600",
    },
    {
      title: "Due Today",
      value: stats.dueToday.toString(),
      change: stats.dueToday > 0 ? "Needs attention" : "All clear",
      icon: Calendar,
      color: "text-amber-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress.toString(),
      change: `${stats.inProgressPercentage}% of total`,
      icon: Clock,
      color: "text-emerald-600",
    },
    {
      title: "Overdue",
      value: stats.overdue.toString(),
      change: stats.overdue > 0 ? "Urgent action" : "On track",
      icon: AlertTriangle,
      color: stats.overdue > 0 ? "text-red-600" : "text-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
