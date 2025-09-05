const mongoose = require('mongoose');

const ReturnUploadSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    type: { type: String, enum: ['GSTR1', 'GSTR3B', 'TDS', 'ITR'] },
    period: String,
    fileUrl: String,
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReturnUpload', ReturnUploadSchema);
