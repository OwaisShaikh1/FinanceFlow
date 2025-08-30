"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function GSTCalculator() {
  const [amount, setAmount] = useState<number>(0)
  const [gstRate, setGstRate] = useState<number>(18)
  const [calculationType, setCalculationType] = useState<"exclusive" | "inclusive">("exclusive")

  const calculateGST = () => {
    if (calculationType === "exclusive") {
      // Amount is without GST
      const gstAmount = (amount * gstRate) / 100
      const totalAmount = amount + gstAmount
      return { baseAmount: amount, gstAmount, totalAmount }
    } else {
      // Amount includes GST
      const baseAmount = (amount * 100) / (100 + gstRate)
      const gstAmount = amount - baseAmount
      return { baseAmount, gstAmount, totalAmount: amount }
    }
  }

  const { baseAmount, gstAmount, totalAmount } = calculateGST()

  const gstBreakdown = () => {
    if (gstRate === 28) {
      return { cgst: gstAmount / 2, sgst: gstAmount / 2, igst: 0 }
    } else if (gstRate === 0) {
      return { cgst: 0, sgst: 0, igst: 0 }
    } else {
      return { cgst: gstAmount / 2, sgst: gstAmount / 2, igst: 0 }
    }
  }

  const { cgst, sgst, igst } = gstBreakdown()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>GST Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={calculationType} onValueChange={(value: "exclusive" | "inclusive") => setCalculationType(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="exclusive">Exclusive of GST</TabsTrigger>
              <TabsTrigger value="inclusive">Inclusive of GST</TabsTrigger>
            </TabsList>

            <TabsContent value="exclusive" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Excluding GST)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </TabsContent>

            <TabsContent value="inclusive" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Including GST)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="gstRate">GST Rate</Label>
            <Select value={gstRate.toString()} onValueChange={(value) => setGstRate(Number.parseFloat(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (Exempt)</SelectItem>
                <SelectItem value="5">5% (Essential goods)</SelectItem>
                <SelectItem value="12">12% (Standard rate)</SelectItem>
                <SelectItem value="18">18% (Standard rate)</SelectItem>
                <SelectItem value="28">28% (Luxury goods)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intrastate">Intrastate (CGST + SGST)</SelectItem>
                <SelectItem value="interstate">Interstate (IGST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calculation Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-medium">Base Amount:</span>
              <span className="text-lg font-bold">₹{baseAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>CGST ({(gstRate / 2).toFixed(1)}%):</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>SGST ({(gstRate / 2).toFixed(1)}%):</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-medium border-t pt-2">
                <span>Total GST ({gstRate}%):</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <span className="font-bold text-lg">Total Amount:</span>
              <span className="text-xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full">Save Calculation</Button>
            <Button variant="outline" className="w-full bg-transparent">
              Generate Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
