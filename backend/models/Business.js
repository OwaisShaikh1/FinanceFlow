// models/Business.js
const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gstin: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);

