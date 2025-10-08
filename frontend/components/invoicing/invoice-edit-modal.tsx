"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Invoice, InvoiceItem, InvoiceEditModalProps } from "@/types/invoice"

export function InvoiceEditModal({ isOpen, onClose, invoice, onUpdate }: InvoiceEditModalProps) {
  const [formData, setFormData] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(false)
  const [invoiceDate, setInvoiceDate] = useState<Date>()
  const [dueDate, setDueDate] = useState<Date>()

  useEffect(() => {
    if (invoice) {
      setFormData({ 
        ...invoice,
        items: invoice.items || [] // Ensure items is always an array
      })
      setInvoiceDate(new Date(invoice.invoiceDate))
      setDueDate(new Date(invoice.dueDate))
    }
  }, [invoice])

  const calculateItemTotals = (item: Partial<InvoiceItem>) => {
    const quantity = item.quantity || 0
    const rate = item.rate || 0
    const gstRate = item.gstRate || 0
    
    const amount = quantity * rate
    const gstAmount = (amount * gstRate) / 100
    const total = amount + gstAmount
    
    return { amount, gstAmount, total }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    if (!formData || !formData.items || !Array.isArray(formData.items)) return

    const updatedItems = [...formData.items]
    const item = { ...updatedItems[index], [field]: value }
    
    // Recalculate totals if quantity, rate, or gstRate changes
    if (field === 'quantity' || field === 'rate' || field === 'gstRate') {
      const totals = calculateItemTotals(item)
      item.amount = totals.amount
      item.gstAmount = totals.gstAmount
      item.total = totals.total
    }
    
    updatedItems[index] = item
    setFormData({ ...formData, items: updatedItems })
  }

  const addItem = () => {
    if (!formData || !formData.items || !Array.isArray(formData.items)) return

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
      gstAmount: 0,
      total: 0
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    })
  }

  const removeItem = (index: number) => {
    if (!formData || !formData.items || !Array.isArray(formData.items)) return

    const updatedItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: updatedItems })
  }

  const calculateGrandTotals = () => {
    if (!formData || !formData.items || !Array.isArray(formData.items)) {
      return { subtotal: 0, totalGst: 0, grandTotal: 0 }
    }

    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)
    const totalGst = formData.items.reduce((sum, item) => sum + (item.gstAmount || 0), 0)
    const grandTotal = subtotal + totalGst

    return { subtotal, totalGst, grandTotal }
  }

  const handleSave = async () => {
    if (!formData || !invoiceDate || !dueDate) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const updateData = {
        ...formData,
        invoiceDate: invoiceDate.toISOString(),
        dueDate: dueDate.toISOString()
      }

      const response = await fetch(`http://localhost:5000/api/invoice/${formData._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const updatedInvoice = await response.json()
      onUpdate(updatedInvoice)
      onClose()
    } catch (error) {
      console.error('Error updating invoice:', error)
      alert('Failed to update invoice')
    } finally {
      setLoading(false)
    }
  }

  const totals = calculateGrandTotals()

  if (!formData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Invoice - {formData.invoiceNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="FINAL">Final</SelectItem>
                    <SelectItem value="SENT">Sent</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {invoiceDate ? format(invoiceDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={invoiceDate}
                      onSelect={setInvoiceDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="clientGstin">Client GSTIN (Optional)</Label>
                <Input
                  id="clientGstin"
                  value={formData.clientGstin}
                  onChange={(e) => setFormData({ ...formData, clientGstin: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="business">Business ID</Label>
                <Input
                  id="business"
                  value={formData.business}
                  onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="ewayBillNo">E-way Bill No (Optional)</Label>
                <Input
                  id="ewayBillNo"
                  value={formData.ewayBillNo || ''}
                  onChange={(e) => setFormData({ ...formData, ewayBillNo: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Invoice Items</CardTitle>
                <Button onClick={addItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(formData.items || []).map((item, index) => (
                  <Card key={item.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-3">
                          <Label htmlFor={`description-${index}`}>Description</Label>
                          <Textarea
                            id={`description-${index}`}
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                        
                        <div className="col-span-1">
                          <Label htmlFor={`quantity-${index}`}>Qty</Label>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Label htmlFor={`rate-${index}`}>Rate (₹)</Label>
                          <Input
                            id={`rate-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="col-span-1">
                          <Label htmlFor={`gstRate-${index}`}>GST%</Label>
                          <Select 
                            value={item.gstRate.toString()} 
                            onValueChange={(value) => updateItem(index, 'gstRate', parseFloat(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="12">12%</SelectItem>
                              <SelectItem value="18">18%</SelectItem>
                              <SelectItem value="28">28%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-2">
                          <Label>Amount (₹)</Label>
                          <div className="p-2 bg-gray-50 rounded text-sm text-right">
                            ₹{item.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <Label>GST (₹)</Label>
                          <div className="p-2 bg-gray-50 rounded text-sm text-right">
                            ₹{item.gstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                          </div>
                        </div>
                        
                        <div className="col-span-1 flex flex-col">
                          <Label>Total (₹)</Label>
                          <div className="p-2 bg-blue-50 rounded text-sm text-right font-medium">
                            ₹{item.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="mt-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Totals Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{totals.subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total GST:</span>
                    <span className="font-medium">₹{totals.totalGst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="border-t-2 pt-2">
                    <div className="flex justify-between py-2">
                      <span className="text-lg font-bold">Grand Total:</span>
                      <span className="text-lg font-bold text-blue-600">₹{totals.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}