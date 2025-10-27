const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Business = require('./models/Business');
const Transaction = require('./models/Transaction');
const Invoice = require('./models/Invoice');
const ChartAccount = require('./models/ChartAccount');
const BankTxn = require('./models/BankTxn');
const TDS = require('./models/TDS');

async function verifyMigration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas connected\n');
    
    console.log('🔍 Verifying database migration...\n');

    const errors = [];
    const warnings = [];
    const stats = {};

    // 1. VERIFY USERS
    console.log('📝 Verifying Users...');
    const users = await User.find({});
    stats.totalUsers = users.length;
    
    let usersWithoutEmail = 0;
    let normalizedPAN = 0;
    let normalizedGSTIN = 0;
    
    users.forEach(user => {
      if (!user.email) {
        usersWithoutEmail++;
        errors.push(`User ${user._id} has no email`);
      }
      if (user.pan && user.pan === user.pan.toUpperCase()) {
        normalizedPAN++;
      }
      if (user.gstin && user.gstin === user.gstin.toUpperCase()) {
        normalizedGSTIN++;
      }
    });
    
    console.log(`  Total Users: ${stats.totalUsers}`);
    console.log(`  Users with normalized PAN: ${normalizedPAN}`);
    console.log(`  Users with normalized GSTIN: ${normalizedGSTIN}`);

    // 2. VERIFY BUSINESSES
    console.log('\n📝 Verifying Businesses...');
    const businesses = await Business.find({}).populate('owner');
    stats.totalBusinesses = businesses.length;
    
    let businessesWithoutOwner = 0;
    let activeBusinesses = 0;
    
    businesses.forEach(business => {
      if (!business.owner) {
        businessesWithoutOwner++;
        errors.push(`Business ${business._id} (${business.name}) has no owner`);
      }
      if (business.isActive) {
        activeBusinesses++;
      }
    });
    
    console.log(`  Total Businesses: ${stats.totalBusinesses}`);
    console.log(`  Active Businesses: ${activeBusinesses}`);

    // 3. VERIFY TRANSACTIONS
    console.log('\n📝 Verifying Transactions...');
    const transactions = await Transaction.find({});
    stats.totalTransactions = transactions.length;
    
    let transactionsWithUser = 0;
    let reconciledTransactions = 0;
    
    transactions.forEach(txn => {
      if (txn.user) {
        transactionsWithUser++;
      }
      if (txn.reconciled) {
        reconciledTransactions++;
      }
    });
    
    console.log(`  Total Transactions: ${stats.totalTransactions}`);
    console.log(`  With User Reference: ${transactionsWithUser}`);
    console.log(`  Reconciled: ${reconciledTransactions}`);

    // 4. VERIFY INVOICES
    console.log('\n📝 Verifying Invoices...');
    const invoices = await Invoice.find({});
    stats.totalInvoices = invoices.length;
    
    let invoicesWithUser = 0;
    
    invoices.forEach(invoice => {
      if (invoice.user) {
        invoicesWithUser++;
      }
    });
    
    console.log(`  Total Invoices: ${stats.totalInvoices}`);
    console.log(`  With User Reference: ${invoicesWithUser}`);

    // 5. VERIFY CHART OF ACCOUNTS
    console.log('\n📝 Verifying Chart of Accounts...');
    const chartAccounts = await ChartAccount.find({});
    stats.totalChartAccounts = chartAccounts.length;
    
    let activeAccounts = 0;
    let accountsByType = {};
    
    chartAccounts.forEach(account => {
      if (account.isActive) {
        activeAccounts++;
      }
      accountsByType[account.type] = (accountsByType[account.type] || 0) + 1;
    });
    
    console.log(`  Total Chart Accounts: ${stats.totalChartAccounts}`);
    console.log(`  Active Accounts: ${activeAccounts}`);
    if (Object.keys(accountsByType).length > 0) {
      console.log(`  By Type:`);
      Object.entries(accountsByType).forEach(([type, count]) => {
        console.log(`    ${type}: ${count}`);
      });
    }

    // 6. VERIFY BANK TRANSACTIONS
    console.log('\n📝 Verifying Bank Transactions...');
    const bankTxns = await BankTxn.find({});
    stats.totalBankTxns = bankTxns.length;
    
    let reconciledBankTxns = 0;
    
    bankTxns.forEach(txn => {
      if (txn.reconciled) {
        reconciledBankTxns++;
      }
    });
    
    console.log(`  Total Bank Transactions: ${stats.totalBankTxns}`);
    console.log(`  Reconciled: ${reconciledBankTxns}`);

    // 7. VERIFY TDS RECORDS
    console.log('\n📝 Verifying TDS Records...');
    const tdsRecords = await TDS.find({});
    stats.totalTDS = tdsRecords.length;
    
    let tdsWithUser = 0;
    let tdsWithFY = 0;
    let tdsByStatus = {};
    
    tdsRecords.forEach(tds => {
      if (tds.user) {
        tdsWithUser++;
      }
      if (tds.financialYear) {
        tdsWithFY++;
      }
      tdsByStatus[tds.status] = (tdsByStatus[tds.status] || 0) + 1;
    });
    
    console.log(`  Total TDS Records: ${stats.totalTDS}`);
    console.log(`  With User Reference: ${tdsWithUser}`);
    console.log(`  With Financial Year: ${tdsWithFY}`);
    if (Object.keys(tdsByStatus).length > 0) {
      console.log(`  By Status:`);
      Object.entries(tdsByStatus).forEach(([status, count]) => {
        console.log(`    ${status}: ${count}`);
      });
    }

    // 8. VERIFY INDEXES
    console.log('\n📝 Verifying Indexes...');
    
    const collections = [
      { name: 'User', model: User },
      { name: 'Business', model: Business },
      { name: 'Transaction', model: Transaction },
      { name: 'Invoice', model: Invoice },
      { name: 'ChartAccount', model: ChartAccount },
      { name: 'BankTxn', model: BankTxn },
      { name: 'TDS', model: TDS }
    ];
    
    for (const { name, model } of collections) {
      const indexes = await model.collection.getIndexes();
      const indexCount = Object.keys(indexes).length;
      console.log(`  ${name}: ${indexCount} indexes`);
    }

    // SUMMARY
    console.log('\n📊 VERIFICATION SUMMARY');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Total Users: ${stats.totalUsers}`);
    console.log(`Total Businesses: ${stats.totalBusinesses}`);
    console.log(`Total Transactions: ${stats.totalTransactions}`);
    console.log(`Total Invoices: ${stats.totalInvoices}`);
    console.log(`Total Chart Accounts: ${stats.totalChartAccounts}`);
    console.log(`Total Bank Transactions: ${stats.totalBankTxns}`);
    console.log(`Total TDS Records: ${stats.totalTDS}`);
    console.log('═══════════════════════════════════════════════════');

    // Display errors
    if (errors.length > 0) {
      console.log(`\n⚠️  ERRORS (${errors.length})`);
      errors.forEach(error => console.log(`  ❌ ${error}`));
    }

    // Display warnings
    if (warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${warnings.length})`);
      warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }

    // Final verdict
    console.log('\n');
    if (errors.length === 0) {
      console.log('✅ MIGRATION VERIFICATION PASSED!');
      console.log('Your database has been successfully migrated.');
      if (warnings.length > 0) {
        console.log(`Note: ${warnings.length} warnings found. Please review.`);
      }
    } else {
      console.log('❌ MIGRATION VERIFICATION FAILED!');
      console.log(`Found ${errors.length} critical errors. Please fix them.`);
    }

    console.log('\n');
    process.exit(errors.length === 0 ? 0 : 1);

  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run verification
verifyMigration();
