const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, sparse: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true, index: true },
    paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Credit Card', 'Debit Card', 'UPI', 'Cheque', 'Online Payment', 'Wallet', 'Other'], default: 'Cash' },
    date: { type: Date, default: Date.now, index: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true, index: true },
    coa: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartAccount', default: null, index: true },
    
    // Receipts/Attachments
    receipts: [{
      filename: { type: String, trim: true },
      contentType: { type: String, trim: true },
      data: { type: Buffer },
      uploadDate: { type: Date, default: Date.now }
    }],
    
    // Source tracking
    source: { type: String, enum: ['MANUAL', 'BANK_UPLOAD', 'IMPORT'], default: 'MANUAL', index: true },
    
    // GST Information
    gst: {
      rate: { type: Number, default: 0, min: 0, max: 100 },
      amount: { type: Number, default: 0, min: 0 },
      input: { type: Boolean, default: false }
    },
    
    // Additional tracking
    invoiceRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    reconciled: { type: Boolean, default: false, index: true },
    reconciledDate: { type: Date },
    notes: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    
    // Audit trail
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for common queries
TransactionSchema.index({ user: 1, business: 1, date: -1 });
TransactionSchema.index({ business: 1, type: 1, date: -1 });
TransactionSchema.index({ user: 1, type: 1, date: -1 });
TransactionSchema.index({ business: 1, category: 1, date: -1 });
TransactionSchema.index({ business: 1, reconciled: 1 });

// Text index for search
TransactionSchema.index({ description: 'text', category: 'text', notes: 'text' });

// Virtual for net amount (amount including GST)
TransactionSchema.virtual('netAmount').get(function() {
  return this.amount + (this.gst?.amount || 0);
});

// Pre-save middleware to calculate GST amount if not provided
TransactionSchema.pre('save', function(next) {
  if (this.gst && this.gst.rate && !this.gst.amount) {
    this.gst.amount = (this.amount * this.gst.rate) / 100;
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
