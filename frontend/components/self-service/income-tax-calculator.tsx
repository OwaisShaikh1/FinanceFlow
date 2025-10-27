"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"

export function IncomeTaxCalculator() {
  const [income, setIncome] = useState("")
  const [age, setAge] = useState("")
  const [deductions, setDeductions] = useState("")
  const [result, setResult] = useState<{
    taxableIncome: number
    tax: number
    effectiveRate: number
  } | null>(null)

  const calculateTax = () => {
    const grossIncome = Number.parseFloat(income) || 0
    const totalDeductions = Number.parseFloat(deductions) || 0
    const taxableIncome = Math.max(0, grossIncome - totalDeductions)

    let tax = 0
    let exemptionLimit = 250000 // Default for below 60

    if (age === "senior") exemptionLimit = 300000
    if (age === "super-senior") exemptionLimit = 500000

    if (taxableIncome > exemptionLimit) {
      const taxableAmount = taxableIncome - exemptionLimit

      // New tax regime slabs (simplified)
      if (taxableAmount <= 250000) {
        tax = taxableAmount * 0.05
      } else if (taxableAmount <= 500000) {
        tax = 250000 * 0.05 + (taxableAmount - 250000) * 0.1
      } else if (taxableAmount <= 750000) {
        tax = 250000 * 0.05 + 250000 * 0.1 + (taxableAmount - 500000) * 0.15
      } else if (taxableAmount <= 1000000) {
        tax = 250000 * 0.05 + 250000 * 0.1 + 250000 * 0.15 + (taxableAmount - 750000) * 0.2
      } else if (taxableAmount <= 1250000) {
        tax = 250000 * 0.05 + 250000 * 0.1 + 250000 * 0.15 + 250000 * 0.2 + (taxableAmount - 1000000) * 0.25
      } else {
        tax =
          250000 * 0.05 + 250000 * 0.1 + 250000 * 0.15 + 250000 * 0.2 + 250000 * 0.25 + (taxableAmount - 1250000) * 0.3
      }
    }

    const effectiveRate = grossIncome > 0 ? (tax / grossIncome) * 100 : 0

    setResult({
      taxableIncome,
      tax,
      effectiveRate,
    })
  }

  // Auto-calculate tax when values change
  useEffect(() => {
    if (income && age) {
      calculateTax()
    }
  }, [income, age, deductions])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Income Tax Calculator</CardTitle>
        </div>
        <CardDescription>Calculate your income tax liability for FY 2024-25</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="income">Annual Income (₹)</Label>
            <Input
              id="income"
              type="number"
              placeholder="e.g., 800000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age Category</Label>
            <Select value={age} onValueChange={setAge}>
              <SelectTrigger>
                <SelectValue placeholder="Select age category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below-60">Below 60 years</SelectItem>
                <SelectItem value="senior">60-80 years (Senior)</SelectItem>
                <SelectItem value="super-senior">Above 80 years (Super Senior)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deductions">Total Deductions (₹)</Label>
          <Input
            id="deductions"
            type="number"
            placeholder="e.g., 150000 (80C + other deductions)"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
          />
        </div>

        <Button onClick={calculateTax} className="w-full" variant="outline">
          Recalculate Tax
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-semibold text-lg">Tax Calculation Result</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Taxable Income:</span>
                <div className="font-semibold">₹{result.taxableIncome.toLocaleString("en-IN")}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Income Tax:</span>
                <div className="font-semibold text-primary">₹{result.tax.toLocaleString("en-IN")}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Effective Rate:</span>
                <div className="font-semibold">{result.effectiveRate.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
