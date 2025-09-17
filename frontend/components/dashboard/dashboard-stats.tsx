"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FileText, AlertTriangle } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from "recharts"

const miniChartData = [
  { value: 120 }, { value: 135 }, { value: 148 }, { value: 162 }, 
  { value: 155 }, { value: 178 }, { value: 185 }
]

const expenseChartData = [
  { value: 85 }, { value: 92 }, { value: 98 }, { value: 105 }, 
  { value: 110 }, { value: 115 }, { value: 120 }
]

export default function DashboardStats() {
  const stats = [
    {
      title: "Total Income",
      value: "₹12,45,000",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      chartData: miniChartData,
      chartColor: "#10b981"
    },
    {
      title: "Total Expenses",
      value: "₹8,75,000",
      change: "+8.2%",
      trend: "up",
      icon: TrendingDown,
      chartData: expenseChartData,
      chartColor: "#ef4444"
    },
    {
      title: "Outstanding Invoices",
      value: "₹2,15,000",
      change: "-5.1%",
      trend: "down",
      icon: FileText,
    },
    {
      title: "Tax Due",
      value: "₹45,000",
      change: "Due in 15 days",
      trend: "neutral",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
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
