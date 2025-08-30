"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

const taxSavingSections = [
  { section: "80C", description: "PPF, ELSS, Life Insurance", limit: 150000, rate: 0.312 },
  { section: "80D", description: "Health Insurance Premium", limit: 25000, rate: 0.312 },
  { section: "80G", description: "Donations to Charity", limit: 50000, rate: 0.312 },
  { section: "80E", description: "Education Loan Interest", limit: 0, rate: 0.312 },
  { section: "80EE", description: "Home Loan Interest", limit: 50000, rate: 0.312 },
]

export function TaxSavingCalculator() {
  const [investments, setInvestments] = useState<Record<string, number>>({})

  const updateInvestment = (section: string, amount: number) => {
    setInvestments({ ...investments, [section]: amount })
  }

  const calculateSavings = () => {
    let totalInvested = 0
    let totalSaved = 0

    taxSavingSections.forEach((section) => {
      const invested = investments[section.section] || 0
      const eligible = section.limit > 0 ? Math.min(invested, section.limit) : invested
      totalInvested += invested
      totalSaved += eligible * section.rate
    })

    return { totalInvested, totalSaved }
  }

  const { totalInvested, totalSaved } = calculateSavings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Saving Calculator</CardTitle>
        <p className="text-sm text-muted-foreground">Plan your investments to maximize tax savings</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {taxSavingSections.map((section) => {
            const invested = investments[section.section] || 0
            const progress = section.limit > 0 ? (invested / section.limit) * 100 : 0
            const saved = section.limit > 0 ? Math.min(invested, section.limit) * section.rate : invested * section.rate

            return (
              <div key={section.section} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="font-medium">Section {section.section}</Label>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">₹{saved.toFixed(0)} saved</span>
                    {section.limit > 0 && (
                      <p className="text-xs text-muted-foreground">Limit: ₹{section.limit.toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="Investment amount"
                  value={invested || ""}
                  onChange={(e) => updateInvestment(section.section, Number.parseFloat(e.target.value) || 0)}
                />
                {section.limit > 0 && <Progress value={progress} className="h-2" />}
              </div>
            )
          })}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Invested:</span>
            <span>₹{totalInvested.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total Tax Saved:</span>
            <span className="text-green-600">₹{totalSaved.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full">Generate Investment Plan</Button>
          <Button variant="outline" className="w-full bg-transparent">
            Export Tax Saving Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
