"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"

export function GSTCalculator() {
  const [amount, setAmount] = useState("")
  const [gstRate, setGstRate] = useState("")
  const [calculationType, setCalculationType] = useState("")
  const [result, setResult] = useState<{
    baseAmount: number
    gstAmount: number
    totalAmount: number
  } | null>(null)

  const calculateGST = () => {
    const inputAmount = Number.parseFloat(amount) || 0
    const rate = Number.parseFloat(gstRate) || 0

    let baseAmount = 0
    let gstAmount = 0
    let totalAmount = 0

    if (calculationType === "exclusive") {
      // GST to be added to the amount
      baseAmount = inputAmount
      gstAmount = (inputAmount * rate) / 100
      totalAmount = inputAmount + gstAmount
    } else if (calculationType === "inclusive") {
      // GST is included in the amount
      totalAmount = inputAmount
      baseAmount = (inputAmount * 100) / (100 + rate)
      gstAmount = totalAmount - baseAmount
    }

    setResult({
      baseAmount,
      gstAmount,
      totalAmount,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-secondary" />
          <CardTitle>GST Calculator</CardTitle>
        </div>
        <CardDescription>Calculate GST amount for goods and services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g., 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gst-rate">GST Rate (%)</Label>
            <Select value={gstRate} onValueChange={setGstRate}>
              <SelectTrigger>
                <SelectValue placeholder="Select GST rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (Exempt)</SelectItem>
                <SelectItem value="5">5% (Essential goods)</SelectItem>
                <SelectItem value="12">12% (Standard goods)</SelectItem>
                <SelectItem value="18">18% (Most goods/services)</SelectItem>
                <SelectItem value="28">28% (Luxury goods)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calculation-type">Calculation Type</Label>
          <Select value={calculationType} onValueChange={setCalculationType}>
            <SelectTrigger>
              <SelectValue placeholder="Select calculation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exclusive">GST Exclusive (Add GST to amount)</SelectItem>
              <SelectItem value="inclusive">GST Inclusive (Extract GST from amount)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateGST} className="w-full">
          Calculate GST
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-semibold text-lg">GST Calculation Result</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Base Amount:</span>
                <div className="font-semibold">
                  ₹{result.baseAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">GST Amount:</span>
                <div className="font-semibold text-secondary">
                  ₹{result.gstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Amount:</span>
                <div className="font-semibold">
                  ₹{result.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

