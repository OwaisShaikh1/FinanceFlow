"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface SelectedClient {
  id: string
  name: string
  email: string
  businessId?: string
  businessName?: string
  gstin?: string
  pan?: string
  businessType?: string
}

interface ClientContextType {
  selectedClient: SelectedClient | null
  selectClient: (client: SelectedClient) => void
  clearClient: () => void
  isViewingAsClient: boolean
  isCAMode: boolean
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export const useClientContext = () => {
  const context = useContext(ClientContext)
  if (!context) {
    throw new Error("useClientContext must be used within ClientContextProvider")
  }
  return context
}

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null)
  const [isCAMode, setIsCAMode] = useState(false)

  // Load selected client from localStorage on mount
  useEffect(() => {
    const savedClient = localStorage.getItem("selectedClient")
    const user = localStorage.getItem("user")
    
    if (savedClient) {
      try {
        setSelectedClient(JSON.parse(savedClient))
      } catch (error) {
        console.error("Error parsing saved client:", error)
        localStorage.removeItem("selectedClient")
      }
    }

    // Check if user is CA
    if (user) {
      try {
        const userData = JSON.parse(user)
        setIsCAMode(userData.role === 'ca' || userData.role === 'CA')
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // Save selected client to localStorage whenever it changes
  useEffect(() => {
    if (selectedClient) {
      localStorage.setItem("selectedClient", JSON.stringify(selectedClient))
    } else {
      localStorage.removeItem("selectedClient")
    }
  }, [selectedClient])

  const selectClient = (client: SelectedClient) => {
    setSelectedClient(client)
  }

  const clearClient = () => {
    setSelectedClient(null)
    localStorage.removeItem("selectedClient")
  }

  const isViewingAsClient = selectedClient !== null

  return (
    <ClientContext.Provider
      value={{
        selectedClient,
        selectClient,
        clearClient,
        isViewingAsClient,
        isCAMode,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

// Backwards compatibility
export const ClientContextProvider = ClientProvider
