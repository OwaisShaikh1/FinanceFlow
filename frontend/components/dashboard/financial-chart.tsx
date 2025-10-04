"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts"
import { useState } from "react"
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react"
import { useDashboard } from "@/contexts/DashboardContext" // <-- import your context

const expenseBreakdown = [
  { name: 'Office Rent', value: 45000, color: '#8884d8' },
  { name: 'Salaries', value: 85000, color: '#82ca9d' },
  { name: 'Utilities', value: 15000, color: '#ffc658' },
  { name: 'Marketing', value: 25000, color: '#ff7300' },
  { name: 'Others', value: 30000, color: '#00ff88' },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function FinancialChart() {
  const { monthlyData, loading } = useDashboard()  // <-- get data from context
  const [chartType, setChartType] = useState<"line" | "bar" | "area" | "pie">("line")
  const [timeRange, setTimeRange] = useState("12months")

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Financial Overview</CardTitle>
            <Badge variant="outline" className="text-xs">
              {chartType === 'pie' ? 'Expense Breakdown' : 'Trend Analysis'}
            </Badge>
          </div>
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
            <div className="flex border rounded-md">
              <Button variant={chartType === 'line' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('line')} className="rounded-r-none border-0">
                <Activity className="h-4 w-4" />
              </Button>
              <Button variant={chartType === 'bar' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('bar')} className="rounded-none border-0">
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button variant={chartType === 'area' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('area')} className="rounded-none border-0">
                <TrendingUp className="h-4 w-4" />
              </Button>
              <Button variant={chartType === 'pie' ? 'default' : 'ghost'} size="sm" onClick={() => setChartType('pie')} className="rounded-l-none border-0">
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(value) => `₹${(value/1000)}K`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} labelFormatter={(label) => `Month: ${label}`} />
                <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} name="Income" dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" dot={{ fill: '#ef4444', r: 4 }} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Profit" dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            ) : chartType === "bar" ? (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(value) => `₹${(value/1000)}K`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} labelFormatter={(label) => `Month: ${label}`} />
                <Bar dataKey="income" fill="#3b82f6" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                <Bar dataKey="profit" fill="#10b981" name="Profit" />
              </BarChart>
            ) : chartType === "area" ? (
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} tickFormatter={(value) => `₹${(value/1000)}K`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} labelFormatter={(label) => `Month: ${label}`} />
                <Area type="monotone" dataKey="income" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Income" />
                <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expenses" />
              </AreaChart>
            ) : (
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                  {expenseBreakdown.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
