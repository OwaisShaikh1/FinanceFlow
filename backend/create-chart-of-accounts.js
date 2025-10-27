const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const Business = require('./models/Business');
const ChartAccount = require('./models/ChartAccount');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'Finance' });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Default Chart of Accounts Template
const defaultChartOfAccounts = [
  // ASSETS
  { code: 'A-1000', name: 'Cash', type: 'ASSET', subType: 'Current Asset', isSystem: true, allowTransactions: true },
  { code: 'A-1100', name: 'Bank Account', type: 'ASSET', subType: 'Current Asset', isSystem: true, allowTransactions: true },
  { code: 'A-1200', name: 'Accounts Receivable', type: 'ASSET', subType: 'Current Asset', isSystem: true, allowTransactions: true },
  { code: 'A-1300', name: 'Inventory', type: 'ASSET', subType: 'Current Asset', isSystem: false, allowTransactions: true },
  { code: 'A-1400', name: 'Prepaid Expenses', type: 'ASSET', subType: 'Current Asset', isSystem: false, allowTransactions: true },
  { code: 'A-2000', name: 'Equipment', type: 'ASSET', subType: 'Fixed Asset', isSystem: false, allowTransactions: true },
  { code: 'A-2100', name: 'Furniture & Fixtures', type: 'ASSET', subType: 'Fixed Asset', isSystem: false, allowTransactions: true },
  { code: 'A-2200', name: 'Vehicles', type: 'ASSET', subType: 'Fixed Asset', isSystem: false, allowTransactions: true },
  { code: 'A-2300', name: 'Buildings', type: 'ASSET', subType: 'Fixed Asset', isSystem: false, allowTransactions: true },
  { code: 'A-2400', name: 'Accumulated Depreciation', type: 'ASSET', subType: 'Fixed Asset', isSystem: true, allowTransactions: true },

  // LIABILITIES
  { code: 'L-3000', name: 'Accounts Payable', type: 'LIABILITY', subType: 'Current Liability', isSystem: true, allowTransactions: true },
  { code: 'L-3100', name: 'Credit Card Payable', type: 'LIABILITY', subType: 'Current Liability', isSystem: false, allowTransactions: true },
  { code: 'L-3200', name: 'Sales Tax Payable', type: 'LIABILITY', subType: 'Current Liability', isSystem: false, allowTransactions: true },
  { code: 'L-3300', name: 'GST Payable', type: 'LIABILITY', subType: 'Current Liability', isSystem: true, allowTransactions: true },
  { code: 'L-3400', name: 'TDS Payable', type: 'LIABILITY', subType: 'Current Liability', isSystem: true, allowTransactions: true },
  { code: 'L-4000', name: 'Long-term Loans', type: 'LIABILITY', subType: 'Long-term Liability', isSystem: false, allowTransactions: true },
  { code: 'L-4100', name: 'Bank Loan', type: 'LIABILITY', subType: 'Long-term Liability', isSystem: false, allowTransactions: true },

  // EQUITY
  { code: 'E-5000', name: 'Owner\'s Equity', type: 'EQUITY', subType: 'Capital', isSystem: true, allowTransactions: false },
  { code: 'E-5100', name: 'Retained Earnings', type: 'EQUITY', subType: 'Earnings', isSystem: true, allowTransactions: false },
  { code: 'E-5200', name: 'Owner Drawings', type: 'EQUITY', subType: 'Drawings', isSystem: false, allowTransactions: true },

  // INCOME
  { code: 'I-6000', name: 'Sales Revenue', type: 'INCOME', subType: 'Operating Income', isSystem: true, allowTransactions: true },
  { code: 'I-6100', name: 'Service Revenue', type: 'INCOME', subType: 'Operating Income', isSystem: true, allowTransactions: true },
  { code: 'I-6200', name: 'Consulting Revenue', type: 'INCOME', subType: 'Operating Income', isSystem: false, allowTransactions: true },
  { code: 'I-6300', name: 'Interest Income', type: 'INCOME', subType: 'Non-operating Income', isSystem: false, allowTransactions: true },
  { code: 'I-6400', name: 'Rental Income', type: 'INCOME', subType: 'Non-operating Income', isSystem: false, allowTransactions: true },
  { code: 'I-6500', name: 'Other Income', type: 'INCOME', subType: 'Non-operating Income', isSystem: false, allowTransactions: true },

  // EXPENSES
  { code: 'X-7000', name: 'Cost of Goods Sold', type: 'EXPENSE', subType: 'Cost of Sales', isSystem: false, allowTransactions: true },
  { code: 'X-7100', name: 'Salaries & Wages', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-7200', name: 'Rent Expense', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-7300', name: 'Utilities', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-7400', name: 'Office Supplies', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-7500', name: 'Marketing & Advertising', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-7600', name: 'Travel Expenses', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-7700', name: 'Fuel Expenses', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-7800', name: 'Insurance', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-7900', name: 'Professional Fees', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-8000', name: 'Software Subscriptions', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-8100', name: 'Telecommunications', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-8200', name: 'Bank Charges', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
  { code: 'X-8300', name: 'Depreciation', type: 'EXPENSE', subType: 'Operating Expense', isSystem: true, allowTransactions: true },
  { code: 'X-8400', name: 'Interest Expense', type: 'EXPENSE', subType: 'Financial Expense', isSystem: false, allowTransactions: true },
  { code: 'X-8500', name: 'Repairs & Maintenance', type: 'EXPENSE', subType: 'Operating Expense', isSystem: false, allowTransactions: true },
];

const createDefaultChartOfAccounts = async () => {
  try {
    await connectDB();

    console.log('\n🏗️  Creating default Chart of Accounts...\n');

    // Get all businesses
    const businesses = await Business.find({}).populate('owner');

    if (businesses.length === 0) {
      console.log('⚠️  No businesses found in the database.');
      console.log('💡 Tip: Create a business first, or businesses will be created when users register.');
      return;
    }

    let totalCreated = 0;

    for (const business of businesses) {
      console.log(`\n📊 Processing business: ${business.name}`);

      // Check if business already has chart of accounts
      const existingAccounts = await ChartAccount.countDocuments({ business: business._id });

      if (existingAccounts > 0) {
        console.log(`  ⏭️  Skipping - already has ${existingAccounts} accounts`);
        continue;
      }

      // Create default chart of accounts for this business
      let createdCount = 0;

      for (const accountTemplate of defaultChartOfAccounts) {
        try {
          await ChartAccount.create({
            business: business._id,
            user: business.owner,
            code: accountTemplate.code,
            name: accountTemplate.name,
            type: accountTemplate.type,
            subType: accountTemplate.subType,
            isSystem: accountTemplate.isSystem,
            isActive: true,
            allowTransactions: accountTemplate.allowTransactions,
            level: 1,
            currentBalance: 0,
            openingBalance: 0,
            taxApplicable: accountTemplate.type === 'INCOME' || accountTemplate.type === 'EXPENSE',
            defaultTaxRate: accountTemplate.type === 'INCOME' || accountTemplate.type === 'EXPENSE' ? 18 : 0,
            createdBy: business.owner
          });
          createdCount++;
        } catch (error) {
          console.error(`  ❌ Error creating account ${accountTemplate.code}:`, error.message);
        }
      }

      console.log(`  ✅ Created ${createdCount} chart accounts`);
      totalCreated += createdCount;
    }

    console.log(`\n📈 SUMMARY:`);
    console.log(`═══════════════════════════════════════════`);
    console.log(`Total Businesses Processed: ${businesses.length}`);
    console.log(`Total Accounts Created: ${totalCreated}`);
    console.log(`═══════════════════════════════════════════`);

    console.log('\n✨ Chart of Accounts setup completed!\n');

  } catch (error) {
    console.error('❌ Error creating chart of accounts:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
if (require.main === module) {
  createDefaultChartOfAccounts()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createDefaultChartOfAccounts, defaultChartOfAccounts };
