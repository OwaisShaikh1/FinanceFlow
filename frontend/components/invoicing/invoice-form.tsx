"use client"

import type React from "react"
import { useState, useCallback, useMemo, useRef, useEffect, useReducer } from "react"
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
import { InvoiceItem } from "@/types/invoice"
import { useAuth } from "@/contexts/AuthContext"

const gstRates = [0, 5, 12, 18, 28]

// Invoice state interface
interface InvoiceState {
  // Invoice Details
  invoiceNumber: string;
  poNumber: string;
  invoiceDate: Date | undefined;
  dueDate: Date | undefined;
  paymentTerms: string;
  taxType: 'CGST+SGST' | 'IGST'; // Tax Type
  
  // Client Details
  clientName: string;
  clientGstin: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientPincode: string;
  
  // Additional Details
  notes: string;
  bankDetails: string;
  pdfUrl: string;
  ewayBillNo: string;
  
  // Meta
  isLoading: boolean;
  error: string | null;
}

type InvoiceAction =
  | { type: 'UPDATE_FIELD'; field: keyof InvoiceState; value: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FORM' };

// Initial state
const initialInvoiceState: InvoiceState = {
  invoiceNumber: "",
  poNumber: "",
  invoiceDate: undefined,
  dueDate: undefined,
  paymentTerms: "",
  taxType: "CGST+SGST",
  clientName: "",
  clientGstin: "",
  clientAddress: "",
  clientCity: "",
  clientState: "",
  clientPincode: "",
  notes: "",
  bankDetails: "",
  pdfUrl: "",
  ewayBillNo: "",
  isLoading: false,
  error: null,
};

// Reducer for invoice state management
function invoiceReducer(state: InvoiceState, action: InvoiceAction): InvoiceState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        error: null, // Clear error when user makes changes
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'RESET_FORM':
      return {
        ...initialInvoiceState,
      };
    default:
      return state;
  }
}

interface InvoiceFormProps {
  onSubmit?: (data: any) => void;
  initialData?: Partial<InvoiceState>;
  isEditing?: boolean;
}

