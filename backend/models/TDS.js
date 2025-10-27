const mongoose = require('mongoose');

const tdsSchema = new mongoose.Schema({
  // References
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  
  // Payee Information  
  payeeName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  payeePAN: {
    type: String,
    uppercase: true,
    trim: true,
    sparse: true
  },

  // TDS Section (e.g., "194D - Insurance Commission")
  tdsSection: {
    type: String,
    required: true,
    index: true
  },

  // Payment Details
  paymentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true,
    index: true
  },

  // Threshold Information
  applicableThreshold: {
    type: Number,
    required: true,
    min: 0
  },

  // TDS Calculation
  tdsRate: {
    type: Number,
    required: true,
    min: 0,
    max: 30
  },
  tdsAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // Net Payment (Payment Amount - TDS Amount)
  netPayment: {
    type: Number,
    required: true,
    min: 0
  },

  // Financial Year & Quarter
  financialYear: {
    type: String,
    required: true,
    index: true
  },
  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: true,
    index: true
  },

  // Challan Information
  challanNumber: {
    type: String,
    trim: true,
    sparse: true
  },
  challanDate: {
    type: Date
  },
  bankName: {
    type: String,
    trim: true
  },

  // Certificate Details
  certificateNumber: {
    type: String,
    trim: true,
    sparse: true
  },
  certificateDate: {
    type: Date
  },
  certificateIssued: {
    type: Boolean,
    default: false,
    index: true
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'paid', 'filed', 'certified'],
    default: 'pending',
    index: true
  },

  // References
  transactionRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },

  // Notes
  notes: {
    type: String,
    trim: true
  },

  // Record Date
  recordDate: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Audit
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common queries
tdsSchema.index({ business: 1, financialYear: 1, quarter: 1 });
tdsSchema.index({ user: 1, status: 1, recordDate: -1 });
tdsSchema.index({ business: 1, payeeName: 1, financialYear: 1 });

// Text search for payee names
tdsSchema.index({ payeeName: 'text', notes: 'text' });

// Pre-save middleware to calculate net payment and financial year/quarter
tdsSchema.pre('save', function(next) {
  // Calculate net payment if not provided
  if (!this.netPayment) {
    this.netPayment = this.paymentAmount - this.tdsAmount;
  }
  
  // Auto-calculate financial year and quarter based on payment date
  if (this.paymentDate && !this.financialYear) {
    const paymentYear = this.paymentDate.getFullYear();
    const paymentMonth = this.paymentDate.getMonth() + 1; // 0-indexed
    
    // Indian Financial Year starts from April
    this.financialYear = paymentMonth >= 4 
      ? `${paymentYear}-${paymentYear + 1}` 
      : `${paymentYear - 1}-${paymentYear}`;
    
    // Determine quarter
    if (paymentMonth >= 4 && paymentMonth <= 6) this.quarter = 'Q1';
    else if (paymentMonth >= 7 && paymentMonth <= 9) this.quarter = 'Q2';
    else if (paymentMonth >= 10 && paymentMonth <= 12) this.quarter = 'Q3';
    else this.quarter = 'Q4';
  }
  
  next();
});

const TDS = mongoose.model('TDS', tdsSchema);

module.exports = TDS;