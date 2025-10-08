const mongoose = require('mongoose');
require('dotenv').config();

// Import the GenInvoice model
const { GenInvoice } = require('./models');

async function checkInvoices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find some sample invoices
    const invoices = await GenInvoice.find().limit(3);
    
    if (invoices.length > 0) {
      console.log(`📋 Found ${invoices.length} invoices:`);
      invoices.forEach(invoice => {
        console.log(`- ID: ${invoice._id}`);
        console.log(`  Number: ${invoice.invoiceNumber}`);
        console.log(`  Client: ${invoice.clientName}`);
        console.log(`  Total: ₹${invoice.grandTotal}`);
        console.log('---');
      });
    } else {
      console.log('❌ No invoices found in database');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkInvoices();