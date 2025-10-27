const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const User = require('./models/User');
const Business = require('./models/Business');
const Transaction = require('./models/Transaction');
const ChartAccount = require('./models/ChartAccount');
const Invoice = require('./models/Invoice');
const TDS = require('./models/TDS');

// Sample data for different business types
const businessTypes = [
  {
    type: 'Retail',
    industry: 'Retail & E-commerce',
    categories: ['Sales', 'Purchase', 'Rent', 'Salaries', 'Marketing', 'Utilities'],
    avgMonthlyRevenue: { min: 200000, max: 800000 }
  },
  {
    type: 'Manufacturing',
    industry: 'Manufacturing',
    categories: ['Raw Materials', 'Production', 'Labor', 'Machinery', 'Sales', 'Utilities'],
    avgMonthlyRevenue: { min: 500000, max: 2000000 }
  },
  {
    type: 'Services',
    industry: 'IT & Consulting',
    categories: ['Professional Fees', 'Service Income', 'Salaries', 'Software', 'Office Rent'],
    avgMonthlyRevenue: { min: 300000, max: 1200000 }
  },
  {
    type: 'Restaurant',
    industry: 'Food & Beverage',
    categories: ['Food Sales', 'Beverage Sales', 'Ingredients', 'Staff Wages', 'Rent', 'Utilities'],
    avgMonthlyRevenue: { min: 150000, max: 600000 }
  },
  {
    type: 'Trading',
    industry: 'Import/Export',
    categories: ['Sales', 'Purchase', 'Transport', 'Customs Duty', 'Insurance', 'Bank Charges'],
    avgMonthlyRevenue: { min: 800000, max: 3000000 }
  }
];

// Chart of Accounts Template
const chartOfAccountsTemplate = [
  // ASSETS
  { code: 'A-1000', name: 'Cash', type: 'ASSET', subType: 'Current Asset', isSystem: true },
  { code: 'A-1100', name: 'Bank Account', type: 'ASSET', subType: 'Current Asset', isSystem: true },
  { code: 'A-1200', name: 'Accounts Receivable', type: 'ASSET', subType: 'Current Asset', isSystem: true },
  { code: 'A-1300', name: 'Inventory', type: 'ASSET', subType: 'Current Asset' },
  { code: 'A-2000', name: 'Equipment', type: 'ASSET', subType: 'Fixed Asset' },
  { code: 'A-2100', name: 'Furniture', type: 'ASSET', subType: 'Fixed Asset' },
  
  // LIABILITIES
  { code: 'L-3000', name: 'Accounts Payable', type: 'LIABILITY', subType: 'Current Liability', isSystem: true },
  { code: 'L-3300', name: 'GST Payable', type: 'LIABILITY', subType: 'Current Liability', isSystem: true },
  { code: 'L-3400', name: 'TDS Payable', type: 'LIABILITY', subType: 'Current Liability', isSystem: true },
  { code: 'L-4000', name: 'Long-term Loans', type: 'LIABILITY', subType: 'Long-term Liability' },
  
  // EQUITY
  { code: 'E-5000', name: 'Owner\'s Equity', type: 'EQUITY', subType: 'Capital', isSystem: true },
  { code: 'E-5100', name: 'Retained Earnings', type: 'EQUITY', subType: 'Earnings', isSystem: true },
  
  // INCOME
  { code: 'I-6000', name: 'Sales Revenue', type: 'INCOME', subType: 'Operating Income', isSystem: true },
  { code: 'I-6100', name: 'Service Income', type: 'INCOME', subType: 'Operating Income' },
  { code: 'I-6200', name: 'Other Income', type: 'INCOME', subType: 'Non-Operating Income' },
  
  // EXPENSES
  { code: 'X-7000', name: 'Cost of Goods Sold', type: 'EXPENSE', subType: 'Direct Expense' },
  { code: 'X-7100', name: 'Salaries & Wages', type: 'EXPENSE', subType: 'Operating Expense' },
  { code: 'X-7200', name: 'Rent', type: 'EXPENSE', subType: 'Operating Expense' },
  { code: 'X-7300', name: 'Utilities', type: 'EXPENSE', subType: 'Operating Expense' },
  { code: 'X-7400', name: 'Marketing', type: 'EXPENSE', subType: 'Operating Expense' },
  { code: 'X-7500', name: 'Office Supplies', type: 'EXPENSE', subType: 'Operating Expense' },
  { code: 'X-7600', name: 'Travel', type: 'EXPENSE', subType: 'Operating Expense' },
  { code: 'X-7700', name: 'Professional Fees', type: 'EXPENSE', subType: 'Operating Expense' },
  { code: 'X-7800', name: 'Insurance', type: 'EXPENSE', subType: 'Operating Expense' },
  { code: 'X-7900', name: 'Depreciation', type: 'EXPENSE', subType: 'Non-Operating Expense' },
];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGSTIN(stateCode) {
  const pan = String(Math.floor(Math.random() * 10000000000)).padStart(10, '0');
  const entityNumber = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  const checkDigit = String(Math.floor(Math.random() * 10));
  return `${stateCode}${pan}${entityNumber}Z${checkDigit}`;
}

