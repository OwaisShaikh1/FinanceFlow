const mongoose = require('mongoose');

const DocShareSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: String,
    notes: String,
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('DocShare', DocShareSchema);
