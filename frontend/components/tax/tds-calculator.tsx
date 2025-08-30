"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tdsRates = [
  { section: "194C", description: "Payments to contractors", rate: 1, threshold: 30000 },
  { section: "194J", description: "Professional/technical services", rate: 10, threshold: 30000 },
  { section: "194I", description: "Rent payments", rate: 10, threshold: 240000 },
  { section: "194H", description: "Commission/brokerage", rate: 5, threshold: 15000 },
  { section: "194A", description: "Interest payments", rate: 10, threshold: 40000 },
]

export function TDSCalculator() {
  const [amount, setAmount] = useState<number>(0)
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [panAvailable, setPanAvailable] = useState<boolean>(true)

  const getTDSDetails = () => {
    const section = tdsRates.find((rate) => rate.section === selectedSection)
    if (!section) return { rate: 0, threshold: 0, description: "" }

    const rate = panAvailable ? section.rate : section.rate * 2 // Double rate if no PAN
    const tdsAmount = amount > section.threshold ? (amount * rate) / 100 : 0
    const netAmount = amount - tdsAmount

    return {
      ...section,
      rate,
      tdsAmount,
      netAmount,
      applicable: amount > section.threshold,
    }
  }

  const tdsDetails = getTDSDetails()

  return (
    <Card>
      <CardHeader>
        <CardTitle>TDS Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter payment amount"
              value={amount || ""}
              onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">TDS Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="Select TDS section" />
              </SelectTrigger>
              <SelectContent>
                {tdsRates.map((rate) => (
                  <SelectItem key={rate.section} value={rate.section}>
                    {rate.section} - {rate.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>PAN Status</Label>
            <Select
              value={panAvailable ? "available" : "not-available"}
              onValueChange={(value) => setPanAvailable(value === "available")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">PAN Available</SelectItem>
                <SelectItem value="not-available">PAN Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedSection && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Payment Amount:</span>
                <span>₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>TDS Rate:</span>
                <span>{tdsDetails.rate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Threshold:</span>
                <span>₹{tdsDetails.threshold.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>TDS Amount:</span>
                <span>₹{tdsDetails.tdsAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Net Payment:</span>
                <span>₹{tdsDetails.netAmount.toFixed(2)}</span>
              </div>
            </div>

            {!tdsDetails.applicable && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  TDS not applicable as amount is below threshold of ₹{tdsDetails.threshold.toLocaleString()}
                </p>
              </div>
            )}

            {!panAvailable && tdsDetails.applicable && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">Higher TDS rate applied due to unavailability of PAN</p>
              </div>
            )}

            <Button className="w-full">Record TDS Deduction</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
