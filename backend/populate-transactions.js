require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Business = require('./models/Business');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/financeflow';

// Transaction categories and types based on business types
const transactionTemplates = {
  'Retail': {
    income: [
      { description: 'Product Sales - Electronics', category: 'Sales Revenue', amount: [15000, 45000], paymentMethod: 'UPI' },
      { description: 'Product Sales - Accessories', category: 'Sales Revenue', amount: [5000, 15000], paymentMethod: 'Cash' },
      { description: 'Wholesale Order', category: 'Sales Revenue', amount: [50000, 150000], paymentMethod: 'Bank Transfer' },
      { description: 'Online Sales Revenue', category: 'Sales Revenue', amount: [20000, 60000], paymentMethod: 'Credit Card' },
      { description: 'Walk-in Customer Sales', category: 'Sales Revenue', amount: [8000, 25000], paymentMethod: 'Cash' },
    ],
    expense: [
      { description: 'Inventory Purchase', category: 'Purchase', amount: [30000, 100000], paymentMethod: 'Bank Transfer' },
      { description: 'Store Rent', category: 'Rent', amount: [15000, 25000], paymentMethod: 'Bank Transfer' },
      { description: 'Staff Salaries', category: 'Salary', amount: [40000, 80000], paymentMethod: 'Bank Transfer' },
      { description: 'Electricity Bill', category: 'Utilities', amount: [3000, 8000], paymentMethod: 'UPI' },
      { description: 'Marketing & Advertising', category: 'Marketing', amount: [5000, 15000], paymentMethod: 'Debit Card' },
      { description: 'Packaging Materials', category: 'Office Supplies', amount: [2000, 6000], paymentMethod: 'Cash' },
    ]
  },
  'Manufacturing': {
    income: [
      { description: 'Product Sales - B2B', category: 'Sales Revenue', amount: [100000, 300000], paymentMethod: 'Bank Transfer' },
      { description: 'Bulk Order Delivery', category: 'Sales Revenue', amount: [150000, 400000], paymentMethod: 'Bank Transfer' },
      { description: 'Export Sales', category: 'Sales Revenue', amount: [200000, 500000], paymentMethod: 'Bank Transfer' },
      { description: 'Custom Manufacturing Order', category: 'Sales Revenue', amount: [75000, 200000], paymentMethod: 'Bank Transfer' },
    ],
    expense: [
      { description: 'Raw Material Purchase', category: 'Purchase', amount: [80000, 200000], paymentMethod: 'Bank Transfer' },
      { description: 'Factory Rent', category: 'Rent', amount: [30000, 50000], paymentMethod: 'Bank Transfer' },
      { description: 'Worker Wages', category: 'Salary', amount: [60000, 120000], paymentMethod: 'Bank Transfer' },
      { description: 'Machinery Maintenance', category: 'Repairs', amount: [10000, 30000], paymentMethod: 'UPI' },
      { description: 'Power & Water Bills', category: 'Utilities', amount: [15000, 35000], paymentMethod: 'Bank Transfer' },
      { description: 'Transportation Costs', category: 'Transport', amount: [8000, 20000], paymentMethod: 'Cash' },
      { description: 'Quality Control Expenses', category: 'Operations', amount: [5000, 12000], paymentMethod: 'UPI' },
    ]
  },
  'Services': {
    income: [
      { description: 'Consulting Project - Phase 1', category: 'Service Revenue', amount: [50000, 150000], paymentMethod: 'Bank Transfer' },
      { description: 'Monthly Retainer - Client A', category: 'Service Revenue', amount: [30000, 80000], paymentMethod: 'Bank Transfer' },
      { description: 'Training Workshop Fees', category: 'Service Revenue', amount: [25000, 60000], paymentMethod: 'UPI' },
      { description: 'Project Completion Payment', category: 'Service Revenue', amount: [100000, 250000], paymentMethod: 'Bank Transfer' },
      { description: 'Advisory Services', category: 'Service Revenue', amount: [20000, 50000], paymentMethod: 'Credit Card' },
    ],
    expense: [
      { description: 'Office Rent', category: 'Rent', amount: [20000, 35000], paymentMethod: 'Bank Transfer' },
      { description: 'Team Salaries', category: 'Salary', amount: [80000, 150000], paymentMethod: 'Bank Transfer' },
      { description: 'Software Subscriptions', category: 'Subscription', amount: [5000, 15000], paymentMethod: 'Credit Card' },
      { description: 'Client Meeting Expenses', category: 'Travel', amount: [3000, 10000], paymentMethod: 'Cash' },
      { description: 'Internet & Phone Bills', category: 'Utilities', amount: [2000, 5000], paymentMethod: 'UPI' },
      { description: 'Professional Development', category: 'Training', amount: [10000, 25000], paymentMethod: 'Debit Card' },
    ]
  },
  'Restaurant': {
    income: [
      { description: 'Dine-in Revenue - Evening', category: 'Sales Revenue', amount: [15000, 40000], paymentMethod: 'Cash' },
      { description: 'Dine-in Revenue - Lunch', category: 'Sales Revenue', amount: [10000, 30000], paymentMethod: 'UPI' },
      { description: 'Online Food Orders', category: 'Sales Revenue', amount: [8000, 25000], paymentMethod: 'Credit Card' },
      { description: 'Catering Service', category: 'Service Revenue', amount: [25000, 75000], paymentMethod: 'Bank Transfer' },
      { description: 'Weekend Special Sales', category: 'Sales Revenue', amount: [20000, 50000], paymentMethod: 'Cash' },
    ],
    expense: [
      { description: 'Food & Ingredients', category: 'Purchase', amount: [20000, 50000], paymentMethod: 'Cash' },
      { description: 'Restaurant Rent', category: 'Rent', amount: [25000, 40000], paymentMethod: 'Bank Transfer' },
      { description: 'Staff Wages', category: 'Salary', amount: [35000, 70000], paymentMethod: 'Cash' },
      { description: 'Gas & Electricity', category: 'Utilities', amount: [8000, 15000], paymentMethod: 'UPI' },
      { description: 'Kitchen Equipment Repair', category: 'Repairs', amount: [3000, 10000], paymentMethod: 'Cash' },
      { description: 'Cleaning Supplies', category: 'Office Supplies', amount: [2000, 5000], paymentMethod: 'Cash' },
      { description: 'Delivery Platform Fees', category: 'Commission', amount: [5000, 12000], paymentMethod: 'UPI' },
    ]
  },
  'Trading': {
    income: [
      { description: 'Goods Sale - Wholesale', category: 'Sales Revenue', amount: [80000, 200000], paymentMethod: 'Bank Transfer' },
      { description: 'Goods Sale - Retail', category: 'Sales Revenue', amount: [30000, 80000], paymentMethod: 'Cash' },
      { description: 'Export Order', category: 'Sales Revenue', amount: [150000, 400000], paymentMethod: 'Bank Transfer' },
      { description: 'Commission Income', category: 'Commission Income', amount: [10000, 30000], paymentMethod: 'UPI' },
      { description: 'Bulk Order Payment', category: 'Sales Revenue', amount: [100000, 250000], paymentMethod: 'Bank Transfer' },
    ],
    expense: [
      { description: 'Goods Purchase', category: 'Purchase', amount: [60000, 150000], paymentMethod: 'Bank Transfer' },
      { description: 'Warehouse Rent', category: 'Rent', amount: [18000, 30000], paymentMethod: 'Bank Transfer' },
      { description: 'Staff Salaries', category: 'Salary', amount: [45000, 90000], paymentMethod: 'Bank Transfer' },
      { description: 'Transportation Charges', category: 'Transport', amount: [10000, 25000], paymentMethod: 'Cash' },
      { description: 'Custom Duty & Taxes', category: 'Tax', amount: [15000, 40000], paymentMethod: 'Bank Transfer' },
      { description: 'Packaging & Loading', category: 'Operations', amount: [5000, 12000], paymentMethod: 'Cash' },
      { description: 'Storage Charges', category: 'Rent', amount: [3000, 8000], paymentMethod: 'UPI' },
    ]
  }
};

