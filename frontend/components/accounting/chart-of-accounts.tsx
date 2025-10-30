"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, DollarSign, Briefcase, PieChart, Download, Loader2 } from "lucide-react"
import { ENDPOINTS } from "@/lib/config"
import { useClientContext } from "@/contexts/ClientContext"

interface BalanceSheetItem {
  _id: string
  name: string
  amount: number
  type: 'current-asset' | 'fixed-asset' | 'current-liability' | 'long-term-liability' | 'equity'
  transactionCount?: number
}

export function AssetsLiabilities() {
  const [items, setItems] = useState<BalanceSheetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { selectedClient } = useClientContext()

  // Fetch real balance sheet data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = { 
        "Content-Type": "application/json" 
      }
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
      
      const asOfDate = new Date().toISOString()
      const queryParams = selectedClient?.id 
        ? `?clientId=${selectedClient.id}&asOfDate=${asOfDate}` 
        : `?asOfDate=${asOfDate}`
      
      console.log('Fetching assets & liabilities data...')
      
      const response = await fetch(
        `${ENDPOINTS.REPORTS_BASE}/balance-sheet/data${queryParams}`,
        { method: "GET", headers }
      )
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        setItems(result.data)
      } else {
        throw new Error('Invalid response format')
      }
      
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load financial data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedClient])

  // Calculate totals and ratios
  const currentAssets = items.filter(i => i.type === 'current-asset')
  const fixedAssets = items.filter(i => i.type === 'fixed-asset')
  const currentLiabilities = items.filter(i => i.type === 'current-liability')
  const longTermLiabilities = items.filter(i => i.type === 'long-term-liability')
  const equity = items.filter(i => i.type === 'equity')

  const totalCurrentAssets = currentAssets.reduce((sum, item) => sum + item.amount, 0)
  const totalFixedAssets = fixedAssets.reduce((sum, item) => sum + item.amount, 0)
  const totalAssets = totalCurrentAssets + totalFixedAssets

  const totalCurrentLiabilities = currentLiabilities.reduce((sum, item) => sum + item.amount, 0)
  const totalLongTermLiabilities = longTermLiabilities.reduce((sum, item) => sum + item.amount, 0)
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities

  const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0)

  // Financial ratios
  const currentRatio = totalCurrentLiabilities > 0 
    ? (totalCurrentAssets / totalCurrentLiabilities).toFixed(2) 
    : 'N/A'
  
  const debtToEquity = totalEquity > 0 
    ? (totalLiabilities / totalEquity).toFixed(2) 
    : 'N/A'

  const netWorth = totalAssets - totalLiabilities

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">Error Loading Data</p>
        <p className="text-gray-600">{error}</p>
        <Button onClick={fetchData} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assets */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Assets</p>
                <p className="text-2xl font-bold text-green-900">
                  ₹{totalAssets.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {currentAssets.length + fixedAssets.length} categories
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Liabilities */}
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Total Liabilities</p>
                <p className="text-2xl font-bold text-red-900">
                  ₹{totalLiabilities.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {currentLiabilities.length + longTermLiabilities.length} categories
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equity */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Equity</p>
                <p className="text-2xl font-bold text-blue-900">
                  ₹{totalEquity.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {equity.length} categories
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Worth */}
        <Card className={`bg-gradient-to-br ${netWorth >= 0 ? 'from-purple-50 to-violet-50 border-purple-200' : 'from-orange-50 to-amber-50 border-orange-200'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${netWorth >= 0 ? 'text-purple-700' : 'text-orange-700'}`}>Net Worth</p>
                <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-purple-900' : 'text-orange-900'}`}>
                  ₹{netWorth.toLocaleString('en-IN')}
                </p>
                <p className={`text-xs mt-1 ${netWorth >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                  Assets - Liabilities
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${netWorth >= 0 ? 'bg-purple-200' : 'bg-orange-200'}`}>
                <DollarSign className={`h-6 w-6 ${netWorth >= 0 ? 'text-purple-700' : 'text-orange-700'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Ratios */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-amber-900 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Financial Ratios
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-amber-700 mb-1">Current Ratio</p>
              <p className="text-3xl font-bold text-amber-900">{currentRatio}</p>
              <p className="text-xs text-amber-600 mt-1">
                {typeof currentRatio === 'string' && currentRatio !== 'N/A' && parseFloat(currentRatio) >= 1.5 
                  ? '✓ Healthy liquidity' 
                  : typeof currentRatio === 'string' && currentRatio !== 'N/A' && parseFloat(currentRatio) >= 1 
                  ? '⚠ Acceptable' 
                  : currentRatio === 'N/A' ? 'No liabilities' : '⚠ Low liquidity'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-amber-700 mb-1">Debt-to-Equity</p>
              <p className="text-3xl font-bold text-amber-900">{debtToEquity}</p>
              <p className="text-xs text-amber-600 mt-1">
                {typeof debtToEquity === 'string' && debtToEquity !== 'N/A' && parseFloat(debtToEquity) <= 1 
                  ? '✓ Low debt' 
                  : typeof debtToEquity === 'string' && debtToEquity !== 'N/A' && parseFloat(debtToEquity) <= 2 
                  ? '⚠ Moderate debt' 
                  : debtToEquity === 'N/A' ? 'No equity' : '⚠ High debt'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-amber-700 mb-1">Asset Coverage</p>
              <p className="text-3xl font-bold text-amber-900">
                {totalLiabilities > 0 ? ((totalAssets / totalLiabilities) * 100).toFixed(0) : '100'}%
              </p>
              <p className="text-xs text-amber-600 mt-1">
                {totalLiabilities > 0 && totalAssets >= totalLiabilities 
                  ? '✓ Assets cover debts' 
                  : totalLiabilities === 0 
                  ? 'No liabilities' 
                  : '⚠ Under-covered'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Section */}
      <Card className="bg-gradient-to-br from-white to-green-50 border-green-100">
        <CardHeader className="border-b border-green-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-green-900">Assets</CardTitle>
            <Badge variant="outline" className="border-green-200 text-green-700">
              ₹{totalAssets.toLocaleString('en-IN')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Current Assets */}
          {currentAssets.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-800 mb-3 flex items-center justify-between">
                <span>Current Assets</span>
                <span className="text-sm text-green-600">₹{totalCurrentAssets.toLocaleString('en-IN')}</span>
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-green-50/50">
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAssets.map((item) => (
                    <TableRow key={item._id} className="hover:bg-green-50/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-300 text-green-700">Current</Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-600">{item.transactionCount || 0}</TableCell>
                      <TableCell className="text-right font-semibold text-green-700">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Fixed Assets */}
          {fixedAssets.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-800 mb-3 flex items-center justify-between">
                <span>Fixed Assets</span>
                <span className="text-sm text-green-600">₹{totalFixedAssets.toLocaleString('en-IN')}</span>
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-green-50/50">
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixedAssets.map((item) => (
                    <TableRow key={item._id} className="hover:bg-green-50/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-emerald-300 text-emerald-700">Fixed</Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-600">{item.transactionCount || 0}</TableCell>
                      <TableCell className="text-right font-semibold text-green-700">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {currentAssets.length === 0 && fixedAssets.length === 0 && (
            <p className="text-center text-gray-500 py-8">No assets recorded yet</p>
          )}
        </CardContent>
      </Card>

      {/* Liabilities Section */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-red-100">
        <CardHeader className="border-b border-red-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-red-900">Liabilities & Equity</CardTitle>
            <Badge variant="outline" className="border-red-200 text-red-700">
              ₹{(totalLiabilities + totalEquity).toLocaleString('en-IN')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Current Liabilities */}
          {currentLiabilities.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-800 mb-3 flex items-center justify-between">
                <span>Current Liabilities</span>
                <span className="text-sm text-red-600">₹{totalCurrentLiabilities.toLocaleString('en-IN')}</span>
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-red-50/50">
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLiabilities.map((item) => (
                    <TableRow key={item._id} className="hover:bg-red-50/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-red-300 text-red-700">Current</Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-600">{item.transactionCount || 0}</TableCell>
                      <TableCell className="text-right font-semibold text-red-700">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Long-term Liabilities */}
          {longTermLiabilities.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-800 mb-3 flex items-center justify-between">
                <span>Long-term Liabilities</span>
                <span className="text-sm text-red-600">₹{totalLongTermLiabilities.toLocaleString('en-IN')}</span>
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-red-50/50">
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {longTermLiabilities.map((item) => (
                    <TableRow key={item._id} className="hover:bg-red-50/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-rose-300 text-rose-700">Long-term</Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-600">{item.transactionCount || 0}</TableCell>
                      <TableCell className="text-right font-semibold text-red-700">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Equity */}
          {equity.length > 0 && (
            <div>
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center justify-between">
                <span>Equity</span>
                <span className="text-sm text-blue-600">₹{totalEquity.toLocaleString('en-IN')}</span>
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-blue-50/50">
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equity.map((item) => (
                    <TableRow key={item._id} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-300 text-blue-700">Equity</Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-600">{item.transactionCount || 0}</TableCell>
                      <TableCell className="text-right font-semibold text-blue-700">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {currentLiabilities.length === 0 && longTermLiabilities.length === 0 && equity.length === 0 && (
            <p className="text-center text-gray-500 py-8">No liabilities or equity recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
