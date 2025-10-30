"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { API_BASE_URL } from "@/lib/config"
import { useClientContext } from "./ClientContext"

export interface Transaction {
  id: string
  date: string
  type: "income" | "expense"
  description: string
  category: string
  amount: number
  paymentMethod: string
  hasAttachment?: boolean
}

export interface DashboardData {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  transactionCount: number
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
  profit: number
  transactions: number
}

interface DashboardContextType {
  dashboardData: DashboardData | null
  transactions: Transaction[]
  monthlyData: MonthlyData[]         // <-- store exactly as received
  loading: boolean
  error: string | null
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  refreshDashboard: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard must be used within DashboardProvider")
  return context
}

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { selectedClient } = useClientContext()

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")

      // Build query params for client filtering
      // Use client ID (user ID) instead of businessId - backend will find the business
      const queryParams = selectedClient?.id 
        ? `?clientId=${selectedClient.id}` 
        : ''

      console.log('🔍 DashboardContext - Fetching with params:', queryParams)
      console.log('🔍 Selected Client:', selectedClient)
      console.log('🔍 Selected Client.id:', selectedClient?.id)
      console.log('🔍 Selected Client (full):', JSON.stringify(selectedClient, null, 2))

      // Fetch stats, transactions, and chart data
      const [statsRes, txnRes, chartRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/transactions/dashboard-stats${queryParams}`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }),
        fetch(`${API_BASE_URL}/api/transactions${queryParams}`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }),
        fetch(`${API_BASE_URL}/api/transactions/chart-data${queryParams}`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }),
      ])

      if (!statsRes.ok) throw new Error("Failed to fetch dashboard stats")
      if (!txnRes.ok) throw new Error("Failed to fetch transactions")
      if (!chartRes.ok) throw new Error("Failed to fetch chart data")

      const statsData: DashboardData = await statsRes.json()
      const txnData: Transaction[] = await txnRes.json()
      const chartData: MonthlyData[] = await chartRes.json() // <-- store as-is

      console.log('✅ Fetched transactions count:', txnData.length)
      console.log('✅ Stats:', statsData)

      setDashboardData(statsData)
      setTransactions(txnData)
      setMonthlyData(chartData)  // <-- store exact backend data
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🔄 DashboardContext useEffect triggered')
    console.log('🔄 selectedClient changed:', selectedClient)
    fetchDashboard()
  }, [selectedClient]) // Re-fetch when client selection changes

  return (
    <DashboardContext.Provider
      value={{ 
        dashboardData, 
        transactions, 
        monthlyData, 
        loading, 
        error, 
        sidebarCollapsed, 
        setSidebarCollapsed,
        refreshDashboard: fetchDashboard 
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
