const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  hsnCode: { type: String, default: '' }, // HSN/SAC Code
  quantity: { type: Number, required: true, min: 1 },
  rate: { type: Number, required: true, min: 0 },
  gstRate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 }, // Taxable Value
  cgstAmount: { type: Number, default: 0 }, // Central GST
  sgstAmount: { type: Number, default: 0 }, // State GST
  igstAmount: { type: Number, default: 0 }, // Integrated GST
  gstAmount: { type: Number, required: true, min: 0 }, // Total GST
  total: { type: Number, required: true, min: 0 }
});

const GenInvoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  business: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  clientName: { type: String, required: true },
  clientGstin: { type: String, default: '' },
  clientAddress: { type: String, default: '' },
  clientCity: { type: String, default: '' },
  clientState: { type: String, default: '' },
  clientPincode: { type: String, default: '' },

  // Tax Type (Intra-state or Inter-state)
  taxType: { 
    type: String, 
    enum: ['CGST+SGST', 'IGST'], 
    default: 'CGST+SGST',
    required: true 
  },

  items: { type: [InvoiceItemSchema], required: true },

  // Totals
  subtotal: { type: Number, default: 0 },
  totalCGST: { type: Number, default: 0 },
  totalSGST: { type: Number, default: 0 },
  totalIGST: { type: Number, default: 0 },
  totalGst: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },

  status: { type: String, enum: ['DRAFT', 'FINAL', 'SENT', 'PAID'], default: 'DRAFT' },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  sentDate: { type: Date },
  paidDate: { type: Date },

  paymentTerms: { type: String, default: '' },
  notes: { type: String, default: '' },
  bankDetails: { type: String, default: '' },
  pdfUrl: { type: String, default: '' },
  ewayBillNo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('GenInvoice', GenInvoiceSchema);
