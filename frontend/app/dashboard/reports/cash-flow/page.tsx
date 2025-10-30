"use client"

import { CashFlowReport } from "@/components/reporting/cash-flow-report"
import { CashFlowChart } from "@/components/reporting/cash-flow-chart"
import { ReportHeader } from "@/components/reporting/report-header"
import { useState, useEffect } from "react"
import { ENDPOINTS } from "@/lib/config"
import { useClientContext } from "@/contexts/ClientContext"

interface CashFlowData {
  operatingInflows: number
  operatingOutflows: number
  operatingCashFlow: number
  investingInflows: number
  investingOutflows: number
  investingCashFlow: number
  financingInflows: number
  financingOutflows: number
  financingCashFlow: number
  netCashFlow: number
  startDate?: Date
  endDate?: Date
  transactionCount?: number
}

export default function CashFlowPage() {
  const [cashFlowData, setCashFlowData] = useState<CashFlowData>({
    operatingInflows: 0,
    operatingOutflows: 0,
    operatingCashFlow: 0,
    investingInflows: 0,
    investingOutflows: 0,
    investingCashFlow: 0,
    financingInflows: 0,
    financingOutflows: 0,
    financingCashFlow: 0,
    netCashFlow: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { selectedClient } = useClientContext()

  useEffect(() => {
    const fetchCashFlowData = async () => {
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
        
        // Add client filtering if a client is selected
        const queryParams = selectedClient?.id 
          ? `?clientId=${selectedClient.id}` 
          : ''
        
        console.log('Fetching cash flow data from API...')
        
        const response = await fetch(
          `${ENDPOINTS.REPORTS_BASE}/cash-flow/data${queryParams}`,
          {
            method: "GET",
            headers,
          }
        )
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cash flow: ${response.status}`)
        }
        
        const result = await response.json()
        
        console.log('Cash flow data received:', result)
        
        if (result.success && result.data) {
          setCashFlowData(result.data)
        } else {
          throw new Error('Invalid response format')
        }
        
      } catch (error) {
        console.error('Error fetching cash flow data:', error)
        setError('Failed to load cash flow data')
      } finally {
        setLoading(false)
      }
    }

    fetchCashFlowData()
  }, [selectedClient]) // Re-fetch when client changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Cash Flow</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ReportHeader
        title="Cash Flow Statement"
        description="Cash inflows and outflows for the selected period"
        reportType="cash-flow"
        reportData={cashFlowData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowReport data={cashFlowData} />
        </div>
        <div>
          <CashFlowChart />
        </div>
      </div>
    </div>
  )
}
