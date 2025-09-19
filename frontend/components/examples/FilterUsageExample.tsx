"use client"

import { useTransactionFilters, useClientFilters, useInvoiceFilters } from '@/contexts/FilterContext'

// Example: Using filters in a data display component
export function TransactionsList() {
  const { filters } = useTransactionFilters()
  
  // Use filters to fetch/filter data
  const filteredTransactions = getFilteredTransactions(filters)
  
  return (
    <div>
      <h2>Transactions</h2>
      {/* Display filtered data */}
      {filteredTransactions.map(transaction => (
        <div key={transaction.id}>{transaction.description}</div>
      ))}
    </div>
  )
}

// Example: Using filters in multiple components
export function ClientsList() {
  const { filters } = useClientFilters()
  
  // Filters are automatically available without prop drilling
  const filteredClients = getFilteredClients(filters)
  
  return (
    <div>
      <h2>Clients</h2>
      {filteredClients.map(client => (
        <div key={client.id}>{client.name}</div>
      ))}
    </div>
  )
}

// Example: Accessing filters from any component
export function FilterSummary() {
  const { filters: transactionFilters } = useTransactionFilters()
  const { filters: clientFilters } = useClientFilters()
  const { filters: invoiceFilters } = useInvoiceFilters()
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Active Filters Summary</h3>
      <p>Transaction Search: {transactionFilters.search || 'None'}</p>
      <p>Client Search: {clientFilters.search || 'None'}</p>
      <p>Invoice Search: {invoiceFilters.search || 'None'}</p>
    </div>
  )
}

// Mock functions - replace with your actual data fetching logic
function getFilteredTransactions(filters: any) {
  // Apply filters to your transaction data
  return []
}

function getFilteredClients(filters: any) {
  // Apply filters to your client data
  return []
}