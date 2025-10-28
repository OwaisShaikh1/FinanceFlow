"use client"

import { useClientContext } from "@/contexts/ClientContext"
import { Building2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ClientNotification() {
  const { selectedClient, clearClient, isViewingAsClient } = useClientContext()

  if (!isViewingAsClient || !selectedClient) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-4 border-2 border-white backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-90">Viewing Client Data</span>
            <span className="text-sm font-bold">{selectedClient.name}</span>
          </div>
        </div>
        
        <div className="h-6 w-px bg-white/30"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={clearClient}
          className="text-white hover:bg-white/20 h-8 px-3 rounded-full"
        >
          <X className="h-4 w-4 mr-1" />
          Exit
        </Button>
      </div>
    </div>
  )
}
