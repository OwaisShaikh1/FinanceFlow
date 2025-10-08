"use client"

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

export default function DashboardStats() {
  const { dashboardData, loading } = useDashboard()

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

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`

  const stats = [
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
      change: dashboardData.netProfit >= 0 ? "+18.7%" : "-12.3%",
      trend: dashboardData.netProfit >= 0 ? "up" as const : "down" as const,
      icon: TrendingUp
    },
    {
      title: "Transactions",
      value: dashboardData.transactionCount.toString(),
      change: "+23 This month",
      trend: "up" as const,
      icon: FileText
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-blue-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
            <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                  {stat.trend === "down" && <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </p>
              </div>
              {stat.chartData && (
                <div className="h-12 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.chartData}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={stat.chartColor}
                        fill={stat.chartColor}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
