const mongoose = require('mongoose');

// GST Invoice Item Schema
const GSTInvoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  taxableValue: { type: Number, required: true },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  totalTax: { type: Number, required: true },
  totalValue: { type: Number, required: true }
});

// Main GST Invoice Schema
const GSTInvoiceSchema = new mongoose.Schema({
  business: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: Date, required: true },
  period: { type: String, required: true }, // YYYY-MM format
  
  // Customer details
  customerName: { type: String, required: true },
  customerGSTIN: { type: String, default: '' },
  customerPAN: { type: String, default: '' },
  customerAddress: { type: String, default: '' },
  
  // Invoice totals
  items: [GSTInvoiceItemSchema],
  totalTaxableValue: { type: Number, required: true },
  totalCGST: { type: Number, default: 0 },
  totalSGST: { type: Number, default: 0 },
  totalIGST: { type: Number, default: 0 },
  totalTax: { type: Number, required: true },
  invoiceValue: { type: Number, required: true },
  
  // Transaction type
  transactionType: { 
    type: String, 
    enum: ['B2B', 'B2C', 'EXPORT'], 
    default: 'B2B' 
  },
  
  // Place of supply
  placeOfSupply: { type: String, default: '' },
  
  status: { 
    type: String, 
    enum: ['DRAFT', 'FINAL'], 
    default: 'DRAFT' 
  }
}, { timestamps: true });

module.exports = mongoose.model('GSTInvoice', GSTInvoiceSchema);