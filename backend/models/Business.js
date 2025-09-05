const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema(
  {
    name: String,
    gstin: String,
    address: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedCA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', BusinessSchema);
