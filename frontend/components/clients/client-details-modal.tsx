"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  FileText, 
  IndianRupee,
  Shield,
  Clock,
  X,
  Loader2,
  Edit,
  Download
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ClientDetailsProps {
  clientId: string | null
  isOpen: boolean
  onClose: () => void
}

interface ClientDetails {
  id: string
  name: string
  email: string
  phone: string
  businessName: string
  businessType: string
  company: string
  gstin: string
  pan: string
  filingScheme: string
  address: string
  city: string
  state: string
  pincode: string
  taxData: {
    annualIncome: number
    taxRegime: string
    section80C: number
    section80D: number
    totalTaxSaved: number
    estimatedAnnualTax: number
  }
  role: string
  provider: string
  createdAt: string
  status: string
  compliance: string
  lastActivity: string
  nextDeadline: string
  revenue: string
}

export function ClientDetailsModal({ clientId, isOpen, onClose }: ClientDetailsProps) {
  const [client, setClient] = useState<ClientDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (clientId && isOpen) {
      fetchClientDetails()
    }
  }, [clientId, isOpen])

  const fetchClientDetails = async () => {
    if (!clientId) return
    
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
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
        setClient(data.client)
      } else {
        throw new Error(data.message || 'Failed to fetch client details')
      }
    } catch (error) {
      console.error('Error fetching client details:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch client details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-900">
            <User className="h-5 w-5" />
            Client Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-blue-600">Loading client details...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <p className="font-medium">Error loading client details</p>
              <p className="text-sm">{error}</p>
            </div>
            <Button onClick={fetchClientDetails} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              Retry
            </Button>
          </div>
        )}

        {client && !loading && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                      <AvatarInitials name={client.name} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900">{client.name}</h2>
                    <p className="text-blue-600">{client.businessName}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                      <Badge className={getComplianceColor(client.compliance)}>{client.compliance}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-900">{client.revenue}</div>
                  <p className="text-sm text-blue-600">Annual Revenue</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Contact Information */}
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-slate-700">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-slate-700">{client.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-slate-700">
                      {client.address !== 'Not Available' && <div>{client.address}</div>}
                      {client.city !== 'Not Available' && client.state !== 'Not Available' && (
                        <div>{client.city}, {client.state}</div>
                      )}
                      {client.pincode !== 'Not Available' && <div>{client.pincode}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Business Type</label>
                    <p className="text-sm text-slate-700">{client.businessType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Company</label>
                    <p className="text-sm text-slate-700">{client.company}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">GSTIN</label>
                    <p className="text-sm text-slate-700">{client.gstin}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">PAN</label>
                    <p className="text-sm text-slate-700">{client.pan}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Information */}
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tax Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Annual Income</label>
                    <p className="text-sm text-slate-700">₹{client.taxData.annualIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Tax Regime</label>
                    <p className="text-sm text-slate-700 capitalize">{client.taxData.taxRegime}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Section 80C</label>
                    <p className="text-sm text-slate-700">₹{client.taxData.section80C.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Filing Scheme</label>
                    <p className="text-sm text-slate-700 capitalize">{client.filingScheme}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Account Activity */}
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Account Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Account Created</label>
                    <p className="text-sm text-slate-700">
                      {new Date(client.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Last Activity</label>
                    <p className="text-sm text-slate-700">{client.lastActivity}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Next Deadline</label>
                    <p className="text-sm text-slate-700">{client.nextDeadline}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Login Method</label>
                    <p className="text-sm text-slate-700 capitalize">{client.provider}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Summary */}
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Estimated Tax</label>
                    <p className="text-sm text-slate-700">₹{client.taxData.estimatedAnnualTax.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Tax Saved</label>
                    <p className="text-sm text-slate-700">₹{client.taxData.totalTaxSaved.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Section 80D</label>
                    <p className="text-sm text-slate-700">₹{client.taxData.section80D.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Overall Status</label>
                    <Badge className={getComplianceColor(client.compliance)}>{client.compliance}</Badge>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">GST Status</label>
                    <Badge className={client.gstin !== 'Not Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}>
                      {client.gstin !== 'Not Available' ? 'Registered' : 'Not Registered'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">PAN Status</label>
                    <Badge className={client.pan !== 'Not Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}>
                      {client.pan !== 'Not Available' ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}