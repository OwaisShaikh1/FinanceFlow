"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useState } from "react"

const monthlyData = [
  { month: "Jan", income: 120000, expenses: 85000, profit: 35000 },
  { month: "Feb", income: 135000, expenses: 92000, profit: 43000 },
  { month: "Mar", income: 148000, expenses: 98000, profit: 50000 },
  { month: "Apr", income: 162000, expenses: 105000, profit: 57000 },
  { month: "May", income: 155000, expenses: 110000, profit: 45000 },
  { month: "Jun", income: 178000, expenses: 115000, profit: 63000 },
  { month: "Jul", income: 185000, expenses: 120000, profit: 65000 },
  { month: "Aug", income: 192000, expenses: 125000, profit: 67000 },
  { month: "Sep", income: 188000, expenses: 118000, profit: 70000 },
  { month: "Oct", income: 205000, expenses: 135000, profit: 70000 },
  { month: "Nov", income: 198000, expenses: 128000, profit: 70000 },
  { month: "Dec", income: 215000, expenses: 145000, profit: 70000 },
]

export function FinancialChart() {
  const [chartType, setChartType] = useState<"line" | "bar">("line")
  const [timeRange, setTimeRange] = useState("12months")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Financial Overview</CardTitle>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value: "line" | "bar") => setChartType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Profit" />
              </LineChart>
            ) : (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="income" fill="hsl(var(--chart-1))" name="Income" />
                <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses" />
                <Bar dataKey="profit" fill="hsl(var(--chart-3))" name="Profit" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
