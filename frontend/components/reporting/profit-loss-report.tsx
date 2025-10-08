"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
  description: string;
}

interface ProfitLossItem {
  account: string;
  amount: number;
  percentage: string;
}

interface ProfitLossData {
  period: {
    startDate: string;
    endDate: string;
    description: string;
  };
  revenue: ProfitLossItem[];
  expenses: ProfitLossItem[];
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
  };
}

interface ProfitLossReportProps {
  transactions?: Transaction[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function ProfitLossReport({ transactions = [], loading = false, onRefresh }: ProfitLossReportProps) {
  const [data, setData] = useState<ProfitLossData | null>(null);

  const processProfitLossData = () => {
    try {
      console.log('=== DEBUGGING PROFIT LOSS DATA ===');
      console.log('Raw transactions received:', transactions);
      console.log('Number of transactions:', transactions.length);
      
      // Check each transaction type
      transactions.forEach((tx, index) => {
        console.log(`Transaction ${index}:`, {
          id: tx._id,
          type: tx.type,
          amount: tx.amount,
          date: tx.date,
          category: tx.category,
          description: tx.description
        });
      });

      // Process transactions to create profit & loss data
      const currentDate = new Date();
      // Let's include the last 3 months to capture more data for testing
      const startOfPeriod = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
      const endOfPeriod = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      console.log('Date filter range:', { 
        startOfPeriod: startOfPeriod.toISOString(), 
        endOfPeriod: endOfPeriod.toISOString(),
        currentDate: currentDate.toISOString()
      });
      
      // Filter transactions for the period (last 3 months)
      const periodTransactions = transactions.filter((tx: Transaction) => {
        const txDate = new Date(tx.date);
        const isInRange = txDate >= startOfPeriod && txDate <= endOfPeriod;
        console.log('Transaction date check:', {
          id: tx._id,
          date: tx.date,
          txDate: txDate.toISOString(),
          isInRange,
          type: tx.type,
          amount: tx.amount,
          category: tx.category
        });
        return isInRange;
      });

      console.log('Filtered period transactions:', periodTransactions);

      // Process revenue transactions
      const revenueTransactions = periodTransactions.filter((tx: Transaction) => tx.type === 'income');
      const expenseTransactions = periodTransactions.filter((tx: Transaction) => tx.type === 'expense');

      console.log('Revenue transactions:', revenueTransactions);
      console.log('Expense transactions:', expenseTransactions);

      // Group revenue by category
      const revenueByCategory: { [key: string]: number } = {};
      let totalRevenue = 0;

      revenueTransactions.forEach((tx: Transaction) => {
        const category = tx.category || 'Other Income';
        revenueByCategory[category] = (revenueByCategory[category] || 0) + tx.amount;
        totalRevenue += tx.amount;
      });

      // Group expenses by category
      const expensesByCategory: { [key: string]: number } = {};
      let totalExpenses = 0;

      expenseTransactions.forEach((tx: Transaction) => {
        const category = tx.category || 'Other Expenses';
        const amount = Math.abs(tx.amount);
        expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
        totalExpenses += amount;
      });

      console.log('Grouped expenses by category:', expensesByCategory);
      console.log('Total expenses calculated:', totalExpenses);

      // Format data for the component
      const revenue = Object.entries(revenueByCategory).map(([account, amount]) => ({
        account,
        amount,
        percentage: totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : "0"
      }));

      const expenses = Object.entries(expensesByCategory).map(([account, amount]) => ({
        account,
        amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : "0"
      }));

      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      const processedData: ProfitLossData = {
        period: {
          startDate: startOfPeriod.toISOString().split('T')[0],
          endDate: endOfPeriod.toISOString().split('T')[0],
          description: `${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Profit & Loss (Last 3 Months)`
        },
        revenue,
        expenses,
        summary: {
          totalRevenue,
          totalExpenses,
          netProfit,
          profitMargin
        }
      };

      console.log('Processed P&L data:', processedData);
      setData(processedData);

    } catch (err: any) {
      console.error('P&L data processing error:', err);
      setData(null);
    }
  };

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      processProfitLossData();
    }
  }, [transactions]);

  // Since we're using props, we don't need the original API fetch
  useEffect(() => {
    // Only fetch if no transactions provided and we have onRefresh
    if ((!transactions || transactions.length === 0) && onRefresh) {
      onRefresh();
    }
  }, [transactions, onRefresh]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading report...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="text-blue-900">Profit & Loss Statement</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-blue-600">No data available</p>
            {onRefresh && (
              <Button 
                onClick={onRefresh} 
                variant="outline" 
                className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-pdf-section="profit-loss-statement" className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-900">Profit & Loss Statement</CardTitle>
            <p className="text-sm text-blue-600">
              For the period: {data.period.description}
            </p>
          </div>
          {onRefresh && (
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Revenue Section */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">Revenue</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-blue-200">
                  <TableHead className="text-blue-800">Account</TableHead>
                  <TableHead className="text-right text-blue-800">Amount</TableHead>
                  <TableHead className="text-right text-blue-800">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.revenue.map((item, index) => (
                  <TableRow key={index} className="hover:bg-blue-50/50 border-blue-100">
                    <TableCell className="text-blue-800">{item.account}</TableCell>
                    <TableCell className="text-right text-blue-800">₹{item.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-blue-800">{item.percentage}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 border-blue-300 font-semibold bg-blue-50/50">
                  <TableCell className="text-blue-900">Total Revenue</TableCell>
                  <TableCell className="text-right text-blue-900">₹{data.summary.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-blue-900">100.0%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Expenses Section */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">Expenses</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-blue-200">
                  <TableHead className="text-blue-800">Account</TableHead>
                  <TableHead className="text-right text-blue-800">Amount</TableHead>
                  <TableHead className="text-right text-blue-800">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.expenses.map((item, index) => (
                  <TableRow key={index} className="hover:bg-blue-50/50 border-blue-100">
                    <TableCell className="text-blue-800">{item.account}</TableCell>
                    <TableCell className="text-right text-blue-800">₹{item.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-blue-800">{item.percentage}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 border-blue-300 font-semibold bg-blue-50/50">
                  <TableCell className="text-blue-900">Total Expenses</TableCell>
                  <TableCell className="text-right text-blue-900">₹{data.summary.totalExpenses.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-blue-900">100.0%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Net Profit */}
          <div className="border-t-2 border-blue-300 pt-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded p-4">
            <div className="flex justify-between items-center text-xl font-bold text-blue-900">
              <span>Net Profit</span>
              <span className={data.summary.netProfit >= 0 ? "text-green-700" : "text-red-600"}>
                ₹{data.summary.netProfit.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Profit Margin: {data.summary.profitMargin}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
