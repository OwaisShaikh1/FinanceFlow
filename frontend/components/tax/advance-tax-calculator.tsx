"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { computeTax, ComputeTaxResult } from "@/lib/tax/calculate"
import { TaxRegime } from "@/lib/tax/taxapi"

export function AdvanceTaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState<number>(0)
  const [deductions, setDeductions] = useState<number>(0)
  const [regime, setRegime] = useState<TaxRegime>("new")

  const calculateTax = (): ComputeTaxResult => {
    return computeTax({ income: annualIncome, deductions, regime })
  }

  const { taxableIncome, totalTax } = calculateTax()

  const quarterlyTax = totalTax / 4
  const advanceTaxDates = [
    { quarter: "Q1", dueDate: "15th June", amount: quarterlyTax * 0.15 },
    { quarter: "Q2", dueDate: "15th September", amount: quarterlyTax * 0.45 },
    { quarter: "Q3", dueDate: "15th December", amount: quarterlyTax * 0.75 },
    { quarter: "Q4", dueDate: "15th March", amount: quarterlyTax },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advance Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
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
              value={deductions || ""}
              onChange={(e) => setDeductions(Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tax Regime</Label>
            <Select value={regime} onValueChange={(value: TaxRegime) => setRegime(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Tax Regime</SelectItem>
                <SelectItem value="old">Old Tax Regime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {annualIncome > 0 && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Taxable Income:</span>
                <span>₹{taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Annual Tax:</span>
                <span>₹{totalTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
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

            <Button className="w-full">Set Payment Reminders</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
