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