import { ClientForm } from "@/components/clients/client-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewClientPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/clients">
              <Button variant="ghost" size="sm" className="hover:bg-blue-50 text-blue-700 border border-blue-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Add New Client</h1>
              <p className="text-blue-600 mt-1">Create a new client profile and setup their account</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-600">Quick Setup</div>
            <div className="text-xs text-blue-500 mt-1">Fill required fields marked with *</div>
          </div>
        </div>
      </div>

      <ClientForm />
    </div>
  )
}