function generatePAN() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  return (
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)] +
    digits[Math.floor(Math.random() * 10)] +
    digits[Math.floor(Math.random() * 10)] +
    digits[Math.floor(Math.random() * 10)] +
    digits[Math.floor(Math.random() * 10)] +
    letters[Math.floor(Math.random() * 26)]
  );
}

async function createChartOfAccounts(business, user) {
  const accounts = [];
  for (const template of chartOfAccountsTemplate) {
    const account = await ChartAccount.create({
      business: business._id,
      user: user._id,
      code: template.code,
      name: template.name,
      type: template.type,
      subType: template.subType,
      isSystem: template.isSystem || false,
      isActive: true,
      allowTransactions: true,
      level: 1,
      currentBalance: 0,
      openingBalance: 0,
      taxApplicable: template.type === 'INCOME' || template.type === 'EXPENSE',
      defaultTaxRate: template.type === 'INCOME' || template.type === 'EXPENSE' ? 18 : 0,
      createdBy: user._id
    });
    accounts.push(account);
  }
  return accounts;
}

async function generateTransactions(business, user, accounts, monthsBack = 6) {
  const transactions = [];
  const businessType = businessTypes.find(bt => bt.type === business.businessType) || businessTypes[0];
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsBack);
  
  const transactionsPerMonth = 40; // Average 40 transactions per month
  const totalTransactions = monthsBack * transactionsPerMonth;
  
  const incomeAccount = accounts.find(a => a.code === 'I-6000');
  const expenseAccounts = accounts.filter(a => a.type === 'EXPENSE');
  
  for (let i = 0; i < totalTransactions; i++) {
    const date = randomDate(startDate, endDate);
    const isIncome = Math.random() > 0.35; // 65% income, 35% expense
    
    let amount, type, category, description, account;
    
    if (isIncome) {
      amount = randomAmount(
        businessType.avgMonthlyRevenue.min / 20,
        businessType.avgMonthlyRevenue.max / 20
      );
      type = 'income';
      category = 'Sales';
      description = `Sales Invoice #${String(i + 1000).padStart(6, '0')}`;
      account = incomeAccount;
    } else {
      const expenseAccount = expenseAccounts[Math.floor(Math.random() * expenseAccounts.length)];
      amount = randomAmount(5000, 50000);
      type = 'expense';
      category = expenseAccount.name;
      description = `${expenseAccount.name} - ${date.toLocaleDateString()}`;
      account = expenseAccount;
    }
    
    const gstRate = [0, 5, 12, 18, 28][Math.floor(Math.random() * 5)];
    const gstAmount = (amount * gstRate) / 100;
    const totalAmount = amount + gstAmount;
    
    const transaction = await Transaction.create({
      user: user._id,
      business: business._id,
      type: type,
      category: category,
      description: description,
      amount: amount,
      totalAmount: totalAmount,
      gst: {
        rate: gstRate,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        igst: 0,
        total: gstAmount
      },
      date: date,
      paymentMethod: ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Credit Card'][Math.floor(Math.random() * 5)],
      chartAccount: account ? account._id : null,
      reconciled: Math.random() > 0.3, // 70% reconciled
      createdBy: user._id,
      updatedBy: user._id
    });
    
    transactions.push(transaction);
  }
  
  return transactions;
}

