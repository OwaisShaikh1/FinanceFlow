"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle } from "lucide-react"
import { getSectionsForRegime, SectionDef, TaxRegime } from "@/lib/tax/config"
import { computeAfterInvestments, generateInvestmentPlan } from "@/lib/tax/calculate"

export function TaxSavingCalculator() {
  const [regime, setRegime] = useState<TaxRegime>("new")
  const [annualIncome, setAnnualIncome] = useState<number>(0)
  const [baseDeductions, setBaseDeductions] = useState<number>(0)
  const [investments, setInvestments] = useState<Record<string, number>>({})
  const { toast } = useToast()

  const sections = useMemo<SectionDef[]>(() => getSectionsForRegime(regime), [regime])

  const updateInvestment = (code: string, amount: number) => {
    const s = sections.find((x) => x.code === code)
    const limit = s?.limit ?? null
    if (limit !== null && amount > limit) {
      setInvestments({ ...investments, [code]: limit })
      toast({
        title: "Investment Limit Exceeded",
        description: `Section ${code} limit is ₹${limit.toLocaleString()}. Amount adjusted to limit.`,
        variant: "destructive",
      })
    } else {
      setInvestments({ ...investments, [code]: Math.max(0, amount) })
    }
  }

  const savings = useMemo(() => {
    const inputs = Object.entries(investments).map(([code, amount]) => ({ code, amount }))
    return computeAfterInvestments(annualIncome, baseDeductions, regime, inputs)
  }, [annualIncome, baseDeductions, regime, investments])

  const hasLimitExceed = sections.some((s) => {
    const val = investments[s.code] || 0
    return s.limit !== null && val > s.limit
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Saving Calculator</CardTitle>
        <p className="text-sm text-muted-foreground">Plan your investments to maximize tax savings</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tax Regime</Label>
            <Select value={regime} onValueChange={(v: TaxRegime) => setRegime(v)}>
              <SelectTrigger className="bg-gray-100 border border-gray-300 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Regime (FY 2025-26)</SelectItem>
                <SelectItem value="old">Old Regime</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Annual Income</Label>
            <Input
              type="number"
              value={annualIncome || ""}
              onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
              className="bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label>Other Deductions (non-section)</Label>
            <Input
              type="number"
              value={baseDeductions || ""}
              onChange={(e) => setBaseDeductions(parseFloat(e.target.value) || 0)}
              className="bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {sections.length === 0 && (
          <div className="text-sm text-muted-foreground">
            The selected regime currently doesn’t allow most traditional deductions. You may still claim employer NPS
            contribution and specific items outside this demo.
          </div>
        )}

        <div className="space-y-4">
          {sections.map((section) => {
            const invested = investments[section.code] || 0
            const limit = section.limit
            const progress = limit ? (invested / limit) * 100 : 0
            return (
              <div key={section.code} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="font-medium">Section {section.code}</Label>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                  <div className="text-right">
                    {limit !== null && <p className="text-xs text-muted-foreground">Limit: ₹{limit.toLocaleString()}</p>}
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Investment amount"
                    value={invested || ""}
                    max={limit ?? undefined}
                    onChange={(e) => updateInvestment(section.code, Number.parseFloat(e.target.value) || 0)}
                    className={`bg-gray-100 border border-gray-300 rounded-md ${
                      limit !== null && invested > limit ? "border-red-500" : ""
                    }`}
                  />
                  {limit !== null && invested > limit && (
                    <div className="absolute right-2 top-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                {limit !== null && (
                  <div className="space-y-1">
                    <Progress value={Math.min(progress, 100)} className={`h-2 ${progress > 100 ? "bg-red-100" : ""}`} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹{invested.toLocaleString()}</span>
                      <span>₹{limit.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {hasLimitExceed && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
              <AlertTriangle className="h-4 w-4" />
              Limits Exceeded
            </div>
            <div className="space-y-1 text-sm">
              {sections.map((s) => {
                const invested = investments[s.code] || 0
                if (s.limit !== null && invested > s.limit) {
                  return (
                    <div key={s.code} className="text-red-600">
                      Section {s.code}: Exceeds by ₹{(invested - s.limit).toLocaleString()}
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
            <span className="font-medium">Tax Before Investments:</span>
            <span>₹{savings.taxBeforeInvestments.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Tax After Investments:</span>
            <span>₹{savings.taxAfterInvestments.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Tax Saved:</span>
            <span className="text-green-600">₹{savings.taxSaved.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2">
          {hasLimitExceed && (
            <Button
              variant="outline"
              className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => {
                const corrected: Record<string, number> = { ...investments }
                sections.forEach((s) => {
                  const v = corrected[s.code] || 0
                  if (s.limit !== null && v > s.limit) corrected[s.code] = s.limit
                })
                setInvestments(corrected)
                toast({ title: "Amounts Corrected", description: "All investments adjusted to their respective limits." })
              }}
            >
              Auto-Correct All Limits
            </Button>
          )}

          <Button
            className="w-full"
            onClick={() => {
              const plan = generateInvestmentPlan(annualIncome, baseDeductions, regime, 150000) // demo budget
              toast({
                title: "Suggested Investment Plan",
                description: `${plan.suggestions.map((s) => `${s.code}: ₹${s.suggested.toLocaleString()}`).join(
                  ", "
                )} | Expected saving ₹${plan.expectedTaxSaved.toFixed(0)}`,
              })
            }}
          >
            Generate Investment Plan
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              const data = {
                regime,
                annualIncome,
                baseDeductions,
                investments,
                estimatedSavings: savings.totalTaxSaved,
                generatedAt: new Date().toISOString(),
              }
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `tax-saving-report-${Date.now()}.json`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            Export Tax Saving Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
