const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  hsnCode: { type: String, trim: true }, // HSN/SAC Code
  qty: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  gstRate: { type: Number, default: 0, min: 0, max: 100 },
  discount: { type: Number, default: 0, min: 0 },
  taxableAmount: { type: Number },
  cgstAmount: { type: Number, default: 0 }, // Central GST
  sgstAmount: { type: Number, default: 0 }, // State GST
  igstAmount: { type: Number, default: 0 }, // Integrated GST
  gstAmount: { type: Number }, // Total GST (CGST+SGST or IGST)
  totalAmount: { type: Number }
}, { _id: true });

const InvoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    number: { type: String, required: true, trim: true, index: true },
    
    // Customer Information
    customerName: { type: String, required: true, trim: true, index: true },
    customerEmail: { type: String, lowercase: true, trim: true },
    customerPhone: { type: String, trim: true },
    customerAddress: { type: String, trim: true },
    customerGSTIN: { type: String, uppercase: true, trim: true },
    customerPAN: { type: String, uppercase: true, trim: true },
    
    // Tax Type (Intra-state or Inter-state)
    taxType: { 
      type: String, 
      enum: ['CGST+SGST', 'IGST'], 
      default: 'CGST+SGST',
      required: true 
    },
    
    // Invoice Items
    items: [InvoiceItemSchema],
    
    // Financial Summary
    subtotal: { type: Number, default: 0, min: 0 },
    totalCGST: { type: Number, default: 0, min: 0 }, // Total CGST
    totalSGST: { type: Number, default: 0, min: 0 }, // Total SGST
    totalIGST: { type: Number, default: 0, min: 0 }, // Total IGST
    totalTax: { type: Number, default: 0, min: 0 },
    totalDiscount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    balanceAmount: { type: Number, default: 0, min: 0 },
    
    // Status and Dates
    status: { type: String, enum: ['DRAFT', 'SENT', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED'], default: 'DRAFT', index: true },
    issueDate: { type: Date, required: true, index: true },
    dueDate: { type: Date, required: true, index: true },
    paidDate: { type: Date },
    
    // Additional Information
    notes: { type: String, trim: true },
    terms: { type: String, trim: true },
    pdfUrl: { type: String, trim: true },
    ewayBillNo: { type: String, trim: true },
    
    // Payment tracking
    paymentHistory: [{
      amount: { type: Number, required: true, min: 0 },
      date: { type: Date, required: true },
      method: { type: String, trim: true },
      reference: { type: String, trim: true },
      notes: { type: String, trim: true }
    }],
    
    // References
    transactionRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    
    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes
InvoiceSchema.index({ business: 1, status: 1, issueDate: -1 });
InvoiceSchema.index({ user: 1, status: 1, issueDate: -1 });
InvoiceSchema.index({ business: 1, customerName: 1 });
InvoiceSchema.index({ number: 1, business: 1 }, { unique: true });

// Text search
InvoiceSchema.index({ customerName: 'text', number: 'text', notes: 'text' });

// Virtual for overdue status
InvoiceSchema.virtual('isOverdue').get(function() {
  return this.status !== 'PAID' && this.dueDate < new Date();
});

// Pre-save middleware to calculate totals
InvoiceSchema.pre('save', function(next) {
  // Calculate item totals based on tax type
  this.items.forEach(item => {
    const baseAmount = item.qty * item.price;
    const discountAmount = (baseAmount * (item.discount || 0)) / 100;
    item.taxableAmount = baseAmount - discountAmount;
    
    const totalGst = (item.taxableAmount * (item.gstRate || 0)) / 100;
    
    // Split GST based on tax type
    if (this.taxType === 'CGST+SGST') {
      item.cgstAmount = totalGst / 2;
      item.sgstAmount = totalGst / 2;
      item.igstAmount = 0;
    } else if (this.taxType === 'IGST') {
      item.cgstAmount = 0;
      item.sgstAmount = 0;
      item.igstAmount = totalGst;
    }
    
    item.gstAmount = totalGst;
    item.totalAmount = item.taxableAmount + item.gstAmount;
  });
  
  // Calculate invoice totals
  this.subtotal = this.items.reduce((sum, item) => sum + (item.taxableAmount || 0), 0);
  this.totalCGST = this.items.reduce((sum, item) => sum + (item.cgstAmount || 0), 0);
  this.totalSGST = this.items.reduce((sum, item) => sum + (item.sgstAmount || 0), 0);
  this.totalIGST = this.items.reduce((sum, item) => sum + (item.igstAmount || 0), 0);
  this.totalTax = this.totalCGST + this.totalSGST + this.totalIGST;
  this.totalAmount = this.subtotal + this.totalTax;
  this.balanceAmount = this.totalAmount - (this.paidAmount || 0);
  
  // Update status based on payment
  if (this.balanceAmount === 0 && this.paidAmount > 0) {
    this.status = 'PAID';
  } else if (this.paidAmount > 0 && this.balanceAmount > 0) {
    this.status = 'PARTIAL';
  } else if (this.status !== 'DRAFT' && this.dueDate < new Date()) {
    this.status = 'OVERDUE';
  }
  
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
