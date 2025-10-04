"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FileText, AlertTriangle } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from "recharts"
import { useEffect, useState } from "react"

const miniChartData = [
  { value: 120 }, { value: 135 }, { value: 148 }, { value: 162 }, 
  { value: 155 }, { value: 178 }, { value: 185 }
]

const expenseChartData = [
  { value: 85 }, { value: 92 }, { value: 98 }, { value: 105 }, 
  { value: 110 }, { value: 115 }, { value: 120 }
]

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
}

export default function DashboardStats() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Dashboard - Token available:', !!token); // Debug log
        
        const response = await fetch('http://localhost:5000/api/transactions/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Dashboard - Response status:', response.status); // Debug log
        
        if (response.ok) {
          const data = await response.json();
          console.log('Dashboard - Data received:', data); // Debug log
          setDashboardData(data);
        } else {
          console.error('Dashboard - Response not ok:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
  
  const stats = [
    {
      title: "Total Income",
      value: dashboardData ? formatCurrency(dashboardData.totalIncome) : "₹0",
      change: "+12.5%",
      trend: "up" as const,
      icon: TrendingUp,
      chartData: miniChartData,
      chartColor: "#10b981"
    },
    {
      title: "Total Expenses", 
      value: dashboardData ? formatCurrency(dashboardData.totalExpenses) : "₹0",
      change: "+8.2%",
      trend: "up" as const,
      icon: TrendingDown,
      chartData: expenseChartData,
      chartColor: "#ef4444"
    },
    {
      title: "Net Profit",
      value: dashboardData ? formatCurrency(dashboardData.netProfit) : "₹0",
      change: (dashboardData?.netProfit ?? 0) >= 0 ? "+18.7%" : "-12.3%",
      trend: (dashboardData?.netProfit ?? 0) >= 0 ? "up" as const : "down" as const,
      icon: TrendingUp,
    },
    {
      title: "Transactions",
      value: dashboardData?.transactionCount?.toString() || "0",
      change: "+23 This month",
      trend: "up" as const,
      icon: FileText,
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
