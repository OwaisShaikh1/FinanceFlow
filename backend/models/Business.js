const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    gstin: { type: String, uppercase: true, trim: true, sparse: true, unique: true, index: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },
    
    // Contact Information
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    website: { type: String, trim: true },
    
    // Business Details
    businessType: { type: String, trim: true },
    industry: { type: String, trim: true },
    pan: { type: String, uppercase: true, trim: true },
    tan: { type: String, uppercase: true, trim: true },
    
    // Ownership and Assignment
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedCA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    
    // Business Settings
    fiscalYearStart: { type: Number, default: 4, min: 1, max: 12 }, // April = 4
    currency: { type: String, default: 'INR' },
    
    // Status
    isActive: { type: Boolean, default: true, index: true },
    isVerified: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for common queries
BusinessSchema.index({ owner: 1, isActive: 1 });
BusinessSchema.index({ assignedCA: 1, isActive: 1 });

// Virtual for getting all transactions
BusinessSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'business'
});

// Virtual for getting all invoices
BusinessSchema.virtual('invoices', {
  ref: 'Invoice',
  localField: '_id',
  foreignField: 'business'
});

module.exports = mongoose.model('Business', BusinessSchema);
