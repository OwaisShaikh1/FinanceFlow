"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { Building2, Mail, Phone, Calendar, MoreHorizontal, Eye, Edit, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useClientFilters } from "@/contexts/FilterContext"

export function ClientsList() {
  const { filters } = useClientFilters()
  const clients = [
    {
      id: 1,
      name: "Sharma Enterprises",
      type: "Partnership",
      gstin: "27AABCS1234C1Z5",
      email: "contact@sharmaent.com",
      phone: "+91 98765 43210",
      status: "active",
      compliance: "up-to-date",
      lastActivity: "2 days ago",
      nextDeadline: "GST Return - Mar 20",
      revenue: "₹12,50,000",
    },
    {
      id: 2,
      name: "Tech Solutions Pvt Ltd",
      type: "Company",
      gstin: "29AABCT1234C1Z6",
      email: "admin@techsol.com",
      phone: "+91 87654 32109",
      status: "active",
      compliance: "pending",
      lastActivity: "1 day ago",
      nextDeadline: "TDS Return - Mar 15",
      revenue: "₹25,75,000",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      type: "Individual",
      gstin: "27AABCP1234C1Z7",
      email: "rajesh.k@email.com",
      phone: "+91 76543 21098",
      status: "active",
      compliance: "overdue",
      lastActivity: "5 days ago",
      nextDeadline: "ITR Filing - Overdue",
      revenue: "₹8,25,000",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case "up-to-date":
        return "bg-emerald-100 text-emerald-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Apply filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch = filters.search
      ? client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.gstin.toLowerCase().includes(filters.search.toLowerCase())
      : true
    const matchesStatus = filters.status === 'all' ? true : client.status === filters.status
    const matchesBusinessType = filters.businessType === 'all' ? true : client.type.toLowerCase() === filters.businessType.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesBusinessType
  })

  return (
    <div className="space-y-4">
      {filteredClients.map((client) => (
        <Card key={client.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    <AvatarInitials name={client.name} />
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {client.type}
                      </span>
                      <span>GSTIN: {client.gstin}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    <Badge className={getComplianceColor(client.compliance)}>{client.compliance}</Badge>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="text-lg font-semibold text-gray-900">{client.revenue}</div>
                <div className="text-sm text-gray-600">Annual Revenue</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Next: {client.nextDeadline}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
