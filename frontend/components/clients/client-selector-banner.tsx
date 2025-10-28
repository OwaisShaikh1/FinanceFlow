"use client"

import { useClientContext } from "@/contexts/ClientContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, X, User, Mail, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ClientSelectorBanner() {
  const { selectedClient, clearClient, isCAMode } = useClientContext()

  if (!isCAMode || !selectedClient) {
    return null
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white rounded-full p-2">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-blue-900">Viewing Client Data</h3>
              <Badge className="bg-blue-600 text-white">CA Mode</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-700">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span className="font-medium">{selectedClient.name}</span>
              </div>
              {selectedClient.businessName && (
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
              {selectedClient.gstin && (
                <div className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="font-mono text-xs">{selectedClient.gstin}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearClient}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
        >
          <X className="h-4 w-4 mr-1" />
          Clear Selection
        </Button>
      </div>
    </Card>
  )
}
