"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { useState, useEffect } from "react"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
  description: string;
}

interface ExpenseData {
  name: string;
  value: number;
  color: string;
}

interface IncomeData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface ProfitLossChartProps {
  transactions?: Transaction[];
  loading?: boolean;
  onRefresh?: () => void;
}

const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"];

export function ProfitLossChart({ transactions = [], loading = false, onRefresh }: ProfitLossChartProps) {
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const processChartData = () => {
    try {
      console.log('Processing chart data from transactions:', transactions);
      
      // Process breakdown for current period (last 3 months to match report)
      const currentDate = new Date();
      const startOfPeriod = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
      const endOfPeriod = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const periodExpenses = transactions.filter((tx: Transaction) => {
        const txDate = new Date(tx.date);
        return tx.type === 'expense' && txDate >= startOfPeriod && txDate <= endOfPeriod;
      });

      const periodIncomes = transactions.filter((tx: Transaction) => {
        const txDate = new Date(tx.date);
        return tx.type === 'income' && txDate >= startOfPeriod && txDate <= endOfPeriod;
      });

      console.log('Period expenses for chart:', periodExpenses);
      console.log('Period incomes for chart:', periodIncomes);

      // Group expenses by category
      const expensesByCategory: { [key: string]: number } = {};
      periodExpenses.forEach((tx: Transaction) => {
        const category = tx.category || 'Other';
        const amount = Math.abs(tx.amount);
        expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
      });

      // Format expense data for pie chart
      const formattedExpenseData: ExpenseData[] = Object.entries(expensesByCategory)
        .map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value) // Sort by value descending
        .slice(0, 8); // Limit to top 8 categories

      setExpenseData(formattedExpenseData);

      // Group income by category
      const incomesByCategory: { [key: string]: number } = {};
      periodIncomes.forEach((tx: Transaction) => {
        const category = tx.category || 'Other Income';
        const amount = Math.abs(tx.amount);
        incomesByCategory[category] = (incomesByCategory[category] || 0) + amount;
      });

      // Format income data for pie chart
      const formattedIncomeData: IncomeData[] = Object.entries(incomesByCategory)
        .map(([name, value], index) => ({
          name,
          value,
          color: colors[(index + 4) % colors.length] // Offset colors to differentiate from expenses
        }))
        .sort((a, b) => b.value - a.value) // Sort by value descending
        .slice(0, 8); // Limit to top 8 categories

      setIncomeData(formattedIncomeData);

      // Process 3-month trend data
      const monthlyTrend: { [key: string]: { revenue: number; expenses: number } } = {};
      
      // Initialize last 3 months
      for (let i = 2; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyTrend[monthKey] = { revenue: 0, expenses: 0 };
      }

      // Process transactions for 3-month trend
      transactions.forEach((tx: Transaction) => {
        const txDate = new Date(tx.date);
        const monthKey = txDate.toLocaleDateString('en-US', { month: 'short' });
        
        if (monthlyTrend[monthKey] !== undefined) {
          if (tx.type === 'income') {
            monthlyTrend[monthKey].revenue += tx.amount;
          } else if (tx.type === 'expense') {
            monthlyTrend[monthKey].expenses += Math.abs(tx.amount);
          }
        }
      });

      // Format monthly data for bar chart
      const formattedMonthlyData: MonthlyData[] = Object.entries(monthlyTrend).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        expenses: data.expenses,
        profit: data.revenue - data.expenses
      }));

      setMonthlyData(formattedMonthlyData);

    } catch (err: any) {
      console.error('Chart data processing error:', err);
      
      // Fallback to empty data
      setExpenseData([]);
      setIncomeData([]);
      setMonthlyData([]);
    }
  };

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      processChartData();
    }
  }, [transactions]);

  // If no transactions provided and we have onRefresh, call it
  useEffect(() => {
    if ((!transactions || transactions.length === 0) && onRefresh) {
      onRefresh();
    }
  }, [transactions, onRefresh]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breakdown Analysis Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Income & Expense Breakdown</h3>
          <p className="text-sm text-gray-600">Category-wise analysis of your financial transactions</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Breakdown Chart */}
          <Card data-pdf-section="income-breakdown" className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Income Sources
                  </CardTitle>
                  <p className="text-sm text-green-600 mt-1">Revenue by category</p>
                </div>
                {onRefresh && (
                  <Button 
                    onClick={onRefresh} 
                    variant="outline" 
                    size="sm"
                    disabled={loading}
                    className="border-green-200 hover:bg-green-100"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                )}
              </div>
            </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {incomeData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs">{item.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  ₹{item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          {incomeData.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No income data available for current period
            </div>
          )}
        </CardContent>
      </Card>

          {/* Expense Breakdown Chart */}
          <Card data-pdf-section="expense-breakdown" className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-rose-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Expense Categories
                  </CardTitle>
                  <p className="text-sm text-red-600 mt-1">Spending by category</p>
                </div>
                {onRefresh && (
                  <Button 
                    onClick={onRefresh} 
                    variant="outline" 
                    size="sm"
                    disabled={loading}
                    className="border-red-200 hover:bg-red-100"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                )}
              </div>
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
                <span className="text-xs text-muted-foreground ml-auto">
                  ₹{item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          {expenseData.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No expense data available for current period
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>

      {/* 3-Month Trend Chart */}
      <Card data-pdf-section="month-trend" className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <CardTitle className="text-blue-800">3-Month Financial Trend</CardTitle>
          </div>
          <p className="text-sm text-blue-600 mt-1">Revenue, expenses, and profit trends</p>
        </CardHeader>
        <CardContent className="pt-4">
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
          {monthlyData.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No data available for 3-month trend
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
