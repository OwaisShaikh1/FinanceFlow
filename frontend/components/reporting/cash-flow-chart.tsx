"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const cashFlowData = [
  {
    category: "Operating",
    amount: 456000,
    color: "#22c55e",
  },
  {
    category: "Investing",
    amount: -55000,
    color: "#ef4444",
  },
  {
    category: "Financing",
    amount: -55000,
    color: "#f59e0b",
  },
]

export function CashFlowChart() {
  const formatCurrency = (value: number) => {
    return `₹${Math.abs(value / 1000)}K`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const isNegative = data.value < 0
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label} Activities`}</p>
          <p className={`text-sm ${isNegative ? "text-red-600" : "text-green-600"}`}>
            {isNegative ? "-" : ""}₹{Math.abs(data.value).toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">Cash flow by activity type</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {cashFlowData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {cashFlowData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.category} Activities</span>
              </div>
              <span className={`font-medium ${item.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                {item.amount >= 0 ? "+" : ""}₹{item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
