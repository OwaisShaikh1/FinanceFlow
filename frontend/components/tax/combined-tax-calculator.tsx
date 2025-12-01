"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface TaxCalculationResult {
  taxableIncome: number
  totalTax: number
  taxAfterRebate: number
  effectiveRate: number
}

export function CombinedTaxCalculator() {
  // Basic inputs
  const [annualIncome, setAnnualIncome] = useState<number>(0)
  const [totalDeductions, setTotalDeductions] = useState<number>(0)
  const [regime, setRegime] = useState<"old" | "new">("new")
  
  // Investment amounts for each section
  const [section80C, setSection80C] = useState<number>(0)
  const [section80D, setSection80D] = useState<number>(0)
  const [section80G, setSection80G] = useState<number>(0)
  const [section80E, setSection80E] = useState<number>(0)
  const [section80EE, setSection80EE] = useState<number>(0)
  const [section80GGC, setSection80GGC] = useState<number>(0)
  const [advanceTaxPaid, setAdvanceTaxPaid] = useState<number>(0)
  
  const router = useRouter()

  // Tax calculation results
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculationResult>({
    taxableIncome: 0,
    totalTax: 0,
    taxAfterRebate: 0,
    effectiveRate: 0
  })

  // Auto-save user tax data to backend
  const saveUserTaxData = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.id) {
        const totalInvestments = section80C + section80D + section80G + section80E + section80EE + section80GGC
        const taxData = {
          annualIncome,
          taxRegime: regime,
          section80C,
          section80D,
          section80G,
          section80E,
          section80EE,
          section80GGC,
          otherDeductions: totalDeductions,
          advanceTaxPaid,
          estimatedAnnualTax: taxCalculation.totalTax,
          totalTaxSaved: regime === 'old' && totalInvestments > 0 ? calculateTaxSaved() : 0,
          lastCalculatedAt: new Date()
        }

        await fetch(`http://localhost:5000/api/user/${user.id}/tax-data`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taxData)
        })
      }
    } catch (error) {
      console.error('Error auto-saving tax data:', error)
    }
  }, [annualIncome, regime, section80C, section80D, section80G, section80E, section80EE, section80GGC, totalDeductions, advanceTaxPaid, taxCalculation.totalTax])

  // Note: Removed auto-loading of saved data to start fresh each session
  // Data is still saved to database via auto-save, but doesn't auto-load on component mount

  const handleRegimeChange = (newRegime: "old" | "new") => {
    setRegime(newRegime)
    // Reset deductions when switching to new regime
    if (newRegime === 'new') {
      setSection80C(0)
      setSection80D(0)
      setSection80G(0)
      setSection80E(0)
      setSection80EE(0)
      setSection80GGC(0)
    }
  }

  const computeTax = (params: { income: number; deductions: number; regime: "old" | "new" }): TaxCalculationResult => {
    const { income, deductions, regime } = params
    const taxableIncome = Math.max(0, income - deductions)
    
    let totalTax = 0
    
    if (regime === "new") {
      // New tax regime slabs
      if (taxableIncome > 300000) totalTax += Math.min(taxableIncome - 300000, 300000) * 0.05
      if (taxableIncome > 600000) totalTax += Math.min(taxableIncome - 600000, 300000) * 0.10
      if (taxableIncome > 900000) totalTax += Math.min(taxableIncome - 900000, 300000) * 0.15
      if (taxableIncome > 1200000) totalTax += Math.min(taxableIncome - 1200000, 300000) * 0.20
      if (taxableIncome > 1500000) totalTax += (taxableIncome - 1500000) * 0.30
    } else {
      // Old tax regime slabs
      if (taxableIncome > 250000) totalTax += Math.min(taxableIncome - 250000, 250000) * 0.05
      if (taxableIncome > 500000) totalTax += Math.min(taxableIncome - 500000, 500000) * 0.20
      if (taxableIncome > 1000000) totalTax += (taxableIncome - 1000000) * 0.30
    }

    // Apply rebate under section 87A for taxable income up to 5 lakhs
    const taxAfterRebate = taxableIncome <= 500000 ? Math.max(0, totalTax - 12500) : totalTax
    const effectiveRate = income > 0 ? (taxAfterRebate / income) * 100 : 0

    return {
      taxableIncome,
      totalTax: taxAfterRebate,
      taxAfterRebate,
      effectiveRate
    }
  }

  useEffect(() => {
    const totalInvestments = section80C + section80D + section80G + section80E + section80EE + section80GGC
    const deductions = regime === 'old' 
      ? 50000 + totalDeductions + totalInvestments
      : 50000 + totalDeductions
    const result = computeTax({ income: annualIncome, deductions, regime })
    
    setTaxCalculation(result)
    
    // Auto-save after calculation (with debounce)
    if (annualIncome > 0) {
      const timeoutId = setTimeout(saveUserTaxData, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [annualIncome, totalDeductions, section80C, section80D, section80G, section80E, section80EE, section80GGC, regime, saveUserTaxData])

  // Reset all fields to zero
  const resetAllFields = useCallback(() => {
    setAnnualIncome(0)
    setTotalDeductions(0)
    setSection80C(0)
    setSection80D(0)
    setSection80G(0)
    setSection80E(0)
    setSection80EE(0)
    setSection80GGC(0)
    setAdvanceTaxPaid(0)
    setRegime("new")
  }, [])

  // Load previous saved data
  const loadPreviousData = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.id) {
        const response = await fetch(`http://localhost:5000/api/user/${user.id}/tax-data`)
        if (response.ok) {
          const data = await response.json()
          if (data.taxData) {
            setAnnualIncome(data.taxData.annualIncome || 0)
            setRegime(data.taxData.taxRegime || "new")
            setSection80C(data.taxData.section80C || 0)
            setSection80D(data.taxData.section80D || 0)
            setSection80G(data.taxData.section80G || 0)
            setSection80E(data.taxData.section80E || 0)
            setSection80EE(data.taxData.section80EE || 0)
            setSection80GGC(data.taxData.section80GGC || 0)
            setTotalDeductions(data.taxData.otherDeductions || 0)
            setAdvanceTaxPaid(data.taxData.advanceTaxPaid || 0)
            alert('Previous tax data loaded successfully!')
          } else {
            alert('No previous tax data found.')
          }
        }
      }
    } catch (error) {
      console.error("Error loading previous tax data:", error)
      alert('Error loading previous data.')
    }
  }, [])

  // Common API call function
  const callTaxAPI = async (endpoint: string, successMessage: string) => {
    try {
      const taxData = {
        annualIncome,
        totalTax: taxCalculation.totalTax,
        regime,
        investments: { section80C, section80D, section80G, section80E, section80EE, section80GGC }
      }

      const response = await fetch(`http://localhost:5000/api/taxcalc/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taxData)
      })

      if (response.ok) {
        alert(successMessage)
        if (endpoint === 'payment-reminder') {
          // Reload the entire page after successful payment reminder save
          window.location.reload()
        }
      } else {
        alert(`Failed to ${endpoint.replace('-', ' ')}`)
      }
    } catch (error) {
      console.error(`Error with ${endpoint}:`, error)
      alert(`Error with ${endpoint.replace('-', ' ')}`)
    }
  }

  const generateInvestmentPlan = () => callTaxAPI('payment-reminder', 'Investment plan generated successfully!')
  
  const exportTaxSavingReport = () => {
    // Create Excel-compatible data structure
    const taxData = [
      ['Tax Saving Report', ''],
      ['Generated on:', new Date().toLocaleDateString('en-IN')],
      ['', ''],
      ['Annual Income', `₹${annualIncome.toLocaleString()}`],
      ['Tax Regime', regime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'],
      ['', ''],
      ['Tax Calculation', ''],
      ['Taxable Income', `₹${taxCalculation.taxableIncome.toLocaleString()}`],
      ['Total Tax', `₹${Math.round(taxCalculation.totalTax).toLocaleString()}`],
      ['Effective Tax Rate', `${taxCalculation.effectiveRate.toFixed(2)}%`],
      ['', ''],
      ['Investments & Deductions', ''],
      ['Section 80C', `₹${section80C.toLocaleString()}`],
      ['Section 80D', `₹${section80D.toLocaleString()}`],
      ['Section 80G', `₹${section80G.toLocaleString()}`],
      ['Section 80E', `₹${section80E.toLocaleString()}`],
      ['Section 80EE', `₹${section80EE.toLocaleString()}`],
      ['Section 80CCD2', `₹${section80GGC.toLocaleString()}`],
      ['Total Investments', `₹${totalInvested.toLocaleString()}`],
      ['', ''],
      ['Tax Savings', ''],
      ['Tax Saved through Investments', `₹${totalTaxSaved.toLocaleString()}`],
      ['Advance Tax Paid', `₹${advanceTaxPaid.toLocaleString()}`],
      ['', ''],
      ['Advance Tax Schedule', ''],
      ['Q1 - Due 15th June', `₹${Math.round(taxCalculation.totalTax * 0.15).toLocaleString()}`],
      ['Q2 - Due 15th September', `₹${Math.round(taxCalculation.totalTax * 0.30).toLocaleString()}`],
      ['Q3 - Due 15th December', `₹${Math.round(taxCalculation.totalTax * 0.45).toLocaleString()}`],
      ['Q4 - Due 15th March', `₹${Math.round(taxCalculation.totalTax).toLocaleString()}`],
    ]

    // Convert to CSV format
    const csvContent = taxData.map(row => row.join(',')).join('\n')
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `Tax_Saving_Report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    alert('Tax saving report exported successfully!')
  }
  
  const setPaymentReminders = () => callTaxAPI('payment-reminder', 'Payment reminders set successfully!')

  // Memoized calculations
  const totalInvested = section80C + section80D + section80G + section80E + section80EE + section80GGC
  
  const calculateTaxSaved = useCallback(() => {
    if (annualIncome === 0 || regime === 'new' || totalInvested === 0) return 0
    
    const taxBefore = computeTax({ income: annualIncome, deductions: 50000 + totalDeductions, regime }).totalTax
    const taxAfter = computeTax({ income: annualIncome, deductions: 50000 + totalDeductions + totalInvested, regime }).totalTax
    
    return Math.max(0, Math.round(taxBefore - taxAfter))
  }, [annualIncome, regime, totalDeductions, totalInvested])

  const totalTaxSaved = calculateTaxSaved()

  const getNextDueDate = () => {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const year = now.getFullYear()
    
    if (month < 6 || (month === 6 && day < 15)) return { date: "15th June", quarter: "Q1" }
    if (month < 9 || (month === 9 && day < 15)) return { date: "15th September", quarter: "Q2" }
    if (month < 12 || (month === 12 && day < 15)) return { date: "15th December", quarter: "Q3" }
    return { date: "15th March", quarter: "Q4" }
  }

  const nextDue = getNextDueDate()

  // Memoized data arrays
  const advanceTaxDates = [
    { quarter: "Q1", dueDate: "15th June", amount: taxCalculation.totalTax * 0.15 },
    { quarter: "Q2", dueDate: "15th September", amount: taxCalculation.totalTax * 0.30 },
    { quarter: "Q3", dueDate: "15th December", amount: taxCalculation.totalTax * 0.45 },
    { quarter: "Q4", dueDate: "15th March", amount: taxCalculation.totalTax }
  ]

  const taxSavingSections = [
    { code: "80C", description: "PPF, ELSS, Life Insurance, etc.", limit: 150000, invested: section80C, setInvested: setSection80C },
    { code: "80D", description: "Health Insurance Premium", limit: 25000, invested: section80D, setInvested: setSection80D },
    { code: "80G", description: "Donations to Charity", limit: 50000, invested: section80G, setInvested: setSection80G },
    { code: "80E", description: "Education Loan Interest", limit: 0, invested: section80E, setInvested: setSection80E },
    { code: "80EE", description: "Home Loan Interest (first-time buyers)", limit: 50000, invested: section80EE, setInvested: setSection80EE },
    { code: "80CCD2", description: "Employer NPS Contribution", limit: 150000, invested: section80GGC, setInvested: setSection80GGC }
  ]

  const availableSections = regime === 'old' ? taxSavingSections : []

  return (
    <div className="space-y-6">
      {/* Main Tax Dashboard Cards - Enhanced UI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Estimated Annual Tax */}
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-2 font-medium">ESTIMATED ANNUAL TAX</p>
                <p className="text-3xl font-bold text-slate-900 mb-2">
                  ₹{Math.round(taxCalculation.totalTax || 0).toLocaleString()}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-blue-600">
                    Based on income of ₹{(annualIncome || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-blue-500 mt-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Saved (Investments) */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-green-600 mb-2 font-medium">TAX SAVED (INVESTMENTS)</p>
                <p className="text-3xl font-bold text-green-800 mb-2">
                  ₹{totalTaxSaved.toLocaleString()}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-green-600">
                    Total invested: ₹{totalInvested.toLocaleString()}
                  </span>
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center ml-1">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advance Tax Paid */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-blue-600 mb-2 font-medium">ADVANCE TAX PAID</p>
                <p className="text-3xl font-bold text-blue-900 mb-2">
                  ₹{(advanceTaxPaid || 0).toLocaleString()}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-blue-600">
                    {taxCalculation.totalTax > 0 ? Math.round((advanceTaxPaid / taxCalculation.totalTax) * 100) : 0}% of estimated tax
                  </span>
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center ml-1">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Due Date */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-orange-600 mb-2 font-medium">NEXT DUE DATE</p>
                <p className="text-3xl font-bold text-orange-800 mb-2">{nextDue.date}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-orange-600">
                    {nextDue.quarter} advance tax
                  </span>
                  <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center ml-1">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Calculation & Saving Planner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Annual Income</Label>
              <Input
                id="income"
                type="number"
                placeholder="Enter annual income"
                value={annualIncome || ""}
                onChange={(e) => setAnnualIncome(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductions">Total Deductions</Label>
              <Input
                id="deductions"
                type="number"
                placeholder="Enter total deductions"
                value={totalDeductions || ""}
                onChange={(e) => setTotalDeductions(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advanceTax">Advance Tax Paid</Label>
              <Input
                id="advanceTax"
                type="number"
                placeholder="Enter advance tax paid"
                value={advanceTaxPaid || ""}
                onChange={(e) => setAdvanceTaxPaid(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tax Regime</Label>
              <Select value={regime} onValueChange={handleRegimeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Tax Regime</SelectItem>
                  <SelectItem value="old">Old Tax Regime</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {regime === "new" ? "Lower rates, no deductions" : "Higher rates, allows deductions"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Calculation Breakdown */}
      {annualIncome > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tax Calculation Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">
              {totalInvested > 0 ? 'Detailed tax calculation with investment savings' : 'Enter investments in the old regime to see savings'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxBefore">Tax Before Investments</Label>
                  <Input
                    id="taxBefore"
                    type="text"
                    value={`₹${Math.round(
                      regime === 'new' 
                        ? taxCalculation.totalTax 
                        : computeTax({ income: annualIncome, deductions: 50000 + totalDeductions, regime }).totalTax
                    ).toLocaleString()}`}
                    readOnly
                    className="bg-red-50 border-red-200 text-red-800 font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxAfter">Tax After Investments</Label>
                  <Input
                    id="taxAfter"
                    type="text"
                    value={`₹${Math.round(taxCalculation.totalTax).toLocaleString()}`}
                    readOnly
                    className="bg-blue-50 border-blue-200 text-blue-800 font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxSaved">Tax Saved</Label>
                  <Input
                    id="taxSaved"
                    type="text"
                    value={`₹${calculateTaxSaved().toLocaleString()}`}
                    readOnly
                    className="bg-green-50 border-green-200 text-green-800 font-medium"
                  />
                </div>
              </div>
              
              {totalInvested > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800">Your Tax Savings Summary</h4>
                      <p className="text-sm text-green-700">
                        By investing ₹{totalInvested.toLocaleString()} in tax-saving instruments, you save ₹{totalTaxSaved.toLocaleString()} in taxes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {totalTaxSaved > 0 ? Math.round((totalTaxSaved / totalInvested) * 100) : 0}%
                      </p>
                      <p className="text-xs text-green-600">Effective Return</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Saving Calculator */}
      {annualIncome > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tax Saving Calculator</CardTitle>
            <p className="text-sm text-muted-foreground">
              {regime === "new" 
                ? "Limited deductions available in New Tax Regime" 
                : "Plan your investments to maximize tax savings"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
{availableSections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No additional deduction sections available in New Tax Regime</p>
                <p className="text-sm">Standard deduction of ₹50,000 is automatically applied</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableSections.map((section, index) => {
                  const progressPercentage = section.limit > 0 ? Math.min((section.invested / section.limit) * 100, 100) : 0
                  
                  return (
                    <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
                      <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                        <div>
                          <h6 className="text-sm font-semibold text-gray-900">Section {section.code}</h6>
                          <p className="text-xs text-gray-700">{section.description}</p>
                        </div>
                        {section.limit > 0 && (
                          <div className="text-sm font-medium text-gray-700">
                            Limit: ₹{section.limit.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 space-y-3">
                        <Input
                          type="number"
                          placeholder="0"
                          value={section.invested || ""}
                          onChange={(e) => {
                            const value = Math.min(Number.parseFloat(e.target.value) || 0, section.limit || Infinity)
                            section.setInvested(value)
                          }}
                          className="text-sm"
                          min="0"
                          max={section.limit || undefined}
                        />
                        
                        {section.limit > 0 && (
                          <div className="relative">
                            <div className="w-full bg-gray-200 border border-gray-300 h-7 rounded-md relative overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-between px-2">
                                <span className="text-xs font-bold text-gray-900 drop-shadow-sm">
                                  ₹{section.invested.toLocaleString()}
                                </span>
                                <span className="text-xs font-bold text-gray-900 drop-shadow-sm">
                                  ₹{section.limit.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {section.limit > 0 && (
                          <div className="flex gap-1">
                            {[0.25, 0.5, 0.75, 1].map(percent => (
                              <button
                                key={percent}
                                type="button"
                                onClick={() => section.setInvested(section.limit * percent)}
                                className={`px-2 py-1 text-xs border rounded-md transition-colors font-medium ${
                                  percent === 1 
                                    ? 'bg-blue-600 hover:bg-blue-700 border-blue-700 text-white shadow-sm'
                                    : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-800'
                                }`}
                              >
                                {percent === 1 ? 'Max' : `${percent * 100}%`}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Advance Tax Calculator Section */}
      {annualIncome > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Advance Tax Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Taxable Income:</span>
                <span>₹{taxCalculation.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Annual Tax:</span>
                <span>₹{taxCalculation.totalTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Advance Tax Schedule:</h4>
              {advanceTaxDates.map((payment, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <div>
                    <span className="font-medium">{payment.quarter}</span>
                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                  <span className="font-medium">
                    ₹{payment.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All buttons at the end as requested */}
      <div className="flex gap-3 pt-4">
        <Button 
          onClick={exportTaxSavingReport} 
          variant="outline" 
          className="flex-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:text-green-800 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Tax Saving Report
        </Button>
        <Button 
          onClick={setPaymentReminders} 
          className="flex-1 bg-blue-600 hover:bg-blue-700 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Set Payment Reminders
        </Button>
        <Button 
          onClick={loadPreviousData} 
          variant="secondary" 
          className="flex-1 bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Load Previous Data
        </Button>
        <Button 
          onClick={resetAllFields} 
          variant="destructive" 
          className="flex-1 bg-red-600 hover:bg-red-700 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All Fields
        </Button>
      </div>
    </div>
  )
}

export default CombinedTaxCalculator