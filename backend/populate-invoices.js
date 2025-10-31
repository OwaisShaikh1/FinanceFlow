require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Business = require('./models/Business');
const Invoice = require('./models/Invoice');

const connectDB = mongoose
  .connect(process.env.MONGODB_URI, { 
    dbName: 'Finance',
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    return true;
  })
  .catch((e) => {
    console.error('❌ MongoDB Atlas connection error:', e.message);
    process.exit(1);
  });

// Sample product/service catalog
const products = [
  { name: 'Web Development Service', description: 'Custom website development', price: 50000, gstRate: 18 },
  { name: 'Mobile App Development', description: 'iOS/Android app development', price: 100000, gstRate: 18 },
  { name: 'Consulting Services', description: 'Business consulting and strategy', price: 25000, gstRate: 18 },
  { name: 'Digital Marketing', description: 'SEO, SEM, and social media marketing', price: 30000, gstRate: 18 },
  { name: 'Graphic Design', description: 'Logo and branding design', price: 15000, gstRate: 18 },
  { name: 'Content Writing', description: 'Blog posts and articles', price: 5000, gstRate: 18 },
  { name: 'Cloud Hosting', description: 'AWS/Azure hosting setup', price: 20000, gstRate: 18 },
  { name: 'Database Management', description: 'Database setup and optimization', price: 35000, gstRate: 18 },
  { name: 'UI/UX Design', description: 'User interface and experience design', price: 40000, gstRate: 18 },
  { name: 'API Integration', description: 'Third-party API integration', price: 18000, gstRate: 18 },
  { name: 'Software Maintenance', description: 'Monthly software maintenance', price: 12000, gstRate: 18 },
  { name: 'Training Services', description: 'Software training and workshops', price: 8000, gstRate: 18 },
];

// Invoice statuses with weights (more likely to be PAID/SENT)
const statuses = [
  { status: 'PAID', weight: 40 },
  { status: 'SENT', weight: 30 },
  { status: 'PARTIAL', weight: 15 },
  { status: 'DRAFT', weight: 10 },
  { status: 'OVERDUE', weight: 5 },
];

function getWeightedRandomStatus() {
  const totalWeight = statuses.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const { status, weight } of statuses) {
    if (random < weight) return status;
    random -= weight;
  }
  return 'SENT';
}

function getRandomItems() {
  const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
  const selectedProducts = [];
  const usedIndices = new Set();
  
  for (let i = 0; i < numItems; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * products.length);
    } while (usedIndices.has(idx));
    usedIndices.add(idx);
    
    const product = products[idx];
    const qty = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
    const discount = Math.random() < 0.3 ? Math.floor(Math.random() * 10) + 5 : 0; // 30% chance of 5-15% discount
    
    const taxableAmount = product.price * qty * (1 - discount / 100);
    const gstAmount = taxableAmount * (product.gstRate / 100);
    const totalAmount = taxableAmount + gstAmount;
    
    selectedProducts.push({
      name: product.name,
      description: product.description,
      qty,
      price: product.price,
      gstRate: product.gstRate,
      discount,
      taxableAmount: Math.round(taxableAmount),
      gstAmount: Math.round(gstAmount),
      totalAmount: Math.round(totalAmount),
    });
  }
  
  return selectedProducts;
}

function calculateInvoiceTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.taxableAmount, 0);
  const totalTax = items.reduce((sum, item) => sum + item.gstAmount, 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.price * item.qty * item.discount / 100), 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);
  
  return {
    subtotal: Math.round(subtotal),
    totalTax: Math.round(totalTax),
    totalDiscount: Math.round(totalDiscount),
    totalAmount: Math.round(totalAmount),
  };
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function populateInvoices() {
  try {
    await connectDB;
    
    console.log('\n📊 Fetching clients...');
    const clients = await User.find({ role: { $in: ['user', 'User'] } }).populate('business');
    
    if (clients.length === 0) {
      console.log('❌ No clients found in database');
      process.exit(1);
    }
    
    console.log(`✅ Found ${clients.length} clients\n`);
    
    // Clear existing invoices (optional - comment out if you want to keep existing)
    await Invoice.deleteMany({});
    console.log('🗑️  Cleared existing invoices\n');
    
    const invoices = [];
    let invoiceCounter = 1000;
    
    for (const client of clients) {
      if (!client.business) {
        console.log(`⚠️  Skipping ${client.name} - No business associated`);
        continue;
      }
      
      // Generate 5-15 invoices per client
      const numInvoices = Math.floor(Math.random() * 11) + 5;
      console.log(`📝 Generating ${numInvoices} invoices for ${client.name}...`);
      
      for (let i = 0; i < numInvoices; i++) {
        invoiceCounter++;
        const invoiceNumber = `INV-${String(invoiceCounter).padStart(6, '0')}`;
        
        // Generate dates (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const issueDate = getRandomDate(sixMonthsAgo, new Date());
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms
        
        const items = getRandomItems();
        const totals = calculateInvoiceTotals(items);
        const status = getWeightedRandomStatus();
        
        // Calculate paid amount based on status
        let paidAmount = 0;
        let paidDate = null;
        if (status === 'PAID') {
          paidAmount = totals.totalAmount;
          paidDate = getRandomDate(issueDate, new Date());
        } else if (status === 'PARTIAL') {
          paidAmount = Math.round(totals.totalAmount * (Math.random() * 0.5 + 0.3)); // 30-80% paid
        }
        
        const balanceAmount = totals.totalAmount - paidAmount;
        
        invoices.push({
          user: client._id,
          business: client.business._id,
          number: invoiceNumber,
          
          // Customer info
          customerName: client.business.name || client.businessName || `${client.name} Business`,
          customerEmail: client.email,
          customerPhone: client.phone || '+91 9876543210',
          customerAddress: client.address || 'Business Address',
          customerGSTIN: client.gstin || '',
          customerPAN: client.pan || '',
          
          items,
          
          subtotal: totals.subtotal,
          totalTax: totals.totalTax,
          totalDiscount: totals.totalDiscount,
          totalAmount: totals.totalAmount,
          paidAmount,
          balanceAmount,
          
          status,
          issueDate,
          dueDate,
          paidDate,
          
          notes: 'Thank you for your business!',
          terms: 'Payment due within 30 days',
        });
      }
    }
    
    console.log(`\n💾 Inserting ${invoices.length} invoices into database...`);
    await Invoice.insertMany(invoices);
    
    // Show summary
    console.log('\n✅ Invoices populated successfully!\n');
    console.log('📊 Summary by Status:');
    const statusCounts = await Invoice.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } }
    ]);
    
    statusCounts.forEach(({ _id, count, total }) => {
      console.log(`   ${_id}: ${count} invoices (₹${total.toLocaleString('en-IN')})`);
    });
    
    console.log('\n📊 Summary by Client:');
    const clientCounts = await Invoice.aggregate([
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
      { $unwind: '$userInfo' },
      { $group: { _id: '$user', name: { $first: '$userInfo.name' }, count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } }
    ]);
    
    clientCounts.forEach(({ name, count, total }) => {
      console.log(`   ${name}: ${count} invoices (₹${total.toLocaleString('en-IN')})`);
    });
    
    const grandTotal = await Invoice.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    console.log(`\n💰 Total Invoice Amount: ₹${grandTotal[0]?.total.toLocaleString('en-IN') || 0}`);
    console.log('\n✨ Done!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating invoices:', error);
    process.exit(1);
  }
}

populateInvoices();
