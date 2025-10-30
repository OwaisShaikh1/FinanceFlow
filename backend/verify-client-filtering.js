require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Business = require('./models/Business');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function verifyClientFiltering() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get Sneha Reddy's user
    const snehaUser = await User.findOne({ email: 'sneha.reddy@example.com' });
    if (!snehaUser) {
      console.log('❌ Sneha Reddy user not found');
      process.exit(1);
    }

    console.log('👤 Sneha Reddy User:');
    console.log('   User ID:', snehaUser._id);
    console.log('   Name:', snehaUser.name);
    console.log('   Email:', snehaUser.email);
    console.log('   Business field in User:', snehaUser.business || 'NULL');
    console.log('');

    // Find Sneha's business
    const snehaBusiness = await Business.findOne({ owner: snehaUser._id });
    if (!snehaBusiness) {
      console.log('❌ Sneha\'s business not found');
      process.exit(1);
    }

    console.log('🏢 Sneha\'s Business:');
    console.log('   Business ID:', snehaBusiness._id);
    console.log('   Business Name:', snehaBusiness.name);
    console.log('   Owner ID:', snehaBusiness.owner);
    console.log('   GSTIN:', snehaBusiness.gstin);
    console.log('');

    // Get transactions for Sneha's business
    console.log('📊 Querying transactions with business ID:', snehaBusiness._id);
    const snehaTransactions = await Transaction.find({ business: snehaBusiness._id })
      .limit(5)
      .lean();

    console.log('   Found', snehaTransactions.length, 'transactions (showing first 5)');
    snehaTransactions.forEach((txn, index) => {
      console.log(`   Transaction ${index + 1}:`);
      console.log('      ID:', txn._id);
      console.log('      Type:', txn.type);
      console.log('      Amount:', txn.amount);
      console.log('      Description:', txn.description);
      console.log('      User ID:', txn.user);
      console.log('      Business ID:', txn.business);
      console.log('      Match:', txn.business.toString() === snehaBusiness._id.toString() ? '✅' : '❌');
      console.log('');
    });

    // Count all transactions by business
    const allTransactionsByBusiness = await Transaction.aggregate([
      { $group: { _id: '$business', count: { $sum: 1 } } }
    ]);

    console.log('\n📈 Transaction count by business:');
    for (const item of allTransactionsByBusiness) {
      const biz = await Business.findById(item._id);
      console.log(`   ${biz?.name || 'Unknown'} (${item._id}): ${item.count} transactions`);
    }

    // Test the filtering query
    console.log('\n🧪 Testing filter query: { business:', snehaBusiness._id, '}');
    const filteredCount = await Transaction.countDocuments({ business: snehaBusiness._id });
    console.log('   Result:', filteredCount, 'transactions');

    // Verify total transactions
    const totalTransactions = await Transaction.countDocuments();
    console.log('\n📊 Total transactions in database:', totalTransactions);

    // Test what the API would return
    console.log('\n🔍 Simulating API call with businessId:', snehaBusiness._id);
    const apiResult = await Transaction.find({ business: snehaBusiness._id })
      .sort({ date: -1 })
      .lean();
    
    console.log('   API would return:', apiResult.length, 'transactions');
    console.log('   Income transactions:', apiResult.filter(t => t.type === 'income').length);
    console.log('   Expense transactions:', apiResult.filter(t => t.type === 'expense').length);
    
    const totalIncome = apiResult.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = apiResult.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    console.log('   Total Income: ₹', totalIncome.toLocaleString('en-IN'));
    console.log('   Total Expenses: ₹', totalExpense.toLocaleString('en-IN'));
    console.log('   Net Profit: ₹', (totalIncome - totalExpense).toLocaleString('en-IN'));

    // Check if User.business field matches Business._id
    console.log('\n🔍 Checking User.business vs Business._id:');
    const allUsers = await User.find({ role: 'user' }).lean();
    for (const user of allUsers) {
      const userBusiness = await Business.findOne({ owner: user._id });
      console.log(`   ${user.name}:`);
      console.log('      User.business:', user.business || 'NULL');
      console.log('      Business._id:', userBusiness?._id || 'NULL');
      console.log('      Match:', user.business && userBusiness && user.business.toString() === userBusiness._id.toString() ? '✅' : '❌');
    }

    console.log('\n✅ Verification complete!');
    console.log('\n🎯 CONCLUSION:');
    console.log(`   - Sneha's business ID: ${snehaBusiness._id}`);
    console.log(`   - Transactions with this business ID: ${filteredCount}`);
    console.log(`   - Filtering query working: ${filteredCount > 0 && filteredCount < totalTransactions ? '✅' : '❌'}`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

verifyClientFiltering();
