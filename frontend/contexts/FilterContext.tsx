"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

// Define filter types for different modules
export interface BaseFilters {
  search: string
  dateFrom?: Date
  dateTo?: Date
}

export interface TransactionFilters extends BaseFilters {
  type: string
  category: string
}

export interface ClientFilters extends BaseFilters {
  status: string
  businessType: string
  complianceStatus: string
}

export interface InvoiceFilters extends BaseFilters {
  status: string
  client: string
}

export interface ReportFilters extends BaseFilters {
  reportType: string
  period: string
}

export interface TaskFilters extends BaseFilters {
  priority: string
  assignee: string
  status: string
}

// Context type
interface FilterContextType {
  // Transaction filters
  transactionFilters: TransactionFilters
  setTransactionFilters: (filters: TransactionFilters | ((prev: TransactionFilters) => TransactionFilters)) => void
  clearTransactionFilters: () => void

  // Client filters
  clientFilters: ClientFilters
  setClientFilters: (filters: ClientFilters | ((prev: ClientFilters) => ClientFilters)) => void
  clearClientFilters: () => void

  // Invoice filters
  invoiceFilters: InvoiceFilters
  setInvoiceFilters: (filters: InvoiceFilters | ((prev: InvoiceFilters) => InvoiceFilters)) => void
  clearInvoiceFilters: () => void

  // Report filters
  reportFilters: ReportFilters
  setReportFilters: (filters: ReportFilters | ((prev: ReportFilters) => ReportFilters)) => void
  clearReportFilters: () => void

  // Task filters
  taskFilters: TaskFilters
  setTaskFilters: (filters: TaskFilters | ((prev: TaskFilters) => TaskFilters)) => void
  clearTaskFilters: () => void
}

// Default filter values
const defaultTransactionFilters: TransactionFilters = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: undefined,
  dateTo: undefined
}

const defaultClientFilters: ClientFilters = {
  search: '',
  status: 'all',
  businessType: 'all',
  complianceStatus: 'all',
  dateFrom: undefined,
  dateTo: undefined
}

const defaultInvoiceFilters: InvoiceFilters = {
  search: '',
  status: 'all',
  client: 'all',
  dateFrom: undefined,
  dateTo: undefined
}

const defaultReportFilters: ReportFilters = {
  search: '',
  reportType: 'all',
  period: 'monthly',
  dateFrom: undefined,
  dateTo: undefined
}

const defaultTaskFilters: TaskFilters = {
  search: '',
  priority: 'all',
  assignee: 'all',
  status: 'all',
  dateFrom: undefined,
  dateTo: undefined
}

// Create context
const FilterContext = createContext<FilterContextType | undefined>(undefined)

// Provider component
export function FilterProvider({ children }: { children: ReactNode }) {
  const [transactionFilters, setTransactionFilters] = useState<TransactionFilters>(defaultTransactionFilters)
  const [clientFilters, setClientFilters] = useState<ClientFilters>(defaultClientFilters)
  const [invoiceFilters, setInvoiceFilters] = useState<InvoiceFilters>(defaultInvoiceFilters)
  const [reportFilters, setReportFilters] = useState<ReportFilters>(defaultReportFilters)
  const [taskFilters, setTaskFilters] = useState<TaskFilters>(defaultTaskFilters)

  const clearTransactionFilters = () => setTransactionFilters(defaultTransactionFilters)
  const clearClientFilters = () => setClientFilters(defaultClientFilters)
  const clearInvoiceFilters = () => setInvoiceFilters(defaultInvoiceFilters)
  const clearReportFilters = () => setReportFilters(defaultReportFilters)
  const clearTaskFilters = () => setTaskFilters(defaultTaskFilters)

  return (
    <FilterContext.Provider
      value={{
        transactionFilters,
        setTransactionFilters,
        clearTransactionFilters,
        clientFilters,
        setClientFilters,
        clearClientFilters,
        invoiceFilters,
        setInvoiceFilters,
        clearInvoiceFilters,
        reportFilters,
        setReportFilters,
        clearReportFilters,
        taskFilters,
        setTaskFilters,
        clearTaskFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

// Custom hook to use filter context
export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}

// Individual hooks for specific filter types
export function useTransactionFilters() {
  const { transactionFilters, setTransactionFilters, clearTransactionFilters } = useFilters()
  return { filters: transactionFilters, setFilters: setTransactionFilters, clearFilters: clearTransactionFilters }
}

export function useClientFilters() {
  const { clientFilters, setClientFilters, clearClientFilters } = useFilters()
  return { filters: clientFilters, setFilters: setClientFilters, clearFilters: clearClientFilters }
}

export function useInvoiceFilters() {
  const { invoiceFilters, setInvoiceFilters, clearInvoiceFilters } = useFilters()
  return { filters: invoiceFilters, setFilters: setInvoiceFilters, clearFilters: clearInvoiceFilters }
}

export function useReportFilters() {
  const { reportFilters, setReportFilters, clearReportFilters } = useFilters()
  return { filters: reportFilters, setFilters: setReportFilters, clearFilters: clearReportFilters }
}

export function useTaskFilters() {
  const { taskFilters, setTaskFilters, clearTaskFilters } = useFilters()
  return { filters: taskFilters, setFilters: setTaskFilters, clearFilters: clearTaskFilters }
}