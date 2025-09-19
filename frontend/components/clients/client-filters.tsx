"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { useClientFilters } from "@/contexts/FilterContext"

export function ClientFilters() {
  const { filters, setFilters } = useClientFilters()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Search Clients</label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input 
              placeholder="Search by name or GSTIN..." 
              className="pl-10" 
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
          <Select value={filters.status} onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending Setup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Business Type</label>
          <Select value={filters.businessType} onValueChange={(val) => setFilters(prev => ({ ...prev, businessType: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="llp">LLP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Compliance Status</label>
          <div className="space-y-2">
            <Badge variant="outline" className="w-full justify-center text-emerald-600 border-emerald-200">
              Up to Date (18)
            </Badge>
            <Badge variant="outline" className="w-full justify-center text-amber-600 border-amber-200">
              Pending (4)
            </Badge>
            <Badge variant="outline" className="w-full justify-center text-red-600 border-red-200">
              Overdue (2)
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