// Generate random amount within range
function randomAmount(range) {
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

// Generate random date within last 6 months
function randomDate(monthsBack = 6) {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - monthsBack);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime);
}

// Get business type keyword from business name
function getBusinessType(businessName) {
  if (businessName.includes('Retail')) return 'Retail';
  if (businessName.includes('Manufacturing')) return 'Manufacturing';
  if (businessName.includes('Services')) return 'Services';
  if (businessName.includes('Restaurant')) return 'Restaurant';
  if (businessName.includes('Trading')) return 'Trading';
  return 'Services'; // default
}

async function populateTransactions() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all businesses (clients)
    const businesses = await Business.find().populate('owner', 'name email');
    
    if (businesses.length === 0) {
      console.log('❌ No businesses found in database');
      process.exit(1);
    }

    console.log(`\n📊 Found ${businesses.length} businesses in database\n`);

    // Clear existing transactions
    console.log('🗑️  Clearing existing transactions...');
    await Transaction.deleteMany({});
    console.log('✅ Cleared all transactions\n');

    let totalCreated = 0;

    for (const business of businesses) {
      const businessType = getBusinessType(business.name);
      const templates = transactionTemplates[businessType];
      
      console.log(`\n🏢 Creating transactions for ${business.name}`);
      console.log(`   Type: ${businessType}`);
      console.log(`   Owner: ${business.owner.name} (${business.owner.email})`);

      const transactionsToCreate = [];
      
      // Create 30-50 transactions per business over last 6 months
      const numTransactions = Math.floor(Math.random() * 21) + 30; // 30-50
      
      for (let i = 0; i < numTransactions; i++) {
        // Randomly choose income or expense (60% income, 40% expense)
        const isIncome = Math.random() < 0.6;
        const type = isIncome ? 'income' : 'expense';
        
        // Pick random template from business type
        const templateList = templates[type];
        const template = templateList[Math.floor(Math.random() * templateList.length)];
        
        const transaction = {
          user: business.owner._id,
          business: business._id,
          type: type,
          amount: randomAmount(template.amount),
          category: template.category,
          description: template.description,
          date: randomDate(6),
          paymentMethod: template.paymentMethod,
          source: 'MANUAL',
          reconciled: Math.random() > 0.3, // 70% reconciled
          createdBy: business.owner._id,
        };
        
        transactionsToCreate.push(transaction);
      }

      // Bulk insert transactions
      const created = await Transaction.insertMany(transactionsToCreate);
      console.log(`   ✅ Created ${created.length} transactions`);
      
      // Calculate stats
      const incomeTransactions = created.filter(t => t.type === 'income');
      const expenseTransactions = created.filter(t => t.type === 'expense');
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      const netProfit = totalIncome - totalExpense;
      
      console.log(`   📈 Income: ₹${totalIncome.toLocaleString('en-IN')} (${incomeTransactions.length} transactions)`);
      console.log(`   📉 Expenses: ₹${totalExpense.toLocaleString('en-IN')} (${expenseTransactions.length} transactions)`);
      console.log(`   💰 Net: ₹${netProfit.toLocaleString('en-IN')}`);
      
      totalCreated += created.length;
    }

    console.log(`\n\n🎉 Successfully created ${totalCreated} transactions across ${businesses.length} businesses!\n`);
    
    // Summary by business
    console.log('📋 Summary by Business:\n');
    for (const business of businesses) {
      const count = await Transaction.countDocuments({ business: business._id });
      const income = await Transaction.aggregate([
        { $match: { business: business._id, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]);
      const expense = await Transaction.aggregate([
        { $match: { business: business._id, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]);
      
      const incomeTotal = income[0]?.total || 0;
      const expenseTotal = expense[0]?.total || 0;
      const incomeCount = income[0]?.count || 0;
      const expenseCount = expense[0]?.count || 0;
      
      console.log(`   📌 ${business.name}: ${count} transactions`);
      console.log(`      • Income: ₹${incomeTotal.toLocaleString('en-IN')} (${incomeCount} transactions)`);
      console.log(`      • Expenses: ₹${expenseTotal.toLocaleString('en-IN')} (${expenseCount} transactions)`);
      console.log(`      • Net Profit: ₹${(incomeTotal - expenseTotal).toLocaleString('en-IN')}\n`);
    }

    console.log('✨ Total transactions in database:', totalCreated);
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

populateTransactions();
