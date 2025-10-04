"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { API_BASE_URL } from "@/lib/config"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  gstRate: number
  amount: number
  gstAmount: number
  total: number
}

const gstRates = [0, 5, 12, 18, 28]

export function InvoiceForm() {
  // Invoice Details State
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [poNumber, setPoNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState<Date>()
  const [dueDate, setDueDate] = useState<Date>()
  const [paymentTerms, setPaymentTerms] = useState("")

  // Client Details State
  const [clientName, setClientName] = useState("")
  const [clientGstin, setClientGstin] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [clientCity, setClientCity] = useState("")
  const [clientState, setClientState] = useState("")
  const [clientPincode, setClientPincode] = useState("")

  // Additional Details State
  const [notes, setNotes] = useState("")
  const [bankDetails, setBankDetails] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [ewayBillNo, setEwayBillNo] = useState("")

  // Invoice Items State
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
      gstAmount: 0,
      total: 0,
    },
  ])
  
  const [isLoading, setIsLoading] = useState(false)

  const calculateItemTotals = (item: Partial<InvoiceItem>): InvoiceItem => {
    const quantity = item.quantity || 0
    const rate = item.rate || 0
    const gstRate = item.gstRate || 0

    const amount = quantity * rate
    const gstAmount = (amount * gstRate) / 100
    const total = amount + gstAmount

    return {
      id: item.id || "",
      description: item.description || "",
      quantity,
      rate,
      gstRate,
      amount,
      gstAmount,
      total,
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items]
    
    // Handle numeric fields properly to avoid "0100" issue
    let processedValue = value
    if (field === 'rate' || field === 'quantity') {
      // If empty string, use the value as is for display, calculation will handle it
      if (typeof value === 'string' && value === '') {
        processedValue = 0
      } else {
        processedValue = typeof value === 'string' ? (Number.parseFloat(value) || 0) : value
      }
    }
    
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: processedValue,
    }
    updatedItems[index] = calculateItemTotals(updatedItems[index])
    setItems(updatedItems)
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
      gstAmount: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const totalGst = items.reduce((sum, item) => sum + item.gstAmount, 0)
    const grandTotal = subtotal + totalGst

    return { subtotal, totalGst, grandTotal }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare form data - all fields are now properly connected
      const formData = {
        // Invoice Details
        invoiceNumber,
        poNumber,
        invoiceDate,
        dueDate,
        paymentTerms,
        
        // Client Details
        clientName,
        clientGstin,
        clientAddress,
        clientCity,
        clientState,
        clientPincode,
        
        // Invoice Items
        items,
        
        // Additional Details
        notes,
        bankDetails,
        pdfUrl,
        ewayBillNo,
        
        // Calculated Totals
        ...calculateTotals()
      }
         console.log("Invoice Data:", formData)

      // Send POST request to API
      const response = await fetch(`${API_BASE_URL}/api/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Server responded with ${response.status}')

      console.log('Invoice saved:', data)

      // Redirect to invoice view
      window.location.href = '/dashboard/invoices'

    } catch (error: any) {
      console.error('Error creating invoice:', error.message)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const { subtotal, totalGst, grandTotal } = calculateTotals()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  placeholder="INV-001"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poNumber">PO Number (Optional)</Label>
                <Input 
                  id="poNumber" 
                  placeholder="PO-001" 
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !invoiceDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {invoiceDate ? format(invoiceDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={invoiceDate} onSelect={setInvoiceDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net-15">Net 15 days</SelectItem>
                  <SelectItem value="net-30">Net 30 days</SelectItem>
                  <SelectItem value="net-45">Net 45 days</SelectItem>
                  <SelectItem value="due-on-receipt">Due on receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Client Details */}
        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input 
                id="clientName" 
                placeholder="ABC Corporation" 
                required 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientGstin">GSTIN</Label>
              <Input 
                id="clientGstin" 
                placeholder="22AAAAA0000A1Z5" 
                value={clientGstin}
                onChange={(e) => setClientGstin(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea 
                id="clientAddress" 
                placeholder="Enter client address" 
                rows={3} 
                required 
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientCity">City</Label>
                <Input 
                  id="clientCity" 
                  placeholder="Mumbai" 
                  required 
                  value={clientCity}
                  onChange={(e) => setClientCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientState">State</Label>
                <Select value={clientState} onValueChange={setClientState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPincode">Pincode</Label>
              <Input 
                id="clientPincode" 
                placeholder="400001" 
                required 
                value={clientPincode}
                onChange={(e) => setClientPincode(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>GST %</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>GST Amount</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Item description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity === 0 ? "" : item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      placeholder="1"
                      min="0"
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.rate === 0 ? "" : item.rate}
                      onChange={(e) => updateItem(index, "rate", e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.gstRate.toString()}
                      onValueChange={(value) => updateItem(index, "gstRate", Number.parseFloat(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gstRates.map((rate) => (
                          <SelectItem key={rate} value={rate.toString()}>
                            {rate}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>₹{item.amount.toFixed(2)}</TableCell>
                  <TableCell>₹{item.gstAmount.toFixed(2)}</TableCell>
                  <TableCell>₹{item.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total GST:</span>
                <span>₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Additional notes or terms" 
              rows={3} 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankDetails">Bank Details</Label>
            <Textarea
              id="bankDetails"
              placeholder="Bank Name: State Bank of India&#10;Account Number: 1234567890&#10;IFSC Code: SBIN0001234"
              rows={3}
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdfUrl">PDF URL (Optional)</Label>
            <Input 
              id="pdfUrl" 
              placeholder="https://example.com/invoice.pdf" 
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ewayBillNo">E-Way Bill Number (Optional)</Label>
            <Input 
              id="ewayBillNo" 
              placeholder="123456789012" 
              value={ewayBillNo}
              onChange={(e) => setEwayBillNo(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create Invoice"}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}