const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    number: String,
    customerName: String,
    customerGSTIN: String,
    items: [
      {
        name: String,
        qty: Number,
        price: Number,
        gstRate: Number,
      },
    ],
    status: { type: String, enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE'], default: 'DRAFT' },
    issueDate: Date,
    dueDate: Date,
    pdfUrl: String,
    ewayBillNo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);