async function generateInvoices(business, user, count = 20) {
  const invoices = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  const customers = [
    'ABC Corp Ltd', 'XYZ Industries', 'Tech Solutions Pvt Ltd',
    'Global Traders', 'Prime Enterprises', 'Metro Services',
    'Digital Hub', 'Smart Systems', 'Elite Corporations',
    'Apex Holdings'
  ];
  
  for (let i = 0; i < count; i++) {
    const invoiceDate = randomDate(startDate, endDate);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const itemsCount = randomAmount(1, 5);
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemsCount; j++) {
      const quantity = randomAmount(1, 20);
      const rate = randomAmount(500, 5000);
      const amount = quantity * rate;
      subtotal += amount;
      
      items.push({
        description: `Product/Service ${j + 1}`,
        quantity: quantity,
        rate: rate,
        amount: amount
      });
    }
    
    const gstRate = 18;
    const gstAmount = (subtotal * gstRate) / 100;
    const total = subtotal + gstAmount;
    
    const paidAmount = Math.random() > 0.3 ? total : randomAmount(0, total);
    const status = paidAmount >= total ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid';
    
    const invoice = await Invoice.create({
      user: user._id,
      business: business._id,
      invoiceNumber: `INV-${String(i + 1).padStart(6, '0')}`,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      customer: {
        name: customers[Math.floor(Math.random() * customers.length)],
        email: `customer${i}@example.com`,
        phone: `+91${randomAmount(7000000000, 9999999999)}`,
        address: `${randomAmount(1, 999)} Business Street, Mumbai, Maharashtra`
      },
      items: items,
      subtotal: subtotal,
      taxAmount: gstAmount,
      total: total,
      paidAmount: paidAmount,
      balanceAmount: total - paidAmount,
      status: status,
      paymentHistory: paidAmount > 0 ? [{
        amount: paidAmount,
        date: new Date(invoiceDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        method: 'Bank Transfer',
        reference: `REF${randomAmount(100000, 999999)}`
      }] : []
    });
    
    invoices.push(invoice);
  }
  
  return invoices;
}

async function generateTDSRecords(business, user, count = 15) {
  const tdsRecords = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  const sections = ['194C', '194J', '194I', '194H'];
  const rates = [1, 2, 10, 5];
  
  for (let i = 0; i < count; i++) {
    const deductionDate = randomDate(startDate, endDate);
    const paymentDate = new Date(deductionDate);
    paymentDate.setDate(paymentDate.getDate() + 7);
    
    const sectionIndex = Math.floor(Math.random() * sections.length);
    const amount = randomAmount(50000, 500000);
    const tdsRate = rates[sectionIndex];
    const tdsAmount = (amount * tdsRate) / 100;
    
    const tds = await TDS.create({
      user: user._id,
      business: business._id,
      deducteeType: ['Individual', 'Company', 'Firm'][Math.floor(Math.random() * 3)],
      deducteeName: `Vendor ${i + 1}`,
      deducteePAN: generatePAN(),
      payeePAN: generatePAN(),
      section: sections[sectionIndex],
      amount: amount,
      tdsRate: tdsRate,
      tdsAmount: tdsAmount,
      deductionDate: deductionDate,
      paymentDate: paymentDate,
      status: ['pending', 'paid', 'filed'][Math.floor(Math.random() * 3)],
      certificateIssued: Math.random() > 0.5,
      certificateNumber: Math.random() > 0.5 ? `CERT${randomAmount(100000, 999999)}` : null
    });
    
    tdsRecords.push(tds);
  }
  
  return tdsRecords;
}

