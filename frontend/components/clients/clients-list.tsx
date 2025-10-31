"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { Building2, Mail, Phone, Calendar, MoreHorizontal, Eye, Edit, FileText, Loader2, ArrowRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useClientFilters } from "@/contexts/FilterContext"
import { useClientContext } from "@/contexts/ClientContext"
import { ClientDetailsModal } from "./client-details-modal"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"

interface Client {
  id: string
  name: string
  type: string
  gstin: string
  email: string
  phone: string
  status: string
  compliance: string
  lastActivity: string
  nextDeadline: string
  revenue: string
}

export function ClientsList() {
  const { filters } = useClientFilters()
  const { selectClient } = useClientContext()
  const router = useRouter()
  const { toast } = useToast()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [showClientDetails, setShowClientDetails] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch(`${API_BASE_URL}/api/clients`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (data.success) {
          setClients(data.clients)
        } else {
          throw new Error(data.message || 'Failed to fetch clients')
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch clients')
        // Fallback to sample data for development
        setClients([
          {
            id: "1",
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
            id: "2",
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
            id: "3",
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
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

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

  const handleViewDetails = (clientId: string) => {
    setSelectedClientId(clientId)
    setShowClientDetails(true)
  }

  const handleCloseDetails = () => {
    setSelectedClientId(null)
    setShowClientDetails(false)
  }

  const handleViewClientData = async (client: Client) => {
    try {
      // Fetch full client details including business info
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/clients/${client.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch client details')
      }

      const data = await response.json()
      if (data.success && data.client) {
        const clientData = data.client
        
        console.log('📋 Client data received from API:', clientData)
        console.log('📋 clientData.businessId:', clientData.businessId)
        console.log('📋 clientData.business:', clientData.business)
        console.log('📋 clientData.business?._id:', clientData.business?._id)
        
        const extractedBusinessId = clientData.businessId || clientData.business?._id || clientData.business
        console.log('📋 Extracted businessId:', extractedBusinessId)
        
        // Set the selected client in context
        const clientToSelect = {
          id: clientData._id || clientData.id,
          name: clientData.name,
          email: clientData.email,
          businessId: extractedBusinessId,
          businessName: clientData.businessName || clientData.company || client.name,
          gstin: clientData.gstin || client.gstin,
          pan: clientData.pan,
          businessType: clientData.businessType || client.type
        }
        
        console.log('📋 Calling selectClient with:', clientToSelect)
        selectClient(clientToSelect)

        // Show success toast
        toast({
          title: "Client Selected",
          description: `Now viewing data for ${clientData.name}. Navigate to Dashboard to see their data.`,
          duration: 3000,
        })

        // Don't navigate - let user choose where to go
      } else {
        throw new Error('Invalid response data')
      }
    } catch (error) {
      console.error('Error accessing client:', error)
      toast({
        title: "Error",
        description: "Failed to access client data. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600">Loading clients...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="font-medium">Error loading clients</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No clients found</p>
          <p className="text-sm text-gray-500">Try adjusting your search filters</p>
        </div>
      ) : (
        filteredClients.map((client) => (
        <Card 
          key={client.id} 
          className="bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
          onClick={() => handleViewDetails(client.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    <AvatarInitials name={client.name} />
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg text-blue-900">{client.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-blue-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {client.type}
                      </span>
                      <span>GSTIN: {client.gstin}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-blue-600">
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
                <div className="text-lg font-semibold text-blue-900">{client.revenue}</div>
                <div className="text-sm text-blue-600">Annual Revenue</div>
                <div className="flex items-center gap-1 text-xs text-blue-500">
                  <Calendar className="h-3 w-3" />
                  Next: {client.nextDeadline}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-blue-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer font-medium" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewClientData(client)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Access Client Data
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-blue-50 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(client.id)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-blue-50">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-blue-50">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        ))
      )}

      <ClientDetailsModal 
        clientId={selectedClientId}
        isOpen={showClientDetails}
        onClose={handleCloseDetails}
      />
    </div>
  )
}
