const mongoose = require('mongoose');
require('dotenv').config();

// Models
const User = require('./models/User');
const Business = require('./models/Business');
const Transaction = require('./models/Transaction');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/financeflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Category mappings for balance sheet categorization
const assetCategories = {
  currentAsset: ['Cash', 'Bank Account', 'Accounts Receivable', 'Inventory', 'Prepaid Expenses', 'Short-term Investments'],
  fixedAsset: ['Equipment', 'Furniture', 'Vehicles', 'Building', 'Land', 'Computers', 'Machinery']
};

const liabilityCategories = {
  currentLiability: ['Accounts Payable', 'Credit Card', 'Short-term Loan', 'Wages Payable', 'Taxes Payable'],
  longTermLiability: ['Bank Loan', 'Mortgage', 'Long-term Loan', 'Bonds Payable']
};

const equityCategories = ['Owner Capital', 'Retained Earnings', 'Capital Investment'];

async function populateFinancialData() {
  try {
    console.log('\n🚀 Starting Financial Data Population...\n');

    // Get all clients (users with role 'user')
    const clients = await User.find({ role: 'user' }).lean();
    
    if (clients.length === 0) {
      console.log('⚠️  No clients found in database (users with role "user")');
      return;
    }

    console.log(`📊 Found ${clients.length} clients to populate data for\n`);

    for (const client of clients) {
      console.log(`\n👤 Processing client: ${client.name} (${client.email})`);

      // Find or create business for this client
      let business = await Business.findOne({ owner: client._id });
      
      if (!business) {
        console.log(`   📝 Creating business for client...`);
        business = await Business.create({
          name: client.businessName || `${client.name}'s Business`,
          owner: client._id,
          email: client.email,
          phone: client.phone,
          gstin: client.gstin,
          pan: client.pan,
          city: client.city,
          state: client.state,
          businessType: client.businessType || 'Services',
          isActive: true
        });
        console.log(`   ✅ Business created: ${business.name}`);
      } else {
        console.log(`   ✅ Found existing business: ${business.name}`);
      }

      // Delete existing transactions for this client to start fresh
      const deletedCount = await Transaction.deleteMany({ user: client._id });
      console.log(`   🗑️  Cleared ${deletedCount.deletedCount} existing transactions`);

      // Generate balanced financial data
      const transactions = [];
      const baseDate = new Date();
      baseDate.setMonth(baseDate.getMonth() - 6); // Start 6 months ago

      // 1. EQUITY - Initial Capital Investment
      const initialCapital = Math.floor(Math.random() * 500000) + 500000; // 500k-1M
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'income',
        category: 'Owner Capital',
        description: 'Initial Capital Investment',
        amount: initialCapital,
        date: new Date(baseDate.getTime() - 180 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        source: 'MANUAL',
        createdBy: client._id
      });

      // 2. CURRENT ASSETS - Cash and Bank
      const cashAmount = Math.floor(initialCapital * 0.15); // 15% as cash
      const bankAmount = Math.floor(initialCapital * 0.25); // 25% in bank
      
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'expense',
        category: 'Cash',
        description: 'Cash on Hand',
        amount: cashAmount,
        date: new Date(baseDate.getTime() - 170 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Cash',
        source: 'MANUAL',
        createdBy: client._id
      });

      transactions.push({
        user: client._id,
        business: business._id,
        type: 'expense',
        category: 'Bank Account',
        description: 'Bank Deposit - Operating Account',
        amount: bankAmount,
        date: new Date(baseDate.getTime() - 170 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        source: 'MANUAL',
        createdBy: client._id
      });

      // 3. FIXED ASSETS - Equipment and Furniture
      const equipmentCost = Math.floor(initialCapital * 0.20); // 20% on equipment
      const furnitureCost = Math.floor(initialCapital * 0.10); // 10% on furniture
      
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'expense',
        category: 'Equipment',
        description: 'Office Equipment Purchase',
        amount: equipmentCost,
        date: new Date(baseDate.getTime() - 160 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        source: 'MANUAL',
        createdBy: client._id
      });

      transactions.push({
        user: client._id,
        business: business._id,
        type: 'expense',
        category: 'Furniture',
        description: 'Office Furniture Purchase',
        amount: furnitureCost,
        date: new Date(baseDate.getTime() - 160 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        source: 'MANUAL',
        createdBy: client._id
      });

      // 4. CURRENT ASSETS - Accounts Receivable (from services rendered)
      const receivableAmount = Math.floor(initialCapital * 0.12); // 12%
      
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'expense',
        category: 'Accounts Receivable',
        description: 'Outstanding Customer Invoices',
        amount: receivableAmount,
        date: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        source: 'MANUAL',
        createdBy: client._id
      });

      // 5. CURRENT LIABILITIES - Accounts Payable
      const payableAmount = Math.floor(initialCapital * 0.08); // 8%
      
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'income',
        category: 'Accounts Payable',
        description: 'Vendor Bills Pending Payment',
        amount: payableAmount,
        date: new Date(baseDate.getTime() - 20 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        source: 'MANUAL',
        createdBy: client._id
      });

      // 6. LONG-TERM LIABILITY - Bank Loan (if needed for equipment)
      const loanAmount = Math.floor(initialCapital * 0.15); // 15% loan
      
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'income',
        category: 'Bank Loan',
        description: 'Business Equipment Loan',
        amount: loanAmount,
        date: new Date(baseDate.getTime() - 150 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        source: 'MANUAL',
        createdBy: client._id
      });

      // 7. CURRENT ASSETS - Inventory (if applicable)
      const inventoryAmount = Math.floor(initialCapital * 0.10); // 10%
      
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'expense',
        category: 'Inventory',
        description: 'Stock Purchase',
        amount: inventoryAmount,
        date: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        source: 'MANUAL',
        createdBy: client._id
      });

      // 8. CURRENT LIABILITY - Credit Card
      const creditCardAmount = Math.floor(initialCapital * 0.05); // 5%
      
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'income',
        category: 'Credit Card',
        description: 'Credit Card Outstanding Balance',
        amount: creditCardAmount,
        date: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Credit Card',
        source: 'MANUAL',
        createdBy: client._id
      });

      // 9. EQUITY - Retained Earnings (from operations)
      const retainedEarnings = Math.floor(initialCapital * 0.08); // 8% profit retained
      
      transactions.push({
        user: client._id,
        business: business._id,
        type: 'income',
        category: 'Retained Earnings',
        description: 'Accumulated Profit from Operations',
        amount: retainedEarnings,
        date: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000),
        paymentMethod: 'Bank Transfer',
        source: 'MANUAL',
        createdBy: client._id
      });

      // Insert all transactions
      const inserted = await Transaction.insertMany(transactions);
      console.log(`   ✅ Created ${inserted.length} balanced transactions`);

      // Calculate and display summary
      const assets = cashAmount + bankAmount + equipmentCost + furnitureCost + receivableAmount + inventoryAmount;
      const liabilities = payableAmount + loanAmount + creditCardAmount;
      const equity = initialCapital + retainedEarnings;
      const netWorth = assets - liabilities;

      console.log(`\n   📊 Financial Position:`);
      console.log(`      Assets:       ₹${assets.toLocaleString('en-IN')}`);
      console.log(`      Liabilities:  ₹${liabilities.toLocaleString('en-IN')}`);
      console.log(`      Equity:       ₹${equity.toLocaleString('en-IN')}`);
      console.log(`      Net Worth:    ₹${netWorth.toLocaleString('en-IN')}`);
      console.log(`      Balance Check: ${Math.abs(assets - (liabilities + equity)) < 1 ? '✅ BALANCED' : '⚠️ NOT BALANCED'}`);
    }

    console.log('\n\n✨ Financial Data Population Complete!\n');
    
  } catch (error) {
    console.error('\n❌ Error populating financial data:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
populateFinancialData()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
