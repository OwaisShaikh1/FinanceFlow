"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"
import { useEffect, useState } from "react"

interface TransactionData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
}

export function TransactionStats() {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/transactions/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTransactionData(data);
        }
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-200 h-3 w-16 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Income",
      value: `₹${transactionData?.totalIncome?.toLocaleString() || '0'}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: TrendingUp,
      period: "This month",
    },
    {
      title: "Total Expenses", 
      value: `₹${transactionData?.totalExpenses?.toLocaleString() || '0'}`,
      change: "+8.2%",
      trend: "up" as const,
      icon: TrendingDown,
      period: "This month",
    },
    {
      title: "Net Profit",
      value: `₹${Math.max(0, (transactionData?.netProfit || 0)).toLocaleString()}`,
      change: "+18.7%",
      trend: (transactionData?.netProfit || 0) >= 0 ? "up" as const : "down" as const,
      icon: DollarSign,
      period: "This month",
    },
    {
      title: "Transactions",
      value: transactionData?.transactionCount?.toString() || '0',
      change: "+23",
      trend: "up" as const,
      icon: PieChart,
      period: "This month",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
              <span className="ml-1">{stat.period}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}