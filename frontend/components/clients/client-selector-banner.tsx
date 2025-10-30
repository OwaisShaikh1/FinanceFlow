"use client"

import { useState, useEffect } from "react"
import { useClientContext } from "@/contexts/ClientContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, X, User, Mail, FileText, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

type Client = {
  id: string
  name: string
  email: string
  businessName?: string
  company?: string
}

export function ClientSelectorBanner() {
  const { selectedClient, clearClient, isCAMode, selectClient } = useClientContext()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (isCAMode && selectedClient) {
      fetchClients()
    }
  }, [isCAMode, selectedClient])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch clients")
      }

      const data = await response.json()
      if (data.success && Array.isArray(data.clients)) {
        setClients(data.clients)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectClient = async (client: Client) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/clients/${client.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch client details")
      }

      const data = await response.json()
      if (data.success && data.client) {
        const clientData = data.client
        const clientToSelect = {
          id: clientData._id || clientData.id,
          name: clientData.name,
          email: clientData.email,
          businessId: clientData.businessId || clientData.business?._id || clientData.business,
          businessName: clientData.businessName || clientData.company || client.name,
          gstin: clientData.gstin,
          pan: clientData.pan,
          businessType: clientData.businessType,
        }

        selectClient(clientToSelect)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error("Error selecting client:", error)
    }
  }

  if (!isCAMode || !selectedClient) {
    return null
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-blue-600 text-white rounded-full p-2">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-blue-900">Viewing Client Data</h3>
              <Badge className="bg-blue-600 text-white">CA Mode</Badge>
              
              {/* Client Switcher Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 h-7 border-blue-300 hover:bg-blue-100 text-blue-900"
                  >
                    <span className="font-semibold">{selectedClient.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80">
                  <DropdownMenuLabel>Switch Client</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <div className="max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Loading clients...
                      </div>
                    ) : clients.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No clients found
                      </div>
                    ) : (
                      clients.map((client) => (
                        <DropdownMenuItem
                          key={client.id}
                          onClick={() => handleSelectClient(client)}
                          className={`cursor-pointer ${
                            selectedClient.id === client.id ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{client.name}</span>
                              {selectedClient.id === client.id && (
                                <Badge variant="secondary" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{client.email}</span>
                            {(client.businessName || client.company) && (
                              <span className="text-xs text-muted-foreground">
                                {client.businessName || client.company}
                              </span>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Toggle Details Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="ml-auto h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>
            
            {/* Client Details - Collapsible */}
            {showDetails && (
              <div className="flex items-center gap-4 text-sm text-blue-700 mt-2">
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span className="font-medium">{selectedClient.name}</span>
                </div>
                {selectedClient.businessName && selectedClient.businessName !== 'Not Available' && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{selectedClient.businessName}</span>
                  </div>
                )}
                {selectedClient.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{selectedClient.email}</span>
                  </div>
                )}
                {selectedClient.gstin && selectedClient.gstin !== 'Not Available' && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="font-mono text-xs">{selectedClient.gstin}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Clear Selection Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={clearClient}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 ml-4"
        >
          <X className="h-4 w-4 mr-1" />
          Exit Client View
        </Button>
      </div>
    </Card>
  )
}
