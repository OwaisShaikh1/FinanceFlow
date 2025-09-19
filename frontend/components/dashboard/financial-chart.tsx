"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend,
  ComposedChart, ReferenceLine
} from "recharts"
import { useState } from "react"
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react"

const monthlyData = [
  { month: "Jan", income: 120000, expenses: 85000, profit: 35000, growth: 5.2 },
  { month: "Feb", income: 135000, expenses: 92000, profit: 43000, growth: 12.5 },
  { month: "Mar", income: 148000, expenses: 98000, profit: 50000, growth: 9.6 },
  { month: "Apr", income: 162000, expenses: 105000, profit: 57000, growth: 14.0 },
  { month: "May", income: 155000, expenses: 110000, profit: 45000, growth: -4.3 },
  { month: "Jun", income: 178000, expenses: 115000, profit: 63000, growth: 14.8 },
  { month: "Jul", income: 185000, expenses: 120000, profit: 65000, growth: 3.9 },
  { month: "Aug", income: 192000, expenses: 125000, profit: 67000, growth: 3.8 },
  { month: "Sep", income: 188000, expenses: 118000, profit: 70000, growth: -2.1 },
  { month: "Oct", income: 205000, expenses: 135000, profit: 70000, growth: 9.0 },
  { month: "Nov", income: 198000, expenses: 128000, profit: 70000, growth: -3.4 },
  { month: "Dec", income: 215000, expenses: 145000, profit: 70000, growth: 8.6 },
]

const expenseBreakdown = [
  { name: 'Office Rent', value: 45000, color: '#8884d8' },
  { name: 'Salaries', value: 85000, color: '#82ca9d' },
  { name: 'Utilities', value: 15000, color: '#ffc658' },
  { name: 'Marketing', value: 25000, color: '#ff7300' },
  { name: 'Others', value: 30000, color: '#00ff88' },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function FinancialChart() {
  const [chartType, setChartType] = useState<"line" | "bar" | "area" | "pie" | "composed">("line")
  const [timeRange, setTimeRange] = useState("12months")
  const [showGrowth, setShowGrowth] = useState(false)

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
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className="rounded-r-none border-0"
              >
                <Activity className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="rounded-none border-0"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'area' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('area')}
                className="rounded-none border-0"
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('pie')}
                className="rounded-l-none border-0"
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {chartType !== 'pie' && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Profit</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickFormatter={(value) => `₹${(value/1000)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    name="Income"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    name="Expenses"
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    name="Profit"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
              </LineChart>
            ) : chartType === "bar" ? (
              <BarChart data={monthlyData} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickFormatter={(value) => `₹${(value/1000)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="income" fill="#3b82f6" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : chartType === "area" ? (
              <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickFormatter={(value) => `₹${(value/1000)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Income"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                    name="Expenses"
                  />
              </AreaChart>
            ) : chartType === "pie" ? (
              <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
              </PieChart>
            ) : (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="income" stroke="#3b82f6" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
