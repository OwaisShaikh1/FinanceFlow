const mongoose = require('mongoose');

// GST Returns Schema
const GSTReturnSchema = new mongoose.Schema({
  business: { type: String, required: true },
  
  // Return identification
  returnType: { 
    type: String, 
    enum: ['GSTR-1', 'GSTR-3B'], 
    required: true 
  },
  period: { type: String, required: true }, // YYYY-MM format
  dueDate: { type: Date, required: true },
  
  // Return status
  status: { 
    type: String, 
    enum: ['DRAFT', 'GENERATED', 'FILED', 'REJECTED'], 
    default: 'DRAFT' 
  },
  
  // Financial summary
  outputGST: { type: Number, default: 0 },
  inputTaxCredit: { type: Number, default: 0 },
  netPayable: { type: Number, default: 0 },
  
  // Return data
  returnData: {
    b2b: { type: Array, default: [] },
    b2c: { type: Array, default: [] },
    exports: { type: Array, default: [] }
  },
  
  // File information
  jsonFileUrl: { type: String, default: '' },
  fileName: { type: String, default: '' },
  
  // Dates
  generatedDate: { type: Date },
  filedDate: { type: Date },
  
  // Invoice references
  invoiceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GSTInvoice' }]
  
}, { timestamps: true });

module.exports = mongoose.model('GSTReturn', GSTReturnSchema);