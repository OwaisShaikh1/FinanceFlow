"use client"

import { useMemo, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingUp, Calculator, Target, Download, Lightbulb, PieChart } from "lucide-react"
import { getSectionsForRegime, SectionDef, TaxRegime } from "@/lib/tax/taxapi"
import { computeAfterInvestments, generateInvestmentPlan } from "@/lib/tax/calculate"

export function TaxSavingCalculator() {
  const [regime, setRegime] = useState<TaxRegime>("old")
  const [annualIncome, setAnnualIncome] = useState<number>(800000)
  const [baseDeductions, setBaseDeductions] = useState<number>(50000)
  const [investments, setInvestments] = useState<Record<string, number>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeInvestmentTab, setActiveInvestmentTab] = useState("manual")
  const { toast } = useToast()

  const sections = useMemo<SectionDef[]>(() => getSectionsForRegime(regime), [regime])

  const updateInvestment = useCallback((code: string, amount: number) => {
    const s = sections.find((x) => x.code === code)
    const limit = s?.limit ?? null
    if (limit !== null && amount > limit) {
      setInvestments(prev => ({ ...prev, [code]: limit }))
      toast({
        title: "Investment Limit Exceeded",
        description: `Section ${code} limit is ₹${limit.toLocaleString()}. Amount adjusted to limit.`,
        variant: "destructive",
      })
    } else {
      setInvestments(prev => ({ ...prev, [code]: Math.max(0, amount) }))
    }
  }, [sections, toast])

  const autoOptimize = useCallback(() => {
    const totalBudget = Math.min(150000, annualIncome * 0.1) // 10% of income or 1.5L max
    const plan = generateInvestmentPlan(annualIncome, baseDeductions, regime, totalBudget)
    
    const optimizedInvestments: Record<string, number> = {}
    plan.suggestions.forEach(suggestion => {
      optimizedInvestments[suggestion.code] = suggestion.suggested
    })
    
    setInvestments(optimizedInvestments)
    toast({
      title: "Investment Optimized!",
      description: `Auto-allocated ₹${totalBudget.toLocaleString()} across tax-saving sections for maximum benefit.`,
    })
  }, [annualIncome, baseDeductions, regime, toast])

  const savings = useMemo(() => {
    const inputs = Object.entries(investments).map(([code, amount]) => ({ code, amount }))
    return computeAfterInvestments(annualIncome, baseDeductions, regime, inputs)
  }, [annualIncome, baseDeductions, regime, investments])

  const hasLimitExceed = sections.some((s) => {
    const val = investments[s.code] || 0
    return s.limit !== null && val > s.limit
  })

  const handleRegimeChange = (newRegime: TaxRegime) => {
    setRegime(newRegime)
    // Clear investments that aren't valid for the new regime
    const newSections = getSectionsForRegime(newRegime)
    const validCodes = new Set(newSections.map(s => s.code))
    const filteredInvestments: Record<string, number> = {}
    Object.entries(investments).forEach(([code, amount]) => {
      if (validCodes.has(code)) {
        filteredInvestments[code] = amount
      }
    })
    setInvestments(filteredInvestments)
  }

  return (
    <div className="space-y-6">
      {/* Main Calculator Card */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-blue-900">Tax Saving Calculator</CardTitle>
                <p className="text-sm text-blue-700 mt-1">Optimize investments for maximum tax savings</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="border-blue-200 hover:bg-blue-100"
            >
              {showAdvanced ? "Simple View" : "Advanced Options"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tax Regime</Label>
              <Select value={regime} onValueChange={handleRegimeChange}>
                <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Regime (FY 2025-26)</SelectItem>
                  <SelectItem value="old">Old Regime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Annual Income</Label>
              <Input
                type="number"
                value={annualIncome || ""}
                onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                className="bg-white border-blue-200 hover:border-blue-300"
                placeholder="Enter annual income"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Other Deductions</Label>
              <Input
                type="number"
                value={baseDeductions || ""}
                onChange={(e) => setBaseDeductions(parseFloat(e.target.value) || 0)}
                className="bg-white border-blue-200 hover:border-blue-300"
                placeholder="Non-section deductions"
              />
            </div>
          </div>

          {/* Tax Savings Summary */}
          {annualIncome > 0 && (
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tax Before Investments</p>
                  <p className="text-2xl font-bold text-red-600">₹{savings.taxBeforeInvestments.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tax After Investments</p>
                  <p className="text-2xl font-bold text-orange-600">₹{savings.taxAfterInvestments.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Tax Saved</p>
                  <p className="text-3xl font-bold text-green-600">₹{savings.taxSaved.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Planning Section */}
      {sections.length > 0 && (
        <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-4 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-900">Investment Planning</CardTitle>
                  <p className="text-sm text-blue-700 mt-1">Plan your tax-saving investments across different sections</p>
                </div>
              </div>
              <Button
                onClick={autoOptimize}
                variant="outline"
                size="sm"
                className="border-blue-200 hover:bg-blue-100"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Auto Optimize
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={activeInvestmentTab} onValueChange={setActiveInvestmentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-blue-100 border border-blue-200">
                <TabsTrigger value="manual" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-200">Manual Entry</TabsTrigger>
                <TabsTrigger value="sliders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-200">Smart Sliders</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                {sections.map((section) => {
                  const invested = investments[section.code] || 0
                  const limit = section.limit
                  const progress = limit !== null ? (invested / limit) * 100 : 0
                  const isOverLimit = limit !== null && invested > limit

                  return (
                    <div key={section.code} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">Section {section.code}</Label>
                        {limit !== null && (
                          <span className="text-xs text-blue-600">Limit: ₹{limit.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <Input
                          type="number"
                          value={invested || ""}
                          placeholder={`Max ₹${limit?.toLocaleString() || "No limit"}`}
                          onChange={(e) => updateInvestment(section.code, parseFloat(e.target.value) || 0)}
                          className={`${isOverLimit ? "border-red-300" : "border-blue-300"}`}
                        />
                        
                        {limit !== null && (
                          <div className="space-y-2">
                            <Progress 
                              value={Math.min(progress, 100)} 
                              className={`h-2 ${progress > 100 ? "bg-red-100 [&_div]:bg-red-500" : "bg-blue-100 [&_div]:bg-blue-600"}`} 
                            />
                            <div className="flex justify-between text-xs">
                              <span className={isOverLimit ? "text-red-600" : "text-blue-600"} >
                                ₹{invested.toLocaleString()}
                              </span>
                              <span className="text-blue-500">
                                {progress.toFixed(1)}% utilized
                              </span>
                              <span className="text-blue-500">₹{limit.toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-blue-600">{section.description}</p>
                    </div>
                  )
                })}
              </TabsContent>

              <TabsContent value="sliders" className="space-y-6">
                {sections.map((section) => {
                  const invested = investments[section.code] || 0
                  const limit = section.limit || 100000

                  return (
                    <div key={section.code} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium text-blue-900">Section {section.code}</Label>
                        <span className="text-sm font-medium text-blue-700">₹{invested.toLocaleString()}</span>
                      </div>
                      <Slider
                        value={[invested]}
                        onValueChange={(value) => updateInvestment(section.code, value[0])}
                        max={limit}
                        step={1000}
                        className="w-full [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600 [&_.bg-primary]:bg-blue-600 [&_[data-orientation=horizontal]]:bg-blue-200"
                      />
                      <p className="text-xs text-blue-600">{section.description}</p>
                    </div>
                  )
                })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* New Regime Information */}
      {sections.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">New Regime - Simplified Tax Structure</h4>
                <p className="text-sm text-blue-700 mb-3">
                  The New Tax Regime offers lower tax rates but doesn't allow most traditional deductions like 80C, 80D, etc. 
                  You can still claim employer NPS contributions and certain other specific deductions.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRegime("old")}
                  className="border-blue-300 hover:bg-blue-100"
                >
                  Switch to Old Regime for Deductions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            const plan = generateInvestmentPlan(annualIncome, baseDeductions, regime, 150000)
            toast({
              title: "Investment Plan Generated",
              description: `Optimized allocation: Expected saving ₹${plan.expectedTaxSaved.toFixed(0)}`,
            })
          }}
        >
          <Target className="h-4 w-4 mr-2" />
          Generate Smart Plan
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-blue-300 hover:bg-blue-50 text-blue-700"
          onClick={() => {
            const data = {
              regime,
              annualIncome,
              baseDeductions,
              investments,
              estimatedSavings: savings.taxSaved,
              generatedAt: new Date().toISOString(),
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "tax-saving-report.json"
            a.click()
            URL.revokeObjectURL(url)
            toast({ title: "Report Downloaded", description: "Your tax saving report has been downloaded." })
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  )
}