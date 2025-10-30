"use client"

import { useEffect, useState } from "react"
import { useClientContext } from "@/contexts/ClientContext"
import { Button } from "@/components/ui/button"
import { Users, X, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

type Client = {
  id: string
  name: string
  email: string
  businessName?: string
  company?: string
}

export function ClientSelectorDropdown() {
  const { selectedClient, clearClient, isViewingAsClient, selectClient } = useClientContext()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch clients list when dropdown is used
    if (isViewingAsClient) {
      fetchClients()
    }
  }, [isViewingAsClient])

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
      // Fetch full client details
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

        // Select the client using context
        selectClient(clientToSelect)
        
        // Navigate to dashboard to show client data
        router.push('/dashboard')
      }
    } catch (error) {
      console.error("Error selecting client:", error)
    }
  }

  const handleClearClient = () => {
    clearClient()
    router.push("/dashboard")
  }

  // Don't show if not viewing as client
  if (!isViewingAsClient || !selectedClient) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-blue-50 border-blue-300 hover:bg-blue-100 text-blue-900"
          >
            <Users className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-blue-600 font-medium">Viewing Client</span>
              <span className="text-sm font-semibold">{selectedClient.name}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
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

      <Button
        variant="ghost"
        size="icon"
        onClick={handleClearClient}
        className="h-9 w-9 text-blue-600 hover:text-blue-900 hover:bg-blue-100"
        title="Exit client view"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
