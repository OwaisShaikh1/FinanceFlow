const mongoose = require('mongoose');

const tdsSchema = new mongoose.Schema({
  // Payee Information  
  payeeName: {
    type: String,
    required: true,
    trim: true
  },

  // TDS Section (e.g., "194D - Insurance Commission")
  tdsSection: {
    type: String,
    required: true
  },

  // Payment Details
  paymentAmount: {
    type: Number,
    required: true,
    min: 0
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

  // Record Date
  recordDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const TDS = mongoose.model('TDS', tdsSchema);

module.exports = TDS;