async function populateMultiClientData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected\n');
    
    console.log('🚀 Starting Multi-Client Data Population...\n');
    
    // Step 1: Create or find CA user
    console.log('📝 Step 1: Creating CA User...');
    const caPassword = await bcrypt.hash('ca123456', 10);
    
    let caUser = await User.findOne({ email: 'ca@financeflow.com' });
    if (!caUser) {
      caUser = await User.create({
        name: 'CA Rajesh Kumar',
        email: 'ca@financeflow.com',
        password: caPassword,
        role: 'ca',
        phone: '+919876543210',
        pan: generatePAN(),
        city: 'Mumbai',
        state: 'Maharashtra',
        profileCompleted: true
      });
      console.log(`✅ Created CA: ${caUser.name} (${caUser.email})`);
    } else {
      console.log(`✅ Found existing CA: ${caUser.name} (${caUser.email})`);
    }
    
    // Step 2: Create multiple client users and their businesses
    console.log('\n📝 Step 2: Creating Client Users and Businesses...\n');
    
    const clientsData = [
      { name: 'Amit Shah', email: 'amit.shah@example.com', city: 'Mumbai', state: 'Maharashtra', stateCode: '27' },
      { name: 'Priya Patel', email: 'priya.patel@example.com', city: 'Ahmedabad', state: 'Gujarat', stateCode: '24' },
      { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', city: 'Delhi', state: 'Delhi', stateCode: '07' },
      { name: 'Sneha Reddy', email: 'sneha.reddy@example.com', city: 'Bangalore', state: 'Karnataka', stateCode: '29' },
      { name: 'Vijay Singh', email: 'vijay.singh@example.com', city: 'Pune', state: 'Maharashtra', stateCode: '27' },
    ];
    
    const clientPassword = await bcrypt.hash('client123', 10);
    let totalStats = {
      clients: 0,
      businesses: 0,
      accounts: 0,
      transactions: 0,
      invoices: 0,
      tdsRecords: 0
    };
    
    for (let i = 0; i < clientsData.length; i++) {
      const clientData = clientsData[i];
      const businessType = businessTypes[i % businessTypes.length];
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📊 Processing Client ${i + 1}/${clientsData.length}: ${clientData.name}`);
      console.log(`${'='.repeat(60)}\n`);
      
      // Create client user
      let client = await User.findOne({ email: clientData.email });
      if (!client) {
        client = await User.create({
          name: clientData.name,
          email: clientData.email,
          password: clientPassword,
          role: 'user',
          phone: `+91${randomAmount(7000000000, 9999999999)}`,
          pan: generatePAN(),
          city: clientData.city,
          state: clientData.state,
          profileCompleted: true
        });
        console.log(`  ✅ Created client user: ${client.name}`);
      } else {
        console.log(`  ✅ Found existing client: ${client.name}`);
      }
      totalStats.clients++;
      
      // Create business for client
      const businessName = `${clientData.name.split(' ')[0]}'s ${businessType.type} Business`;
      let business = await Business.findOne({ owner: client._id });
      
      if (!business) {
        business = await Business.create({
          name: businessName,
          owner: client._id,
          assignedCA: caUser._id, // Assign to CA
          gstin: generateGSTIN(clientData.stateCode),
          pan: generatePAN(),
          address: `${randomAmount(1, 999)} ${businessType.type} Street`,
          city: clientData.city,
          state: clientData.state,
          pincode: String(randomAmount(400001, 600099)),
          phone: `+91${randomAmount(7000000000, 9999999999)}`,
          email: clientData.email,
          businessType: businessType.type,
          industry: businessType.industry,
          fiscalYearStart: 4,
          currency: 'INR',
          isActive: true,
          isVerified: true
        });
        console.log(`  ✅ Created business: ${business.name}`);
        console.log(`     GSTIN: ${business.gstin}`);
        console.log(`     PAN: ${business.pan}`);
      } else {
        console.log(`  ✅ Found existing business: ${business.name}`);
      }
      totalStats.businesses++;
      
      // Update user's business reference
      client.business = business._id;
      await client.save();
      
      // Create Chart of Accounts
      console.log(`  📊 Creating chart of accounts...`);
      const existingAccounts = await ChartAccount.countDocuments({ business: business._id });
      
      if (existingAccounts === 0) {
        const accounts = await createChartOfAccounts(business, client);
        console.log(`  ✅ Created ${accounts.length} chart accounts`);
        totalStats.accounts += accounts.length;
      } else {
        console.log(`  ⏭️  Chart of accounts already exists (${existingAccounts} accounts)`);
        totalStats.accounts += existingAccounts;
      }
      
      // Get accounts for transaction generation
      const accounts = await ChartAccount.find({ business: business._id });
      
      // Generate Transactions
      console.log(`  💰 Generating transactions (6 months of data)...`);
      const existingTransactions = await Transaction.countDocuments({ business: business._id });
      
      if (existingTransactions < 50) {
        const transactions = await generateTransactions(business, client, accounts, 6);
        console.log(`  ✅ Generated ${transactions.length} transactions`);
        totalStats.transactions += transactions.length;
      } else {
        console.log(`  ⏭️  Transactions already exist (${existingTransactions} transactions)`);
        totalStats.transactions += existingTransactions;
      }
      
      // Generate Invoices
      console.log(`  📄 Generating invoices...`);
      console.log(`  ⏭️  Skipping invoice generation for now (focus on transactions)`);
      
      // Generate TDS Records
      console.log(`  📋 Generating TDS records...`);
      console.log(`  ⏭️  Skipping TDS generation for now (focus on transactions)`);
      
      // Calculate summary for this business
      const businessTransactions = await Transaction.find({ business: business._id });
      const totalIncome = businessTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.totalAmount, 0);
      const totalExpense = businessTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.totalAmount, 0);
      
      console.log(`\n  📈 Business Summary:`);
      console.log(`     Total Income: ₹${(totalIncome / 100000).toFixed(2)} Lakhs`);
      console.log(`     Total Expenses: ₹${(totalExpense / 100000).toFixed(2)} Lakhs`);
      console.log(`     Net Profit: ₹${((totalIncome - totalExpense) / 100000).toFixed(2)} Lakhs`);
    }
    
    // Final Summary
    console.log(`\n\n${'═'.repeat(70)}`);
    console.log('📊 MULTI-CLIENT DATA POPULATION SUMMARY');
    console.log('═'.repeat(70));
    console.log(`\n👥 CA Details:`);
    console.log(`   Name: ${caUser.name}`);
    console.log(`   Email: ${caUser.email}`);
    console.log(`   Password: ca123456`);
    console.log(`   Total Clients Managed: ${totalStats.clients}`);
    
    console.log(`\n📈 Total Data Created:`);
    console.log(`   ├─ Client Users: ${totalStats.clients}`);
    console.log(`   ├─ Businesses: ${totalStats.businesses}`);
    console.log(`   ├─ Chart Accounts: ${totalStats.accounts}`);
    console.log(`   ├─ Transactions: ${totalStats.transactions}`);
    console.log(`   ├─ Invoices: ${totalStats.invoices}`);
    console.log(`   └─ TDS Records: ${totalStats.tdsRecords}`);
    
    console.log(`\n👤 Client Login Credentials:`);
    console.log(`   Password for all clients: client123`);
    console.log(`\n   Client Emails:`);
    clientsData.forEach((client, idx) => {
      console.log(`   ${idx + 1}. ${client.email} (${client.name})`);
    });
    
    console.log(`\n${'═'.repeat(70)}`);
    console.log('✨ Multi-client data population completed successfully!');
    console.log(`${'═'.repeat(70)}\n`);
    
    console.log('🔐 Database Structure:');
    console.log('   ✅ Each client has their own isolated business data');
    console.log('   ✅ All businesses are assigned to the CA user');
    console.log('   ✅ CA can view and manage all client businesses');
    console.log('   ✅ Clients can only see their own business data');
    console.log('   ✅ Complete data separation between clients\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the population
populateMultiClientData();
