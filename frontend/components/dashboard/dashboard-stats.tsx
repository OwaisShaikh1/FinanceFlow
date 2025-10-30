"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FileText } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area } from "recharts"
import { useDashboard } from "@/contexts/DashboardContext"

const miniChartData = [
  { value: 120 }, { value: 135 }, { value: 148 }, { value: 162 }, 
  { value: 155 }, { value: 178 }, { value: 185 }
]

const expenseChartData = [
  { value: 85 }, { value: 92 }, { value: 98 }, { value: 105 }, 
  { value: 110 }, { value: 115 }, { value: 120 }
]

// Memoized individual stat card component
const StatCard = React.memo(({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  chartData, 
  chartColor 
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ComponentType<any>
  chartData: any[]
  chartColor: string
}) => (
  <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-lg transition-all duration-300">
    <CardHeader className="border-b border-blue-100 pb-3">
      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          <div className={`text-xs flex items-center gap-1 ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change}
          </div>
        </div>
        <div className="w-16 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                fill={chartColor} 
                strokeWidth={2}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardContent>
  </Card>
))

StatCard.displayName = 'StatCard'

function DashboardStats() {
  const { dashboardData, loading } = useDashboard()

  // useMemo for expensive calculations and data transformations
  const formatCurrency = useMemo(() => 
    (amount: number) => `₹${amount.toLocaleString("en-IN")}`,
  [])

  const stats = useMemo(() => {
    if (!dashboardData) return []
    
    return [
      {
        title: "Total Income",
        value: formatCurrency(dashboardData.totalIncome),
        change: "+12.5%",
        trend: "up" as const,
        icon: TrendingUp,
        chartData: miniChartData,
        chartColor: "#10b981"
      },
      {
        title: "Total Expenses", 
        value: formatCurrency(dashboardData.totalExpenses),
        change: "+8.2%",
        trend: "up" as const,
        icon: TrendingDown,
        chartData: expenseChartData,
        chartColor: "#ef4444"
      },
      {
        title: "Net Profit",
        value: formatCurrency(dashboardData.netProfit),
        change: "+15.3%",
        trend: "up" as const,
        icon: TrendingUp,
        chartData: miniChartData,
        chartColor: "#8b5cf6"
      },
      {
        title: "Transactions",
        value: dashboardData.transactionCount.toString(),
        change: "+23",
        trend: "up" as const,
        icon: FileText,
        chartData: miniChartData,
        chartColor: "#3b82f6"
      }
    ]
  }, [dashboardData, formatCurrency])

  if (loading || !dashboardData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse bg-gradient-to-br from-white to-blue-50 border-blue-100">
            <CardHeader className="border-b border-blue-100">
              <div className="h-4 bg-blue-200 rounded w-24"></div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-8 bg-blue-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-blue-100 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={`${stat.title}-${index}`}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          chartData={stat.chartData}
          chartColor={stat.chartColor}
        />
      ))}
    </div>
  )
}

// Export with React.memo to prevent unnecessary re-renders
export default React.memo(DashboardStats)
