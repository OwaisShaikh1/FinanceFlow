const mongoose = require('mongoose');

const ChartAccountSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    name: String,
    code: String,
    type: { type: String, enum: ['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChartAccount', ChartAccountSchema);
