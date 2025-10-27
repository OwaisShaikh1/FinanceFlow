const mongoose = require('mongoose');
const User = require('./models/User');
const Business = require('./models/Business');
const Transaction = require('./models/Transaction');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/accounting_demo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const viewDatabaseStatus = async () => {
  try {
    await connectDB();

    console.log('\n📊 CURRENT DATABASE STATUS');
    console.log('=' .repeat(50));

    // Get all users with their data
    const users = await User.find({}).populate('business');
    
    console.log(`\n👥 USERS (${users.length} total):`);
    for (const user of users) {
      const transactionCount = await Transaction.countDocuments({ user: user._id });
      const business = user.business || await Business.findOne({ owner: user._id });
      
      console.log(`\n  👤 ${user.name}`);
      console.log(`     📧 Email: ${user.email}`);
      console.log(`     📱 Phone: ${user.phone || 'Not set'}`);
      console.log(`     🎭 Role: ${user.role}`);
      console.log(`     🏢 Business: ${business ? business.name : 'No business assigned'}`);
      console.log(`     💰 Transactions: ${transactionCount}`);
      
      if (transactionCount > 0) {
        const incomeCount = await Transaction.countDocuments({ user: user._id, type: 'income' });
        const expenseCount = await Transaction.countDocuments({ user: user._id, type: 'expense' });
        
        const incomeTotal = await Transaction.aggregate([
          { $match: { user: user._id, type: 'income' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const expenseTotal = await Transaction.aggregate([
          { $match: { user: user._id, type: 'expense' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        const totalIncome = incomeTotal.length > 0 ? incomeTotal[0].total : 0;
        const totalExpense = expenseTotal.length > 0 ? expenseTotal[0].total : 0;
        
        console.log(`     📈 Income: ${incomeCount} transactions, ₹${totalIncome.toLocaleString()}`);
        console.log(`     📉 Expenses: ${expenseCount} transactions, ₹${totalExpense.toLocaleString()}`);
        console.log(`     💵 Net Profit: ₹${(totalIncome - totalExpense).toLocaleString()}`);
      }
    }

    // Overall statistics
    const totalTransactions = await Transaction.countDocuments();
    const totalBusinesses = await Business.countDocuments();
    
    console.log(`\n📊 OVERALL STATISTICS:`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Businesses: ${totalBusinesses}`);
    console.log(`   Transactions: ${totalTransactions}`);

    // Recent transactions
    const recentTransactions = await Transaction.find({})
      .populate('user', 'name email')
      .populate('business', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    console.log(`\n🕒 RECENT TRANSACTIONS:`);
    for (const txn of recentTransactions) {
      console.log(`   ${txn.type.toUpperCase()}: ₹${txn.amount} - ${txn.description} (${txn.user.name})`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Database status check completed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error checking database status:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  viewDatabaseStatus();
}

module.exports = { viewDatabaseStatus };