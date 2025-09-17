"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle } from "lucide-react"

const taxSavingSections = [
  { section: "80C", description: "PPF, ELSS, Life Insurance", limit: 150000, rate: 0.312 },
  { section: "80D", description: "Health Insurance Premium", limit: 25000, rate: 0.312 },
  { section: "80G", description: "Donations to Charity", limit: 50000, rate: 0.312 },
  { section: "80E", description: "Education Loan Interest", limit: 0, rate: 0.312 },
  { section: "80EE", description: "Home Loan Interest", limit: 50000, rate: 0.312 },
]

export function TaxSavingCalculator() {
  const [investments, setInvestments] = useState<Record<string, number>>({})
  const { toast } = useToast()

  const updateInvestment = (section: string, amount: number) => {
    const sectionData = taxSavingSections.find(s => s.section === section)
    
    if (sectionData && sectionData.limit > 0 && amount > sectionData.limit) {
      toast({
        title: "Investment Limit Exceeded",
        description: `Section ${section} limit is ₹${sectionData.limit.toLocaleString()}. Amount adjusted to limit.`,
        variant: "destructive"
      })
      setInvestments({ ...investments, [section]: sectionData.limit })
    } else {
      setInvestments({ ...investments, [section]: amount })
    }
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
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Investment amount"
                    value={invested || ""}
                    max={section.limit > 0 ? section.limit : undefined}
                    onChange={(e) => updateInvestment(section.section, Number.parseFloat(e.target.value) || 0)}
                    className={invested > section.limit && section.limit > 0 ? "border-red-500" : ""}
                  />
                  {invested > section.limit && section.limit > 0 && (
                    <div className="absolute right-2 top-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                {invested > section.limit && section.limit > 0 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Exceeds limit by ₹{(invested - section.limit).toLocaleString()}
                  </p>
                )}
                {section.limit > 0 && (
                  <div className="space-y-1">
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className={`h-2 ${progress > 100 ? 'bg-red-100' : ''}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹{invested.toLocaleString()}</span>
                      <span>₹{section.limit.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Limit Warnings */}
        {taxSavingSections.some(section => {
          const invested = investments[section.section] || 0
          return section.limit > 0 && invested > section.limit
        }) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
              <AlertTriangle className="h-4 w-4" />
              Limits Exceeded
            </div>
            <div className="space-y-1 text-sm">
              {taxSavingSections.map(section => {
                const invested = investments[section.section] || 0
                if (section.limit > 0 && invested > section.limit) {
                  return (
                    <div key={section.section} className="text-red-600">
                      Section {section.section}: Exceeds by ₹{(invested - section.limit).toLocaleString()}
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

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
          {taxSavingSections.some(section => {
            const invested = investments[section.section] || 0
            return section.limit > 0 && invested > section.limit
          }) && (
            <Button 
              variant="outline" 
              className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => {
                const correctedInvestments = { ...investments }
                taxSavingSections.forEach(section => {
                  const invested = investments[section.section] || 0
                  if (section.limit > 0 && invested > section.limit) {
                    correctedInvestments[section.section] = section.limit
                  }
                })
                setInvestments(correctedInvestments)
                toast({
                  title: "Amounts Corrected",
                  description: "All investments adjusted to their respective limits."
                })
              }}
            >
              Auto-Correct All Limits
            </Button>
          )}
          <Button className="w-full">Generate Investment Plan</Button>
          <Button variant="outline" className="w-full bg-transparent">
            Export Tax Saving Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
