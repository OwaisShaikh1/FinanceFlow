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
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Total Payment",
      value: `₹${data.totalPayment.toLocaleString()}`,
      change: "Gross payment amount",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Total Entries",
      value: data.totalEntries.toString(),
      change: "TDS records this year",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Total Recorded",
      value: (data.statusCounts.recorded || 0).toString(),
      change: "TDS entries recorded",
      icon: AlertTriangle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Enhanced TDS Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${stat.borderColor} bg-gradient-to-br from-white to-purple-50`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm text-purple-600 font-medium uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium ${stat.color} flex items-center gap-1`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} ring-1 ring-white/20`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent TDS Deductions Table */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="pb-4 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-purple-900">Recent TDS Deductions</CardTitle>
              <p className="text-sm text-purple-700 mt-1">Latest TDS transactions and deductions</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
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
