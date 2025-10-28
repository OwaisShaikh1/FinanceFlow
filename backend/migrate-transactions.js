const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, { dbName: 'accounting_demo' })
  .then(() => console.log('✅ MongoDB connected for migration'))
  .catch(e => console.error('❌ MongoDB error:', e.message));

async function migrateTransactions() {
  try {
    const db = mongoose.connection.db;
    const transactionsCollection = db.collection('transactions');
    const usersCollection = db.collection('users');
    const businessesCollection = db.collection('businesses');

    // Find all transactions without user field
    const transactionsWithoutUser = await transactionsCollection.find({
      user: { $exists: false }
    }).toArray();

    console.log(`Found ${transactionsWithoutUser.length} transactions without user field`);

    if (transactionsWithoutUser.length === 0) {
      console.log('✅ All transactions already have user field');
      return;
    }

    // Get all users and businesses for mapping
    const users = await usersCollection.find({}).toArray();
    const businesses = await businessesCollection.find({}).toArray();

    console.log(`Found ${users.length} users and ${businesses.length} businesses`);

    let migratedCount = 0;

    for (const transaction of transactionsWithoutUser) {
      try {
        // Find the user associated with this transaction's business
        const business = businesses.find(b => b._id.toString() === transaction.business.toString());
        if (!business) {
          console.log(`⚠️  No business found for transaction ${transaction._id}`);
          continue;
        }

        // Find user associated with this business
        const user = users.find(u => u.business && u.business.toString() === business._id.toString());
        if (!user) {
          console.log(`⚠️  No user found for business ${business._id} (transaction ${transaction._id})`);
          continue;
        }

        // Update the transaction with user field
        await transactionsCollection.updateOne(
          { _id: transaction._id },
          { $set: { user: user._id } }
        );

        migratedCount++;
        console.log(`✅ Updated transaction ${transaction._id} with user ${user._id}`);

      } catch (error) {
        console.error(`❌ Error updating transaction ${transaction._id}:`, error.message);
      }
    }

    console.log(`\n🎉 Migration completed! Updated ${migratedCount} transactions`);

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
}

// Run migration
migrateTransactions();