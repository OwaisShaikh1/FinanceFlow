"use client"

import { TDSDashboard, TDSDashboardRef } from "@/components/tax/tds-dashboard"
import { TDSCalculator } from "@/components/tax/tds-calculator"
import { TDSReturns } from "@/components/tax/tds-returns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileText, Download, Shield, Users } from "lucide-react"
import { useState, useRef } from "react"

export default function TDSPage() {
  const dashboardRef = useRef<TDSDashboardRef>(null);

  const handleTDSRecorded = () => {
    // Refresh the dashboard when a new TDS record is added
    if (dashboardRef.current) {
      dashboardRef.current.refreshDashboard();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              TDS Management Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Complete TDS compliance, deduction calculations, return filing, and certificate management
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm font-medium bg-white">
                Current Quarter: Q2 FY 2024-25
              </Badge>
              <Badge variant="secondary" className="text-sm font-medium">
                Next Filing: 31st October 2025
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
              <Calculator className="h-4 w-4 mr-2" />
              TDS Calculator
            </Button>
            <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
              <FileText className="h-4 w-4 mr-2" />
              Generate Form 16
            </Button>
            <Button 
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              File Return
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Dashboard Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-purple-900 mb-2">TDS Overview</h3>
          <p className="text-purple-700">Current TDS status, deductions, compliance summary, and certificate tracking</p>
        </div>
        <TDSDashboard ref={dashboardRef} />
      </div>

      {/* Enhanced Content Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-purple-900 mb-2">Calculations & Returns</h3>
          <p className="text-purple-700">TDS calculations, deduction processing, and return management</p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-900">TDS Calculator</h4>
            <TDSCalculator onTDSRecorded={handleTDSRecorded} />
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-900">TDS Returns</h4>
            <TDSReturns />
          </div>
        </div>
      </div>
    </div>
  )
}
