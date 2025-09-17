"use client"

import { useTransactionFilters, useClientFilters, useInvoiceFilters } from '@/contexts/FilterContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function FilterTest() {
  const { filters: transactionFilters, setFilters: setTransactionFilters, clearFilters: clearTransactionFilters } = useTransactionFilters()
  const { filters: clientFilters, setFilters: setClientFilters, clearFilters: clearClientFilters } = useClientFilters()
  const { filters: invoiceFilters, setFilters: setInvoiceFilters, clearFilters: clearInvoiceFilters } = useInvoiceFilters()

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Filter Context Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Transaction Filters:</h3>
          <p>Search: {transactionFilters.search || 'None'}</p>
          <p>Type: {transactionFilters.type}</p>
          <p>Category: {transactionFilters.category}</p>
          <Button 
            size="sm" 
            onClick={() => setTransactionFilters(prev => ({ ...prev, search: 'test search' }))}
          >
            Set Test Search
          </Button>
          <Button size="sm" variant="outline" onClick={clearTransactionFilters}>
            Clear
          </Button>
        </div>

        <div>
          <h3 className="font-semibold">Client Filters:</h3>
          <p>Search: {clientFilters.search || 'None'}</p>
          <p>Status: {clientFilters.status}</p>
          <p>Business Type: {clientFilters.businessType}</p>
          <Button 
            size="sm" 
            onClick={() => setClientFilters(prev => ({ ...prev, search: 'test client' }))}
          >
            Set Test Search
          </Button>
          <Button size="sm" variant="outline" onClick={clearClientFilters}>
            Clear
          </Button>
        </div>

        <div>
          <h3 className="font-semibold">Invoice Filters:</h3>
          <p>Search: {invoiceFilters.search || 'None'}</p>
          <p>Status: {invoiceFilters.status}</p>
          <p>Client: {invoiceFilters.client}</p>
          <Button 
            size="sm" 
            onClick={() => setInvoiceFilters(prev => ({ ...prev, search: 'test invoice' }))}
          >
            Set Test Search
          </Button>
          <Button size="sm" variant="outline" onClick={clearInvoiceFilters}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}