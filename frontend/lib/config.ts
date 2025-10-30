// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// API Endpoints
export const ENDPOINTS = {
  TRANSACTIONS: {
    SUMMARY: `${API_BASE_URL}/api/transactions/summary`,
    LIST: `${API_BASE_URL}/api/transactions`,
  },
  TAX_CALC: `${API_BASE_URL}/api/taxcalc`,
  EXPORT: `${API_BASE_URL}/api/export`,
  TDS_BASE: `${API_BASE_URL}/api/tds`,
  TDS: {
    CALCULATE: `${API_BASE_URL}/api/tds/calculate`,
    RECORD_DEDUCTION: `${API_BASE_URL}/api/tds/record-deduction`,
    DASHBOARD: `${API_BASE_URL}/api/tds/dashboard`,
    SAVE: `${API_BASE_URL}/api/tds`,
    LIST: `${API_BASE_URL}/api/tds`,
    SECTIONS: `${API_BASE_URL}/api/tds/sections`,
  },
  GST: {
    DASHBOARD: `${API_BASE_URL}/api/gst/dashboard`,
    SUMMARY: `${API_BASE_URL}/api/gst/summary`,
  },
  INVOICES: {
    BASE: `${API_BASE_URL}/api/invoice`,
    LIST: `${API_BASE_URL}/api/invoice`,
    CREATE: `${API_BASE_URL}/api/invoice`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/invoice/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/invoice/${id}`,
    PDF: (id: string) => `${API_BASE_URL}/api/invoice/${id}/pdf`,
    STATUS: (id: string) => `${API_BASE_URL}/api/invoice/${id}/status`,
  },
  REPORTS_BASE: `${API_BASE_URL}/api/reports`,
  REPORTS: {
    BALANCE_SHEET: {
      PDF: `${API_BASE_URL}/api/reports/balance-sheet/pdf`,
      EXCEL: `${API_BASE_URL}/api/reports/balance-sheet/excel`,
      TEST: `${API_BASE_URL}/api/reports/balance-sheet/test`,
      DATA: `${API_BASE_URL}/api/reports/balance-sheet/data`,
    },
    CASH_FLOW: {
      PDF: `${API_BASE_URL}/api/reports/cash-flow/pdf`,
      EXCEL: `${API_BASE_URL}/api/reports/cash-flow/excel`,
      TEST: `${API_BASE_URL}/api/reports/cash-flow/test`,
      DATA: `${API_BASE_URL}/api/reports/cash-flow/data`,
    },
    PROFIT_LOSS: {
      PDF: `${API_BASE_URL}/api/reports/profit-loss/pdf`,
      EXCEL: `${API_BASE_URL}/api/reports/profit-loss/excel`,
    },
    TAX: {
      GST: {
        PDF: `${API_BASE_URL}/api/reports/tax/gst/pdf`,
        EXCEL: `${API_BASE_URL}/api/reports/tax/gst/excel`,
      },
      TDS: {
        PDF: `${API_BASE_URL}/api/reports/tax/tds/pdf`,
        EXCEL: `${API_BASE_URL}/api/reports/tax/tds/excel`,
      }
    }
  },
}

// Format currency with Rupee symbol
export const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`
}

// Calculate percentage change
export const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return '0%'
  const change = ((current - previous) / previous) * 100
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
}