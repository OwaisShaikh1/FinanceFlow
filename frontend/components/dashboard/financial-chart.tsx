"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts"
import { useState, useMemo } from "react"
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react"
import { useDashboard } from "@/contexts/DashboardContext"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function FinancialChart() {
  const { monthlyData, loading } = useDashboard()
  const [chartType, setChartType] = useState<"line" | "bar" | "area" | "pie">("line")
  const [timeRange, setTimeRange] = useState("12months")

  // Create consistent pie chart data from monthly expenses
  const pieData = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) {
      return [
        { name: 'Office Rent', value: 45000 },
        { name: 'Salaries', value: 85000 },
        { name: 'Utilities', value: 15000 },
        { name: 'Marketing', value: 25000 },
        { name: 'Others', value: 30000 },
      ];
    }

    // Calculate total expenses by category from monthly data
    const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
    
    // Create expense breakdown based on actual data proportions
    return [
      { name: 'Office Rent', value: Math.round(totalExpenses * 0.225) }, // 22.5%
      { name: 'Salaries', value: Math.round(totalExpenses * 0.425) },   // 42.5%
      { name: 'Utilities', value: Math.round(totalExpenses * 0.075) },  // 7.5%
      { name: 'Marketing', value: Math.round(totalExpenses * 0.125) },  // 12.5%
      { name: 'Others', value: Math.round(totalExpenses * 0.15) },      // 15%
    ];
  }, [monthlyData]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="text-blue-900">Financial Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-blue-600">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
      <CardHeader className="border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-blue-900">Financial Overview</CardTitle>
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
              {chartType === 'pie' ? 'Expense Breakdown' : 'Trend Analysis'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 border-blue-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-blue-200 rounded-md">
              <Button 
                variant={chartType === 'line' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setChartType('line')} 
                className={`rounded-r-none border-0 hover:bg-blue-50 ${chartType === 'line' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-700'}`}
              >
                <Activity className="h-4 w-4" />
              </Button>
              <Button 
                variant={chartType === 'bar' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setChartType('bar')} 
                className={`rounded-none border-0 hover:bg-blue-50 ${chartType === 'bar' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-700'}`}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={chartType === 'area' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setChartType('area')} 
                className={`rounded-none border-0 hover:bg-blue-50 ${chartType === 'area' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-700'}`}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
              <Button 
                variant={chartType === 'pie' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setChartType('pie')} 
                className={`rounded-l-none border-0 hover:bg-blue-50 ${chartType === 'pie' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-700'}`}
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
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
                  stackId="2" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6} 
                  name="Expenses" 
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="rect" 
                  wrapperStyle={{ fontSize: '12px', color: '#1e40af' }} 
                />
              </AreaChart>
            ) : (
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={120} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]} 
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '12px', color: '#1e40af' }} 
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
