// Shared types for the invoicing system

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  gstRate: number
  amount: number
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
  items: InvoiceItem[]
  subtotal: number
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