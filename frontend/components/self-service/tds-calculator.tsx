"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp } from "lucide-react"

export function TDSCalculator() {
  const [amount, setAmount] = useState("")
  const [tdsSection, setTdsSection] = useState("")
  const [result, setResult] = useState<{
    tdsAmount: number
    netAmount: number
    tdsRate: number
  } | null>(null)

  const tdsRates: Record<string, { rate: number; description: string }> = {
    "194A": { rate: 10, description: "Interest on Securities" },
    "194B": { rate: 30, description: "Winnings from Lottery/Crossword" },
    "194C": { rate: 1, description: "Payment to Contractors" },
    "194H": { rate: 10, description: "Commission/Brokerage" },
    "194I": { rate: 10, description: "Rent on Land/Building/Furniture" },
    "194J": { rate: 10, description: "Professional/Technical Services" },
    "194K": { rate: 10, description: "Income from Units" },
    "194O": { rate: 1, description: "E-commerce Transactions" },
  }

  const calculateTDS = () => {
    const paymentAmount = Number.parseFloat(amount) || 0
    const selectedSection = tdsRates[tdsSection]

    if (!selectedSection) return

    const tdsAmount = (paymentAmount * selectedSection.rate) / 100
    const netAmount = paymentAmount - tdsAmount

    setResult({
      tdsAmount,
      netAmount,
      tdsRate: selectedSection.rate,
    })
  }

  // Auto-calculate TDS when values change
  useEffect(() => {
    if (amount && tdsSection) {
      calculateTDS()
    }
  }, [amount, tdsSection])

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="pb-4 border-b border-purple-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <CardTitle className="text-purple-900">TDS Calculator</CardTitle>
        </div>
        <CardDescription className="text-purple-700">Calculate TDS on various types of payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="payment-amount">Payment Amount (₹)</Label>
          <Input
            id="payment-amount"
            type="number"
            placeholder="e.g., 50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tds-section">TDS Section</Label>
          <Select value={tdsSection} onValueChange={setTdsSection}>
            <SelectTrigger>
              <SelectValue placeholder="Select TDS section" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(tdsRates).map(([section, details]) => (
                <SelectItem key={section} value={section}>
                  {section} - {details.description} ({details.rate}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateTDS} className="w-full" variant="outline">
          Recalculate TDS
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-semibold text-lg">TDS Calculation Result</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">TDS Rate:</span>
                <div className="font-semibold">{result.tdsRate}%</div>
              </div>
              <div>
                <span className="text-muted-foreground">TDS Amount:</span>
                <div className="font-semibold text-accent">
                  ₹{result.tdsAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Net Payment:</span>
                <div className="font-semibold">
                  ₹{result.netAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
