"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { API_BASE_URL } from "@/lib/config"
import { BASE_URL } from "@/hooks/storagehelper"

const transactionCategories = {
  income: ["Sales Revenue", "Service Income", "Interest Income", "Rental Income", "Other Income"],
  expense: [
    "Office Rent",
    "Utilities",
    "Office Supplies",
    "Travel & Transportation",
    "Marketing & Advertising",
    "Professional Services",
    "Insurance",
    "Maintenance & Repairs",
    "Salaries & Wages",
    "Other Expenses",
  ],
}

export function TransactionForm() {
  const [date, setDate] = useState<Date>()
  const [type, setType] = useState<"income" | "expense">("income")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments([...attachments, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

   try {
      const form = e.currentTarget

      // Safely parse amount
      const amount = parseFloat(form.amount.value)
      if (isNaN(amount)) {
        alert("Please enter a valid amount")
        setIsLoading(false)
        return
      }

      const transactionData = {
        type: form.type.value,
        amount,
        date: date ? format(date, "yyyy-MM-dd") : "",
        category: form.category.value,
        description: form.description.value,
        notes: form.notes.value,
        paymentMethod: form.paymentMethod.value,
      }

      // Build FormData
      const formData = new FormData()
      formData.append("type", transactionData.type)
      formData.append("amount", transactionData.amount.toString())
      formData.append("date", transactionData.date)
      formData.append("category", transactionData.category)
      formData.append("description", transactionData.description)
      formData.append("notes", transactionData.notes)
      formData.append("paymentMethod", transactionData.paymentMethod)

      // Append files with the correct field name
      attachments.forEach((file) => formData.append("receipts", file)) // ✅ must match backend Multer field

      // Send request
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        body: formData, // ✅ FormData handles Content-Type automatically
      })

      if (!res.ok) throw new Error("Failed to save transaction")

      // Redirect on success
      window.location.href = "/dashboard/transactions"
    } catch (err) {
      console.error("Error:", err)
      alert("Something went wrong while saving the transaction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Transaction Type</Label>
          <Select name="type" value={type} onValueChange={(value: "income" | "expense") => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input id="amount" name="amount" type="number" placeholder="0.00" step="0.01" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category">
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {transactionCategories[type].map((category) => (
                <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" placeholder="Enter transaction description" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea id="notes" name="notes" placeholder="Additional notes about this transaction" rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select name="paymentMethod">
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
            <SelectItem value="credit-card">Credit Card</SelectItem>
            <SelectItem value="debit-card">Debit Card</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="cheque">Cheque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Attachments</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-4">
          <input
             type="file"
          name="receipts" 
           multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
         onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Click to upload receipts or documents</p>
              <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DOC up to 10MB</p>
            </div>
          </label>
        </div>

        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{file.name}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : "Save Transaction"}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
