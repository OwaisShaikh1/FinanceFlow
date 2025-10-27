const mongoose = require('mongoose');

const BankTxnSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    
    // Bank transaction details
    bankRef: { type: String, required: true, trim: true, index: true },
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true },
    balance: { type: Number, default: 0 }, // Account balance after transaction
    description: { type: String, required: true, trim: true },
    transactionType: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
    
    // Bank details
    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    
    // Reconciliation
    matchedTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', default: null, index: true },
    reconciled: { type: Boolean, default: false, index: true },
    reconciledDate: { type: Date },
    reconciledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Additional tracking
    category: { type: String, trim: true },
    notes: { type: String, trim: true },
    isIgnored: { type: Boolean, default: false }, // For excluding from reconciliation
    
    // Import metadata
    importBatch: { type: String, trim: true }, // Group related imports
    importDate: { type: Date, default: Date.now },
    rawData: { type: mongoose.Schema.Types.Mixed }, // Store original bank statement data
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for reconciliation queries
BankTxnSchema.index({ business: 1, reconciled: 1, date: -1 });
BankTxnSchema.index({ user: 1, reconciled: 1 });
BankTxnSchema.index({ business: 1, bankRef: 1 }, { unique: true });

// Text search for descriptions
BankTxnSchema.index({ description: 'text', notes: 'text' });

// Virtual for matched status
BankTxnSchema.virtual('isMatched').get(function() {
  return this.matchedTransaction !== null;
});

module.exports = mongoose.model('BankTxn', BankTxnSchema);
