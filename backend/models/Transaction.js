// models/Transaction.js
const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  coa: { type: mongoose.Schema.Types.ObjectId, ref: "COA" },
  gstRate: { type: Number, default: 0 },
  gstInput: { type: Boolean, default: false },
  receipt: { type: String }, // file path or URL
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);

