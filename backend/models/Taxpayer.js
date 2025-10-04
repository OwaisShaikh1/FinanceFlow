const mongoose = require('mongoose');

// Taxpayer Schema
const TaxpayerSchema = new mongoose.Schema({
  business: { type: String, required: true },
  
  // Basic details
  gstin: { type: String, required: true, unique: true },
  pan: { type: String, required: true },
  legalName: { type: String, required: true },
  tradeName: { type: String, default: '' },
  
  // Contact information
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  
  // Address
  address: {
    building: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  
  // GSP credentials (optional)
  gspCredentials: {
    username: { type: String, default: '' },
    appKey: { type: String, default: '' },
    isActive: { type: Boolean, default: false }
  },
  
  // Configuration
  isActive: { type: Boolean, default: true },
  
}, { timestamps: true });

module.exports = mongoose.model('Taxpayer', TaxpayerSchema);