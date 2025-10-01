"use client"

import { TDSDashboard, TDSDashboardRef } from "@/components/tax/tds-dashboard"
import { TDSCalculator } from "@/components/tax/tds-calculator"
import { TDSReturns } from "@/components/tax/tds-returns"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, Download } from "lucide-react"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">TDS Management</h1>
          <p className="text-muted-foreground">Manage TDS calculations, deductions, and returns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            TDS Calculator
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Form 16
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            File Return
          </Button>
        </div>
      </div>

      <TDSDashboard ref={dashboardRef} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TDSCalculator onTDSRecorded={handleTDSRecorded} />
        <TDSReturns />
      </div>
    </div>
  )
}