export function InvoiceForm({ onSubmit, initialData, isEditing = false }: InvoiceFormProps) {
  const { user, token } = useAuth();

  // Use useReducer for complex invoice state management
  const [state, dispatch] = useReducer(invoiceReducer, {
    ...initialInvoiceState,
    ...initialData,
  });

  // Invoice Items State (separate from main reducer for performance)
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      hsnCode: "",
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      gstAmount: 0,
      total: 0,
    },
  ]);

  // useRef for form elements
  const formRef = useRef<HTMLFormElement>(null);
  const invoiceNumberRef = useRef<HTMLInputElement>(null);

  // useEffect to focus on invoice number when component mounts
  useEffect(() => {
    if (invoiceNumberRef.current) {
      invoiceNumberRef.current.focus();
    }
  }, []);

  // Clear error when user types
  useEffect(() => {
    if (state.error) {
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  }, [state.invoiceNumber, state.clientName, state.error]);

  // useCallback for state updates to prevent unnecessary re-renders
  const updateField = useCallback((field: keyof InvoiceState, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const calculateItemTotals = useCallback((item: Partial<InvoiceItem>, taxType: 'CGST+SGST' | 'IGST'): InvoiceItem => {
    const quantity = item.quantity || 0
    const rate = item.rate || 0
    const gstRate = item.gstRate || 0

    const amount = quantity * rate
    const gstAmount = (amount * gstRate) / 100
    
    // Calculate CGST, SGST, IGST based on tax type
    let cgstAmount = 0
    let sgstAmount = 0
    let igstAmount = 0

    if (taxType === 'CGST+SGST') {
      cgstAmount = gstAmount / 2
      sgstAmount = gstAmount / 2
    } else {
      igstAmount = gstAmount
    }

    const total = amount + gstAmount

    return {
      id: item.id || "",
      description: item.description || "",
      hsnCode: item.hsnCode || "",
      quantity,
      rate,
      gstRate,
      amount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      gstAmount,
      total,
    }
  }, []);

  const updateItem = useCallback((index: number, field: keyof InvoiceItem, value: string | number) => {
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
    updatedItems[index] = calculateItemTotals(updatedItems[index], state.taxType)
    setItems(updatedItems)
  }, [items, calculateItemTotals, state.taxType]);

  const addItem = useCallback(() => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      hsnCode: "",
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      gstAmount: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }, [items]);

  const removeItem = useCallback((index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }, [items]);

  const calculateTotals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const totalCGST = items.reduce((sum, item) => sum + (item.cgstAmount || 0), 0)
    const totalSGST = items.reduce((sum, item) => sum + (item.sgstAmount || 0), 0)
    const totalIGST = items.reduce((sum, item) => sum + (item.igstAmount || 0), 0)
    const totalGst = totalCGST + totalSGST + totalIGST
    const grandTotal = subtotal + totalGst

    return { subtotal, totalCGST, totalSGST, totalIGST, totalGst, grandTotal }
  }, [items]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare form data - all fields are now properly connected
      const formData = {
        // Invoice Details
        invoiceNumber: state.invoiceNumber,
        poNumber: state.poNumber,
        invoiceDate: state.invoiceDate,
        dueDate: state.dueDate,
        paymentTerms: state.paymentTerms,
        taxType: state.taxType,
        
        // Client Details
        clientName: state.clientName,
        clientGstin: state.clientGstin,
        clientAddress: state.clientAddress,
        clientCity: state.clientCity,
        clientState: state.clientState,
        clientPincode: state.clientPincode,
        
        // Invoice Items
        items,
        
        // Additional Details
        notes: state.notes,
        bankDetails: state.bankDetails,
        pdfUrl: state.pdfUrl,
        ewayBillNo: state.ewayBillNo,
        
        // Calculated Totals
        ...calculateTotals
      }
         console.log("Invoice Data:", formData)

      // Send POST request to API
      const response = await fetch(`http://localhost:5000/api/invoice`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Server responded with ${response.status}')

      console.log('Invoice saved:', data)

      if (onSubmit) {
        onSubmit(formData);
      }

      // Reset form if creating new invoice (not editing)
      if (!isEditing) {
        dispatch({ type: 'RESET_FORM' });
        setItems([{
          id: "1",
          description: "",
          hsnCode: "",
          quantity: 1,
          rate: 0,
          gstRate: 18,
          amount: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          gstAmount: 0,
          total: 0,
        }]);
      }

    } catch (error: any) {
      console.error('Error creating invoice:', error.message)
      setError(error.message || 'An error occurred while saving the invoice');
    } finally {
      setLoading(false)
    }
  }, [state, items, calculateTotals, token, user?.id, onSubmit, isEditing, setLoading, setError]);

  // useMemo for computed values  
  const { subtotal, totalCGST, totalSGST, totalIGST, totalGst, grandTotal } = calculateTotals;

  // Form validation
  const isFormValid = useMemo(() => {
    return (
      state.invoiceNumber.trim() &&
      state.clientName.trim() &&
      items.some(item => item.description.trim() && item.quantity > 0 && item.rate > 0)
    );
  }, [state.invoiceNumber, state.clientName, items]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {state.error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {state.error}
        </div>
      )}

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
                  ref={invoiceNumberRef}
                  id="invoiceNumber"
                  placeholder="INV-001"
                  required
                  value={state.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poNumber">PO Number (Optional)</Label>
                <Input 
                  id="poNumber" 
                  placeholder="PO-001" 
                  value={state.poNumber}
                  onChange={(e) => updateField('poNumber', e.target.value)}
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
                        !state.invoiceDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {state.invoiceDate ? format(state.invoiceDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={state.invoiceDate} onSelect={(date) => updateField('invoiceDate', date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !state.dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {state.dueDate ? format(state.dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={state.dueDate} onSelect={(date) => updateField('dueDate', date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={state.paymentTerms} onValueChange={(value) => updateField('paymentTerms', value)}>
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

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="taxType">Tax Type *</Label>
                <span className="text-xs text-muted-foreground" title="Select CGST + SGST for same-state sales; IGST for inter-state">
                  💡
                </span>
              </div>
              <Select value={state.taxType} onValueChange={(value: 'CGST+SGST' | 'IGST') => {
                updateField('taxType', value);
                // Recalculate all items with new tax type
                const updatedItems = items.map(item => calculateItemTotals(item, value));
                setItems(updatedItems);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="CGST+SGST">CGST + SGST (Intra-State)</SelectItem>
                  <SelectItem value="IGST">IGST (Inter-State)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                💡 Select CGST + SGST for same-state sales; IGST for inter-state
              </p>
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
                value={state.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientGstin">GSTIN</Label>
              <Input 
                id="clientGstin" 
                placeholder="22AAAAA0000A1Z5" 
                value={state.clientGstin}
                onChange={(e) => updateField('clientGstin', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea 
                id="clientAddress" 
                placeholder="Enter client address" 
                rows={3} 
                required 
                value={state.clientAddress}
                onChange={(e) => updateField('clientAddress', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientCity">City</Label>
                <Input 
                  id="clientCity" 
                  placeholder="Mumbai" 
                  required 
                  value={state.clientCity}
                  onChange={(e) => updateField('clientCity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientState">State</Label>
                <Select value={state.clientState} onValueChange={(value) => updateField('clientState', value)}>
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
                value={state.clientPincode}
                onChange={(e) => updateField('clientPincode', e.target.value)}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Item Name</TableHead>
                  <TableHead className="min-w-[120px]">HSN Code</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>GST %</TableHead>
                  <TableHead>Taxable Value</TableHead>
                  {state.taxType === 'CGST+SGST' && (
                    <>
                      <TableHead>CGST</TableHead>
                      <TableHead>SGST</TableHead>
                    </>
                  )}
                  {state.taxType === 'IGST' && <TableHead>IGST</TableHead>}
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
                        placeholder="Item name"
                        className="min-w-[180px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.hsnCode || ""}
                        onChange={(e) => updateItem(index, "hsnCode", e.target.value)}
                        placeholder="HSN/SAC"
                        className="w-[100px]"
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
                    <TableCell className="font-medium">₹{item.amount.toFixed(2)}</TableCell>
                    {state.taxType === 'CGST+SGST' && (
                      <>
                        <TableCell>₹{(item.cgstAmount || 0).toFixed(2)}</TableCell>
                        <TableCell>₹{(item.sgstAmount || 0).toFixed(2)}</TableCell>
                      </>
                    )}
                    {state.taxType === 'IGST' && (
                      <TableCell>₹{(item.igstAmount || 0).toFixed(2)}</TableCell>
                    )}
                    <TableCell className="font-bold">₹{item.total.toFixed(2)}</TableCell>
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
          </div>

          {/* Tax Summary */}
          <div className="mt-6 flex justify-end">
            <div className="w-96 space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 border-b border-blue-300 pb-2">Tax Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              {state.taxType === 'CGST+SGST' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">CGST:</span>
                    <span className="font-medium">₹{totalCGST.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">SGST:</span>
                    <span className="font-medium">₹{totalSGST.toFixed(2)}</span>
                  </div>
                </>
              )}
              {state.taxType === 'IGST' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">IGST:</span>
                  <span className="font-medium">₹{totalIGST.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-blue-300 pt-3 text-blue-900">
                <span>Total Invoice Value:</span>
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
              value={state.notes}
              onChange={(e) => updateField('notes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankDetails">Bank Details</Label>
            <Textarea
              id="bankDetails"
              placeholder="Bank Name: State Bank of India&#10;Account Number: 1234567890&#10;IFSC Code: SBIN0001234"
              rows={3}
              value={state.bankDetails}
              onChange={(e) => updateField('bankDetails', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdfUrl">PDF URL (Optional)</Label>
            <Input 
              id="pdfUrl" 
              placeholder="https://example.com/invoice.pdf" 
              value={state.pdfUrl}
              onChange={(e) => updateField('pdfUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ewayBillNo">E-Way Bill Number (Optional)</Label>
            <Input 
              id="ewayBillNo" 
              placeholder="123456789012" 
              value={state.ewayBillNo}
              onChange={(e) => updateField('ewayBillNo', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={state.isLoading || !isFormValid} className="flex-1">
          {state.isLoading ? "Creating..." : isEditing ? "Update Invoice" : "Create Invoice"}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}