"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, FileText, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface GSTData {
  currentMonthGST: number;
  inputTaxCredit: number;
  netGSTPayable: number;
  returnsFiled: number;
  totalReturns: number;
  upcomingDeadlines: Array<{
    return: string;
    period: string;
    dueDate: string;
    status: string;
    amount: string;
  }>;
}

export function GSTDashboard() {
  const [gstData, setGSTData] = useState<GSTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Frontend-only GST Dashboard with mock data
    const loadMockGSTData = () => {
      setLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        const mockData: GSTData = {
          currentMonthGST: 25000,
          inputTaxCredit: 8500,
          netGSTPayable: 16500,
          returnsFiled: 8,
          totalReturns: 12,
          upcomingDeadlines: [
            {
              return: "GSTR-1",
              period: "Oct 2025",
              dueDate: "11 Nov 2025",
              status: "pending",
              amount: "₹25,000"
            },
            {
              return: "GSTR-3B", 
              period: "Oct 2025",
              dueDate: "20 Nov 2025",
              status: "pending",
              amount: "₹16,500"
            }
          ]
        };
        
        setGSTData(mockData);
        setLoading(false);
      }, 800);
    };

    loadMockGSTData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading GST data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        {error}
      </div>
    );
  }

  if (!gstData) {
    return (
      <div className="text-center text-muted-foreground p-8">
        <p className="text-lg">No GST data available yet</p>
        <p className="text-sm">Start by adding transactions with GST information</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Current Month GST",
      value: `₹${gstData.currentMonthGST.toLocaleString()}`,
      change: "Output GST collected",
      icon: Receipt,
      color: "text-green-600",
    },
    {
      title: "Input Tax Credit",
      value: `₹${gstData.inputTaxCredit.toLocaleString()}`,
      change: "Available for offset",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Net GST Payable",
      value: `₹${gstData.netGSTPayable.toLocaleString()}`,
      change: `Due by ${new Date().getDate()}th ${new Date().toLocaleString('default', { month: 'short' })}`,
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Returns Filed",
      value: `${gstData.returnsFiled}/${gstData.totalReturns}`,
      change: "This financial year",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming GST Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gstData.upcomingDeadlines.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No upcoming GST deadlines
              </div>
            ) : (
              gstData.upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{deadline.return}</h4>
                    <p className="text-sm text-muted-foreground">Period: {deadline.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Due: {deadline.dueDate}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        deadline.status === "overdue"
                          ? "destructive"
                          : deadline.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {deadline.status}
                    </Badge>
                    {deadline.amount !== "-" && <span className="text-sm">{deadline.amount}</span>}
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
