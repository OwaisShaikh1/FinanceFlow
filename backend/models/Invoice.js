// models/Invoice.js
const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  items: [
    {
      name: String,
      qty: Number,
      price: Number,
      gstRate: { type: Number, default: 0 }
    }
  ],
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
