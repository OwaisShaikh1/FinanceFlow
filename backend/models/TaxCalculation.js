const mongoose = require('mongoose');

const TaxCalculationSchema = new mongoose.Schema({
  annualIncome: {
    type: Number,
    required: true,
    min: 0,
  },
  regime: {
    type: String,
    enum: ['old', 'new'],
    required: true,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  taxableIncome: {
    type: Number,
    required: true,
  },
  totalTax: {
    type: Number,
    required: true,
  },
  quarterlyTax: [
    {
      quarter: { type: String, required: true },
      dueDate: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  baseDeductions: {
    type: Number,
    default: 0,
  },
  investments: {
    type: Map,
    of: Number,
  },
  totalInvested: {
    type: Number,
    default: 0,
  },
  totalTaxSaved: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TaxCalculation', TaxCalculationSchema);