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
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div>
          <label className="text-sm font-medium text-blue-700 mb-2 block">Search Clients</label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
            <Input 
              placeholder="Search by name or GSTIN..." 
              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400" 
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-blue-700 mb-2 block">Status</label>
          <Select value={filters.status} onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}>
            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
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
          <label className="text-sm font-medium text-blue-700 mb-2 block">Business Type</label>
          <Select value={filters.businessType} onValueChange={(val) => setFilters(prev => ({ ...prev, businessType: val }))}>
            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
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
          <label className="text-sm font-medium text-blue-700 mb-2 block">Compliance Status</label>
          <div className="space-y-2">
            <Badge variant="outline" className="w-full justify-center text-emerald-600 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50">
              Up to Date (18)
            </Badge>
            <Badge variant="outline" className="w-full justify-center text-amber-600 border-amber-200 bg-amber-50/50 hover:bg-amber-50">
              Pending (4)
            </Badge>
            <Badge variant="outline" className="w-full justify-center text-red-600 border-red-200 bg-red-50/50 hover:bg-red-50">
              Overdue (2)
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
