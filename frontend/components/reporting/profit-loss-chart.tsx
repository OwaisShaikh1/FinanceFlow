"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const expenseData = [
  { name: "Salaries", value: 85000, color: "#ef4444" },
  { name: "Rent", value: 36000, color: "#f97316" },
  { name: "Marketing", value: 18000, color: "#eab308" },
  { name: "Professional", value: 15000, color: "#22c55e" },
  { name: "Other", value: 26000, color: "#3b82f6" },
]

const monthlyData = [
  { month: "Oct", revenue: 220000, expenses: 165000, profit: 55000 },
  { month: "Nov", revenue: 235000, expenses: 175000, profit: 60000 },
  { month: "Dec", revenue: 287000, expenses: 180000, profit: 107000 },
]

export function ProfitLossChart() {
  return (
    <div className="space-y-6">
      <Card data-pdf-section="expense-breakdown">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card data-pdf-section="month-trend">
        <CardHeader>
          <CardTitle>3-Month Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue" />
                <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses" />
                <Bar dataKey="profit" fill="hsl(var(--chart-3))" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
