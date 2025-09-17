const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    paymentMethod: { type: String, default: null },
    date: { type: Date, default: Date.now },
    description: { type: String, default: null },
    amount: { type: Number, default: null },
    category: { type: String, default: null },
    coa: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartAccount', default: null },
    receipts: [{
      filename: { type: String, default: null },
      contentType: { type: String, default: null },
      data: { type: Buffer, default: null }
    }],
    source: { type: String, enum: ['MANUAL', 'BANK_UPLOAD'], default: 'MANUAL' },
    gst: {
      type: {
        rate: { type: Number, default: null },
        amount: { type: Number, default: null },
        input: { type: Boolean, default: null }
      },
      default: {}
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
