"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from "react"
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

// Dashboard state type for useReducer
interface DashboardState {
  dashboardData: DashboardData | null
  transactions: Transaction[]
  monthlyData: MonthlyData[]
  loading: boolean
  error: string | null
  sidebarCollapsed: boolean
}

// Action types for useReducer
type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DASHBOARD_DATA'; payload: DashboardData }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_MONTHLY_DATA'; payload: MonthlyData[] }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'REFRESH_START' }
  | { type: 'REFRESH_SUCCESS'; payload: { dashboardData: DashboardData; transactions: Transaction[]; monthlyData: MonthlyData[] } }
  | { type: 'REFRESH_ERROR'; payload: string };

interface DashboardContextType extends DashboardState {
  setSidebarCollapsed: (collapsed: boolean) => void
  refreshDashboard: () => Promise<void>
}

// Initial state
const initialState: DashboardState = {
  dashboardData: null,
  transactions: [],
  monthlyData: [],
  loading: true,
  error: null,
  sidebarCollapsed: false,
};

// Reducer function using useReducer for complex state management
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DASHBOARD_DATA':
      return { ...state, dashboardData: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_MONTHLY_DATA':
      return { ...state, monthlyData: action.payload };
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    case 'REFRESH_START':
      return { ...state, loading: true, error: null };
    case 'REFRESH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        dashboardData: action.payload.dashboardData,
        transactions: action.payload.transactions,
        monthlyData: action.payload.monthlyData,
      };
    case 'REFRESH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard must be used within DashboardProvider")
  return context
}

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
<<<<<<< HEAD
  // Use useReducer for complex state management
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
=======
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { selectedClient } = useClientContext()
>>>>>>> a77f7d4b8c83b43a09e733c2982d6b7eda104ca6

  // useCallback to memoize the fetch function
  const fetchDashboard = useCallback(async () => {
    dispatch({ type: 'REFRESH_START' })
    
    try {
      const token = localStorage.getItem("token")

<<<<<<< HEAD
      // Fetch stats, transactions, and chart data with memoized headers
      const headers = { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      };

      const [statsRes, txnRes, chartRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/transactions/dashboard-stats`, { headers }),
        fetch(`${API_BASE_URL}/api/transactions`, { headers }),
        fetch(`${API_BASE_URL}/api/transactions/chart-data`, { headers }),
=======
      // Build query params for client filtering
      const queryParams = selectedClient?.businessId 
        ? `?business=${selectedClient.businessId}` 
        : ''

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
>>>>>>> a77f7d4b8c83b43a09e733c2982d6b7eda104ca6
      ])

      if (!statsRes.ok) throw new Error("Failed to fetch dashboard stats")
      if (!txnRes.ok) throw new Error("Failed to fetch transactions")
      if (!chartRes.ok) throw new Error("Failed to fetch chart data")

      const statsData: DashboardData = await statsRes.json()
      const txnData: Transaction[] = await txnRes.json()
      const chartData: MonthlyData[] = await chartRes.json()

      dispatch({
        type: 'REFRESH_SUCCESS',
        payload: {
          dashboardData: statsData,
          transactions: txnData,
          monthlyData: chartData,
        }
      })
    } catch (err: any) {
      console.error(err)
      dispatch({
        type: 'REFRESH_ERROR',
        payload: err.message || "Failed to fetch dashboard data"
      })
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [selectedClient]) // Re-fetch when client selection changes

  // useCallback for sidebar toggle to prevent re-renders
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed })
  }, [])

  // useEffect for initial data fetch
  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // useMemo to optimize context value and prevent unnecessary re-renders
  const contextValue = useMemo<DashboardContextType>(() => ({
    ...state,
    setSidebarCollapsed,
    refreshDashboard: fetchDashboard,
  }), [state, setSidebarCollapsed, fetchDashboard])

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  )
}
