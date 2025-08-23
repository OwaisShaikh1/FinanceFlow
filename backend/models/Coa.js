// models/COA.js (Chart of Accounts)
const mongoose = require("mongoose");

const coaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Asset", "Liability", "Equity", "Income", "Expense"], required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true }
}, { timestamps: true });

module.exports = mongoose.model("COA", coaSchema);

