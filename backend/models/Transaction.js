const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    date: { type: Date, default: Date.now },
    description: String,
    amount: Number,
    category: String,
    coa: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartAccount' },
    receiptUrl: String,
    source: { type: String, enum: ['MANUAL', 'BANK_UPLOAD'], default: 'MANUAL' },
    gst: { rate: Number, amount: Number, input: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
