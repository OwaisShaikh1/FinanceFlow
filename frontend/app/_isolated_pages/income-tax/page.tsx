"use client"
import { useState } from "react"
import { IncomeTaxDashboard } from "@/components/tax/income-tax-dashboard"
import { TaxSavingCalculator } from "@/components/tax/tax-saving-calculator"
import { AdvanceTaxCalculator } from "@/components/tax/advance-tax-calculator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calculator, FileText, Download, Calendar, AlertTriangle, Target, ChevronDown, ChevronUp } from "lucide-react"

export default function IncomeTaxPage() {
  const [isAdvanceTaxExpanded, setIsAdvanceTaxExpanded] = useState(false)
  const [isTaxSavingExpanded, setIsTaxSavingExpanded] = useState(false)
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Individual-focused Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Income Tax
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Calculate your tax liability, plan advance payments, and maximize savings with smart investment planning
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm font-medium bg-white border-blue-200">
                <Calendar className="h-3 w-3 mr-1" />
                FY 2024-25
              </Badge>
              <Badge variant="secondary" className="text-sm font-medium bg-blue-100 text-blue-700">
                <AlertTriangle className="h-3 w-3 mr-1" />
                ITR Due: July 31, 2025
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 text-blue-700">
              <Calculator className="h-4 w-4 mr-2" />
              Quick Calculator
            </Button>
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Prepare ITR
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Tax Overview - Minimized */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 p-4">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-blue-900 mb-1">Your Tax Overview</h2>
        </div>
        <IncomeTaxDashboard onOpenPlanner={() => setIsTaxSavingExpanded(true)} />
      </div>

      {/* Tax Planning Tools */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">Tax Planning Tools</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Use our calculators to plan your taxes, calculate advance payments, and optimize your investment strategy for maximum savings
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Advance Tax Calculator - Collapsible */}
          <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50 transition-shadow">
            <CardHeader 
              className="cursor-pointer transition-colors border-b border-blue-100"
              onClick={() => setIsAdvanceTaxExpanded(!isAdvanceTaxExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Advance Tax Calculator</h3>
                    <p className="text-sm text-blue-700">Calculate quarterly advance tax payments to avoid penalties</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  {isAdvanceTaxExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
            </CardHeader>
            {isAdvanceTaxExpanded && (
              <CardContent className="pt-4 animate-in slide-in-from-top-2 duration-300">
                <AdvanceTaxCalculator />
              </CardContent>
            )}
          </Card>

          {/* Tax Saving Calculator - Collapsible */}
          <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50 transition-shadow">
            <CardHeader 
              className="cursor-pointer transition-colors border-b border-blue-100"
              onClick={() => setIsTaxSavingExpanded(!isTaxSavingExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Tax Saving Planner</h3>
                    <p className="text-sm text-blue-700">Optimize investments across 80C, 80D, and other sections</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  {isTaxSavingExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </div>
            </CardHeader>
            {isTaxSavingExpanded && (
              <CardContent className="pt-4 animate-in slide-in-from-top-2 duration-300">
                <TaxSavingCalculator />
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-16 flex-col gap-2">
            <Download className="h-5 w-5" />
            <span className="text-sm">Download Tax Summary</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col gap-2">
            <FileText className="h-5 w-5" />
            <span className="text-sm">View Tax Documents</span>
          </Button>
          <Button variant="outline" className="h-16 flex-col gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Set Tax Reminders</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
