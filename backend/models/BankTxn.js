const mongoose = require('mongoose');

const BankTxnSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    bankRef: String,
    date: Date,
    amount: Number,
    description: String,
    matchedTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BankTxn', BankTxnSchema);
