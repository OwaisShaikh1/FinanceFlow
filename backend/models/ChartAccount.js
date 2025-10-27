const mongoose = require('mongoose');

const ChartAccountSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    type: { type: String, enum: ['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE', 'EQUITY'], required: true, index: true },
    subType: { type: String, trim: true }, // e.g., "Current Asset", "Fixed Asset", "Operating Expense"
    
    // Account Details
    description: { type: String, trim: true },
    parentAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartAccount', default: null },
    level: { type: Number, default: 1, min: 1 }, // Hierarchy level
    
    // Balance tracking
    currentBalance: { type: Number, default: 0 },
    openingBalance: { type: Number, default: 0 },
    
    // Settings
    isActive: { type: Boolean, default: true, index: true },
    isSystem: { type: Boolean, default: false }, // System-created accounts can't be deleted
    allowTransactions: { type: Boolean, default: true },
    
    // Tax settings
    taxApplicable: { type: Boolean, default: false },
    defaultTaxRate: { type: Number, default: 0, min: 0, max: 100 },
    
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
ChartAccountSchema.index({ business: 1, code: 1 }, { unique: true });
ChartAccountSchema.index({ business: 1, type: 1, isActive: 1 });
ChartAccountSchema.index({ user: 1, type: 1 });

// Virtual for transactions
ChartAccountSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'coa'
});

// Virtual for child accounts
ChartAccountSchema.virtual('children', {
  ref: 'ChartAccount',
  localField: '_id',
  foreignField: 'parentAccount'
});

// Method to get account hierarchy
ChartAccountSchema.methods.getFullName = function() {
  return this.code ? `${this.code} - ${this.name}` : this.name;
};

module.exports = mongoose.model('ChartAccount', ChartAccountSchema);
