"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useInvoiceFilters } from "@/contexts/FilterContext"
import { API_BASE_URL } from "@/lib/config"

interface Client {
  _id: string
  name: string
  email: string
}

export function InvoiceFilters() {
  const { filters, setFilters, clearFilters } = useInvoiceFilters()
  const [showFilters, setShowFilters] = useState(false)
  const [clients, setClients] = useState<Client[]>([])

  // Fetch clients for the client filter dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/api/clients`, {
          headers,
        })

        if (response.ok) {
          const data = await response.json()
          setClients(data)
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }

    if (showFilters) {
      fetchClients()
    }
  }, [showFilters])

  // Count active filters
  const activeFiltersCount = [
    filters.status !== 'all',
    filters.client !== 'all',
    filters.dateFrom !== undefined,
    filters.dateTo !== undefined,
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search invoices by number or customer name..." 
            className="max-w-sm bg-white border-blue-200 hover:border-blue-300 focus:border-blue-400" 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)} 
          className="border-blue-200 hover:bg-blue-50 text-blue-700 relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-blue-600 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-blue-200 rounded-lg bg-gradient-to-br from-white to-blue-50">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-700">Status</label>
            <Select value={filters.status} onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}>
              <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-700">Client</label>
            <Select value={filters.client} onValueChange={(val) => setFilters(prev => ({ ...prev, client: val }))}>
              <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                <SelectValue placeholder="All clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client._id} value={client.name.toLowerCase()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !filters.dateFrom && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={filters.dateFrom} onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !filters.dateTo && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={filters.dateTo} onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
