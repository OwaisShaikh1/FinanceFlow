import { GSTDashboard } from "@/components/tax/gst-dashboard"
import { GSTFilingCalendar } from "@/components/tax/gst-filing-calendar"
import { GSTReturns } from "@/components/tax/gst-returns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, Upload, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function GSTPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              GST Management Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Comprehensive GST compliance, return filing, calculations, and business tax management
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm font-medium bg-white">
                Current Quarter: Q2 FY 2024-25
              </Badge>
              <Badge variant="secondary" className="text-sm font-medium">
                Next Filing: 20th October 2025
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/gst/calculator">
              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                <Calculator className="h-4 w-4 mr-2" />
                GST Calculator
              </Button>
            </Link>
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              File Return
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Dashboard Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-green-900 mb-2">GST Overview</h3>
          <p className="text-green-700">Current GST status, collections, and compliance summary</p>
        </div>
        <GSTDashboard />
      </div>

      {/* Enhanced Content Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-green-900 mb-2">Returns & Compliance</h3>
          <p className="text-green-700">Manage GST returns, filing calendar, and compliance activities</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-green-900">GST Returns</h4>
            <GSTReturns />
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-green-900">Filing Calendar</h4>
            <GSTFilingCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}
