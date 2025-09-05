const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    date: { type: Date, default: Date.now },
    lines: [
      {
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartAccount' },
        debit: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
        memo: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
