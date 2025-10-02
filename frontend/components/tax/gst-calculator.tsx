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
  const [transactionType, setTransactionType] = useState<string>("sale-goods")
  const [stateType, setStateType] = useState<"intrastate" | "interstate">("intrastate")
  const [productCategory, setProductCategory] = useState<string>("standard")

  // Product categories with auto GST rates
  const productCategories = {
    essential: { name: "Essential Goods", rate: 0 },
    daily: { name: "Daily Necessities", rate: 5 },
    standard: { name: "Standard Goods/Services", rate: 18 },
    luxury: { name: "Luxury/Sin Goods", rate: 40 }
  }

  // Auto-update GST rate when product category changes
  const handleCategoryChange = (category: string) => {
    setProductCategory(category)
    const categoryData = productCategories[category as keyof typeof productCategories]
    if (categoryData) {
      setGstRate(categoryData.rate)
    }
  }

  const calculateGST = () => {
    if (calculationType === "exclusive") {
      // Exclusive GST: GST Amount = Amount × GST Rate / 100
      const gstAmount = (amount * gstRate) / 100
      const totalAmount = amount + gstAmount
      return { baseAmount: amount, gstAmount, totalAmount }
    } else {
      // Inclusive GST: GST Amount = Amount × GST Rate / (100 + GST Rate)
      const gstAmount = (amount * gstRate) / (100 + gstRate)
      const netAmount = amount - gstAmount
      return { baseAmount: netAmount, gstAmount, totalAmount: amount }
    }
  }

  const { baseAmount, gstAmount, totalAmount } = calculateGST()

  const gstBreakdown = () => {
    if (gstRate === 0) {
      return { cgst: 0, sgst: 0, igst: 0 }
    } else if (stateType === "interstate") {
      return { cgst: 0, sgst: 0, igst: gstAmount }
    } else {
      // Intrastate: CGST + SGST
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
          <Tabs value={calculationType} onValueChange={(value) => setCalculationType(value as "exclusive" | "inclusive")}>
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
            <Label>Transaction Type</Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale-goods">Sale of Goods</SelectItem>
                <SelectItem value="sale-services">Sale of Services</SelectItem>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="export">Export</SelectItem>
                <SelectItem value="b2b">Business-to-Business (B2B)</SelectItem>
                <SelectItem value="b2c">Business-to-Consumer (B2C)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Product Category (Auto GST Rate)</Label>
            <Select value={productCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essential">Essential Goods (0%)</SelectItem>
                <SelectItem value="daily">Daily Necessities (5%)</SelectItem>
                <SelectItem value="standard">Standard Goods/Services (18%)</SelectItem>
                <SelectItem value="luxury">Luxury/Sin Goods (40%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstRate">GST Rate (Auto-selected)</Label>
            <Input
              id="gstRate"
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(Number.parseFloat(e.target.value) || 0)}
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Rate auto-updated based on product category. You can manually adjust if needed.
            </p>
          </div>

          <div className="space-y-2">
            <Label>State of Transaction</Label>
            <Select value={stateType} onValueChange={(value) => setStateType(value as "intrastate" | "interstate")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intrastate">Same State (CGST + SGST)</SelectItem>
                <SelectItem value="interstate">Different State (IGST)</SelectItem>
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
              <span className="font-medium">
                {calculationType === "exclusive" ? "Base Amount:" : "Net Amount:"}
              </span>
              <span className="text-lg font-bold">₹{baseAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              {gstRate === 0 ? (
                <div className="flex justify-between items-center text-green-600">
                  <span>GST Exempt (0%):</span>
                  <span>₹0.00</span>
                </div>
              ) : stateType === "interstate" ? (
                <div className="flex justify-between items-center">
                  <span>IGST ({gstRate}%):</span>
                  <span>₹{igst.toFixed(2)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span>CGST ({(gstRate / 2).toFixed(1)}%):</span>
                    <span>₹{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SGST ({(gstRate / 2).toFixed(1)}%):</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                </>
              )}
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
