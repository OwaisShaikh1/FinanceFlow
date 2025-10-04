"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Receipt, FileText, AlertTriangle, CheckCircle, Loader2, Calculator } from "lucide-react"
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchGSTData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching GST summary from backend...');
        
        // Get GST summary from backend
        const response = await fetch('http://localhost:5000/api/gst/summary?period=2025-10', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('GST Summary Response:', result);
        
        if (result.success) {
          const backendData = result.data;
          
          // Transform backend data to match frontend interface
          const transformedData: GSTData = {
            currentMonthGST: backendData.currentMonthGST || 0,
            inputTaxCredit: backendData.inputTaxCredit || 0,
            netGSTPayable: backendData.netGSTPayable || 0,
            returnsFiled: backendData.returnsFiled || 0,
            totalReturns: backendData.totalReturns || 12,
            upcomingDeadlines: backendData.upcomingDeadlines || []
          };
          
          setGSTData(transformedData);
          console.log('GST Dashboard loaded with backend data:', transformedData);
        } else {
          throw new Error(result.message || 'Failed to fetch GST data');
        }
        
      } catch (error: any) {
        console.error('GST Dashboard fetch error:', error);
        setError(`Failed to load GST data: ${error.message}`);
        
        // Fallback to mock data
        const mockData: GSTData = {
          currentMonthGST: 0,
          inputTaxCredit: 0,
          netGSTPayable: 0,
          returnsFiled: 8,
          totalReturns: 12,
          upcomingDeadlines: [
            {
              return: "GSTR-1",
              period: "2025-10",
              dueDate: "11 Nov 2025",
              status: "pending",
              amount: "₹0"
            }
          ]
        };
        setGSTData(mockData);
      } finally {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* GST Returns Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GSTR-1 Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              GSTR-1 (Outward Supplies)
            </CardTitle>
            <p className="text-sm text-muted-foreground">Monthly return for all sales/services provided</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Period:</span>
                <span className="font-medium">October 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Return type:</span>
                <span className="font-medium">GSTR-1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Invoice basis:</span>
                <span className="font-medium">Based on 3 invoices</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">GST collected:</span>
                <span className="font-bold text-lg">{formatCurrency(gstData.currentMonthGST)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="default">Final</Badge>
              </div>
            </div>
            <div className="pt-2 border-t">
              <Button className="w-full" variant="outline">
                <Receipt className="h-4 w-4 mr-2" />
                Generate GSTR-1
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GSTR-3B Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              GSTR-3B (Monthly Summary)
            </CardTitle>
            <p className="text-sm text-muted-foreground">Summary return for net GST payment</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Period:</span>
                <span className="font-medium">October 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Return type:</span>
                <span className="font-medium">GSTR-3B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Invoice basis:</span>
                <span className="font-medium">Latest Invoice INV001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Net GST payable:</span>
                <span className="font-bold text-lg">{formatCurrency(gstData.netGSTPayable)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="default">Final</Badge>
              </div>
            </div>
            <div className="pt-2 border-t">
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate GSTR-3B
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming GST Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-medium">GSTR-1 October 2025</h4>
                  <p className="text-sm text-muted-foreground">Outward supplies return</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Due: 11 Nov 2025</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-medium">GSTR-3B October 2025</h4>
                  <p className="text-sm text-muted-foreground">Monthly summary return</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Due: 20 Nov 2025</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">Pending</Badge>
                  <span className="text-sm">{formatCurrency(gstData.netGSTPayable)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
