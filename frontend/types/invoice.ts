// Shared types for the invoicing system

export interface InvoiceItem {
  id: string
  description: string
  hsnCode?: string // HSN/SAC Code
  quantity: number
  rate: number
  gstRate: number
  amount: number // Taxable Value
  cgstAmount?: number // Central GST
  sgstAmount?: number // State GST
  igstAmount?: number // Integrated GST
  gstAmount: number
  total: number
}

export interface Invoice {
  _id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  clientName: string
  clientGstin: string
  taxType: 'CGST+SGST' | 'IGST' // Tax Type
  items: InvoiceItem[]
  subtotal: number
  totalCGST?: number // Total CGST
  totalSGST?: number // Total SGST
  totalIGST?: number // Total IGST
  totalGst: number
  grandTotal: number
  status: string
  business: string
  pdfUrl?: string
  ewayBillNo?: string
}

export interface InvoiceEditModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  onUpdate: (updatedInvoice: Invoice) => void
}