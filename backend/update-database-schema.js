const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import models
const User = require('./models/User');
const Business = require('./models/Business');
const Transaction = require('./models/Transaction');
const Invoice = require('./models/Invoice');
const ChartAccount = require('./models/ChartAccount');
const BankTxn = require('./models/BankTxn');
const TDS = require('./models/TDS');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'Finance' });
    console.log('✅ MongoDB Atlas connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const migrateData = async () => {
  try {
    await connectDB();

    console.log('\n🚀 Starting database migration...\n');

    // 1. Update Users - Add missing indexes and normalize data
    console.log('📝 Updating User collection...');
    const users = await User.find({});
    let userUpdates = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      const updates = {};

      // Normalize PAN and GSTIN
      if (user.pan && user.pan !== user.pan.toUpperCase()) {
        updates.pan = user.pan.toUpperCase();
        needsUpdate = true;
      }
      if (user.gstin && user.gstin !== user.gstin.toUpperCase()) {
        updates.gstin = user.gstin.toUpperCase();
        needsUpdate = true;
      }

      // Set default values for new fields
      if (user.profileCompleted === undefined) {
        updates.profileCompleted = user.business ? true : false;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updates);
        userUpdates++;
      }
    }
    console.log(`✅ Updated ${userUpdates} users\n`);

    // 2. Update Businesses - Add new fields
    console.log('📝 Updating Business collection...');
    const businesses = await Business.find({});
    let businessUpdates = 0;

    for (const business of businesses) {
      const updates = {};
      let needsUpdate = false;

      // Ensure isActive is set
      if (business.isActive === undefined) {
        updates.isActive = true;
        needsUpdate = true;
      }

      // Set default fiscal year start
      if (!business.fiscalYearStart) {
        updates.fiscalYearStart = 4; // April
        needsUpdate = true;
      }

      // Set default currency
      if (!business.currency) {
        updates.currency = 'INR';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Business.findByIdAndUpdate(business._id, updates);
        businessUpdates++;
      }
    }
    console.log(`✅ Updated ${businessUpdates} businesses\n`);

    // 3. Update Transactions - Add new fields and ensure user references
    console.log('📝 Updating Transaction collection...');
    const transactions = await Transaction.find({});
    let transactionUpdates = 0;

    for (const transaction of transactions) {
      const updates = {};
      let needsUpdate = false;

      // Ensure user field exists (from business owner)
      if (!transaction.user && transaction.business) {
        const business = await Business.findById(transaction.business);
        if (business && business.owner) {
          updates.user = business.owner;
          needsUpdate = true;
        }
      }

      // Set default reconciled status
      if (transaction.reconciled === undefined) {
        updates.reconciled = false;
        needsUpdate = true;
      }

      // Set default payment method if missing
      if (!transaction.paymentMethod) {
        updates.paymentMethod = 'Cash';
        needsUpdate = true;
      }

      // Ensure description is not null
      if (!transaction.description) {
        updates.description = transaction.category || 'Transaction';
        needsUpdate = true;
      }

      // Add createdBy if missing
      if (!transaction.createdBy && transaction.user) {
        updates.createdBy = transaction.user;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Transaction.findByIdAndUpdate(transaction._id, updates, { runValidators: false });
        transactionUpdates++;
      }
    }
    console.log(`✅ Updated ${transactionUpdates} transactions\n`);

    // 4. Update Invoices - Add user reference and new fields
    console.log('📝 Updating Invoice collection...');
    const invoices = await Invoice.find({});
    let invoiceUpdates = 0;

    for (const invoice of invoices) {
      const updates = {};
      let needsUpdate = false;

      // Add user reference from business owner
      if (!invoice.user && invoice.business) {
        const business = await Business.findById(invoice.business);
        if (business && business.owner) {
          updates.user = business.owner;
          needsUpdate = true;
        }
      }

      // Initialize payment tracking
      if (invoice.paidAmount === undefined) {
        updates.paidAmount = invoice.status === 'PAID' ? invoice.totalAmount : 0;
        updates.balanceAmount = invoice.status === 'PAID' ? 0 : invoice.totalAmount;
        needsUpdate = true;
      }

      // Set createdBy
      if (!invoice.createdBy && invoice.user) {
        updates.createdBy = invoice.user;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Invoice.findByIdAndUpdate(invoice._id, updates, { runValidators: false });
        invoiceUpdates++;
      }
    }
    console.log(`✅ Updated ${invoiceUpdates} invoices\n`);

    // 5. Update Chart of Accounts - Add user reference
    console.log('📝 Updating ChartAccount collection...');
    const accounts = await ChartAccount.find({});
    let accountUpdates = 0;

    for (const account of accounts) {
      const updates = {};
      let needsUpdate = false;

      // Add user reference
      if (!account.user && account.business) {
        const business = await Business.findById(account.business);
        if (business && business.owner) {
          updates.user = business.owner;
          needsUpdate = true;
        }
      }

      // Set default active status
      if (account.isActive === undefined) {
        updates.isActive = true;
        needsUpdate = true;
      }

      // Set default level
      if (!account.level) {
        updates.level = 1;
        needsUpdate = true;
      }

      // Set allowTransactions
      if (account.allowTransactions === undefined) {
        updates.allowTransactions = true;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await ChartAccount.findByIdAndUpdate(account._id, updates, { runValidators: false });
        accountUpdates++;
      }
    }
    console.log(`✅ Updated ${accountUpdates} chart accounts\n`);

    // 6. Update Bank Transactions - Add new fields
    console.log('📝 Updating BankTxn collection...');
    const bankTxns = await BankTxn.find({});
    let bankUpdates = 0;

    for (const bankTxn of bankTxns) {
      const updates = {};
      let needsUpdate = false;

      // Add user reference
      if (!bankTxn.user && bankTxn.business) {
        const business = await Business.findById(bankTxn.business);
        if (business && business.owner) {
          updates.user = business.owner;
          needsUpdate = true;
        }
      }

      // Set reconciled status
      if (bankTxn.reconciled === undefined) {
        updates.reconciled = bankTxn.matchedTransaction ? true : false;
        needsUpdate = true;
      }

      // Set transaction type based on amount
      if (!bankTxn.transactionType) {
        updates.transactionType = bankTxn.amount >= 0 ? 'CREDIT' : 'DEBIT';
        updates.amount = Math.abs(bankTxn.amount);
        needsUpdate = true;
      }

      if (needsUpdate) {
        await BankTxn.findByIdAndUpdate(bankTxn._id, updates, { runValidators: false });
        bankUpdates++;
      }
    }
    console.log(`✅ Updated ${bankUpdates} bank transactions\n`);

    // 7. Update TDS Records - Add new required fields
    console.log('📝 Updating TDS collection...');
    const tdsRecords = await TDS.find({});
    let tdsUpdates = 0;

    for (const tds of tdsRecords) {
      const updates = {};
      let needsUpdate = false;

      // Add user and business references (use defaults for existing records)
      if (!tds.user) {
        const firstUser = await User.findOne({});
        if (firstUser) {
          updates.user = firstUser._id;
          updates.business = firstUser.business;
          needsUpdate = true;
        }
      }

      // Set payment date if missing
      if (!tds.paymentDate) {
        updates.paymentDate = tds.recordDate || new Date();
        needsUpdate = true;
      }

      // Set status if missing
      if (!tds.status) {
        updates.status = 'pending';
        needsUpdate = true;
      }

      // Certificate status
      if (tds.certificateIssued === undefined) {
        updates.certificateIssued = false;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await TDS.findByIdAndUpdate(tds._id, updates, { runValidators: false });
        tdsUpdates++;
      }
    }
    console.log(`✅ Updated ${tdsUpdates} TDS records\n`);

    // 8. Create indexes - use createIndexes() which handles existing indexes
    console.log('📝 Creating database indexes...');
    try {
      await User.createIndexes();
      console.log('  ✅ User indexes created');
    } catch (err) {
      console.log(`  ⚠️  User indexes: ${err.message}`);
    }
    
    try {
      await Business.createIndexes();
      console.log('  ✅ Business indexes created');
    } catch (err) {
      console.log(`  ⚠️  Business indexes: ${err.message}`);
    }
    
    try {
      await Transaction.createIndexes();
      console.log('  ✅ Transaction indexes created');
    } catch (err) {
      console.log(`  ⚠️  Transaction indexes: ${err.message}`);
    }
    
    try {
      await Invoice.createIndexes();
      console.log('  ✅ Invoice indexes created');
    } catch (err) {
      console.log(`  ⚠️  Invoice indexes: ${err.message}`);
    }
    
    try {
      await ChartAccount.createIndexes();
      console.log('  ✅ ChartAccount indexes created');
    } catch (err) {
      console.log(`  ⚠️  ChartAccount indexes: ${err.message}`);
    }
    
    try {
      await BankTxn.createIndexes();
      console.log('  ✅ BankTxn indexes created');
    } catch (err) {
      console.log(`  ⚠️  BankTxn indexes: ${err.message}`);
    }
    
    try {
      await TDS.createIndexes();
      console.log('  ✅ TDS indexes created');
    } catch (err) {
      console.log(`  ⚠️  TDS indexes: ${err.message}`);
    }
    console.log('✅ Index creation completed\n');

    // Summary
    console.log('\n📊 MIGRATION SUMMARY:');
    console.log('═'.repeat(50));
    console.log(`Users updated: ${userUpdates}`);
    console.log(`Businesses updated: ${businessUpdates}`);
    console.log(`Transactions updated: ${transactionUpdates}`);
    console.log(`Invoices updated: ${invoiceUpdates}`);
    console.log(`Chart Accounts updated: ${accountUpdates}`);
    console.log(`Bank Transactions updated: ${bankUpdates}`);
    console.log(`TDS Records updated: ${tdsUpdates}`);
    console.log('═'.repeat(50));

    // Database statistics
    const stats = {
      users: await User.countDocuments(),
      businesses: await Business.countDocuments(),
      transactions: await Transaction.countDocuments(),
      invoices: await Invoice.countDocuments(),
      chartAccounts: await ChartAccount.countDocuments(),
      bankTransactions: await BankTxn.countDocuments(),
      tdsRecords: await TDS.countDocuments()
    };

    console.log('\n📈 DATABASE TOTALS:');
    console.log('═'.repeat(50));
    console.log(`Total Users: ${stats.users}`);
    console.log(`Total Businesses: ${stats.businesses}`);
    console.log(`Total Transactions: ${stats.transactions}`);
    console.log(`Total Invoices: ${stats.invoices}`);
    console.log(`Total Chart Accounts: ${stats.chartAccounts}`);
    console.log(`Total Bank Transactions: ${stats.bankTransactions}`);
    console.log(`Total TDS Records: ${stats.tdsRecords}`);
    console.log('═'.repeat(50));

    console.log('\n✨ Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run migration
if (require.main === module) {
  migrateData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };
