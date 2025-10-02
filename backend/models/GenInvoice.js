const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  rate: { type: Number, required: true, min: 0 },
  gstRate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  gstAmount: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const GenInvoiceSchema = new mongoose.Schema({
  business: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  clientName: { type: String, required: true },
  clientGstin: { type: String, default: '' },

  items: { type: [InvoiceItemSchema], required: true },

  status: { type: String, enum: ['DRAFT', 'FINAL', 'SENT', 'PAID'], default: 'DRAFT' },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },

  pdfUrl: { type: String, default: '' },
  ewayBillNo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('GenInvoice', GenInvoiceSchema);
