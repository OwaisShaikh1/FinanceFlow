"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileText, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { ENDPOINTS } from "@/lib/config"

interface TDSDashboardData {
  totalDeducted: number;
  totalPayment: number;
  totalEntries: number;
  statusCounts: { recorded: number };
  recentDeductions: Array<{
    _id: string;
    payeeName: string;
    paymentAmount: number;
    tdsAmount: number;
    netPayment: number;
    tdsSection: string;
    recordDate: string;
    tdsRate: number;
    applicableThreshold: number;
  }>;
}

export interface TDSDashboardRef {
  refreshDashboard: () => void;
}

export const TDSDashboard = forwardRef<TDSDashboardRef>((props, ref) => {
  const [dashboardData, setDashboardData] = useState<TDSDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback dummy data in case API fails
  const fallbackData = {
    totalDeducted: 25780,
    totalPayment: 486500,
    totalEntries: 8,
    statusCounts: { recorded: 8 },
    recentDeductions: [
      {
        _id: "1",
        payeeName: "Manager Consultancy",
        paymentAmount: 79000,
        tdsAmount: 3950,
        netPayment: 75050,
        tdsSection: "194D - Insurance Commission",
        recordDate: "2025-01-10",
        tdsRate: 5,
        applicableThreshold: 15000
      },
      {
        _id: "2",
        payeeName: "Tech Solutions Pvt Ltd",
        paymentAmount: 50000,
        tdsAmount: 5000,
        netPayment: 45000,
        tdsSection: "194J - Professional Services",
        recordDate: "2025-01-08",
        tdsRate: 10,
        applicableThreshold: 30000
      },
      {
        _id: "3",
        payeeName: "Design Agency",
        paymentAmount: 75000,
        tdsAmount: 7500,
        netPayment: 67500,
        tdsSection: "194J - Professional Services",
        recordDate: "2025-01-05",
        tdsRate: 10,
        applicableThreshold: 30000
      },
      {
        _id: "4",
        payeeName: "ABC Construction",
        paymentAmount: 99000,
        tdsAmount: 990,
        netPayment: 98010,
        tdsSection: "194C - Contractor Payments",
        recordDate: "2025-01-03",
        tdsRate: 1,
        applicableThreshold: 30000
      },
      {
        _id: "5",
        payeeName: "Security Services",
        paymentAmount: 79000,
        tdsAmount: 3950,
        netPayment: 75050,
        tdsSection: "194D - Insurance Commission",
        recordDate: "2024-12-28",
        tdsRate: 5,
        applicableThreshold: 15000
      }
    ]
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching from:', `${ENDPOINTS.TDS_BASE}/dashboard`);
      const response = await fetch(`${ENDPOINTS.TDS_BASE}/dashboard`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', response.status, errorText);
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API Result:', result);
      
      if (result.success) {
        console.log('Using real data from database');
        setDashboardData(result.data);
      } else {
        console.log('API returned no success, using fallback data');
        setDashboardData(fallbackData);
        setError(null);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(`API Error: ${err instanceof Error ? err.message : String(err)}`);
      // Temporarily show error instead of fallback data for debugging
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshDashboard: fetchDashboardData
  }));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
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

  // Use fallback data if dashboardData is null
  const data = dashboardData || fallbackData;
  const stats = [
    {
      title: "TDS Deducted",
      value: `₹${data.totalDeducted.toLocaleString()}`,
      change: `From ${data.totalEntries} transactions`,
      icon: Calculator,
      color: "text-green-600",
    },
    {
      title: "Total Payment",
      value: `₹${data.totalPayment.toLocaleString()}`,
      change: "Gross payment amount",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      title: "Total Entries",
      value: data.totalEntries.toString(),
      change: "TDS records this year",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Total Recorded",
      value: (data.statusCounts.recorded || 0).toString(),
      change: "TDS entries recorded",
      icon: AlertTriangle,
      color: "text-yellow-600",
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
          <CardTitle>Recent TDS Deductions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>TDS Rate</TableHead>
                <TableHead>TDS Amount</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentDeductions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No TDS deductions recorded yet
                  </TableCell>
                </TableRow>
              ) : (
                data.recentDeductions.map((deduction, index) => (
                  <TableRow key={deduction._id || index}>
                    <TableCell>
                      {new Date(deduction.recordDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{deduction.payeeName}</TableCell>
                    <TableCell>₹{deduction.paymentAmount.toLocaleString()}</TableCell>
                    <TableCell>{deduction.tdsRate}%</TableCell>
                    <TableCell>₹{deduction.tdsAmount.toLocaleString()}</TableCell>
                    <TableCell>{deduction.tdsSection}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        Recorded
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
});

TDSDashboard.displayName = 'TDSDashboard';
