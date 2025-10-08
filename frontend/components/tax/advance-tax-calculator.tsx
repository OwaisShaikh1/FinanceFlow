"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Calculator } from "lucide-react"
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
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="pb-4 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-blue-900">Advance Tax Calculator</CardTitle>
            <p className="text-sm text-blue-700 mt-1">Calculate quarterly advance tax payments</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="income" className="text-sm font-medium">Annual Income</Label>
            <Input
              id="income"
              type="number"
              placeholder="Enter annual income"
              value={annualIncome || ""}
              onChange={(e) => setAnnualIncome(Number.parseFloat(e.target.value) || 0)}
              className="bg-white border-blue-200 hover:border-blue-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deductions" className="text-sm font-medium">Total Deductions</Label>
            <Input
              id="deductions"
              type="number"
              placeholder="Enter total deductions"
              value={deductions || ""}
              onChange={(e) => setDeductions(Number.parseFloat(e.target.value) || 0)}
              className="bg-white border-blue-200 hover:border-blue-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Tax Regime</Label>
            <Select value={regime} onValueChange={(value: TaxRegime) => setRegime(value)}>
              <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
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
          <div className="space-y-6">
            {/* Tax Summary */}
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Taxable Income</p>
                  <p className="text-2xl font-bold text-orange-600">₹{taxableIncome.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Annual Tax Liability</p>
                  <p className="text-2xl font-bold text-red-600">₹{totalTax.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-orange-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Quarterly Payment Schedule
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {advanceTaxDates.map((payment, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-orange-200 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-orange-900">{payment.quarter}</span>
                        <p className="text-sm text-orange-700">Due: {payment.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-orange-600">
                          ₹{payment.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                        <p className="text-xs text-gray-500">
                          {((payment.amount / totalTax) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h5 className="font-medium text-orange-900 mb-2">Important Notes:</h5>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Advance tax is required if your tax liability exceeds ₹10,000</li>
                <li>• Pay at least 90% of current year's tax liability to avoid interest</li>
                <li>• Use Challan 280 for advance tax payments</li>
              </ul>
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              <Calendar className="h-4 w-4 mr-2" />
              Set Payment Reminders
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
