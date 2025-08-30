"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdvanceTaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState<number>(0)
  const [deductions, setDeductions] = useState<number>(0)
  const [regime, setRegime] = useState<"old" | "new">("new")

  const calculateTax = () => {
    const taxableIncome = Math.max(0, annualIncome - deductions)
    let tax = 0

    if (regime === "new") {
      // New tax regime rates (simplified)
      if (taxableIncome <= 300000) tax = 0
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05
      else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1
      else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15
      else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2
      else tax = 150000 + (taxableIncome - 1500000) * 0.3
    } else {
      // Old tax regime rates (simplified)
      if (taxableIncome <= 250000) tax = 0
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05
      else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2
      else tax = 112500 + (taxableIncome - 1000000) * 0.3
    }

    // Add 4% cess
    tax = tax * 1.04

    const quarterlyTax = tax / 4
    const advanceTaxDates = [
      { quarter: "Q1", dueDate: "15th June", amount: quarterlyTax * 0.15 },
      { quarter: "Q2", dueDate: "15th September", amount: quarterlyTax * 0.45 },
      { quarter: "Q3", dueDate: "15th December", amount: quarterlyTax * 0.75 },
      { quarter: "Q4", dueDate: "15th March", amount: quarterlyTax },
    ]

    return { tax, quarterlyTax, advanceTaxDates, taxableIncome }
  }

  const { tax, advanceTaxDates, taxableIncome } = calculateTax()

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
            <Select value={regime} onValueChange={(value: "old" | "new") => setRegime(value)}>
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
                <span>₹{tax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
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
