require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const Business = require('./models/Business');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/financeflow';

async function checkTransactions() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get CA user
    const caUser = await User.findOne({ email: 'ca@financeflow.com' });
    console.log('CA User:', caUser ? `${caUser.name} (${caUser._id})` : 'Not found');
    console.log('CA Business:', caUser?.biz || 'None\n');

    // Get all transactions
    const allTransactions = await Transaction.countDocuments();
    console.log(`Total transactions in database: ${allTransactions}\n`);

    // Check transactions by business
    const businesses = await Business.find().populate('owner', 'name email');
    
    for (const business of businesses) {
      const count = await Transaction.countDocuments({ business: business._id });
      console.log(`📊 ${business.name} (${business._id})`);
      console.log(`   Owner: ${business.owner.name} (${business.owner._id})`);
      console.log(`   Transactions: ${count}`);
      
      if (count > 0) {
        const sample = await Transaction.findOne({ business: business._id }).lean();
        console.log(`   Sample transaction:`, {
          id: sample._id,
          type: sample.type,
          amount: sample.amount,
          description: sample.description,
          user: sample.user,
          business: sample.business
        });
      }
      console.log('');
    }

    // Check if CA user has transactions
    if (caUser) {
      const caTransactions = await Transaction.countDocuments({ user: caUser._id });
      console.log(`\n🔍 CA User transactions: ${caTransactions}`);
      
      if (caUser.biz) {
        const caBizTransactions = await Transaction.countDocuments({ business: caUser.biz });
        console.log(`🔍 CA Business transactions: ${caBizTransactions}`);
      }
    }

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkTransactions();
