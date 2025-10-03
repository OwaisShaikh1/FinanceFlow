"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Upload, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface TDSReturn {
  id: string;
  type: string;
  quarter: string;
  dueDate: string;
  status: string;
  filedDate?: string;
  amount: number;
  deductees: number;
  records?: number;
}

// Fallback data for when API fails
const fallbackReturns: TDSReturn[] = [
  {
    id: "2025-Q2-24Q",
    type: "Form 24Q",
    quarter: "Q2 2024-25",
    dueDate: "2024-10-31",
    status: "pending",
    amount: 11229,
    deductees: 4,
  },
  {
    id: "2025-Q2-26Q",
    type: "Form 26Q",
    quarter: "Q2 2024-25",
    dueDate: "2024-10-31",
    status: "pending",
    amount: 3369,
    deductees: 2,
  },
]

export function TDSReturns() {
  const [tdsReturns, setTdsReturns] = useState<TDSReturn[]>(fallbackReturns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTDSReturns = async () => {
      try {
        setLoading(true);
        console.log('Fetching TDS returns from backend...');
        
        const response = await fetch('http://localhost:5000/api/tds/returns');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          console.log('Loaded TDS returns from database:', result.data);
          setTdsReturns(result.data);
          setError(null);
        } else {
          console.log('No TDS returns data, using fallback');
          setTdsReturns(fallbackReturns);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching TDS returns:', err);
        setError('Failed to load TDS returns');
        setTdsReturns(fallbackReturns);
      } finally {
        setLoading(false);
      }
    };

    fetchTDSReturns();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "filed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          TDS Returns
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading returns...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p>{error}</p>
            <p className="text-sm text-gray-500 mt-1">Showing sample data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tdsReturns.map((returnItem: TDSReturn) => (
            <div key={returnItem.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(returnItem.status)}
                <div>
                  <div className="font-medium">{returnItem.type}</div>
                  <div className="text-sm text-muted-foreground">{returnItem.quarter}</div>
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(returnItem.dueDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{returnItem.deductees} deductees</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">₹{returnItem.amount.toLocaleString()}</div>
                  <Badge className={getStatusColor(returnItem.status)}>{returnItem.status}</Badge>
                </div>
                <div className="flex gap-1">
                  {returnItem.status === "filed" ? (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
